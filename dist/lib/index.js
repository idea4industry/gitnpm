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
const fs_1 = __importDefault(require("fs"));
const manageGitDependency_fn_1 = require("./manageGitDependency.fn");
const helpers_fn_1 = require("./helpers.fn");
const npmProxy_fn_1 = require("./npmProxy.fn");
function dependencyFilter(packagePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const [packageJsonObject, packageJsonBuffer] = helpers_fn_1.readPackageJson(packagePath);
        const [githubDependenciesObject, npmDependenciesObject] = helpers_fn_1.groupDependencies(packageJsonObject);
        console.log('Installing dependencies...');
        try {
            yield npmProxy_fn_1.npmProxy(npmDependenciesObject, packageJsonObject, packagePath);
            yield manageGitDependency_fn_1.manageGitDependency(githubDependenciesObject);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            fs_1.default.writeFileSync(packagePath, packageJsonBuffer);
        }
    });
}
exports.dependencyFilter = dependencyFilter;
//# sourceMappingURL=index.js.map