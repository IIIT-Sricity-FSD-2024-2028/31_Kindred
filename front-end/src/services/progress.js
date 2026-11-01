export function workProgress(tasks = [], subtasks = []) {
  const work = [...tasks,...subtasks].filter(t => !['cancelled','transferred'].includes(t.status));
  const completed = work.filter(t => t.status === 'completed').length;
  return { total:work.length, completed, percent:work.length ? Math.round(completed/work.length*100) : 0, eligible:work.length > 0 && completed === work.length };
}
