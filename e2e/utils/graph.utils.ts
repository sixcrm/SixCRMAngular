export function deleteUser(id: string): string {
  return `mutation { deleteuser (id: "${id}") { id } deleteusersettings (id: "${id}") { id }}`
}
