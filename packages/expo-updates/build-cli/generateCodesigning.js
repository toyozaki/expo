#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCodeSigning = void 0;
const tslib_1 = require("tslib");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const args_1 = require("./utils/args");
const Log = (0, tslib_1.__importStar)(require("./utils/log"));
const generateCodeSigning = async (argv) => {
    const args = (0, args_1.assertArgs)({
        // Types
        '--help': Boolean,
        // Aliases
        '-h': '--help',
    }, argv !== null && argv !== void 0 ? argv : []);
    if (args['--help']) {
        Log.exit((0, chalk_1.default) `
      {bold Description}
      Generate expo-updates code signing keys and certificates

      {bold Usage}
        $ npx expo-updates codesigning:generate

        Options
        -o, --output <string>                   Directory in which to put the generated keys and certificate
        -d, --validity-duration-years <number>  Validity duration in years
        -c, --common-name <string>              Common name attribute for certificate
        -h, --help                              Output usage information
    `, 0);
    }
    const { generateCodeSigningAsync } = await Promise.resolve().then(() => (0, tslib_1.__importStar)(require('./generateCodeSigningAsync')));
    return await generateCodeSigningAsync((0, args_1.getProjectRoot)(args), {
        validityDurationYears: args['--validity-duration-years'],
        output: args['--output'],
        commonName: args['--common-name'],
    });
};
exports.generateCodeSigning = generateCodeSigning;
