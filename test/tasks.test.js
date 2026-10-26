import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addTask, completeTask, removeTask, listTasks } from '../src/tasks.js';

test('addTask appends a pending task with defaults', () => {
  const tasks = addTask([], 'Write docs');
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].title, 'Write docs');
  assert.equal(tasks[0].priority, 'medium');
  assert.equal(tasks[0].done, false);
});

test('addTask rejects an empty title', () => {
  assert.throws(() => addTask([], '   '), /cannot be empty/);
});

test('addTask rejects an unknown priority', () => {
  assert.throws(() => addTask([], 'x', { priority: 'urgent' }), /Invalid priority/);
});

test('completeTask marks the task as done', () => {
  const tasks = completeTask(addTask([], 'a'), 1);
  assert.equal(tasks[0].done, true);
});

test('removeTask removes the task', () => {
  const tasks = removeTask(addTask(addTask([], 'a'), 'b'), 1);
  assert.deepEqual(tasks.map((t) => t.title), ['b']);
});

test('addTask does not reuse an id after a task is removed', () => {
  let tasks = addTask(addTask([], 'a'), 'b');
  tasks = removeTask(tasks, 1);
  tasks = addTask(tasks, 'c');
  assert.deepEqual(tasks.map((t) => t.id), [2, 3]);
});

test('addTask does not mutate the input list', () => {
  const tasks = addTask([], 'a');
  const copy = structuredClone(tasks);
  addTask(tasks, 'b');
  assert.deepEqual(tasks, copy);
});

test('listTasks filters by tag and pending state', () => {
  let tasks = addTask([], 'a', { tags: ['work'] });
  tasks = addTask(tasks, 'b', { tags: ['home'] });
  tasks = completeTask(tasks, 1);
  assert.deepEqual(listTasks(tasks, { tag: 'work' }).map((t) => t.title), ['a']);
  assert.deepEqual(listTasks(tasks, { showDone: false }).map((t) => t.title), ['b']);
});

test('listTasks with several tags keeps only tasks that have all of them', () => {
  let tasks = addTask([], 'a', { tags: ['work', 'urgent'] });
  tasks = addTask(tasks, 'b', { tags: ['work'] });
  tasks = addTask(tasks, 'c', { tags: ['urgent'] });
  assert.deepEqual(listTasks(tasks, { tag: ['work', 'urgent'] }).map((t) => t.title), ['a']);
  assert.deepEqual(listTasks(tasks, { tag: ['work'] }).map((t) => t.title), ['a', 'b']);
  assert.deepEqual(listTasks(tasks, { tag: [] }).map((t) => t.title), ['a', 'b', 'c']);
});

test('listTasks treats an empty tag as no filter', () => {
  let tasks = addTask([], 'a', { tags: ['work'] });
  tasks = addTask(tasks, 'b');
  assert.deepEqual(listTasks(tasks, { tag: '' }).map((t) => t.title), ['a', 'b']);
  assert.deepEqual(listTasks(tasks, { tag: ['', 'work'] }).map((t) => t.title), ['a']);
});
