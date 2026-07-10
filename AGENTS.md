# Joseph’s Working Notes

## Scope

Use this repository only to develop, update, and locally validate the Joseph’s Working Notes website.

Preserve the existing design and previously approved product decisions.

Unless the user explicitly requests otherwise:

- stay within the requested scope;
- leave unrelated files untouched;
- do not stage, commit, or push changes.

Identify and report any required new dependencies during the initial review, before making changes.

Do not add new dependencies unless the user explicitly approves them.

## Development

Do not start a dev server solely for validation.

If the user explicitly asks you to start one, run:

```bash
astro dev --background
```

Manage only a server started during the current task:

```bash
astro dev status
astro dev logs
astro dev stop
```

Reuse an existing dev server only when it is already running for this repository and immediately reachable.

Do not stop, restart, kill, rebind, or troubleshoot a server that was running before the task.

## Validation

Use the simplest checks that demonstrate the requested change.

For routine changes, run:

```bash
git diff --check
npm run build
```

For content changes, reread the final content and verify its facts, structure, metadata, and links against the authoritative source.

For routing, metadata, RSS, or redirect changes, inspect only the relevant files generated under `dist/`.

Browser validation is optional. Use it only when the required browser capability is already available and immediately usable.

If browser validation is unavailable, report the limitation and leave visual review to the user. Do not attempt Playwright, alternative browsers, runtimes, wrappers, or other substitute rendering methods.

A missing browser capability does not block completion of content-only work.

Once the requested checks have passed, stop. Do not continue with additional evidence gathering, optional cleanup, broader review, or unrelated improvements.

## Documentation

Prefer existing repository patterns over external examples.

Consult the Astro documentation only when the repository does not clearly establish the required behavior.