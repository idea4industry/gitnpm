"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.npmProxy = void 0;
const child_process_1 = require("child_process");
function npmProxy() {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve, reject) => {
            child_process_1.exec(`npm install`, (err, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    reject(err);
                resolve();
            }));
        });
    });
}
exports.npmProxy = npmProxy;
//# sourceMappingURL=npmProxy.fn.js.map