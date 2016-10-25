'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.messengerTunneling = exports.rulesWrapper = undefined;

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOG_REQUEST_FIELDS = ['method', 'url', '_data', 'header'];

var message = function message(accessToken, recipientId, logger, messageObject) {
    return new Promise(function (resolve, reject) {
        return _superagent2.default.post('https://graph.facebook.com/v2.6/me/messages?access_token=' + accessToken).send(Object.assign({}, {
            recipient: { id: recipientId }
        }, messageObject)).use(function (req) {
            logger.info('Request  -->', (0, _pick2.default)(req, LOG_REQUEST_FIELDS));
            return req;
        }).then(function (result) {
            if (result.status === _httpStatus.OK) {
                logger.info('Response <--', result.body);
            } else {
                logger.error(result.error);
            }

            resolve(result);
        }, function (err) {
            logger.error(err);
            reject(err);
        });
    });
};