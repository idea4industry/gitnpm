import { Dictionary } from 'lodash'
import { findMaxVersion } from './helpers.fn'
import { gitPullOrClone, gitCheckout, getListOfTags } from './git.fn'
import { dependencyFilter } from '.'

export async function manageGitDependency(
  githubDependenciesObject: Dictionary<string>,
) {
  const githubDependenciesArray = Object.values(githubDependenciesObject)
  if (!githubDependenciesArray.length) return
  for (const gitDependency of githubDependenciesArray) {
    const gitDependencyWithoutPrefix = gitDependency.replace('github:', '')
    const [, repoDetail] = gitDependencyWithoutPrefix.split('/')
    const [repoName, version] = repoDetail.split('#')
    const localPath = `${process.cwd()}/node_modules/${repoName}`
    // eslint-disable-next-line no-await-in-loop
    await gitPullOrClone(localPath, gitDependencyWithoutPrefix)
    // eslint-disable-next-line no-await-in-loop
    const tags = await getListOfTags(localPath)

    // checkout latest version
    if (tags.length > 0) {
      const maxVer: string | null = findMaxVersion(tags, version ?? null)
      if (maxVer !== null) {
        // eslint-disable-next-line no-await-in-loop
        await gitCheckout(maxVer, localPath)
      }
    }
    // eslint-disable-next-line no-await-in-loop
    await dependencyFilter(`${localPath}/package.json`)
  }
}
