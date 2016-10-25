'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (client) {
    return function (req, res, next) {
        if (!req.bot) {
            throw new Error('Field \'bot\' should be initialized in request object.');
        }

        if (!req.bot.normalized) {
            throw new Error('No normalized data in request object.');
        }

        req.bot.normalized.reduce(function (acc, data) {
            data.im = (0, _rulesWrapper2.default)(client(data.sender.id, data.recipient.id));
            acc.push(data);
            return acc;
        }, []);

        next();
    };
};

var _rulesWrapper = require('./rules-wrapper');

var _rulesWrapper2 = _interopRequireDefault(_rulesWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }