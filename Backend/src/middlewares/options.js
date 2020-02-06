module.exports = (request, response, next) => {
  if(request.method === "OPTIONS") {
    response.status(200).send();
    return;
  }
  next();
}