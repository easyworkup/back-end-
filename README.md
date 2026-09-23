# easyworkup-api

Бэкенд EasyWorkUp — NestJS, модульный монолит (Auth / Resume / Roadmap / Interview / Llm / HhSync), Prisma + PostgreSQL, Redis, BullMQ.

> На GitHub этот код живёт в репозитории `easyworkup/back-end-` (историческое название, менять не стали, чтобы не рвать ссылки/клоны).

Полное техническое задание — в документе проекта («ТЗ — резюме, роадмап, подготовка к собеседованиям»); здесь только каркас модулей и моделей.

## Контракт для фронта

Фронтенд (`easyworkup-web`) не импортирует отсюда никакого общего пакета — вместо этого он генерирует typed-клиент и Zod-схемы из OpenAPI-спеки этого сервиса:

- в деве спека отдаётся живым эндпоинтом `GET /api-json`;
- `pnpm generate:openapi` пишет статичный `openapi.json` в корень репозитория (используется в CI как артефакт, см. `.github/workflows/ci.yml`).

DTO пишутся как `nestjs-zod`-схемы (`createZodDto`, см. `src/modules/*/dto`) — `patchNestJsSwagger()` в `main.ts` следит, чтобы они попадали в OpenAPI-спеку корректно, а не как пустые объекты.

## Быстрый старт

```bash
pnpm install
cp .env.example .env
docker compose -f infra/docker-compose.yml up -d
pnpm prisma migrate dev
pnpm dev
```

API: http://localhost:4000/api · Спека: http://localhost:4000/api-json

## Структура

```
src/
  main.ts             — bootstrap + настройка Swagger/OpenAPI
  scripts/            — генерация статичного openapi.json
  prisma/             — PrismaService/PrismaModule
  modules/
    auth/              — регистрация/логин, JWT access+refresh
    resume/            — резюме + DTO (Zod) + ИИ-ревью
    roadmap/           — построение роадмапа, темп, задачи, прогресс + DTO
    interview/         — хаб собеседований, сессии, обратная связь в роадмап
    llm/               — LlmProvider — провайдер-агностичная абстракция
    hh-sync/           — периодический ETL с hh.ru (BullMQ)
prisma/schema.prisma   — полная модель данных по ТЗ
infra/docker-compose.yml — Postgres, Redis, MinIO для локальной разработки
```

## Разработка в команде

- Коммиты — [Conventional Commits](https://www.conventionalcommits.org/), проверяются commitlint'ом (`git commit`). Перед коммитом husky прогоняет eslint+prettier на изменённых файлах (`lint-staged`) — см. `CONTRIBUTING.md`.
- CI (`.github/workflows/ci.yml`): lint → build → test → генерация `openapi.json` артефактом на каждый push/PR в `main`; отдельный job деплоит на прод через Coolify-вебхук (нужно завести секрет `COOLIFY_DEPLOY_WEBHOOK`, пока не задан — деплой пропускается).
- Dependabot обновляет зависимости и версии GitHub Actions еженедельно (`.github/dependabot.yml`).
- Шаблоны PR и issue — в `.github/`.

## Статус

Каркас: модули, контроллеры и Prisma-схема на месте, бизнес-логика (`throw new Error("Not implemented")`) — впереди.
