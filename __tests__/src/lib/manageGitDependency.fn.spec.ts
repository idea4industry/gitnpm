import { manageGitDependency } from '../../../src/lib/manageGitDependency.fn'
import { gitCheckout, gitPullOrClone, getListOfTags} from '../../../src/lib/git.fn'
import { dependencyFilter } from '../../../src/lib/index'
import { findMaxVersion } from '../../../src/lib/helpers.fn'

jest.mock('../../../src/lib/git.fn.ts', () => ({
    gitPullOrClone: jest.fn(),
    getListOfTags: jest.fn().mockReturnValueOnce(Promise.resolve(['1.0.0','1.0.1']))
                            .mockReturnValueOnce(Promise.resolve([]))
                            .mockReturnValueOnce(Promise.resolve(['1.0.0','1.0.1'])),
    gitCheckout: jest.fn()
}))
jest.mock('../../../src/lib/index')
jest.mock('../../../src/lib/helpers.fn.ts', () => ({
    findMaxVersion: jest.fn().mockReturnValueOnce('1.0.1')
                             .mockReturnValueOnce(null)
}))

describe('manageGitDependency spec', () => {
    it('should return for empty github dependencies', async() => {
        expect(await manageGitDependency({})).toBeUndefined()
    });

    it('should manage given git dependencies with tags', async() => {
        expect(await manageGitDependency({
            'config-manager': 'github:idea4industry/config-manager',
            'logger': 'github:idea4industry/logger#1.0.0',
            'rpc': 'github:idea4industry/rpc#1.0.0',
          })).toBeUndefined()
          expect(gitPullOrClone).toHaveBeenCalled()
          expect(getListOfTags).toHaveBeenCalled()
          expect(gitCheckout).toHaveBeenCalled()
          expect(dependencyFilter).toHaveBeenCalled()
          expect(gitPullOrClone).toHaveBeenCalledTimes(3)
          expect(getListOfTags).toHaveBeenCalledTimes(3)
          expect(findMaxVersion).toHaveBeenCalledTimes(2)
          expect(gitCheckout).toHaveBeenCalledTimes(1)
          expect(dependencyFilter).toHaveBeenCalledTimes(3)
    });

});