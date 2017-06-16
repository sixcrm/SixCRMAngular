import {Field} from './field.model';
import {InputValue} from './input-value.model';
import {TypeRef} from './type-ref.model';
import {Enum} from './enum.model';

export interface Type {
  kind: string;
  name: string;
  description: string;
  fields: Field[];
  inputFields: InputValue[];
  interfaces: TypeRef[];
  enumValues: Enum[];
  possibleTypes: TypeRef[];
}
