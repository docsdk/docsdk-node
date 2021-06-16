<p align="center">
  <img width="108px" src="https://yuntu-images.oss-cn-hangzhou.aliyuncs.com/xlogo.jpg" />
</p>

<h1 align="center">DocSDK</h1>
<p align="center">一个智能文件（文档）转换的开发工具包</p>
<p align="center"><a href="/README.md">English</a> | 中文</p>

## 关于 DocSDK
> DocSDK 是一个智能文件转换的开发工具包。我们支持各类文档的转换，其中包括 pdf、doc、docx、xls、xlsx、ppt、pptx、dwg、caj、svg、html、json、png、jpg 和 gif 等等各种格式的转换，更多转换格式可查看[九云图网站](https://www.docsdk.com/) 。现有八种 SDK 的支持，其中包括 Java、Node.js、PHP、Python、Swift、CLI、AWS-Lambda 和 Laravel。
> 
> **关键词： 文档转换，文件转换，PDF转Word，PDF转PPT，PDF转HTML**

## docsdk-node

> 这是 [九云图 DocSDK API](https://www.docsdk.com/docAPI#sdk) 官方的 Node.js 开发工具包.

[![npm](https://img.shields.io/npm/v/docsdk.svg)](https://www.npmjs.com/package/docsdk)
[![npm](https://img.shields.io/npm/dt/docsdk.svg)](https://www.npmjs.com/package/docsdk)

### 安装

    npm install --save docsdk

导入依赖模块包:

```js
import DocSDK from 'docsdk';
```

...或者引用:

```js
const DocSDK = require('docsdk');
```

### 创建 Jobs

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

### 下载文件

DocSDK 可以使用 `export/url` 生成公开的链接，您可以使用这些 URL 下载输出文件。

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

### 上传文件

可通过 `import/upload` 上传文件。
这是一种简单的上传方法：

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

### Websocket 事件

Node.js SDK 可以订阅 [DocSDK socket.io API 的事件](https://docsdk.com/api/v2/socket#socket)：

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

当您不想再接收任何事件时，您应该关闭 socket：

```js
docSDK.socket.close();
```

### 签署 Webhook

Node.js SDK 允许验证从 DocSDK 收到的 webhook 请求。

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
* [DocSDK API 文档](https://www.docsdk.com/docAPI)
* [DocSDK 主页](https://www.docsdk.com/)
