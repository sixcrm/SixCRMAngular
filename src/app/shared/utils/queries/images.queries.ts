export function uploadImage(image: string): string {
  return `
    mutation {
      createaccountimage (accountimage: { data: ${image} }) {
        filename, path
      }
	  }`
}
