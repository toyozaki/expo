#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureCodeSigning = void 0;
const tslib_1 = require("tslib");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const args_1 = require("./utils/args");
const Log = (0, tslib_1.__importStar)(require("./utils/log"));
const configureCodeSigning = async (argv) => {
    const args = (0, args_1.assertArgs)({
        // Types
        '--help': Boolean,
        // Aliases
        '-h': '--help',
    }, argv !== null && argv !== void 0 ? argv : []);
    if (args['--help']) {
        Log.exit((0, chalk_1.default) `
      {bold Description}
      Configure and validate expo-updates code signing for this project

      {bold Usage}
        $ npx expo-updates codesigning:configure

        Options
        -i, --input <string>     Directory containing keys and certificate
        -h, --help               Output usage information
    `, 0);
    }
    const { configureCodeSigningAsync } = await Promise.resolve().then(() => (0, tslib_1.__importStar)(require('./configureCodeSigningAsync')));
    return await configureCodeSigningAsync((0, args_1.getProjectRoot)(args), {
        input: args['--input'],
    });
};
exports.configureCodeSigning = configureCodeSigning;
