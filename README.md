# taskr

A tiny, zero-dependency command-line task manager written in Node.js.

```
$ taskr add "Write the release notes" --priority high --tag work
Added task 1
$ taskr list
[ ] 1. !! Write the release notes #work (2026-10-26)
```

## Install

Requires Node.js 20 or newer.

```bash
git clone <this-repo>
cd taskr
npm link        # makes the `taskr` command available globally
```

## Usage

| Command | Description |
| --- | --- |
| `taskr add <title>` | Add a task. Options: `--priority low\|medium\|high`, `--tag <tag>` (repeatable) |
| `taskr list` | List tasks. Options: `--tag <tag>`, `--pending`, `--sort` |
| `taskr done <id>` | Mark a task as done |
| `taskr remove <id>` | Delete a task |
| `taskr help` | Show help |

Tasks are stored in `~/.taskr.json`. Set the `TASKR_FILE` environment variable to use a different file.

## Using it as a library

```js
import { addTask, listTasks, formatList } from 'taskr';

let tasks = addTask([], 'Try taskr', { priority: 'low' });
console.log(formatList(listTasks(tasks)));
```

## FAQ / Troubleshooting

**`taskr: command not found` after installing**

`npm link` puts `taskr` in npm's global bin folder. Make sure that folder is on your `PATH` (`npm prefix -g` shows where it is; on macOS/Linux the commands live in its `bin` subfolder). You can also run taskr without linking: `node bin/taskr.js <command>` from the repo folder.

**I get a syntax error or `parseArgs` is not a function**

taskr needs Node.js 20 or newer. Check your version with `node --version` and upgrade if needed.

**Where are my tasks stored? How do I back them up?**

In a single JSON file: `~/.taskr.json` by default, or whatever path `TASKR_FILE` points to. To back up or move your tasks, copy that file. To keep separate lists (say, one per project), point `TASKR_FILE` at a different file:

```bash
TASKR_FILE=./project-tasks.json taskr list
```

**Every command fails with a JSON error**

The tasks file has been corrupted, usually by a manual edit. Open it and fix the JSON, or restore it from a backup. If you don't need its contents, delete or rename the file and taskr will start a fresh, empty list.

**`Error: Invalid priority "..."`**

Priority must be exactly `low`, `medium` or `high` (lowercase). If you leave it out, the task gets `medium`.

**`Error: Invalid task id "..."` or `Error: No task with id ...`**

`done` and `remove` take the number shown before the title in `taskr list` (for `[ ] 3. ! Buy milk`, the id is `3`). Run `taskr list` to see current ids; finished tasks still appear there unless you pass `--pending`.

**A task I finished isn't showing up**

You're probably using `--pending`, which hides completed tasks. Run `taskr list` without it to see everything.

**`Error: Unknown option '-...'` when adding a task**

A title that starts with `-` looks like an option. Put `--` before it: `taskr add -- "-5 min stretch"`. It's also a good habit to wrap titles in quotes.

Still stuck? Open an issue with the command you ran, the full output, and your `node --version`.

## Development

```bash
npm test       # run the test suite (node:test, no install needed)
npm run lint   # syntax + whitespace checks
```

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request, and look for issues labelled **good first issue** if you are new.

## License

[MIT](LICENSE)
