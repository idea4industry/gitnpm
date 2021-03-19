import { square } from '../src/index'

describe('index.spec', () => {
  it('should add', () => {
    expect(square).toBeDefined()
    expect(square(10)).toEqual(100)
  })
})
