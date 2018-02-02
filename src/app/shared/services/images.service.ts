import { Injectable } from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';

@Injectable()
export class ImagesService {

  constructor(private http: HttpWrapperService) { }

}
