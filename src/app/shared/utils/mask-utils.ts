import {createNumberMask} from 'text-mask-addons/dist/textMaskAddons';

export function getCurrencyMask(): any {
  return createNumberMask({
    prefix: '$',
    allowDecimal: true
  });
}

export function parseCurrencyMaskedValue(value: any): number {
  if (value) {
    let temp = value.replace(/$|,/g, '');
    if (temp.charAt(0) === '$') {
      temp = temp.slice(1);
    }
    return temp ? +temp : 0;
  }

  return 0;
}
