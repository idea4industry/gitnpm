import { Dictionary } from 'lodash';
import { PackageJson } from 'type-fest';
export declare function npmProxy(npmDependenciesObject: Dictionary<string>, packageJsonObject: PackageJson, packagePath: string): Promise<void>;
