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
Object.defineProperty(exports, "__esModule", { value: true });
exports.manageGitDependency = void 0;
const helpers_fn_1 = require("./helpers.fn");
const git_fn_1 = require("./git.fn");
const _1 = require(".");
function manageGitDependency(githubDependenciesObject) {
    return __awaiter(this, void 0, void 0, function* () {
        const githubDependenciesArray = Object.values(githubDependenciesObject);
        if (!githubDependenciesArray.length)
            return;
        for (const gitDependency of githubDependenciesArray) {
            const gitDependencyWithoutPrefix = gitDependency.replace('github:', '');
            const [, repoDetail] = gitDependencyWithoutPrefix.split('/');
            const [repoName, version] = repoDetail.split('#');
            const localPath = `${process.cwd()}/node_modules/${repoName}`;
            // eslint-disable-next-line no-await-in-loop
            yield git_fn_1.gitPullOrClone(localPath, gitDependencyWithoutPrefix);
            // eslint-disable-next-line no-await-in-loop
            const tags = yield git_fn_1.getListOfTags(localPath);
            // checkout latest version
            if (tags.length > 0) {
                const maxVer = helpers_fn_1.findMaxVersion(tags, version !== null && version !== void 0 ? version : null);
                if (maxVer !== null) {
                    // eslint-disable-next-line no-await-in-loop
                    yield git_fn_1.gitCheckout(maxVer, localPath);
                }
            }
            // eslint-disable-next-line no-await-in-loop
            yield _1.dependencyFilter(`${localPath}/package.json`);
        }
    });
}
exports.manageGitDependency = manageGitDependency;
//# sourceMappingURL=manageGitDependency.fn.js.map