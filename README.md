# engage-digital-sdk-source-reddit

RingCentral Engage Digital Dimelo SDK source: Reddit, created with [Framework(js) to create Dimelo SDK source for RingCentral Engage Digital](https://github.com/ringcentral/engage-digital-source-sdk-js)

## Youtube video

[engage-digital-sdk-source-reddit](https://youtu.be/kOfPbJaVHYU)

## Prerequisites

- Nodejs 8.10+/npm, recommend using [nvm](https://github.com/creationix/nvm) to install nodejs/npm.
- RingCentral Engage(Dimelo) account, [request a demo](http://site.dimelo.com/en/demo#schedule-demo).

## Quick start

Let's start a simple RingCentral Engage source server for Reddit.

```bash

# install dependecies
npm i

# start proxy server, this will make your local bot server can be accessed by RingCentral service
npm run ngrok

# will show
Forwarding                    https://xxxx.ap.ngrok.io -> localhost:6066
# Remember the https://xxxx.ap.ngrok.io, we will use it later
```

Follow [Step by step guide to enable SDK source](https://github.com/ringcentral/engage-digital-source-sdk-js/blob/master/docs/enable-sdk-source.md) to prepare the source.

```bash
# create env file
cp sample-env.env .env
# then edit .env, set proper setting according to the tip in .env

# run local dev server
npm start

# run front end server
npm run c
```

Then visit `https://xxxx.ap.ngrok.io`, fill in the required fields to get it to work.

### Test source server

Save your source, your server will get request, you check the request log from console.

## Build

```bash
npm run build
```

## Run production code

```bash
node dist/server/run-server.js
```

## Build and deploy to AWS Lambda

[https://github.com/ringcentral/engage-digital-source-sdk-js/blob/master/docs/deploy-to-lambda.md](https://github.com/ringcentral/engage-digital-source-sdk-js/blob/master/docs/deploy-to-lambda.md)

## License

MIT
