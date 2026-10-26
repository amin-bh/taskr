# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Fixed

- `taskr done <id>` and `taskr remove <id>` no longer fail with "No task with id" for existing tasks. Invalid ids now give a clear error (#1).
- Adding a task after removing one no longer gives two tasks the same id (#4).
- `taskr list` with several `--tag` options now shows tasks that have all of them, instead of silently using only the first (#5).

## [0.1.0] - 2026-10-26

### Added

- `add`, `list`, `done`, `remove` and `help` commands.
- Priorities (`low`, `medium`, `high`) and tags.
- JSON file storage, configurable with `TASKR_FILE`.
