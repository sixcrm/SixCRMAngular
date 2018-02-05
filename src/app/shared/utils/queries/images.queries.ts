import {SixImage} from '../../models/six-image.model';

export function uploadImage(image: SixImage): string {
  return `
    mutation {
      putaccountimage (accountimage: { data: "${image.raw}" }) {
        filename, path
      }
	  }`
}
