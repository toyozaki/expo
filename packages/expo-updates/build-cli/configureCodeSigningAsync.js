"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureCodeSigningAsync = void 0;
const tslib_1 = require("tslib");
const code_signing_certificates_1 = require("@expo/code-signing-certificates");
const config_1 = require("@expo/config");
const assert_1 = (0, tslib_1.__importDefault)(require("assert"));
const fs_1 = require("fs");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const log_1 = require("./utils/log");
const modifyConfigAsync_1 = require("./utils/modifyConfigAsync");
async function configureCodeSigningAsync(projectRoot, { input }) {
    (0, assert_1.default)(typeof input === 'string', '--input must be a string');
    const inputDir = path_1.default.resolve(projectRoot, input);
    const [certificatePEM, privateKeyPEM, publicKeyPEM] = await Promise.all(['certificate.pem', 'private-key.pem', 'public-key.pem'].map((fname) => fs_1.promises.readFile(path_1.default.join(inputDir, fname), 'utf8')));
    const certificate = (0, code_signing_certificates_1.convertCertificatePEMToCertificate)(certificatePEM);
    const keyPair = (0, code_signing_certificates_1.convertKeyPairPEMToKeyPair)({ privateKeyPEM, publicKeyPEM });
    (0, code_signing_certificates_1.validateSelfSignedCertificate)(certificate, keyPair);
    const { exp } = (0, config_1.getConfig)(projectRoot, { skipSDKVersionRequirement: true });
    // TODO(wschurman) type as ExpoConfig['updates'] when typedefs are updated
    const fields = {
        codeSigningCertificate: `./${path_1.default.relative(projectRoot, inputDir)}/certificate.pem`,
        codeSigningMetadata: {
            keyid: 'main',
            alg: 'rsa-v1_5-sha256',
        },
    };
    await (0, modifyConfigAsync_1.attemptModification)(projectRoot, {
        updates: {
            ...exp.updates,
            ...fields,
        },
    }, {
        updates: {
            ...fields,
        },
    });
    (0, log_1.log)(`Code signing configured for expo-updates (configuration written to app.json)`);
}
exports.configureCodeSigningAsync = configureCodeSigningAsync;
