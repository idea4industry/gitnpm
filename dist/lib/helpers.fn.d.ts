export declare function getGitToken(gitHubTokenFilePath: string): Promise<string>;
export declare function manageCmdPackages(command: string, args: string): Promise<void>;
export declare function findMaxVersion(tags: string[], version: string): Promise<string | null>;
