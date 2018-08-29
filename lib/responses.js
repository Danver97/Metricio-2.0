const badRequest = (res, message) => {
  res.status(400);
  if (message)
    res.json({ error: message });
  else 
    res.end();
};

const notFound = (res, message) => {
  res.status(404);
  if (message)
    res.json({ error: message });
  else 
    res.end();
};

const internalServerError = (res, message) => {
  res.status(500);
  if (message)
    res.json({ error: message });
  else 
    res.end();
};

module.exports = {
  badRequest,
  notFound,
  internalServerError,
};
