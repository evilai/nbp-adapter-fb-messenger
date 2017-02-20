/**
 * If we should be silent, then don't try to communicate with user.
 * This wrapper returns noop functions for all client methods.
 */

import reduce from 'lodash/reduce';
import { COMMUNICATED_COUNT } from './constants';
const noop = function* () {
    return null;
};

const SILENT_RULE = 'silent';

export default function(client) {
    return (rules) => {
        if (rules.get(SILENT_RULE)) {
            return reduce(client, (acc, method, methodName) => {
                acc[methodName] = noop;
                return acc;
            }, {});
        }

        const count = rules.get(COMMUNICATED_COUNT) || 0;
        rules.set({ [COMMUNICATED_COUNT]: count + 1 });

        return client;
    };
}