import {createNumberMask} from 'text-mask-addons/dist/textMaskAddons';

export function getCurrencyMask(): any {
  return createNumberMask({
    prefix: '$',
    allowDecimal: true
  });
}

export function getPhoneNumberMask(): any {
  return ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
}
