"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const metadata_1 = require("./utils/metadata");
const parameters_1 = require("./utils/parameters");
function action(options) {
    return (target, propertyKey, descriptor) => {
        const func = descriptor.value;
        if (func && util_1.isFunction(func)) {
            const keyName = propertyKey.toString();
            const opts = Object.assign({ name: keyName }, options);
            const actions = metadata_1.getMetadata(target, "actions") || {};
            const params = metadata_1.getMetadata(target, `${keyName}Params`);
            const contextParam = metadata_1.getMetadata(target, `${keyName}Context`);
            const metaParam = metadata_1.getMetadata(target, `${keyName}Meta`);
            if (!(opts.params || !params)) {
                descriptor.value = ((ctx) => {
                    const args = parameters_1.getParamNames(func).map((param) => {
                        return ctx.params[param];
                    });
                    if (contextParam) {
                        args.splice(contextParam.index, 0, ctx);
                    }
                    if (metaParam) {
                        args.splice(metaParam.index, 0, ctx.meta);
                    }
                    return func.call(ctx.service, ...args);
                });
            }
            const handler = descriptor.value;
            if (params) {
                opts.params = params;
            }
            actions[propertyKey] = Object.assign({ handler }, opts);
            metadata_1.setMetadata(target, "actions", actions);
            metadata_1.removeMetadata(target, `${keyName}Params`);
            return descriptor;
        }
        else {
            throw new TypeError("An action must be a function/method");
        }
    };
}
exports.action = action;
