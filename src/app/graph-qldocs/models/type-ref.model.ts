import {OfType} from './of-type.model';

export interface TypeRef {
  kind: string;
  name: string;
  ofType: OfType;
}
