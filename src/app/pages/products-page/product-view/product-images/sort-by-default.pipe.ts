import { Pipe, PipeTransform } from '@angular/core';
import {SixImage} from '../../../../shared/models/six-image.model';

@Pipe({
  name: 'sortByDefault'
})
export class SortByDefaultPipe implements PipeTransform {

  transform(images: SixImage[]): any {
    return images.sort((a,b) => {
      if (a.defaultImage && !b.defaultImage) {
        return -1;
      }

      if (b.defaultImage && !a.defaultImage) {
        return 1;
      }

      return 0;
    })
  }

}
