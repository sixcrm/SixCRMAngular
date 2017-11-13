import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDuration'
})
export class FormatDurationPipe implements PipeTransform {

  transform(durationInSeconds: number): string {
    let minutes = Math.floor(durationInSeconds / 60);
    let seconds = durationInSeconds - (minutes * 60);

    return `${minutes < 10 ? '0'+minutes : minutes}:${seconds < 10 ? '0'+seconds : seconds}min`;
  }

}
