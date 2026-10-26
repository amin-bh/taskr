import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CLI = new URL('../bin/taskr.js', import.meta.url).pathname;

function setup() {
  const file = join(mkdtempSync(join(tmpdir(), 'taskr-')), 'tasks.json');
  const run = (...args) =>
    spawnSync(process.execPath, [CLI, ...args], {
      encoding: 'utf8',
      env: { ...process.env, TASKR_FILE: file },
    });
  const read = () => JSON.parse(readFileSync(file, 'utf8'));
  return { run, read };
}

test('done marks a task as done by id', () => {
  const { run, read } = setup();
  run('add', 'Buy milk');
  const res = run('done', '1');
  assert.equal(res.status, 0, res.stderr);
  assert.equal(read()[0].done, true);
});

test('remove deletes a task by id', () => {
  const { run, read } = setup();
  run('add', 'a');
  run('add', 'b');
  const res = run('remove', '1');
  assert.equal(res.status, 0, res.stderr);
  assert.deepEqual(read().map((t) => t.title), ['b']);
});

test('ids stay unique after a task is removed (#4)', () => {
  const { run, read } = setup();
  run('add', 'a');
  run('add', 'b');
  run('remove', '1');
  const res = run('add', 'c');
  assert.equal(res.status, 0, res.stderr);
  assert.match(res.stdout, /Added task 3/);
  assert.deepEqual(read().map((t) => t.id), [2, 3]);
});

test('done rejects an id that is not a positive integer', () => {
  const { run } = setup();
  run('add', 'a');
  // '-1' goes after '--' so parseArgs doesn't treat it as an option.
  for (const bad of ['abc', '1.5', '0', '-- -1']) {
    const res = run('done', ...bad.split(' '));
    assert.equal(res.status, 1);
    assert.match(res.stderr, /Invalid task id/);
  }
});

test('done without an id prints a usage error', () => {
  const { run } = setup();
  const res = run('done');
  assert.equal(res.status, 1);
  assert.match(res.stderr, /Invalid task id/);
});
