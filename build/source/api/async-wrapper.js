"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wrap Async Handler - so express will be able to catch an async error
 * @param fn - async express handler
 * @returns wrapped async express handler
 */
function wrap(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}
exports.default = wrap;
