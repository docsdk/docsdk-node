import DocSDK from '../../built/DocSDK.js';
import apiKey from './ApiKey';
import { assert } from 'chai';

describe('UsersResource', () => {
    beforeEach(() => {
        this.docSDK = new DocSDK(apiKey, true);
    });

    describe('me()', () => {
        it('should fetch the current user', async () => {
            const data = await this.docSDK.users.me();

            console.log(data);

            assert.isObject(data);
            assert.containsAllKeys(data, [
                'id',
                'username',
                'email',
                'credits'
            ]);
        });
    });
});
