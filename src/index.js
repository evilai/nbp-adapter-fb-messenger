import pick from 'lodash/pick';
import noop from 'lodash/noop';
import request from 'superagent';
import { OK } from 'http-status';

const LOG_REQUEST_FIELDS = ['method', 'url', '_data', 'header'];

export default function({ logger = { info: noop, error: noop }, accessToken }) {
    if (!accessToken) {
        throw new Error('Required access token for Facebook Messenger adapter.');
    }

    return recipientId =>
        () => ({
            send: text => new Promise((resolve, reject) =>
                request
                    .post(`https://graph.facebook.com/v2.6/me/messages?access_token=${accessToken}`)
                    .send({
                        recipient: { id: recipientId },
                        message: { text }
                    })
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
            ),

            typing: () => new Promise((resolve, reject) =>
                request
                    .post(`https://graph.facebook.com/v2.6/me/messages?access_token=${accessToken}`)
                    .send({
                        recipient: { id: recipientId },
                        sender_action: 'typing_on'
                    })
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
            ),

            seen: () => new Promise((resolve, reject) =>
                request
                    .post(`https://graph.facebook.com/v2.6/me/messages?access_token=${accessToken}`)
                    .send({
                        recipient: { id: recipientId },
                        sender_action: 'mark_seen'
                    })
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
            )
        });
}
