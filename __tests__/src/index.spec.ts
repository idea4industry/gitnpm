import { dependencyFilter } from '../../src/lib/index'

jest.mock('child_process', () => ({
  exec: jest.fn().mockImplementation((cmd, cb) => {
    cb()
  }),
}))
