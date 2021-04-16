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
function gitPull(localPath, checkoutBranch) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('In pull');
        yield nodegit_1.default.Repository.open(localPath)
            .then((reporesult) => __awaiter(this, void 0, void 0, function* () {
            const repo = reporesult;
            yield repo.fetch('origin').then(() => __awaiter(this, void 0, void 0, function* () {
                return repo.mergeBranches(checkoutBranch, `origin/${checkoutBranch}`);
            }));
        }))
            .catch((e) => {
            // eslint-disable-next-line no-console
            console.error(e);
        })
            .then((res) => console.log(res));
    });
}
function gitClone(localPath, repoPath, gitToken, checkoutBranch) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('In clone');
        yield nodegit_1.default.Clone.clone(`https://${gitToken}:x-oauth-basic@github.com/${repoPath}.git`, localPath);
        const repo = yield nodegit_1.default.Repository.open(localPath);
        yield repo.checkoutBranch(checkoutBranch);
    });
}
function gitPullOrClone(repoPath, repoUrl, token, checkoutBranch) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('In gitpullorclone');
        if (fs_1.default.existsSync(repoPath)) {
            yield gitPull(repoPath, checkoutBranch);
        }
        else {
            yield gitClone(repoPath, repoUrl, token, checkoutBranch);
        }
    });
}
exports.gitPullOrClone = gitPullOrClone;
function gitCheckout(tag, localPath) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('In Checkout 1');
        const repo = yield nodegit_1.default.Repository.open(localPath);
        const refs = yield repo.getReferences();
        const tagRefs = refs.filter((ref) => ref.isTag());
        const tagRef = tagRefs.find((t) => t.name() === `refs/tags/${tag}`);
        const targetRef = yield (tagRef === null || tagRef === void 0 ? void 0 : tagRef.peel(1 /* COMMIT */));
        const commit = yield repo.getCommit(targetRef);
        // const tagO = await Git.Reference.dwim(repo, `refs/tags/${tag}`)
        // // const reference = await repo.getReference(`refs/tags/${tag}`)
        // const ref = await tagO.peel(Git.Object.TYPE.COMMIT)
        // const commit = repo.getCommit(ref)
        yield repo.checkoutRef(targetRef);
    });
}
exports.gitCheckout = gitCheckout;
function getListOfTags(repoPath) {
    return nodegit_1.default.Repository.open(repoPath).then((repoResult) => {
        const repo = repoResult;
        return nodegit_1.default.Tag.list(repo);
    });
}
exports.getListOfTags = getListOfTags;
//# sourceMappingURL=git.fn.js.map