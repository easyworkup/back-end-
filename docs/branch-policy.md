# Branch and review policy

- Contributors outside @easyworkup/core-devs work in a fork based on dev and open pull requests into dev. They cannot push or merge in this repository.
- @easyworkup/core-devs may push to dev and working branches, and merge reviewed contributions.
- main accepts pull requests only from dev in this repository. Direct pushes, force pushes and deletion are blocked, including for core-devs.
- Merging into main requires one current approval, code-owner review, resolved conversations, successful build and PR branch policy checks. A new push invalidates old approvals; the last pusher cannot supply the required approval.
- Only core-devs can merge into main. Administrative access still permits changing repository settings; it is not a ruleset bypass.
- Dependabot targets dev. Its app may maintain dependabot/** branches but cannot merge into dev or main.
- Keep dev after releases and merge main back into dev when needed. Release PRs use merge commits to preserve shared history.

## CI

Use Node.js 22 and pnpm 9.15.9. The packageManager field pins pnpm locally; package.json pnpm.onlyBuiltDependencies restricts dependency install scripts for this version.
CI checks pushes and PRs to main/dev with a read-only token. The metadata-only PR policy check rejects other destinations and rejects fork branches named dev as release sources.
Production deployment is attempted only after successful CI on a push to main; missing Coolify configuration is reported explicitly as skipped. Deployment does not run for PRs or dev pushes.

The OpenAPI smoke test constructs the application without listening on a port and verifies the /api route prefix. It does not test live database or Redis behavior.
