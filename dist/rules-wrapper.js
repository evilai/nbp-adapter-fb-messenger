'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (client) {
    return function (rules) {
        if (rules.get(SILENT_RULE)) {
            return (0, _reduce2.default)(client, function (acc, method, methodName) {
                acc[methodName] = noop;
                return acc;
            }, {});
        }

        var count = rules.get(_constants.COMMUNICATED_COUNT) || 0;
        rules.set(_defineProperty({}, _constants.COMMUNICATED_COUNT, count + 1));

        return client;
    };
};

var _reduce = require('lodash/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /**
                                                                                                                                                                                                                   * If we should be silent, then don't try to communicate with user.
                                                                                                                                                                                                                   * This wrapper returns noop functions for all client methods.
                                                                                                                                                                                                                   */

var noop = regeneratorRuntime.mark(function noop() {
    return regeneratorRuntime.wrap(function noop$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    return _context.abrupt('return', null);

                case 1:
                case 'end':
                    return _context.stop();
            }
        }
    }, noop, this);
});

var SILENT_RULE = 'silent';