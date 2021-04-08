#!/usr/bin/env node

import { dependencyFilter } from './lib'

dependencyFilter(`${process.cwd()}/package.json`)
