import { Dictionary } from 'lodash';
export declare type GitPackageJson = {
    dependencies: Dictionary<string>;
    checkoutBranch?: string;
    token: string;
};
export declare function findMaxVersion(tags: string[], versionWithPrefix: string | null): string | null;
export declare function readGitPackageJson(workingDirectory: string): GitPackageJson | null;
