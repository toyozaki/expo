"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCodeSigningAsync = void 0;
const tslib_1 = require("tslib");
const code_signing_certificates_1 = require("@expo/code-signing-certificates");
const assert_1 = (0, tslib_1.__importDefault)(require("assert"));
const fs_1 = require("fs");
const fs_extra_1 = require("fs-extra");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const log_1 = require("./utils/log");
async function generateCodeSigningAsync(projectRoot, { output, validityDurationYears: validityDurationYearsString, commonName }) {
    (0, assert_1.default)(typeof output === 'string', '--output must be a string');
    (0, assert_1.default)(typeof validityDurationYearsString === 'string', '--validity-duration-years must be a number');
    (0, assert_1.default)(typeof commonName === 'string', '--common-name must be a string');
    const validityDurationYears = parseInt(validityDurationYearsString, 10);
    const outputDir = path_1.default.resolve(projectRoot, output);
    await (0, fs_extra_1.ensureDir)(outputDir);
    const isDirectoryEmpty = (await fs_1.promises.readdir(outputDir)).length === 0;
    (0, assert_1.default)(isDirectoryEmpty, 'Output directory must be empty');
    const keyPair = (0, code_signing_certificates_1.generateKeyPair)();
    const validityNotBefore = new Date();
    const validityNotAfter = new Date();
    validityNotAfter.setFullYear(validityNotAfter.getFullYear() + validityDurationYears);
    const certificate = (0, code_signing_certificates_1.generateSelfSignedCodeSigningCertificate)({
        keyPair,
        validityNotBefore,
        validityNotAfter,
        commonName,
    });
    const keyPairPEM = (0, code_signing_certificates_1.convertKeyPairToPEM)(keyPair);
    const certificatePEM = (0, code_signing_certificates_1.convertCertificateToCertificatePEM)(certificate);
    await Promise.all([
        fs_1.promises.writeFile(path_1.default.join(outputDir, 'public-key.pem'), keyPairPEM.publicKeyPEM),
        fs_1.promises.writeFile(path_1.default.join(outputDir, 'private-key.pem'), keyPairPEM.privateKeyPEM),
        fs_1.promises.writeFile(path_1.default.join(outputDir, 'certificate.pem'), certificatePEM),
    ]);
    (0, log_1.log)(`Generated keys and certificates output to ${outputDir}`);
}
exports.generateCodeSigningAsync = generateCodeSigningAsync;
