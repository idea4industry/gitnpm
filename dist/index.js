#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const manageGitDependency_fn_1 = require("./lib/manageGitDependency.fn");
manageGitDependency_fn_1.manageGitDependencies(process.cwd()).catch((err) => console.log(err));
//# sourceMappingURL=index.js.map