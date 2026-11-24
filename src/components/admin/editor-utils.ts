export function moveItem<T>(items: T[], from: number, to: number) {
  if (from < 0 || from >= items.length || to < 0 || to >= items.length || from === to) return items;
  const next = items.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function newSlug(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}
