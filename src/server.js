import express from 'express';
import { app as AlexaApp } from 'alexa-app';

const { env } = process;

const config = {
  port: 3000
};

const app = express();
const alexaApp = new AlexaApp('my-info');

alexaApp.express({
  expressApp: app,
  checkCert: false,
  debug: env.NODE_ENV !== 'production'
});

alexaApp.launch((req, res) => {
  console.log('launched');
  res.say('you launched my info');
});

alexaApp.intent(
  'setName',
  {
    slots: {
      name: 'AMAZON.Person'
    }
  },
  (req, res) => {
    console.log('set name');
    const session = req.getSession();
    const name = req.slot('name');
    session.set('name', name);
    res.say(`Your name was set to ${name}`);
  }
);

alexaApp.intent(
  'getName',
  {
    slots: {}
  },
  (req, res) => {
    console.log('get name');
    const session = req.getSession();
    const name = session.get('name');
    if (!name) return res.say('You have not told my your name');
    res.say(`Your name is ${name}`);
  }
);

alexaApp.intent(
  'addAge',
  {
    slots: {
      age: 'AMAZON.NUMBER'
    }
  },
  (req, res) => {
    const age = req.slot('age');
    const session = req.getSession();
    session.set('age', age);
    return res.say('Your age was set to ${age}');
  }
);

alexaApp.inent('getAge', {}, (req, res) => {
  const session = req.getSession();
  const age = session.get('age');
  return res.say('You are ${age} years old');
});

app.get('/', (req, res) => {
  return res.json({ message: 'this is the my info alexa app server' });
});

app.listen(config.port, '0.0.0.0', () => {
  console.log(`listening on port ${config.port}`);
});
