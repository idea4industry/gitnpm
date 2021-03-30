#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
// eslint-disable-next-line no-void
void lib_1.dependencyFilter(`${process.cwd()}/package.json`).then((res) => {
    console.log(res);
});
//# sourceMappingURL=index.js.map