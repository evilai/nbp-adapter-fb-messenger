'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.messengerTunneling = exports.rulesWrapper = exports.CONTENT_TYPES = undefined;

var _constants = require('./constants');

Object.defineProperty(exports, 'CONTENT_TYPES', {
    enumerable: true,
    get: function get() {
        return _constants.CONTENT_TYPES;
    }
});

var _rulesWrapper = require('./rules-wrapper');

Object.defineProperty(exports, 'rulesWrapper', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_rulesWrapper).default;
    }
});

var _tunneling = require('./tunneling');

Object.defineProperty(exports, 'messengerTunneling', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_tunneling).default;
    }
});

exports.default = function (_ref) {
    var _ref$logger = _ref.logger;
    var logger = _ref$logger === undefined ? { info: _noop2.default, error: _noop2.default } : _ref$logger;
    var accessToken = _ref.accessToken;

    if (!accessToken) {
        throw new Error('Required access token for Facebook Messenger adapter.');
    }

    return function (recipientId) {
        var performMessage = message.bind(null, accessToken, recipientId, logger);

        return {
            send: function send(text) {
                return performMessage({
                    message: {
                        text: text
                    }
                });
            },

            typing: function typing() {
                return performMessage({
                    sender_action: 'typing_on'
                });
            },

            seen: function seen() {
                return performMessage({
                    sender_action: 'mark_seen'
                });
            },

            quickReplies: function quickReplies(text, list) {
                return performMessage({
                    message: {
                        text: text,
                        quick_replies: normalizeQuickReplies(list)
                    }
                });
            },

            button: function button(text, buttons) {
                return performMessage({
                    message: {
                        attachment: {
                            type: 'template',
                            payload: {
                                text: text,
                                template_type: 'button',
                                buttons: buttons
                            }
                        }
                    }
                });
            },

            generic: function generic(elements) {
                return performMessage({
                    message: {
                        attachment: {
                            type: 'template',
                            payload: {
                                template_type: 'generic',
                                elements: elements
                            }
                        }
                    }
                });
            },

            buttons: function buttons(_buttons) {
                return performMessage({
                    message: {
                        attachment: {
                            type: 'template',
                            payload: {
                                template_type: 'generic',
                                elements: _buttons
                            }
                        }
                    }
                });
            },

            list: function list(_list, buttons) {
                return performMessage({
                    message: {
                        attachment: {
                            type: 'template',
                            payload: {
                                template_type: 'list',
                                top_element_style: 'compact',
                                elements: _list,
                                buttons: buttons
                            }
                        }
                    }
                });
            },

            image: function image(url) {
                return performMessage({
                    message: {
                        attachment: {
                            type: 'image',
                            payload: {
                                url: url
                            }
                        }
                    }
                });
            },

            receipt: function receipt(_ref2) {
                var order = _ref2.order;
                var items = _ref2.items;
                var address = _ref2.address;
                var summary = _ref2.summary;
                var _ref2$adjustments = _ref2.adjustments;
                var adjustments = _ref2$adjustments === undefined ? [] : _ref2$adjustments;

                return performMessage({
                    message: {
                        attachment: {
                            type: 'template',
                            payload: Object.assign({}, order, {
                                template_type: 'receipt',
                                elements: items,
                                address: address,
                                summary: summary,
                                adjustments: adjustments
                            })
                        }
                    }
                });
            }
        };
    };
};

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _noop = require('lodash/noop');

var _noop2 = _interopRequireDefault(_noop);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _httpStatus = require('http-status');

var _humps = require('humps');

var _humps2 = _interopRequireDefault(_humps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOG_REQUEST_FIELDS = ['method', 'url', '_data', 'header'];

var message = function message(accessToken, recipientId, logger, messageObject) {
    return new Promise(function (resolve, reject) {
        return _superagent2.default.post('https://graph.facebook.com/me/messages?access_token=' + accessToken).send(Object.assign({}, {
            recipient: { id: recipientId }
        }, messageObject)).use(function (req) {
            logger.info('Request  -->', (0, _pick2.default)(req, LOG_REQUEST_FIELDS));
            return req;
        }).then(function (result) {
            if (result.status === _httpStatus.OK) {
                logger.info('Response <--', result.body);
                return resolve(result);
            } else {
                return reject(err);
                logger.error(result.error);
            }
        }, function (error) {
            logger.error(error.response.text);
            reject(error);
        });
    });
};

var normalizeQuickReplies = function normalizeQuickReplies(list) {
    return list.map(function (item) {
        if (!item.contentType) {
            throw new Error('Didn\'t specify required field \'contentType\' in facebook quick replies.');
        }

        return _humps2.default.decamelizeKeys(item);
    });
};