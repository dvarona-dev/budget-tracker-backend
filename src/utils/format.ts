export const prettifyObject = (obj: Record<any, any>): string => {
  return JSON.stringify(obj, null, 2)
}
