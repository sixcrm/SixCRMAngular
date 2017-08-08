export function isAllowedNumeric(event): boolean {
  const pattern = /[0-9]|Backspace|ArrowRight|ArrowLeft/;

  if (!pattern.test(event.key)) {
    event.preventDefault();
    return false;
  }

  return true;
}

export function isAllowedCurrency(event): boolean {
  const pattern = /[0-9]|\.|Backspace|ArrowRight|ArrowLeft/;

  if (!pattern.test(event.key)) {
    event.preventDefault();
    return false;
  }

  return true;
}

export function isAllowedFloatNumeric(event): boolean {
  const pattern = /[0-9]|\.|Backspace|ArrowRight|ArrowLeft/;

  if (!pattern.test(event.key)) {
    event.preventDefault();
    return false;
  }

  return true;
}
