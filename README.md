# C.Render IA

SketchUp plugin that turns the model view into an AI render. Read `CLAUDE.md` and `docs/`
first.

## Development

Everything runs in Docker; only Docker and `make` are needed on the host.

```sh
make install     # Node and Ruby dependencies
make check       # lint, typecheck, test, build
make build       # plugin UI + SketchUp package (.rbz)
make format      # Prettier and RuboCop autocorrect
```

Do not run `pnpm install` on the host: `node_modules` holds Linux binaries built inside the
container.
