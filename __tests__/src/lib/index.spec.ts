/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { writeFileSync } from 'fs'
import { dependencyFilter } from '../../../src/lib'

import packageJson from '../../../data/package.json'

import { manageGitDependency } from '../../../src/lib/manageGitDependency.fn'

const fs = require('fs')

fs.writeFileSync = jest.fn()

// eslint-disable-next-line no-console
const originalConsoleLog = console.log

// const packageData = require('../../../data/package.json')

jest.mock('../../../src/lib/manageGitDependency.fn')

let mockError: NodeJS.ErrnoException | undefined

jest.mock('child_process', () => ({
  exec: (command: string, cb: Function) => cb(mockError),
}))

describe('index.spec', () => {
  beforeAll(() => {
    console.log = jest.fn()
  })
  afterAll(() => {
    console.log = originalConsoleLog
  })
  beforeEach(() => {
    mockError = undefined
  })
  afterEach(() => {
    fs.writeFileSync.mockClear()
    ;(manageGitDependency as jest.Mock).mockClear()
  })
  it('should work without error', async () => {
    await dependencyFilter(`${process.cwd()}/data/package.json`)
    expect(writeFileSync).toHaveBeenCalledTimes(2)
    expect(writeFileSync).toHaveBeenNthCalledWith(
      1,
      `${process.cwd()}/data/package.json`,
      JSON.stringify(
        {
          ...packageJson,
          dependencies: {
            '@types/node-fetch': '^2.5.8',
            'lodash': '^4.17.20',
            'moment': '^2.29.1',
          },
        },
        null,
        2,
      ),
    )
    expect(writeFileSync).toHaveBeenNthCalledWith(
      2,
      `${process.cwd()}/data/package.json`,
      Buffer.from(JSON.stringify(packageJson, null, 2)),
    )
    expect(manageGitDependency).toHaveBeenCalledWith({
      'config-manager': 'github:idea4industry/config-manager',
      'logger': 'github:idea4industry/logger',
    })
  })
  it('should work with error', async () => {
    mockError = {
      name: 'name',
      message: 'message',
      code: 'CODE1',
      path: 'path',
      syscall: '',
      stack: 'stack 1',
    }
    await dependencyFilter(`${process.cwd()}/data/package.json`)
    expect(writeFileSync).toHaveBeenCalledTimes(2)
    expect(writeFileSync).toHaveBeenNthCalledWith(
      1,
      `${process.cwd()}/data/package.json`,
      JSON.stringify(
        {
          ...packageJson,
          dependencies: {
            '@types/node-fetch': '^2.5.8',
            'lodash': '^4.17.20',
            'moment': '^2.29.1',
          },
        },
        null,
        2,
      ),
    )
    expect(writeFileSync).toHaveBeenNthCalledWith(
      2,
      `${process.cwd()}/data/package.json`,
      Buffer.from(JSON.stringify(packageJson, null, 2)),
    )
    expect(manageGitDependency).not.toHaveBeenCalledWith({
      'config-manager': 'github:idea4industry/config-manager',
      'logger': 'github:idea4industry/logger',
    })
  })
  it('should work with blank dependencies', async () => {
    await dependencyFilter(`${process.cwd()}/data/package_empty_deps.json`)
    expect(writeFileSync).toHaveBeenCalledTimes(1)
    expect(manageGitDependency).toHaveBeenCalled()
  })
  it('should work with missing dependencies', async () => {
    await dependencyFilter(`${process.cwd()}/data/package_missing_deps.json`)
    expect(writeFileSync).toHaveBeenCalledTimes(1)
    expect(manageGitDependency).toHaveBeenCalled()
  })
  it('should work without github dependencies', async () => {
    await dependencyFilter(
      `${process.cwd()}/data/package_without_github_deps.json`,
    )
    expect(writeFileSync).toHaveBeenCalledTimes(2)
    expect(writeFileSync).toHaveBeenNthCalledWith(
      1,
      `${process.cwd()}/data/package_without_github_deps.json`,
      JSON.stringify(
        {
          ...packageJson,
          dependencies: {
            '@types/node-fetch': '^2.5.8',
            'lodash': '^4.17.20',
            'moment': '^2.29.1',
          },
        },
        null,
        2,
      ),
    )
    expect(writeFileSync).toHaveBeenNthCalledWith(
      2,
      `${process.cwd()}/data/package_without_github_deps.json`,
      Buffer.from(
        JSON.stringify(
          require('../../../data/package_without_github_deps'),
          null,
          2,
        ),
      ),
    )
    expect(manageGitDependency).toHaveBeenCalled()
  })
})
