export const PRIORITIES = ['low', 'medium', 'high'];

// One more than the highest id in use, so ids stay unique after a task is removed.
function nextId(tasks) {
  return tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}

export function addTask(tasks, title, { priority = 'medium', tags = [] } = {}) {
  if (!title || !title.trim()) {
    throw new Error('Task title cannot be empty');
  }
  if (!PRIORITIES.includes(priority)) {
    throw new Error(`Invalid priority "${priority}". Use one of: ${PRIORITIES.join(', ')}`);
  }

  const task = {
    id: nextId(tasks),
    title: title.trim(),
    priority,
    tags,
    done: false,
    createdAt: new Date().toISOString(),
  };
  return [...tasks, task];
}

export function completeTask(tasks, id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) throw new Error(`No task with id ${id}`);
  return tasks.map((t) => (t.id === id ? { ...t, done: true } : t));
}

export function removeTask(tasks, id) {
  const exists = tasks.some((t) => t.id === id);
  if (!exists) throw new Error(`No task with id ${id}`);
  return tasks.filter((t) => t.id !== id);
}

// `tag` is a single tag or an array of tags; a task must have all of them to be listed.
export function listTasks(tasks, { tag, showDone = true } = {}) {
  const wanted = [tag ?? []].flat().filter(Boolean);
  return tasks.filter((t) => {
    if (!showDone && t.done) return false;
    if (!wanted.every((w) => t.tags.includes(w))) return false;
    return true;
  });
}

export function sortByPriority(tasks) {
  const rank = { low: 0, medium: 1, high: 2 };
  return [...tasks].sort((a, b) => rank[a.priority] - rank[b.priority]);
}
