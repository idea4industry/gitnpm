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

// eslint-disable-next-line require-await
export async function manageCmdPackages(
  command: string,
  args: string,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    exec(`npm ${command} ${args}`, (err, stdout, stderr) => {
      console.log(stdout)
      console.error(stderr)
      resolve()
    })
  })
}

function findMajorVersion(tags: string[], version: string): string | null {
  const majorNum = semver.major(version)
  return semver.maxSatisfying(tags, `${version} - ${majorNum}`)
}

function findMinorVersion(tags: string[], version: string): string | null {
  const versionWithoutPrefix = version.slice(1)
  const majorNum = semver.major(versionWithoutPrefix)
  const minorNum = semver.minor(versionWithoutPrefix)
  return semver.maxSatisfying(
    tags,
    `${versionWithoutPrefix} - ${majorNum}.${minorNum}`,
  )
}

// test: github:user/repo
// test: github:user/repo#1.0.1
// test: github:user/repo#^1.0.1
// test: github:user/repo#~1.0.1

type Prefix = '^' | '~' | ''

type PrefixandVersion =
  | [prefix: Prefix, version: string]
  | [prefix: null, version: null]

function splitPrefixandVersion(
  versionWithPrefix: string | null,
): PrefixandVersion {
  if (versionWithPrefix) {
    const prefixString = versionWithPrefix[0]
    let prefix: Prefix
    let version: string
    if (prefixString === '^' || prefixString === '~') {
      prefix = prefixString
      version = versionWithPrefix.slice(1)
    } else {
      prefix = ''
      version = versionWithPrefix
    }
    return [prefix, version]
  }
  return [null, null]
}

export function findMaxVersion(
  tags: string[],
  versionWithPrefix: string | null,
): string | null {
  const prefixAndVersion = splitPrefixandVersion(versionWithPrefix)
  switch (prefixAndVersion[0]) {
    case '^':
      return findMajorVersion(tags, prefixAndVersion[1])
    case '~':
      return findMinorVersion(tags, prefixAndVersion[1])
    case '':
      return prefixAndVersion[1]
    default:
      return tags[tags.length - 1]
  }
}
