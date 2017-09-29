export function deleteUser(id: string): string {
  return `mutation { deleteusersetting (id: "${id}") { id } deleteuser (id: "${id}") { id }}`
}
