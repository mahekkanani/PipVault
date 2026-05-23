const REQUIRED_FIELDS = ['pair', 'side', 'entry', 'exit', 'capturedPips', 'profitLoss', 'date'];
const NUMERIC_FIELDS = ['lotSize', 'entry', 'takeProfit', 'stopLoss', 'exit', 'capturedPips', 'profitLoss'];

export function validateTrade(values) {
  const errors = {};

  REQUIRED_FIELDS.forEach((field) => {
    if (!String(values[field] ?? '').trim()) {
      errors[field] = 'Required';
    }
  });

  NUMERIC_FIELDS.forEach((field) => {
    const value = values[field];
    if (value !== '' && value !== null && value !== undefined && !Number.isFinite(Number(value))) {
      errors[field] = 'Must be a number';
    }
  });

  return errors;
}

export function validateBacktest(values) {
  const errors = validateTrade(values);

  if (!String(values.strategy ?? '').trim()) {
    errors.strategy = 'Required';
  }

  return errors;
}
