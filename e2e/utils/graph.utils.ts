export function deleteUser(id: string): string {
  return `mutation { deleteusersetting (id: "${id}") { id } deleteuser (id: "${id}") { id }}`
}

export function sendInvite(email: string): string {
 return `mutation {
		  inviteuser (userinvite: {email: "${email}" account:"d3fa3bf3-7111-49f4-8261-87674482bf1c" role:"e09ac44b-6cde-4572-8162-609f6f0aeca8"}) {
			  link
		  }
	  }`
}
