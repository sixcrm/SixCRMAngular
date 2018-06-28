import {InputValue} from './input-value.model';
import {TypeRef} from './type-ref.model';

export interface Field {
  name: string;
  description: string;
  args: InputValue[];
  type: TypeRef;
  isDeprecated: boolean;
  deprecationReason: string
  example?: string;
  response?: string;
}
