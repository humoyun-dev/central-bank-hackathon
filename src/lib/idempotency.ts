export function createIdempotencyKey(scope = "mutation") {
  return `${scope}:${crypto.randomUUID()}`
}
