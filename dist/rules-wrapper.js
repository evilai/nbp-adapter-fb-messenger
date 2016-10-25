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

        return client;
    };
};

var _reduce = require('lodash/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
}); /**
     * If we should be silent, then don't try to communicate with user.
     * This wrapper returns noop functions for all client methods.
     */

var SILENT_RULE = 'silent';