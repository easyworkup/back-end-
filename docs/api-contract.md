# Контракт API — KAN-8

Источник: `src/contracts/schemas.ts` (Zod), `dto.ts` (конкретные Nest DTO), `openapi.ts` (операции, security и HTTP-ответы). Версия 1.0.0. Владелец общей области — интегратор.

Это целевой контракт MVP, **не отчёт о готовности бизнес-функций**. Все операции помечены `x-implementation: planned`. Контроллеры из исходного каркаса пока заглушки, их старые inline DTO и ответы не являются контрактом для фронта. Реализация и HTTP integration tests делаются в соответствующих задачах KAN-62 и далее. В частности, старый `GET resumes/:id` с TODO нельзя использовать как реальные данные.

`GET /api-json` и экспорт используют одну функцию `buildContractDocument`. Экспорт не импортирует AppModule, PrismaService, ConfigModule, Redis или HTTP bootstrap и работает без DATABASE_URL и ключей. Это проверяется отдельным шагом CI с удалёнными переменными окружения.

## Получить контракт

После `pnpm install --frozen-lockfile` выполнить `pnpm generate:openapi`. Результат: `openapi.json` и `openapi-source.json` (версия, Git SHA источника, dirty, SHA-256 точных байтов). В CI артефакт называется `openapi-<github.sha>`. Для PR SHA относится к проверенному merge commit GitHub, а не обязательно к HEAD ветки.

Для фронта скачать **оба файла из одного успешного запуска** и положить в `api/`. Запустить `pnpm verify:contract`, `pnpm codegen`, `pnpm typecheck`, `pnpm test:contract`. Создать PR в dev с обоими файлами. Не брать «последний» артефакт без SHA, не редактировать generated вручную. npm-пакет и токен публикации для этого не нужны. Перед публикацией локального артефакта закоммитить backend: dirty должен быть false.

Backend CI дополнительно проверяет свой артефакт на зафиксированном SHA потребителя Frontend: checksum → Orval → TypeScript → транспортные тесты. SHA потребителя обновляет интегратор после изменения frontend contract tests. Это проверка выбранных потребительских сценариев, не полное доказательство совместимости любого неизвестного клиента. Breaking change требует новой major-версии и согласованного PR фронта; добавление необязательных полей — minor, исправление документации — patch.

## Правила реализации для следующих задач

- Все пути уже содержат `/api`; базовый URL клиента — origin сервера. Ранее используемый origin + `/api` также поддержан транспортом без двойного префикса.
- Использовать DTO из `src/contracts/dto.ts` и `ZodValidationPipe`. Response DTO — формат JSON, не Prisma entity. Даты — ISO UTC, id — UUID. Пароли, passwordHash, reset/refresh токены, testCases и referenceSolution не входят в публичные ответы.
- Идентификатор владельца брать из проверенной сессии, никогда из body. Для чужих резюме/jobs/session возвращать 404. Обычный доступ: `Authorization: Bearer ...`. Refresh/logout: HttpOnly refresh cookie + `X-CSRF-Token`; KAN-63 должен реализовать выдачу и проверку CSRF, ротацию и отзыв. Не хранить refresh token в localStorage. Настройка CORS/доменов и cookie должна соответствовать развёртыванию, текущий CORS каркаса не готов для authenticated cross-origin запросов.
- Ошибка: `{ "error": { "code": "CONFLICT", "message": "Resume changed", "requestId": "..." } }`. Валидация: 400 с `fieldErrors`; неверная сессия: 401; конфликт revision/idempotency: 409; лимиты: 429; временно недоступный provider: 503. Не выдавать stack trace. Общий exception filter и реальное применение правил — часть реализации auth/jobs, не этого экспорта.
- Autosave: PATCH содержит последнюю `revision`; обновление с проверкой owner + revision в одной транзакции, затем increment и ResumeRevision. При 409 клиент перечитывает актуальное резюме; не делает безусловную перезапись. Активное резюме переключается транзакционно.
- `Idempotency-Key` обязателен на отмеченных в OpenAPI операциях. Одинаковые owner + операция + key + тело возвращают исходный ответ; другое тело с тем же key — 409; хранение не менее 24 часов. Заголовок передаётся в RequestInit.headers — Orval не создаёт отдельный аргумент для него. Job worker хранит попытки и не применяет устаревшую revision к новому резюме.
- Задание: 202 `{ "jobId": "UUID", "status": "QUEUED" }`, затем GET `/api/jobs/{id}`. Терминальные состояния SUCCEEDED/FAILED; результат — discriminated union по kind. Polling/backoff/отмена/лимит попыток — KAN-67 и frontend integration tasks.
- SSE: GET `/api/interview-sessions/{id}/events`, Bearer header, `Last-Event-ID`, UTF-8 `text/event-stream`. Данные валидируются схемой StreamEvent, события delta/feedback/error/done. Пример wire-сообщения есть в OpenAPI. Для живого чтения использовать fetch + ReadableStream parser в задаче интеграции SSE: обычный generated fetch метод читает весь текст и не заменяет streaming transport. Reconnect и дедупликация по id обязательны.
- Пагинация списка: limit 1–100, по умолчанию 20, opaque cursor, `nextCursor: null` означает конец. Стабильная сортировка по createdAt/id или startedAt/id документируется в реализации.
- OpenAPI 3.0 не выражает все бизнес-инварианты: владение, связь направления, транзакции, одноразовость токенов и состояние jobs требуют серверных проверок и тестов. Генерируемые Zod-схемы валидируют wire format, не заменяют бизнес-валидацию.

## Проверки

`pnpm lint`, `pnpm build`, `pnpm test`, `pnpm generate:openapi`. Тесты проверяют уникальные operationId, request/success/error schemas, security, fixtures всех схем и отрицательные входы. Frontend тесты проверяют реально сгенерированный запрос, заголовки, отмену, 204/409/502 и Zod-регистрацию; compile-only consumer фиксирует используемые поля ответов.

После реализации операции изменить её маркер готовности и добавить HTTP-тест соответствия. Не менять общий контракт в параллельных feature PR без интегратора.
