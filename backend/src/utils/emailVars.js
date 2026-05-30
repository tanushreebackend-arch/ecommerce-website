function applyEmailVars(text, vars = {}) {
  if (!text) return '';
  let result = String(text);
  Object.entries(vars).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value ?? ''));
  });
  return result;
}

module.exports = { applyEmailVars };
