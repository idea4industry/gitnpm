import Git from 'nodegit'
import fs from 'fs'
import { getGitToken } from './helpers.fn'

async function gitPull(localPath: string) {
  await Git.Repository.open(localPath)
    .then(async (reporesult) => {
      const repo = reporesult
      await repo.fetch('origin').then(async () => {
        return repo.mergeBranches('master', 'origin/master')
      })
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e)
    })
}

async function gitClone(localPath: string, repoPath: string, gitToken: string) {
  await Git.Clone.clone(
    `https://${gitToken}:x-oauth-basic@github.com/${repoPath}.git`,
    localPath,
  )
}

export async function gitPullOrClone(localPath: string, repoPath: string) {
  const gitToken = await getGitToken(`${process.cwd()}/github_token.json`)
  if (fs.existsSync(localPath)) {
    await gitPull(localPath)
  } else {
    await gitClone(localPath, repoPath, gitToken)
  }
}

export async function gitCheckout(tag: string, localPath: string) {
  await Git.Repository.open(localPath)
    .then(async (repoResult) => {
      const repo = repoResult
      const commit = await Git.Reference.dwim(repo, `refs/tags/${tag}`)
      return repo.checkoutRef(commit)
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e)
    })
}

export function getListOfTags(localPath: string): Promise<string[]> {
  return Git.Repository.open(localPath).then((repoResult) => {
    const repo = repoResult
    return Git.Tag.list(repo)
  })
}
