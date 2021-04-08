/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
import fs from 'fs'
import { exec } from 'child_process'
import _ from 'lodash'
import { findMaxVersion } from './helpers.fn'
import { gitPullOrClone, gitCheckout, getListOfTags } from './git.fn'

export function dependencyFilter(packagePath: string) {
  const packageRawData = fs.readFileSync(packagePath).toString()
  const packageJsonData = JSON.parse(packageRawData)
  const copyOfPackage = _.cloneDeep(packageJsonData)
  const dependenciesData: { [key: string]: string } =
    packageJsonData.dependencies
  if (dependenciesData) {
    // filtering out github dependencies
    const githubDepend: Array<string> = Object.values(
      dependenciesData,
    ).filter((version) => version.includes('git'))

    // Taking only dependencies without git to modify package.json
    const dependenciesModified = Object.entries(dependenciesData)
      .filter(([packageName, version]) => !version.includes('git'))
      .reduce(
        (acc, [packageName, version]) => ({
          ...acc,
          [packageName]: version,
        }),
        {},
      )

    // Modifying package.json with new dependencies
    packageJsonData.dependencies = dependenciesModified
    fs.writeFileSync(packagePath, JSON.stringify(packageJsonData))
    console.log('Installing dependencies...')
    // installing dependencies using npm
    exec(`npm install`, async (err, stdout, stderr) => {
      console.log(stdout)
      // Put back original package.json
      fs.writeFileSync(packagePath, JSON.stringify(copyOfPackage, null, 2))

      if (githubDepend.length > 0) {
        await manageGitDependency(githubDepend)
      }
    })
  }
}

async function manageGitDependency(gitDepend: Array<string>) {
  // Iterating git dependencies
  // eslint-disable-next-line no-restricted-syntax
  for (const val of gitDepend) {
    const pathParts = val.split(':')
    const repoDetail = pathParts[1].split('/')[1]
    let repoName: string
    let version: string = ''
    if (repoDetail.includes('#')) {
      repoName = repoDetail.split('#')[0]
      version = repoDetail.split('#')[1]
    } else {
      repoName = repoDetail
    }
    // clone or pull git repo into node_modules
    const localPath = `${process.cwd()}/node_modules/${repoName}`
    await gitPullOrClone(localPath, pathParts[1])

    // List of tags
    const tags = await getListOfTags(localPath)

    // checkout latest version
    if (tags.length > 0) {
      const maxVer: string | null = findMaxVersion(tags, version)
      if (maxVer !== null) {
        await gitCheckout(maxVer, localPath)
      }
    }
    dependencyFilter(`${localPath}/package.json`)
  }
}
