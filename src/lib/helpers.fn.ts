import fs from 'fs'
import { Dictionary, pickBy } from 'lodash'
import semver from 'semver'
import path from 'path'

export type GitPackageJson = {
  dependencies: Dictionary<string>
  checkoutBranch?: string
  token: string
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
    case null:
    default:
      return tags[tags.length - 1]
  }
}

export function readGitPackageJson(
  workingDirectory: string,
): GitPackageJson | null {
  try {
    const packageJsonBuffer = fs.readFileSync(
      path.join(workingDirectory, 'git-package.json'),
    )
    return JSON.parse(packageJsonBuffer.toString())
  } catch (error) {
    return null
  }
}
