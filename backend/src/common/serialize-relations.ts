/** Maps SQL relations to the existing populated API fields without changing stored IDs. */
export function serializeRelations<T extends object>(
  entity: T,
  fields: Record<string, string>
): T {
  const result = { ...entity } as Record<string, unknown>;
  for (const [relation, idField] of Object.entries(fields)) {
    if (result[relation]) result[idField] = result[relation];
    delete result[relation];
  }
  return result as T;
}
