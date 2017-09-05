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
