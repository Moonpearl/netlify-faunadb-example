module.exports = (object, schema) => {
  for (const prop in schema) {
    const propSchema = schema[prop];
    if (typeof object[prop] === 'undefined') {
      if (typeof propSchema.default === 'undefined') {
        throw new Error(`Property '${prop}' missing.`);
      } else {
        object[prop] = propSchema.default;
      }
    } else {
      if (typeof object[prop] !== propSchema.type) {
        throw new Error(`Property '${prop}' has type '${typeof object[prop]}' (expected type: ${propSchema.type}).`);
      }
    }
  }
  return object;
}
