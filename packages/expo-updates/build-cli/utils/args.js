"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertArgs = exports.getProjectRoot = void 0;
const tslib_1 = require("tslib");
// Common utilities for interacting with `args` library.
// These functions should be used by every command.
const arg_1 = (0, tslib_1.__importDefault)(require("arg"));
const fs_1 = require("fs");
const path_1 = require("path");
const Log = (0, tslib_1.__importStar)(require("./log"));
/**
 * Parse the first argument as a project directory.
 *
 * @returns valid project directory.
 */
function getProjectRoot(args) {
    const projectRoot = (0, path_1.resolve)(args._[0] || '.');
    if (!(0, fs_1.existsSync)(projectRoot)) {
        Log.exit(`Invalid project root: ${projectRoot}`);
    }
    return projectRoot;
}
exports.getProjectRoot = getProjectRoot;
/**
 * Parse args and assert unknown options.
 *
 * @param schema the `args` schema for parsing the command line arguments.
 * @param argv extra strings
 * @returns processed args object.
 */
function assertArgs(schema, argv) {
    try {
        return (0, arg_1.default)(schema, { argv });
    }
    catch (error) {
        // Ensure unknown options are handled the same way.
        if (error.code === 'ARG_UNKNOWN_OPTION') {
            Log.exit(error.message, 1);
        }
        // Otherwise rethrow the error.
        throw error;
    }
}
exports.assertArgs = assertArgs;
