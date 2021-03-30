#!/usr/bin/env node

import { dependencyFilter } from './lib'

// eslint-disable-next-line no-void
void dependencyFilter(`${process.cwd()}/package.json`).then((res) => {
  console.log(res)
})
