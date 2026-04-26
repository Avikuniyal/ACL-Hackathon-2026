const { onRequest } = require("firebase-functions/https");
const { setGlobalOptions } = require("firebase-functions");
const { getGroqResponse } = require("./getGroqResponse");

setGlobalOptions({ maxInstances: 10 });

exports.testGroq = onRequest(async (request, response) => {
  const reply = await getGroqResponse("How are you today?");
  response.send(reply);
});