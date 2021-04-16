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
exports.manageGitDependencies = void 0;
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const helpers_fn_1 = require("./helpers.fn");
const git_fn_1 = require("./git.fn");
function splitGithubPath(githubPath) {
    const repoUrl = githubPath.replace('github:', '');
    const [, repoDetail] = repoUrl.split('/');
    const [repoName, version] = repoDetail.split('#');
    return [repoUrl, repoName, version];
}
function getGitDependencies(dependencies) {
    if (!dependencies)
        return [];
    const gitDependencies = Object.values(dependencies);
    if (!(gitDependencies === null || gitDependencies === void 0 ? void 0 : gitDependencies.length))
        return [];
    return gitDependencies;
}
function installNPMDependencies(directory) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentDirectory = process.cwd();
        process.chdir(directory);
        yield new Promise((resolve, reject) => {
            child_process_1.exec('npm install', (err, stdout, stderr) => {
                process.chdir(currentDirectory);
                if (err) {
                    reject(err);
                }
                console.log(stdout);
                console.error(stderr);
                resolve();
            });
        });
    });
}
function manageGitDependency(gitDependency, workingDirectory, token, checkoutBranch) {
    return __awaiter(this, void 0, void 0, function* () {
        const [repoUrl, repoName, version] = splitGithubPath(gitDependency);
        const repoPath = path_1.default.join(workingDirectory, 'node_modules', repoName);
        yield git_fn_1.gitPullOrClone(repoPath, repoUrl, token, checkoutBranch);
        const tags = yield git_fn_1.getListOfTags(repoPath);
        // checkout latest version
        if (tags.length > 0) {
            const maxVer = helpers_fn_1.findMaxVersion(tags, version !== null && version !== void 0 ? version : null);
            if (maxVer !== null) {
                yield git_fn_1.gitCheckout(maxVer, repoPath);
            }
        }
        yield installNPMDependencies(repoPath);
        yield manageGitDependencies(repoPath);
    });
}
function manageGitDependencies(workingDirectory) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Managing Git Dependencies in ${workingDirectory}`);
        const gitPackageJson = helpers_fn_1.readGitPackageJson(workingDirectory);
        if (!gitPackageJson)
            return;
        const { dependencies, token, checkoutBranch = 'main' } = gitPackageJson;
        const gitDependencies = getGitDependencies(dependencies);
        for (const gitDependency of gitDependencies) {
            console.log(`Managing Git Dependency - ${gitDependency}`);
            yield manageGitDependency(gitDependency, workingDirectory, token, checkoutBranch);
        }
    });
}
exports.manageGitDependencies = manageGitDependencies;
//# sourceMappingURL=manageGitDependency.fn.js.map