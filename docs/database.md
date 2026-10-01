# База данных — KAN-9

PostgreSQL 16, Prisma 5.22 из lockfile. Миграции разделены: `20261001000000_baseline` воспроизводит исходный `legacy.prisma`, `20261001001000_foundation` добавляет профиль/график, версии/активное резюме, jobs, reset-токены и устойчивые связи интервью с навыками. Foundation выполняется в транзакции.

## Новая локальная база

1. Указать DATABASE_URL в локальном окружении или .env (не коммитить).
2. `pnpm install --frozen-lockfile`
3. `pnpm prisma generate`
4. `pnpm prisma migrate deploy`
5. `pnpm db:seed`

Seed создаёт минимальный каталог Frontend: один навык JavaScript, собственное упражнение и вопрос. Это база для разработки, не полное наполнение KAN-74. Идентификаторы стабильные; повторный запуск ничего не удаляет и не перезаписывает существующие строки. Direction ищется по slug, связи учитывают её фактический id.

Для искусственного пользователя установить `SEED_DEMO_USER=true` перед `pnpm db:seed`. Адрес `seed-demo@example.invalid`, passwordHash `!LOGIN_DISABLED`: вход для этого пользователя намеренно невозможен, секретов и реальных персональных данных нет. Для login smoke test создать пользователя через auth после KAN-62. Не включать demo seed в production.

## Уже заполненная база старого каркаса

Сначала сделать backup и проверить процедуру на восстановленной копии. `prisma/legacy.prisma` — замороженный эталон исходной схемы, не схема для дальнейшей разработки.

1. Убедиться, что база соответствует legacy: `pnpm prisma migrate diff --from-url "$env:DATABASE_URL" --to-schema-datamodel prisma/legacy.prisma --exit-code` (PowerShell). Ненулевой diff — остановиться и разобрать расхождения. Если уже есть история миграций, не помечать baseline вслепую.
2. Проверить дубли `(userId,directionId)` в UserRoadmap, `(roadmapId,skillId)` в UserSkillProgress, `(roadmapId,taskId)` в UserTaskProgress, `(sessionId,questionId)` в SessionAnswer. Проверить orphan direction/skill/question ссылки и отрицательные часы. Миграция не удаляет такие записи автоматически: конфликт остановит её и откатит транзакцию. Исправление данных — отдельный согласованный шаг.
3. Только для базы, созданной старым db push без истории: `pnpm prisma migrate resolve --applied 20261001000000_baseline`.
4. `pnpm prisma migrate deploy`, затем `pnpm db:seed`.

Содержимое старых резюме копируется в ResumeRevision. Завершённые сессии получают COMPLETED. Связь вопрос → skillId заполняется только при единственном совпадении topic/title внутри направления; неоднозначные/неизвестные темы остаются NULL для ручного разбора, данные не отбрасываются. SessionQuestion восстанавливается из старых ответов с детерминированным порядком по id: исходный порядок вопросов в старой схеме не сохранялся. Старые резюме не становятся активными автоматически.

Не использовать migrate reset или db push для обновления заполненной базы. При неудачной foundation после устранения причины и проверки полного rollback можно отметить её `migrate resolve --rolled-back 20261001001000_foundation` и повторить deploy. Не использовать --applied для пропуска неудачной миграции.

## Владение и удаление

User владеет Resume/ResumeRevision/Suggestion, UserRoadmap/Progress, InterviewSession/SessionQuestion/Answer, графиком, reset-токенами и jobs. Удаление User каскадно удаляет эти данные. Удаление Resume каскадно удаляет revisions/suggestions. Каталоги Direction/Skill/Task/Question общие, их удаление при зависимостях ограничено FK; пользовательское удаление не очищает общие каталоги.

Jobs.resourceId и progress.sourceSessionId — диагностические ссылки, не FK: worker обязан проверять существование владельца/ресурса перед применением результата. Внешние PDF, очереди и кеши не удаляются SQL-каскадом: cleanup реализуется в задачах workers/account deletion. Refresh session storage/rotation и общая запись idempotency запроса могут потребовать отдельной миграции в KAN-63/KAN-67; согласовать её с владельцем Prisma.

FK гарантируют существование ссылок, но не совпадение направления у roadmap/skill/task/question: сервис обязан проверять направление и владельца. Для новых TECHNICAL/CODING вопросов skillId обязателен на уровне доменного сервиса; NULL сохранён для совместимости старых данных и BEHAVIORAL вопросов.

Уникальности: один roadmap на user/direction; один progress на roadmap/skill или task; один ответ на session/question и clientMessageId; один job на user/kind/idempotencyKey; одно активное резюме на пользователя. Последняя реализована частичным SQL-индексом, не выражаемым Prisma 5 schema. CHECK для часов/дней/revision/позиции/попыток также заданы вручную в SQL. Сохранять их в следующих миграциях: schema.prisma не отражает всю DB-логику.

## Реальные проверки

Указать **TEST_DATABASE_URL** на отдельную тестовую PostgreSQL; `pnpm test:db`. Тест создаёт случайные схемы kan89_test_* и удаляет только их в finally. Проверяются пустая база, заполненная legacy-база, повторный seed и сохранность пользовательской правки, backfill, уникальности, FK, CHECK и каскадное удаление. В CI это выполняется на отдельном service container.

Prisma/schema/migrations меняет один интегратор. Следующие исполнители работают в своих доменах; потребность новой колонки сначала обсуждают с ним. Не править уже применённые миграции.
