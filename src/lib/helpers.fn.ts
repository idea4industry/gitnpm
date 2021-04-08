import fs from 'fs'
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
  return json.token
}

function findMajorVersion(tags: string[], version: string): string | null {
  const majorNum = semver.major(version)
  return semver.maxSatisfying(tags, `${version} - ${majorNum}`)
}

function findMinorVersion(tags: string[], version: string): string | null {
  const majorNum = semver.major(version)
  const minorNum = semver.minor(version)
  return semver.maxSatisfying(tags, `${version} - ${majorNum}.${minorNum}`)
}

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
