export declare function gitPullOrClone(localPath: string, repoPath: string): Promise<void>;
export declare function gitCheckout(tag: string, localPath: string): Promise<void>;
export declare function getListOfTags(localPath: string): Promise<string[]>;
