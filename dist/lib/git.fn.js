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
exports.getListOfTags = exports.gitCheckout = exports.gitPullOrClone = void 0;
const nodegit_1 = __importDefault(require("nodegit"));
const fs_1 = __importDefault(require("fs"));
const helpers_fn_1 = require("./helpers.fn");
function gitPull(localPath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield nodegit_1.default.Repository.open(localPath)
            .then((reporesult) => __awaiter(this, void 0, void 0, function* () {
            const repo = reporesult;
            yield repo.fetch('origin').then(() => __awaiter(this, void 0, void 0, function* () {
                return repo.mergeBranches('master', 'origin/master');
            }));
        }))
            .catch((e) => {
            // eslint-disable-next-line no-console
            console.error(e);
        });
    });
}
function gitClone(localPath, repoPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const gitToken = yield helpers_fn_1.getGitToken(`${process.cwd()}/github_token.json`);
        yield nodegit_1.default.Clone.clone(`https://${gitToken}:x-oauth-basic@github.com/${repoPath}.git`, localPath);
    });
}
function gitPullOrClone(localPath, repoPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs_1.default.existsSync(localPath)) {
            yield gitPull(localPath);
        }
        else {
            yield gitClone(localPath, repoPath);
        }
    });
}
exports.gitPullOrClone = gitPullOrClone;
function gitCheckout(tag, localPath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield nodegit_1.default.Repository.open(localPath)
            .then((repoResult) => __awaiter(this, void 0, void 0, function* () {
            const repo = repoResult;
            const commit = yield nodegit_1.default.Reference.dwim(repo, `refs/tags/${tag}`);
            return repo.checkoutRef(commit);
        }))
            .catch((e) => {
            // eslint-disable-next-line no-console
            console.error(e);
        });
    });
}
exports.gitCheckout = gitCheckout;
function getListOfTags(localPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const tags = yield nodegit_1.default.Repository.open(localPath).then((repoResult) => {
            const repo = repoResult;
            return nodegit_1.default.Tag.list(repo);
        });
        return tags;
    });
}
exports.getListOfTags = getListOfTags;
//# sourceMappingURL=git.fn.js.map