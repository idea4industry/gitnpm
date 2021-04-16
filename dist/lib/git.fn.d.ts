export declare function gitPullOrClone(repoPath: string, repoUrl: string, token: string, checkoutBranch: string): Promise<void>;
export declare function gitCheckout(tag: string, localPath: string): Promise<void>;
export declare function getListOfTags(repoPath: string): Promise<string[]>;
