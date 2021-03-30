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
exports.dependencyFilter = void 0;
const nodegit_1 = __importDefault(require("nodegit"));
const fs_1 = __importDefault(require("fs"));
const semver_1 = __importDefault(require("semver"));
const child_process_1 = require("child_process");
const lodash_1 = __importDefault(require("lodash"));
const gitTokenRaw = fs_1.default
    .readFileSync(`${process.cwd()}/github_token.json`)
    .toString();
const gitToken = JSON.parse(gitTokenRaw);
function manageGitDependency(gitDepend) {
    return __awaiter(this, void 0, void 0, function* () {
        if (gitToken === null || gitToken === undefined) {
            throw new Error('Add github_token file');
        }
        else {
            // Iterating git dependencies
            // eslint-disable-next-line no-restricted-syntax
            for (const val of gitDepend) {
                const pathParts = val.split(':');
                const repoDetail = pathParts[1].split('/')[1];
                let repoName;
                let version = '';
                if (repoDetail.includes('#')) {
                    repoName = repoDetail.split('#')[0];
                    version = repoDetail.split('#')[1];
                }
                else {
                    repoName = repoDetail;
                }
                // clone or pull git repo into node_modules
                const localPath = `${process.cwd()}/node_modules/${repoName}`;
                yield gitPullOrClone(localPath, pathParts[1]);
                // List of tags
                const tags = yield nodegit_1.default.Repository.open(localPath).then((repoResult) => __awaiter(this, void 0, void 0, function* () {
                    const repo = repoResult;
                    return nodegit_1.default.Tag.list(repo);
                }));
                // checkout latest version
                if (tags.length > 0) {
                    let maxVer;
                    if (version) {
                        if (version.startsWith('^')) {
                            version = version.slice(1);
                            const majorNum = semver_1.default.major(version);
                            maxVer = semver_1.default.maxSatisfying(tags, `${version} - ${majorNum}`);
                        }
                        else if (version.startsWith('~')) {
                            version = version.slice(1);
                            const majorNum = semver_1.default.major(version);
                            const minorNum = semver_1.default.minor(version);
                            maxVer = semver_1.default.maxSatisfying(tags, `${version} - ${majorNum}.${minorNum}`);
                        }
                        else {
                            maxVer = tags[tags.length - 1];
                        }
                    }
                    else {
                        maxVer = tags[tags.length - 1];
                    }
                    yield gitCheckout(maxVer, localPath);
                }
                yield dependencyFilter(`${localPath}/package.json`);
            }
        }
    });
}
function gitPullOrClone(localPath, repoPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs_1.default.existsSync(localPath)) {
            yield nodegit_1.default.Repository.open(localPath).then((reporesult) => __awaiter(this, void 0, void 0, function* () {
                const repo = reporesult;
                yield repo.fetch('origin').then(() => __awaiter(this, void 0, void 0, function* () {
                    return repo.mergeBranches('master', 'origin/master');
                }));
            }));
        }
        else {
            yield nodegit_1.default.Clone.clone(`https://${gitToken.token}:x-oauth-basic@github.com/${repoPath}.git`, localPath);
        }
    });
}
function gitCheckout(tag, localPath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield nodegit_1.default.Repository.open(localPath)
            .then((repoResult) => __awaiter(this, void 0, void 0, function* () {
            const repo = repoResult;
            return nodegit_1.default.Reference.dwim(repo, `refs/tags/${tag}`).then(function (commit) {
                return repo.checkoutRef(commit);
            });
        }))
            .catch((e) => {
            throw e;
        });
    });
}
function dependencyFilter(packagePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const packageRawData = fs_1.default.readFileSync(packagePath).toString();
        const packageJsonData = JSON.parse(packageRawData);
        const copyOfPackage = lodash_1.default.cloneDeep(packageJsonData);
        const dependenciesData = packageJsonData.dependencies;
        if (dependenciesData) {
            // filtering out github dependencies
            const githubDepend = Object.values(dependenciesData).filter((version) => version.includes('git'));
            // Taking only dependencies without git to modify package.json
            const dependenciesModified = Object.entries(dependenciesData)
                .filter(([packageName, version]) => !version.includes('git'))
                .reduce((acc, [packageName, version]) => (Object.assign(Object.assign({}, acc), { [packageName]: version })), {});
            // Modifying package.json with new dependencies
            packageJsonData.dependencies = dependenciesModified;
            fs_1.default.writeFileSync(packagePath, JSON.stringify(packageJsonData));
            // installing dependencies using npm
            child_process_1.exec(`npm install`, (err, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
                // Put back original package.json
                fs_1.default.writeFileSync(packagePath, JSON.stringify(copyOfPackage, null, 2));
                if (githubDepend.length > 0) {
                    yield manageGitDependency(githubDepend);
                }
            }));
        }
    });
}
exports.dependencyFilter = dependencyFilter;
//# sourceMappingURL=index.js.map