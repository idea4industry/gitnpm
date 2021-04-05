import Git from 'nodegit'
import fs from 'fs'
import { getGitToken } from './helpers.fn'

export async function gitPullOrClone(localPath: string, repoPath: string) {
  const gitToken = await getGitToken(`${process.cwd()}/github_token.json`)
  if (fs.existsSync(localPath)) {
    await Git.Repository.open(localPath)
      .then(async (reporesult) => {
        const repo = reporesult
        await repo.fetch('origin').then(async () => {
          return repo.mergeBranches('master', 'origin/master')
        })
      })
      .catch((e) => {
        console.error(e)
      })
  } else {
    await Git.Clone.clone(
      `https://${gitToken}:x-oauth-basic@github.com/${repoPath}.git`,
      localPath,
    )
  }
}

export async function gitCheckout(tag: string, localPath: string) {
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

export async function getListOfTags(localPath: string): Promise<string[]> {
  const tags: string[] = await Git.Repository.open(localPath).then(
    async (repoResult) => {
      const repo = repoResult
      return Git.Tag.list(repo)
    },
  )
  return tags
}
