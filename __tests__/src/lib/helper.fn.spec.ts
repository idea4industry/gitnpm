import { getGitToken, findMaxVersion } from '../../../src/lib/helpers.fn'

describe('helper.fn.spec', () => {
    it('should throw add token file error', () => {
        expect(async() => {
            await getGitToken(`${__dirname}/github_token.json`)
        }).rejects.toEqual(new Error("Add github_token.json file"))
    });

    it('should throw for empty token', () => {
        expect(async() => {
            await getGitToken(`${__dirname}/empty_token.json`)
        }).rejects.toEqual(new Error("Token is not given in the file"))
    });

    it('should get github token', async() => {
        let token = await getGitToken(`${__dirname}/github_token_test.json`)
        expect(token).toEqual("18ce3a8c28bf949d12946c548f714ebc967d5335")
    });

    it('should return latest version of a specified version from a list of tags', () => {
        let tags = ['0.1.0','0.1.1','0.2.1','1.0.0','1.0.1','1.1.0','2.0.0','2.0.1']
        expect(findMaxVersion(tags, '^1.0.0')).toEqual('1.1.0') 
        expect(findMaxVersion(tags, '~1.0.0')).toEqual('1.0.1')
        expect(findMaxVersion(tags, '1.0.0')).toEqual('1.0.0')
        expect(findMaxVersion(tags, '')).toEqual('2.0.1')
        expect(findMaxVersion(tags,null)).toEqual('2.0.1')
    });
});