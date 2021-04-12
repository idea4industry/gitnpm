import fs from 'fs'
import { exec } from 'child_process'
import { manageGitDependency } from './manageGitDependency.fn'
import { groupDependencies, readPackageJson } from './helpers.fn'
import { npmProxy } from './npmProxy.fn'

export async function dependencyFilter(packagePath: string): Promise<void> {
  const [packageJsonObject, packageJsonBuffer] = readPackageJson(packagePath)
  const [githubDependenciesObject, npmDependenciesObject] = groupDependencies(
    packageJsonObject,
  )
  console.log('Installing git dependencies...')
 
  await manageGitDependency(githubDependenciesObject)
  
}
