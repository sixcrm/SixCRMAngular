import {saveAs} from 'file-saver';

export function download(data: any, name: string, format: string) {
  let b = new Blob([data], {type: format});
  saveAs(b, name);
}

export function downloadJSON(data: any, name: string) {
  download(JSON.stringify(data), name, 'application/json');
}

export function downloadCSV(data: any[], name: string) {
  let csvString = '';

  if (data.length > 0) {
    csvString = Object.keys(data[0]).reduce((a,b) => `${a}${a?',':''}${b}`, '');

    for (let i = 0; i < data.length; i++) {
      csvString += '\n';
      csvString += Object.keys(data[i]).reduce((a,b) => `${a}${a?',':''}${data[i][b]}`, '')
    }
  }

  download(csvString, name, 'application/csv');
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
