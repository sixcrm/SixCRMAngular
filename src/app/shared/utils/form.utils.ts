export function isAllowedNumeric(event): boolean {
  const pattern = /[0-9]|Backspace|ArrowRight|ArrowLeft|Tab/;

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
  const pattern = /[0-9]|\.|Backspace|ArrowRight|ArrowLeft|Tab/;

  if (!pattern.test(event.key)) {
    event.preventDefault();
    return false;
  }

  return true;
}

export function isValidEmail(email): boolean {
  if (!email) return false;

  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

export function isAllowedZip(event): boolean {
  const pattern = /[0-9]|Backspace|ArrowRight|ArrowLeft|Tab|-/;

  if (!pattern.test(event.key)) {
    event.preventDefault();
    return false;
  }

  return true;
}

export function isValidZip(value: string): boolean {
  return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value);
}
