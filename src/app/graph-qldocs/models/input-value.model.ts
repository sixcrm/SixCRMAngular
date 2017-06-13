import {TypeRef} from './type-ref.model';

export interface InputValue {
  name: string;
  description: string;
  defaultValue: string;
  type: TypeRef;
}
