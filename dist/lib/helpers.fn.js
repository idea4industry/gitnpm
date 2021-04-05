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
exports.findMaxVersion = exports.manageCmdPackages = exports.getGitToken = void 0;
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
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
        // const tokenRegex = new RegExp('^([0-9a-fA-F]{40})$')
        // if (!tokenRegex.test(json.token)) {
        //   throw new Error('Given token is not a valid one')
        // }
        return json.token;
    });
}
exports.getGitToken = getGitToken;
function manageCmdPackages(command, args) {
    return __awaiter(this, void 0, void 0, function* () {
        child_process_1.exec(`npm ${command} ${args}`, (err, stdout, stderr) => {
            console.log(stdout);
            console.error(stderr);
        });
    });
}
exports.manageCmdPackages = manageCmdPackages;
function findMajorVersion(tags, version) {
    return __awaiter(this, void 0, void 0, function* () {
        version = version.slice(1);
        const majorNum = semver_1.default.major(version);
        return semver_1.default.maxSatisfying(tags, `${version} - ${majorNum}`);
    });
}
function findMinorVersion(tags, version) {
    return __awaiter(this, void 0, void 0, function* () {
        version = version.slice(1);
        const majorNum = semver_1.default.major(version);
        const minorNum = semver_1.default.minor(version);
        return semver_1.default.maxSatisfying(tags, `${version} - ${majorNum}.${minorNum}`);
    });
}
function findMaxVersion(tags, version) {
    return __awaiter(this, void 0, void 0, function* () {
        let maxVer;
        if (version) {
            if (version.startsWith('^')) {
                maxVer = yield findMajorVersion(tags, version);
            }
            else if (version.startsWith('~')) {
                maxVer = yield findMinorVersion(tags, version);
            }
            else {
                maxVer = tags[tags.length - 1];
            }
        }
        else {
            maxVer = tags[tags.length - 1];
        }
        return maxVer;
    });
}
exports.findMaxVersion = findMaxVersion;
//# sourceMappingURL=helpers.fn.js.map