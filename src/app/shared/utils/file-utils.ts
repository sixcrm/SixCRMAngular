import {saveAs} from 'file-saver';

export function downloadFile(data: any, name: string, format: string) {
  let b = new Blob([data], {type: format});
  saveAs(b, name);
}

export function downloadJSON(data: any, name: string) {
  downloadFile(JSON.stringify(data), name, 'application/json');
}
