/// <reference types="node" />
import { Dictionary } from 'lodash';
import { JsonValue } from 'type-fest';
declare type PackageJson = {
    [index: string]: JsonValue | undefined;
    dependencies: Dictionary<string> | undefined;
    devDependencies: Dictionary<string> | undefined;
};
export declare function getGitToken(gitHubTokenFilePath: string): Promise<string>;
export declare function findMaxVersion(tags: string[], versionWithPrefix: string | null): string | null;
export declare function groupDependencies(packageJson: PackageJson): [
    githubDependencies: Dictionary<string>,
    normalDependencies: Dictionary<string>
];
export declare function readPackageJson(packagePath: string): [packageJsonObject: PackageJson, packageJsonBuffer: Buffer];
export {};
