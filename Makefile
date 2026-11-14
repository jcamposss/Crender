RUN_NODE = docker compose run --rm node
RUN_RUBY = docker compose run --rm ruby

.PHONY: install lint typecheck test build check format

install:
	$(RUN_NODE) pnpm install --frozen-lockfile
	$(RUN_RUBY) bundle install

lint:
	$(RUN_NODE) pnpm lint
	$(RUN_RUBY) bundle exec rubocop

typecheck:
	$(RUN_NODE) pnpm typecheck

test:
	$(RUN_NODE) pnpm test
	$(RUN_RUBY) bundle exec rake test

build:
	$(RUN_NODE) pnpm build

check: lint typecheck test build

format:
	$(RUN_NODE) pnpm format
	$(RUN_RUBY) bundle exec rubocop --autocorrect
