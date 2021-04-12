import { gitPullOrClone, getListOfTags} from '../../../src/lib/git.fn'
import { Repository, Tag} from 'nodegit'

Repository.open = jest.fn().mockReturnValue(Promise.resolve(new Repository()))
Tag.list = jest.fn()

describe('git.fn spec', () => {
    it('should getListOfTags', async() => {
        console.log(await getListOfTags(''))

    });
});