
module.exports = function getId(urlPath) {
  const lastSegment = urlPath.match(/([^\/]*)\/*$/)[0];

  const match = lastSegment.match(/^\d+$/);

  if (match) {
    return lastSegment;
  }

  return null;
}
