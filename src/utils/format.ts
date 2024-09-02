export const prettifyObject = (obj: Record<any, any>) => {
  return JSON.stringify(obj, null, 2)
}
