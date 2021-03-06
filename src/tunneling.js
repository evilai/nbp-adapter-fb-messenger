import rulesWrapper from './rules-wrapper';

export default function(client) {
    return (req, res, next) => {
        if (!req.bot) {
            throw new Error('Field \'bot\' should be initialized in request object.');
        }

        if (!req.bot.normalized) {
            throw new Error('No normalized data in request object.');
        }

        req.bot.normalized.reduce((acc, data) => {
            data.im = rulesWrapper(client(data.sender.id, data.recipient.id));
            acc.push(data);
            return acc;
        }, []);

        next();
    };
}
