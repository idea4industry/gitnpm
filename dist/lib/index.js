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
/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const lodash_1 = __importDefault(require("lodash"));
const helpers_fn_1 = require("./helpers.fn");
const git_fn_1 = require("./git.fn");
function dependencyFilter(packagePath) {
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
        console.log('Installing dependencies...');
        // installing dependencies using npm
        child_process_1.exec(`npm install`, (err, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
            console.log(stdout);
            // Put back original package.json
            fs_1.default.writeFileSync(packagePath, JSON.stringify(copyOfPackage, null, 2));
            if (githubDepend.length > 0) {
                yield manageGitDependency(githubDepend);
            }
        }));
    }
}
exports.dependencyFilter = dependencyFilter;
function manageGitDependency(gitDepend) {
    return __awaiter(this, void 0, void 0, function* () {
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
            yield git_fn_1.gitPullOrClone(localPath, pathParts[1]);
            // List of tags
            const tags = yield git_fn_1.getListOfTags(localPath);
            // checkout latest version
            if (tags.length > 0) {
                const maxVer = helpers_fn_1.findMaxVersion(tags, version);
                if (maxVer !== null) {
                    yield git_fn_1.gitCheckout(maxVer, localPath);
                }
            }
            dependencyFilter(`${localPath}/package.json`);
        }
    });
}
//# sourceMappingURL=index.js.map