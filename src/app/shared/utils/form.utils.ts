import {getStates, getCountries} from './address.utils';

export function isAllowedNumeric(event): boolean {
  const pattern = /[0-9]|Backspace|Delete|ArrowRight|ArrowLeft|Tab/;

  if (!pattern.test(event.key)) {
    event.preventDefault();
    return false;
  }

  return true;
}

export function isAllowedCurrency(event): boolean {
  return isAllowedFloatNumeric(event);
}

export function isAllowedEmail(event, currentValue: string): boolean {
  if (event.key === '@' && (!currentValue || currentValue.indexOf('@') !== -1)) {
    event.preventDefault();
    return false;
  }

  return true;
}

export function isAllowedFloatNumeric(event): boolean {
  const pattern = /[0-9]|\.|Backspace|ArrowRight|ArrowLeft|Tab|Delete/;

  if (!pattern.test(event.key)) {
    event.preventDefault();
    return false;
  }

  return true;
}

export function isAllowedPercentage(event, currentValue): boolean {
  if (!isAllowedFloatNumeric(event)) return false;

  if (!isAllowedNumber(event)) return true;

  return +(`${currentValue || ''}${event.key}`) <= 100;
}

export function isValidEmail(email): boolean {
  if (!email) return false;

  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

export function isValidLink(link): boolean {
  if (!link) return false;

  let regex = /^((https|http):\/\/)?([a-z0-9]+\.)*[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/;
  return regex.test(link);
}

export function isValidColorHex(hex): boolean {
  if (!hex) return false;

  let regex = /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return regex.test(hex);
}

export function isAllowedZip(event): boolean {
  const pattern = /[0-9]|Backspace|ArrowRight|ArrowLeft|Tab|Delete|-/;

  if (!pattern.test(event.key)) {
    event.preventDefault();
    return false;
  }

  return true;
}

export function isValidZip(value: string): boolean {
  return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value);
}

function isAllowedNumber(event): boolean {
  const pattern = /[0-9]/;

  return pattern.test(event.key);

}

export function isValidAddress(address): boolean {
  const regex = /^[0-9]+\s.*/;

  return regex.test(address);
}

export function isValidCity(city): boolean {
  const regex = /^[a-zA-Z -]*$/;

  return regex.test(city) && city;
}

export function isValidState(state): boolean {
  if (!state) return false;

  return getStates().indexOf(state) !== -1;
}

export function isValidCountry(country): boolean {
  if (!country) return false;

  return getCountries().indexOf(country) !== -1;
}

export function isShorterThan(limit: number, string: string, event): boolean {
  if (!string) return true;

  const pattern = /Backspace|Delete|ArrowRight|ArrowLeft|Tab/;

  if (pattern.test(event.key)) {
    return true;
  }

  return string.length + 1 < limit;
}
