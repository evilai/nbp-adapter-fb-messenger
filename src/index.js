import pick from 'lodash/pick';
import noop from 'lodash/noop';
import request from 'superagent';
import { OK } from 'http-status';

const LOG_REQUEST_FIELDS = ['method', 'url', '_data', 'header'];

const message = (accessToken, recipientId, logger, messageObject) =>
    new Promise((resolve, reject) =>
        request
            .post(`https://graph.facebook.com/v2.6/me/messages?access_token=${accessToken}`)
            .send(Object.assign({}, {
                recipient: { id: recipientId }
            }, messageObject))
            .use(req => {
                logger.info('Request  -->', pick(req, LOG_REQUEST_FIELDS));
                return req;
            })
            .then(
                result => {
                    if (result.status === OK) {
                        logger.info('Response <--', result.body);
                    } else {
                        logger.error(result.error);
                    }

                    resolve(result);
                },
                err => {
                    logger.error(err);
                    reject(err);
                }
            )
    );

export { default as rulesWrapper } from './rules-wrapper';
export { default as messengerTunneling } from './tunneling';

export default function({ logger = { info: noop, error: noop }, accessToken }) {
    if (!accessToken) {
        throw new Error('Required access token for Facebook Messenger adapter.');
    }

    return recipientId => {
        const performMessage = message.bind(null, accessToken, recipientId, logger);

        return {
            send: text => performMessage({
                message: {
                    text: text
                }
            }),

            typing: () => performMessage({
                sender_action: 'typing_on'
            }),

            seen: () => performMessage({
                sender_action: 'mark_seen'
            })
        };
    }
}
