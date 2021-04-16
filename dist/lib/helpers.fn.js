"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readGitPackageJson = exports.findMaxVersion = void 0;
const fs_1 = __importDefault(require("fs"));
const semver_1 = __importDefault(require("semver"));
const path_1 = __importDefault(require("path"));
function findMajorVersion(tags, version) {
    const majorNum = semver_1.default.major(version);
    return semver_1.default.maxSatisfying(tags, `${version} - ${majorNum}`);
}
function findMinorVersion(tags, version) {
    const majorNum = semver_1.default.major(version);
    const minorNum = semver_1.default.minor(version);
    return semver_1.default.maxSatisfying(tags, `${version} - ${majorNum}.${minorNum}`);
}
function splitPrefixandVersion(versionWithPrefix) {
    if (versionWithPrefix) {
        const prefixString = versionWithPrefix[0];
        let prefix;
        let version;
        if (prefixString === '^' || prefixString === '~') {
            prefix = prefixString;
            version = versionWithPrefix.slice(1);
        }
        else {
            prefix = '';
            version = versionWithPrefix;
        }
        return [prefix, version];
    }
    return [null, null];
}
function findMaxVersion(tags, versionWithPrefix) {
    const prefixAndVersion = splitPrefixandVersion(versionWithPrefix);
    switch (prefixAndVersion[0]) {
        case '^':
            return findMajorVersion(tags, prefixAndVersion[1]);
        case '~':
            return findMinorVersion(tags, prefixAndVersion[1]);
        case '':
            return prefixAndVersion[1];
        case null:
        default:
            return tags[tags.length - 1];
    }
}
exports.findMaxVersion = findMaxVersion;
function readGitPackageJson(workingDirectory) {
    try {
        const packageJsonBuffer = fs_1.default.readFileSync(path_1.default.join(workingDirectory, 'git-package.json'));
        return JSON.parse(packageJsonBuffer.toString());
    }
    catch (error) {
        return null;
    }
}
exports.readGitPackageJson = readGitPackageJson;
//# sourceMappingURL=helpers.fn.js.map