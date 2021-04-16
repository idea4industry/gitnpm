#!/usr/bin/env node

import { manageGitDependencies } from './lib/manageGitDependency.fn'

manageGitDependencies(process.cwd()).catch((err) => console.log(err))
