import pick from 'lodash/pick';
import noop from 'lodash/noop';
import request from 'superagent';
import { OK } from 'http-status';
import humps from 'humps';

export { CONTENT_TYPES, COMMUNICATED_COUNT } from './constants';

const LOG_REQUEST_FIELDS = ['method', 'url', '_data', 'header'];

const message = (accessToken, recipientId, logger, messageObject) =>
    new Promise((resolve, reject) =>
        request
            .post(`https://graph.facebook.com/me/messages?access_token=${accessToken}`)
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
                        return resolve(result);
                    } else {
                        return reject(err);
                        logger.error(result.error);
                    }
                },
                error => {
                    logger.error(error.response.text);
                    reject(error);
                }
            )
    );

const normalizeQuickReplies = list =>
    list.map(item => {
        if (!item.contentType) {
            throw new Error(`Didn't specify required field 'contentType' in facebook quick replies.`)
        }

        return humps.decamelizeKeys(item);
    });

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
            }),

            quickReplies: (text, list) => performMessage({
                message: {
                    text,
                    quick_replies: normalizeQuickReplies(list)
                }
            }),

            button: (text, buttons) => performMessage({
                message: {
                    attachment: {
                        type: 'template',
                        payload: {
                            text,
                            template_type: 'button',
                            buttons
                        }
                    }
                }
            }),

            generic: elements => performMessage({
                message: {
                    attachment: {
                        type: 'template',
                        payload: {
                            template_type: 'generic',
                            elements
                        }
                    }
                }
            }),

            buttons: buttons => performMessage({
                message: {
                    attachment: {
                        type: 'template',
                        payload: {
                            template_type: 'generic',
                            elements: buttons
                        }
                    }
                }
            }),

            list: (list, buttons) => performMessage({
                message: {
                    attachment: {
                        type: 'template',
                        payload: {
                            template_type: 'list',
                            top_element_style: 'compact',
                            elements: list,
                            buttons
                        }
                    }
                }
            }),

            image: url => performMessage({
                message: {
                    attachment: {
                        type: 'image',
                        payload: {
                            url
                        }
                    }
                }
            }),

            receipt: ({
                order,
                items,
                address,
                summary,
                adjustments = []
            }) => {
                return performMessage({
                    message: {
                        attachment: {
                            type: 'template',
                            payload: Object.assign({}, order, {
                                template_type: 'receipt',
                                elements: items,
                                address,
                                summary,
                                adjustments
                            })
                        }
                    }
                })
            }
        };
    }
}
