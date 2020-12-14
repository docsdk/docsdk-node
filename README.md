# docsdk-node

> This is the official Node.js SDK v2 for the [DocSDK](https://docsdk.com/api/v2) _API v2_.
> For API v1, please use [v1 branch](https://github.com/docsdk/docsdk-node/tree/v1) of this repository.

[![Build Status](https://travis-ci.org/docsdk/docsdk-node.svg?branch=master)](https://travis-ci.org/docsdk/docsdk-node)
[![npm](https://img.shields.io/npm/v/docsdk.svg)](https://www.npmjs.com/package/docsdk)
[![npm](https://img.shields.io/npm/dt/docsdk.svg)](https://www.npmjs.com/package/docsdk)

## Installation

    npm install --save docsdk

Load as ESM module:

```js
import DocSDK from 'docsdk';
```

... or via require:

```js
const DocSDK = require('docsdk');
```

## Creating Jobs

```js
import DocSDK from 'docsdk';

const docSDK = new DocSDK('api_key');

let job = await docSDK.jobs.create({
    tasks: {
        'ImportURL': {
            operation: 'import/url',
            url: 'https://my-url'
        },
        'ConvertFile': {
            operation: 'convert',
            input: 'ImportURL',
            output_format: 'pdf'
        },
        'ExportResult': {
            operation: 'export/url',
            input: 'ConvertFile'
        }
    }
});
```

## Downloading Files

DocSDK can generate public URLs for using `export/url` tasks. You can use these URLs to download output files.

```js
job = await docSDK.jobs.wait(job.id); // Wait for job completion

const exportTask = job.tasks.filter(
    task => task.operation === 'export/url' && task.status === 'finished'
)[0];
const file = exportTask.result.files[0];

const writeStream = fs.createWriteStream('./out/' + file.filename);

https.get(file.url, function (response) {
    response.pipe(writeStream);
});

await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
});
```

## Uploading Files

Uploads to DocSDK are done via `import/upload` tasks (see the [docs](https://docsdk.com/api/v2/import#import-upload-tasks)). This SDK offers a convenient upload method:

```js
const job = await docSDK.jobs.create({
    tasks: {
        'upload-my-file': {
            operation: 'import/upload'
        }
        // ...
    }
});

const uploadTask = job.tasks.filter(task => task.name === 'upload-my-file')[0];

const inputFile = fs.createReadStream('./file.pdf');

await docSDK.tasks.upload(uploadTask, inputFile, 'file.pdf');
```

## Websocket Events

The node SDK can subscribe to events of the [DocSDK socket.io API](https://docsdk.com/api/v2/socket#socket).

```js
const job = await docSDK.jobs.create({ ... });

// Events for the job
// Available events: created, updated, finished, failed
docSDK.jobs.subscribeEvent(job.id, 'finished', event => {
    // Job has finished
    console.log(event.job);
});

// Events for all tasks of the job
// Available events: created, updated, finished, failed
docSDK.jobs.subscribeTaskEvent(job.id, 'finished', event => {
    // Task has finished
    console.log(event.task);
});
```

When you don't want to receive any events any more you should close the socket:

```js
docSDK.socket.close();
```

## Webhook Signing

The node SDK allows to verify webhook requests received from DocSDK.

```js
const payloadString = '...'; // The JSON string from the raw request body.
const signature = '...'; // The value of the "DocSDK-Signature" header.
const signingSecret = '...'; // You can find it in your webhook settings.

const isValid = docSDK.webhooks.verify(
    payloadString,
    signature,
    signingSecret
); // returns true or false
```

## Using Sandbox

You can use the Sandbox to avoid consuming your quota while testing your application. The node SDK allows you to do that.

```js
// Pass `true` to the constructor
const docSDK = new DocSDK('api_key', true);
```

> Don't forget to generate MD5 Hashes for the files you will use for testing.

## Contributing

This section is intended for people who want to contribute to the development of this library.

### Getting started

Begin with installing the necessary dependencies by running

    npm install

in the root directory of this repository.

### Building

This project is written in TypeScript so it needs to be compiled first:

    npm run build

This will compile the code in the `lib` directory and generate a `built` directory containing the JS files and the type declarations.

### Unit Tests

Tests are based on mocha:

    npm run test

### Integration Tests

    npm run test-integration

By default, this runs the integration tests against the Sandbox API with an official DocSDK account. If you would like to use your own account, you can set your API key using the `DOCSDK_API_KEY` enviroment variable. In this case you need to whitelist the following MD5 hashes for Sandbox API (using the DocSDK dashboard).

    53d6fe6b688c31c565907c81de625046  input.pdf
    99d4c165f77af02015aa647770286cf9  input.png

### Linting

The project is linted by ESLint+Prettier.

If you're using VSCode, all files will be linted automatically upon saving.
Otherwise, you can lint the project by running

    npm run lint

and even auto-fix as many things as possible by running

    npm run lint -- --fix

## Resources

-   [API v2 Documentation](https://docsdk.com/api/v2)
-   [DocSDK Blog](https://docsdk.com/blog)
