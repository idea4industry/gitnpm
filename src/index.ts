#!/usr/bin/env node

import { startProcess } from './lib'

// eslint-disable-next-line no-void
void startProcess(`${process.cwd()}/package.json`).then((res) => {
  // console.log(res)
})
