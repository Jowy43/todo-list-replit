
import express from 'express';
import { ExpressAdapter } from 'ask-sdk-express-adapter';
import Alexa, { SkillBuilders } from 'ask-sdk-core';

const app = express();
const port = 3001;

const LaunchRequestHandler = {
  canHandle(handlerInput: any) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput: any) {
    const speechText = 'Welcome to your Todo App!';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Todo App', speechText)
      .getResponse();
  }
};

const skill = SkillBuilders.custom()
  .addRequestHandlers(LaunchRequestHandler)
  .create();

const adapter = new ExpressAdapter(skill, true, true);

app.post('/api/alexa', adapter.getRequestHandlers());

app.listen(port, '0.0.0.0', () => {
  console.log(`Alexa skill server running on port ${port}`);
});
