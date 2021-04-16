import Git from 'nodegit'
import fs from 'fs'

async function gitPull(localPath: string, checkoutBranch: string) {
  console.log('In pull')
  await Git.Repository.open(localPath)
    .then(async (reporesult) => {
      const repo = reporesult
      await repo.fetch('origin').then(async () => {
        return repo.mergeBranches(checkoutBranch, `origin/${checkoutBranch}`)
      })
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e)
    })
    .then((res) => console.log(res))
}

async function gitClone(
  localPath: string,
  repoPath: string,
  gitToken: string,
  checkoutBranch: string,
) {
  console.log('In clone')
  await Git.Clone.clone(
    `https://${gitToken}:x-oauth-basic@github.com/${repoPath}.git`,
    localPath,
  )
  const repo = await Git.Repository.open(localPath)
  await repo.checkoutBranch(checkoutBranch)
}

export async function gitPullOrClone(
  repoPath: string,
  repoUrl: string,
  token: string,
  checkoutBranch: string,
) {
  console.log('In gitpullorclone')
  if (fs.existsSync(repoPath)) {
    await gitPull(repoPath, checkoutBranch)
  } else {
    await gitClone(repoPath, repoUrl, token, checkoutBranch)
  }
}

export async function gitCheckout(tag: string, localPath: string) {
  console.log('In Checkout 1')
  const repo = await Git.Repository.open(localPath)
  const refs = await repo.getReferences()
  const tagRefs = refs.filter((ref) => ref.isTag())
  const tagRef = tagRefs.find((t) => t.name() === `refs/tags/${tag}`)
  const targetRef = await tagRef?.peel(Git.Object.TYPE.COMMIT)
  const commit = await repo.getCommit(targetRef as any)

  // const tagO = await Git.Reference.dwim(repo, `refs/tags/${tag}`)
  // // const reference = await repo.getReference(`refs/tags/${tag}`)
  // const ref = await tagO.peel(Git.Object.TYPE.COMMIT)
  // const commit = repo.getCommit(ref)
  await repo.checkoutRef(targetRef as any)
}

export function getListOfTags(repoPath: string): Promise<string[]> {
  return Git.Repository.open(repoPath).then((repoResult) => {
    const repo = repoResult
    return Git.Tag.list(repo)
  })
}
