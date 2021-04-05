import fs from 'fs'
import { exec } from 'child_process'
import semver from 'semver'

type TokenFileData = {
  token: string
}

export async function getGitToken(
  gitHubTokenFilePath: string,
): Promise<string> {
  const buffer = await fs.promises.readFile(gitHubTokenFilePath).catch(() => {
    throw new Error('Add github_token.json file')
  }) // This read the file
  const text = buffer.toString()
  const json: TokenFileData = JSON.parse(text)
  if (json.token.length === 0) {
    throw new Error('Token is not given in the file')
  }
  // const tokenRegex = new RegExp('^([0-9a-fA-F]{40})$')
  // if (!tokenRegex.test(json.token)) {
  //   throw new Error('Given token is not a valid one')
  // }
  return json.token
}

export async function manageCmdPackages(command: string, args: string) {
  exec(`npm ${command} ${args}`, (err, stdout, stderr) => {
    console.log(stdout)
    console.error(stderr)
  })
}

async function findMajorVersion(
  tags: string[],
  version: string,
): Promise<string | null> {
  version = version.slice(1)
  const majorNum = semver.major(version)
  return semver.maxSatisfying(tags, `${version} - ${majorNum}`)
}

async function findMinorVersion(
  tags: string[],
  version: string,
): Promise<string | null> {
  version = version.slice(1)
  const majorNum = semver.major(version)
  const minorNum = semver.minor(version)
  return semver.maxSatisfying(tags, `${version} - ${majorNum}.${minorNum}`)
}

export async function findMaxVersion(
  tags: string[],
  version: string,
): Promise<string | null> {
  let maxVer: string | null
  if (version) {
    if (version.startsWith('^')) {
      maxVer = await findMajorVersion(tags, version)
    } else if (version.startsWith('~')) {
      maxVer = await findMinorVersion(tags, version)
    } else {
      maxVer = tags[tags.length - 1]
    }
  } else {
    maxVer = tags[tags.length - 1]
  }
  return maxVer
}
