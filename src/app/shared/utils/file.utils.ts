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
    d = data.json().data;
  } else if (format === 'csv') {
    f = 'application/csv';
    d = data.json().data;
  } else if (format === 'excel') {
    f = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    d = JSON.stringify(data.json().data);
    format = 'xlsx';
  }

  download(d, name + '.' + format, f);
}
