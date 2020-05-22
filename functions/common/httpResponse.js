module.exports = (statusCode, data) => {
  return {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    statusCode,
    body: JSON.stringify(data),
  };
}
