# Contributing

## Ветки и коммиты

- Ветки: `feature/<кратко>`, `fix/<кратко>`.
- Коммиты — [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`...) — проверяется commitlint при `git commit`.
- Перед коммитом husky прогоняет `lint-staged` (eslint + prettier) на изменённых файлах — если ругается, коммит блокируется, пока не поправишь.

## Локальный запуск

См. `README.md`.

## Если меняете DTO (`src/modules/*/dto`)

Это меняет контракт с фронтендом (репозиторий `Frontend` / `easyworkup-web`). После мержа в `main`:

1. CI сам сгенерирует и приложит артефакт `openapi` (см. `.github/workflows/ci.yml`).
2. На фронте нужно прогнать `pnpm codegen`, чтобы typed-клиент и Zod-схемы подтянули изменения — иначе они молча устареют.

## Pull request

Заполните шаблон PR, дождитесь зелёного CI перед мержем.
