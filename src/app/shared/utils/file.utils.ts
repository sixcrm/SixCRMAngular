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
  let d = extractDownloadedContent(data);

  switch (format) {
    case 'json': {
      f = 'application/json';
      break;
    }
    case 'csv': {
      f = 'application/csv';
      break;
    }
    case 'excel': {
      f = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      d = JSON.stringify(extractDownloadedContent(data));
      break;
    }
  }

  download(d, name + '.' + format, f);
}

function extractDownloadedContent(data) {
  return data.json().response;
}
