import DocSDK from '../../built/DocSDK.js';
import { assert } from 'chai';
import * as fs from 'fs';
import apiKey from './ApiKey';

describe('TasksResource', () => {
    beforeEach(() => {
        this.docSDK = new DocSDK(apiKey, true);
    });

    describe('upload()', () => {
        it('uploads input.png', async () => {
            let task = await this.docSDK.tasks.create('import/upload', {
                name: 'upload-test'
            });

            const stream = fs.createReadStream(
                __dirname + '/../integration/files/input.png'
            );

            await this.docSDK.tasks.upload(task, stream);

            task = await this.docSDK.tasks.wait(task.id);

            assert.equal(task.status, 'finished');
            assert.equal(task.result.files[0].filename, 'input.png');
        }).timeout(30000);
    });
});
