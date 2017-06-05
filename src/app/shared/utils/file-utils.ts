import {saveAs} from 'file-saver';

export function downloadFile(data: any, name: string, format: string) {
  let b = new Blob([data], {type: format});
  saveAs(b, name);
}
