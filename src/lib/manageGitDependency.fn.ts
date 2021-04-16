/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import path from 'path'
import { exec } from 'child_process'
import {
  findMaxVersion,
  GitPackageJson,
  readGitPackageJson,
} from './helpers.fn'
import { gitPullOrClone, gitCheckout, getListOfTags } from './git.fn'

function splitGithubPath(
  githubPath: string,
): [repoUrl: string, repoName: string, version: string] {
  const repoUrl = githubPath.replace('github:', '')
  const [, repoDetail] = repoUrl.split('/')
  const [repoName, version] = repoDetail.split('#')
  return [repoUrl, repoName, version]
}

function getGitDependencies(
  dependencies: GitPackageJson['dependencies'],
): string[] {
  if (!dependencies) return []
  const gitDependencies = Object.values(dependencies)
  if (!gitDependencies?.length) return []
  return gitDependencies
}

async function installNPMDependencies(directory: string): Promise<void> {
  const currentDirectory = process.cwd()
  process.chdir(directory)
  await new Promise<void>((resolve, reject) => {
    exec('npm install', (err, stdout, stderr) => {
      process.chdir(currentDirectory)
      if (err) {
        reject(err)
      }
      console.log(stdout)
      console.error(stderr)
      resolve()
    })
  })
}

async function manageGitDependency(
  gitDependency: string,
  workingDirectory: string,
  token: string,
  checkoutBranch: string,
) {
  const [repoUrl, repoName, version] = splitGithubPath(gitDependency)
  const repoPath = path.join(workingDirectory, 'node_modules', repoName)
  await gitPullOrClone(repoPath, repoUrl, token, checkoutBranch)
  const tags = await getListOfTags(repoPath)

  // checkout latest version
  if (tags.length > 0) {
    const maxVer: string | null = findMaxVersion(tags, version ?? null)
    if (maxVer !== null) {
      await gitCheckout(maxVer, repoPath)
    }
  }
  await installNPMDependencies(repoPath)
  await manageGitDependencies(repoPath)
}

export async function manageGitDependencies(workingDirectory: string) {
  console.log(`Managing Git Dependencies in ${workingDirectory}`)
  const gitPackageJson = readGitPackageJson(workingDirectory)
  if (!gitPackageJson) return
  const { dependencies, token, checkoutBranch = 'main' } = gitPackageJson
  const gitDependencies = getGitDependencies(dependencies)
  for (const gitDependency of gitDependencies) {
    console.log(`Managing Git Dependency - ${gitDependency}`)
    await manageGitDependency(
      gitDependency,
      workingDirectory,
      token,
      checkoutBranch,
    )
  }
}
