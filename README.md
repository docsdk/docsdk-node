<p align="center">
  <img width="108px" src="https://yuntu-images.oss-cn-hangzhou.aliyuncs.com/xlogo.jpg" />
</p>

<h1 align="center">DocSDK</h1>
<p align="center">English | <a href="doc/README-zh-CN.md">中文</a></p>

## About DocSDK

> DocSDK is a development kit for smart file conversion. We support the conversion of various types of documents, including pdf, doc, docx, xls, xlsx, ppt, pptx, dwg, caj, svg, html, json, png, jpg, gif and other formats, more conversion formats can be viewed on our [website](https://www.docsdk.com/). There are 8 kinds of SDK support, including Java, Node.js, PHP, Python, Swift, CLI, AWS-Lambda and Laravel.
> 
> **Keywords: document conversion, file conversion, PDF to Word, PDF to PPT, PDF to HTML**

## docsdk-node

> This is the official Node.js SDK for the [DocSDK API](https://www.docsdk.com/docAPI#sdk).

[![npm](https://img.shields.io/npm/v/docsdk.svg)](https://www.npmjs.com/package/docsdk)
[![npm](https://img.shields.io/npm/dt/docsdk.svg)](https://www.npmjs.com/package/docsdk)

### Installation

    npm install --save docsdk

Load as ESM module:

```js
import DocSDK from 'docsdk';
```

... or via require:

```js
const DocSDK = require('docsdk');
```

### Creating Jobs

```js
import DocSDK from 'docsdk';

const docSDK = new DocSDK('api_key');

let job = await docSDK.jobs.create({
    tasks: {
        'ImportURL': {
            operation: 'import/url',
            url: 'https://file-url'
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

### Downloading Files

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

### Uploading Files

Uploads to DocSDK are done via `import/upload` tasks.
This SDK offers a convenient upload method:

```js
const job = await docSDK.jobs.create({
    tasks: {
        'UploadFile': {
            operation: 'import/upload'
        }
        // ...
    }
});

const uploadTask = job.tasks.filter(task => task.name === 'UploadFile')[0];

const inputFile = fs.createReadStream('./file.pdf');

await docSDK.tasks.upload(uploadTask, inputFile, 'file.pdf');
```

### Websocket Events

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

### Webhook Signing

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

### Resources
* [DocSDK API Documentation](https://www.docsdk.com/docAPI)
* [DocSDK home page](https://www.docsdk.com/)
