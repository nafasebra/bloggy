export function toObjectIdString(
  value: { toString(): string } | string
): string {
  if (typeof value === 'string') {
    return value;
  }

  return value.toString();
}
