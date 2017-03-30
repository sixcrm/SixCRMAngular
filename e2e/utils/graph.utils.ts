export function deleteMutation(id: string): string {
  return `mutation { deleteuser (id: "${id}") { id }}`
}
