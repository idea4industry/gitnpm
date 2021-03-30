#!/usr/bin/env node

import Git from 'nodegit'
import fs from 'fs'
import semver from 'semver'
import { exec } from 'child_process'
import _ from 'lodash'

const gitTokenRaw = fs
  .readFileSync(`${process.cwd()}/github_token.json`)
  .toString()
const gitToken = JSON.parse(gitTokenRaw)

export class GitDependencyManager {
  public static async dependencyFilter(packagePath: string) {
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
      // installing dependencies using npm
      exec(`npm install`, async (err, stdout, stderr) => {
        // Put back original package.json
        fs.writeFileSync(packagePath, JSON.stringify(copyOfPackage, null, 2))

        if (githubDepend.length > 0) {
          await this.manageGitDependency(githubDepend)
        }
      })
    }
  }

  private static async manageGitDependency(gitDepend: Array<string>) {
    if (gitToken === null || gitToken === undefined) {
      throw new Error('Add github_token file')
    } else {
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
        await this.gitPullOrClone(localPath, pathParts[1])

        // List of tags
        const tags = await Git.Repository.open(localPath).then(
          async (repoResult) => {
            const repo = repoResult
            return Git.Tag.list(repo)
          },
        )

        // checkout latest version
        if (tags.length > 0) {
          let maxVer: string
          if (version) {
            if (version.startsWith('^')) {
              version = version.slice(1)
              const majorNum = semver.major(version)
              maxVer = semver.maxSatisfying(tags, `${version} - ${majorNum}`)
            } else if (version.startsWith('~')) {
              version = version.slice(1)
              const majorNum = semver.major(version)
              const minorNum = semver.minor(version)
              maxVer = semver.maxSatisfying(
                tags,
                `${version} - ${majorNum}.${minorNum}`,
              )
            } else {
              maxVer = tags[tags.length - 1]
            }
          } else {
            maxVer = tags[tags.length - 1]
          }

          await this.gitCheckout(maxVer, localPath)
        }
        await this.dependencyFilter(`${localPath}/package.json`)
      }
    }
  }

  public static async gitPullOrClone(localPath: string, repoPath: string) {
    if (fs.existsSync(localPath)) {
      await Git.Repository.open(localPath).then(async (reporesult) => {
        const repo = reporesult
        await repo.fetch('origin').then(async () => {
          return repo.mergeBranches('master', 'origin/master')
        })
      })
    } else {
      await Git.Clone.clone(
        `https://${gitToken.token}:x-oauth-basic@github.com/${repoPath}.git`,
        localPath,
      )
    }
  }

  private static async gitCheckout(tag: string, localPath: string) {
    await Git.Repository.open(localPath)
      .then(async (repoResult) => {
        const repo = repoResult
        return Git.Reference.dwim(repo, `refs/tags/${tag}`).then(function (
          commit,
        ) {
          return repo.checkoutRef(commit)
        })
      })
      .catch((e) => {
        throw e
      })
  }
}

GitDependencyManager.dependencyFilter(`${process.cwd()}/package.json`)
