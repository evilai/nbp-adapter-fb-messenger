## Facebook Messenger adapter
This is Facebook Messenger adapter for Node.js Bot Platform.

```js
import fbMessengerAdapterFactory from 'nbp-adapter-fb-messenger';
const fbMessengerAdapter = fbMessengerAdapterFactory({
    accessToken: 'your-fb-application-access-token',
    logger // your logging tool instance
});
```

Then you should pass the `recipientId`, which you can get from facebook message body.

```js
const messenger = fbMessengerAdapter(recipientId);

messenger.send('Text for the user'); // Send text to the user
messenger.typing(); // Show typing action for the user 
messenger.seen(); // Mark as seen previous user's messages
```

Please, look at [usage example](https://github.com/evilai/nodejs-bot-platform/blob/master/src/bot/skills/clusters/minor/greetings/greet.js). I use a wrapper around messenger, that accept rules and don't send anything if there is a rule `silent`.

## Tunneling
Check `tunneling.js`. To bind context of all client's function we need to perform tunneling on each request, so inside skills you can do `im.send('Some text)` without specifying user IDs and application tokens.

Look at [router-builder.js](https://github.com/evilai/nodejs-bot-platform/blob/master/src/bot/platforms/messenger/bot-name/router-builder.js) as an example.