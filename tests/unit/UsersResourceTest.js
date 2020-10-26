import DocSDK from '../../built/DocSDK.js';
import { assert } from 'chai';
import nock from 'nock';

describe('UsersResource', () => {
    beforeEach(() => {
        this.docSDK = new DocSDK('test');
    });

    describe('me()', () => {
        it('should fetch the current user', async () => {
            nock('https://api.docsdk.com')
                .get('/v2/users/me')
                .replyWithFile(200, __dirname + '/responses/user.json', {
                    'Content-Type': 'application/json'
                });

            const data = await this.docSDK.users.me();

            assert.isObject(data);
            assert.equal(data.id, 1);
            assert.equal(data.credits, 4434);
        });
    });
});
