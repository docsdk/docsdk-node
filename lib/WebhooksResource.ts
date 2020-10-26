import * as crypto from 'crypto';
import DocSDK from './DocSDK';

export default class WebhooksResource {
    private readonly docSDK: DocSDK;

    constructor(docSDK: DocSDK) {
        this.docSDK = docSDK;
    }

    verify(
        payloadString: string,
        signature: string,
        signingSecret: string
    ): boolean {
        const hmac = crypto.createHmac('sha256', signingSecret);
        const signed = hmac
            .update(Buffer.from(payloadString, 'utf-8'))
            .digest('hex');

        return signature === signed;
    }
}
