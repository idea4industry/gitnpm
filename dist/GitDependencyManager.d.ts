#!/usr/bin/env node
export declare class GitDependencyManager {
    static dependencyFilter(packagePath: string): Promise<void>;
    private static manageGitDependency;
    static gitPullOrClone(localPath: string, repoPath: string): Promise<void>;
    private static gitCheckout;
}
