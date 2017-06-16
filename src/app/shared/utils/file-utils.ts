import {saveAs} from 'file-saver';

export function download(data: any, name: string, format: string) {
  let b = new Blob([data], {type: format});
  saveAs(b, name);
}

export function downloadJSON(data: any, name: string) {
  download(JSON.stringify(data), name, 'application/json');
}


export function downloadFile(data: any, name: string, format: string) {
  let f;
  let d;

  if (format === 'json') {
    f = 'application/json';
    d = JSON.stringify(data.json());
  } else if (format === 'csv') {
    f = 'application/csv';
    d = data['_body'];
  } else if (format === 'excel') {
    f = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    d = data['_body'];
    format = 'xlsx';
  }

  download(d, name + '.' + format, f);
}
