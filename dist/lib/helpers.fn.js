"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readPackageJson = exports.groupDependencies = exports.findMaxVersion = exports.getGitToken = void 0;
const fs_1 = __importDefault(require("fs"));
const lodash_1 = require("lodash");
const semver_1 = __importDefault(require("semver"));
function getGitToken(gitHubTokenFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const buffer = yield fs_1.default.promises.readFile(gitHubTokenFilePath).catch(() => {
            throw new Error('Add github_token.json file');
        }); // This read the file
        const text = buffer.toString();
        const json = JSON.parse(text);
        if (json.token.length === 0) {
            throw new Error('Token is not given in the file');
        }
        return json.token;
    });
}
exports.getGitToken = getGitToken;
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
        case undefined:
        default:
            return tags[tags.length - 1];
    }
}
exports.findMaxVersion = findMaxVersion;
function groupDependencies(packageJson) {
    const { dependencies } = packageJson;
    if (dependencies) {
        const githubDependencies = lodash_1.pickBy(dependencies, (value) => value.includes('git'));
        const normalDependencies = lodash_1.pickBy(dependencies, (value) => !value.includes('git'));
        return [githubDependencies, normalDependencies];
    }
    return [{}, {}];
}
exports.groupDependencies = groupDependencies;
function readPackageJson(packagePath) {
    const packageJsonBuffer = fs_1.default.readFileSync(packagePath);
    return [JSON.parse(packageJsonBuffer.toString()), packageJsonBuffer];
}
exports.readPackageJson = readPackageJson;
//# sourceMappingURL=helpers.fn.js.map