import fs from 'fs'
import { exec } from 'child_process'
import _, { Dictionary, pickBy } from 'lodash'
import { JsonValue } from 'type-fest'
import { findMaxVersion } from './helpers.fn'
import { gitPullOrClone, gitCheckout, getListOfTags } from './git.fn'

type PackageJson = {
  [index: string]: JsonValue | undefined
  dependencies: Dictionary<string> | undefined
  devDependencies: Dictionary<string> | undefined
}

export function dependencyFilter(packagePath: string) {
  const originalPackageFileData = fs.readFileSync(packagePath)
  const packageJson: PackageJson = JSON.parse(
    originalPackageFileData.toString(),
  )
  const { dependencies } = packageJson
  if (dependencies) {
    // filtering out github dependencies
    const githubDependencies = pickBy(dependencies, (value) =>
      value.includes('git'),
    )

    const normalDependencies = pickBy(
      dependencies,
      (value) => !value.includes('git'),
    )

    packageJson.dependencies = normalDependencies
    fs.writeFileSync(packagePath, JSON.stringify(packageJson))
    console.log('Installing dependencies...')
    // installing dependencies using npm
    exec(`npm install`, async (err, stdout, stderr) => {
      if (err) {
        console.log(err)
        process.exit(err.code)
      }
      console.log(stdout)
      console.error(stderr)
      // Put back original package.json
      fs.writeFileSync(packagePath, originalPackageFileData)

      if (Object.values(githubDependencies).length) {
        await manageGitDependency(Object.values(githubDependencies))
      }
    })
  }
}

async function manageGitDependency(gitDependencies: string[]) {
  // Iterating git dependencies
  // eslint-disable-next-line no-restricted-syntax
  for (const gitDependency of gitDependencies) {
    const gitDependencyWithoutPrefix = gitDependency.replace('github:', '')
    const [, repoDetail] = gitDependencyWithoutPrefix.split('/')
    const [repoName, version] = repoDetail.split('#')
    const localPath = `${process.cwd()}/node_modules/${repoName}`
    await gitPullOrClone(localPath, gitDependencyWithoutPrefix)
    const tags = await getListOfTags(localPath)

    // checkout latest version
    if (tags.length > 0) {
      const maxVer: string | null = findMaxVersion(tags, version ?? null)
      if (maxVer !== null) {
        await gitCheckout(maxVer, localPath)
      }
    }
    dependencyFilter(`${localPath}/package.json`)
  }
}
