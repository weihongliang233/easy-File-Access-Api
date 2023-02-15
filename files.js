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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.write = exports.tmp = exports.stat = exports.sep = exports.rename = exports.remove = exports.read = exports.name = exports.move = exports.mkdir = exports.ls = exports.list = exports.join = exports.home = exports.exists = exports.dir = exports.cat = exports.abs = void 0;
// The best filesystem for promises and array manipulation
var fs = require("fs");
var path = require('path');
var os_1 = require("os");
var util_1 = require("util");
// Retrieve the full, absolute path for the path
var abs = function (name, base) {
    if (name === void 0) { name = "."; }
    if (base === void 0) { base = '/'; }
    name = name;
    base = base;
    // Absolute paths do not need more absolutism
    if (path.isAbsolute(name))
        return name;
    if (name.slice(0, 2) === "~/") {
        base = home();
        name = name.slice(2);
    }
    // We are off-base here; recover the viable base option
    if (!base || typeof base !== "string") {
        base = '/';
    }
    // Return the file/folder within the base
    return join(base, name);
};
exports.abs = abs;
// Read the contents of a single file
var readFile = (0, util_1.promisify)(fs.readFile);
var cat = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, abs(name)];
            case 1:
                name = _a.sent();
                return [2 /*return*/, readFile(name, "utf-8")];
        }
    });
}); };
exports.cat = cat;
exports.read = cat;
// Get the directory from path
var dir = function (name) {
    name = abs(name);
    return path.dirname(name);
};
exports.dir = dir;
// Check whether a filename exists or not
var existsAsync = (0, util_1.promisify)(fs.exists);
// Need to catch since for some reason, sometimes promisify() will not work
//   properly and will return the first boolean arg of exists() as an error
var exists = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, abs(name)];
            case 1:
                name = _a.sent();
                return [2 /*return*/, existsAsync(name).catch(function (res) { return res; })];
        }
    });
}); };
exports.exists = exists;
// Get the home directory: https://stackoverflow.com/a/9081436/938236
var home = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return join.apply(void 0, __spreadArray([(0, os_1.homedir)()], args, false));
};
exports.home = home;
// Put several path segments together
var join = function () {
    var parts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parts[_i] = arguments[_i];
    }
    return abs(path.join.apply(path, parts));
};
exports.join = join;
// List all the files in the folder
var readDir = (0, util_1.promisify)(fs.readdir);
var list = function (dir) { return __awaiter(void 0, void 0, void 0, function () {
    var files;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, abs(dir)];
            case 1:
                dir = _a.sent();
                return [4 /*yield*/, readDir(dir)];
            case 2:
                files = _a.sent();
                return [2 /*return*/, files.map(function (file) { return abs(file, dir); })];
        }
    });
}); };
exports.list = list;
exports.ls = list;
// Create a new directory in the specified path
// Note: `recursive` flag on Node.js is ONLY for Mac and Windows (not Linux), so
// it's totally worthless for us
var mkdirAsync = (0, util_1.promisify)(fs.mkdir);
var mkdir = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    var list, _i, list_1, path_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, abs(name)];
            case 1:
                name = _a.sent();
                list = name
                    .split(path.sep)
                    .map(function (part, i, all) { return all.slice(0, i + 1).join(path.sep); })
                    .filter(Boolean);
                _i = 0, list_1 = list;
                _a.label = 2;
            case 2:
                if (!(_i < list_1.length)) return [3 /*break*/, 6];
                path_1 = list_1[_i];
                return [4 /*yield*/, exists(path_1)];
            case 3:
                if (_a.sent())
                    return [3 /*break*/, 5];
                return [4 /*yield*/, mkdirAsync(path_1).catch(function (err) { })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 2];
            case 6: return [2 /*return*/, name];
        }
    });
}); };
exports.mkdir = mkdir;
var renameAsync = (0, util_1.promisify)(fs.rename);
var move = function (src, dst) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, abs(src)];
            case 1:
                src = _a.sent();
                return [4 /*yield*/, abs(dst)];
            case 2:
                dst = _a.sent();
                return [4 /*yield*/, mkdir(dir(dst))];
            case 3:
                _a.sent();
                return [4 /*yield*/, renameAsync(src, dst)];
            case 4:
                _a.sent();
                return [2 /*return*/, dst];
            case 5:
                error_1 = _a.sent();
                throw error_1;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.move = move;
exports.rename = move;
// Get the path's filename
var name = function (file) { return path.basename(file); };
exports.name = name;
// Delete a file or directory (recursively)
var removeDirAsync = (0, util_1.promisify)(fs.rmdir);
var removeFileAsync = (0, util_1.promisify)(fs.unlink);
var remove = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, abs(name)];
            case 1:
                name = _c.sent();
                if (name === "/")
                    throw new Error("Cannot remove the root folder `/`");
                return [4 /*yield*/, exists(name)];
            case 2:
                if (!(_c.sent()))
                    return [2 /*return*/, name];
                return [4 /*yield*/, stat(name)];
            case 3:
                if (!(_c.sent()).isDirectory()) return [3 /*break*/, 7];
                _b = (_a = Promise).all;
                return [4 /*yield*/, list(name)];
            case 4: 
            // Remove all content recursively
            return [4 /*yield*/, _b.apply(_a, [(_c.sent()).map(remove)])];
            case 5:
                // Remove all content recursively
                _c.sent();
                return [4 /*yield*/, removeDirAsync(name).catch(function (err) { })];
            case 6:
                _c.sent();
                return [3 /*break*/, 9];
            case 7: return [4 /*yield*/, removeFileAsync(name).catch(function (err) { })];
            case 8:
                _c.sent();
                _c.label = 9;
            case 9: return [2 /*return*/, name];
        }
    });
}); };
exports.remove = remove;
var sep = path.sep;
exports.sep = sep;
// Get some interesting info from the path
var statAsync = (0, util_1.promisify)(fs.lstat);
var stat = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, abs(name)];
            case 1:
                name = _a.sent();
                return [2 /*return*/, statAsync(name)];
        }
    });
}); };
exports.stat = stat;
// Get a temporary folder
var tmp = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, abs(path, (0, os_1.tmpdir)())];
            case 1:
                path = _a.sent();
                return [2 /*return*/, mkdir(path)];
        }
    });
}); };
exports.tmp = tmp;
// Create a new file with the specified contents
var writeFile = (0, util_1.promisify)(fs.writeFile);
var write = function (name, body) {
    if (body === void 0) { body = ""; }
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, abs(name)];
                case 1:
                    name = _a.sent();
                    return [4 /*yield*/, mkdir(dir(name))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, writeFile(name, body, "utf-8")];
                case 3:
                    _a.sent();
                    return [2 /*return*/, name];
            }
        });
    });
};
exports.write = write;
var files = {
    abs: abs,
    cat: cat,
    dir: dir,
    exists: exists,
    home: home,
    join: join,
    list: list,
    ls: list,
    mkdir: mkdir,
    move: move,
    name: name,
    read: cat,
    remove: remove,
    rename: move,
    sep: sep,
    stat: stat,
    tmp: tmp,
    write: write,
};
exports.default = files;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmaWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwREFBMEQ7QUFDMUQsdUJBQXlCO0FBQ3pCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM1Qix5QkFBcUM7QUFDckMsNkJBQWlDO0FBR2pDLGdEQUFnRDtBQUNoRCxJQUFNLEdBQUcsR0FBRyxVQUFDLElBQVUsRUFBRSxJQUFVO0lBQXRCLHFCQUFBLEVBQUEsVUFBVTtJQUFFLHFCQUFBLEVBQUEsVUFBVTtJQUNqQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ1osSUFBSSxHQUFHLElBQUksQ0FBQztJQUVaLDZDQUE2QztJQUM3QyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFFdkMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDN0IsSUFBSSxHQUFHLElBQUksRUFBRSxDQUFDO1FBQ2QsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdEI7SUFFRCx1REFBdUQ7SUFDdkQsSUFBSSxDQUFDLElBQUksSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7UUFDckMsSUFBSSxHQUFHLEdBQUcsQ0FBQTtLQUNYO0lBRUQseUNBQXlDO0lBQ3pDLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMxQixDQUFDLENBQUM7QUE0SUEsa0JBQUc7QUExSUwscUNBQXFDO0FBQ3JDLElBQU0sUUFBUSxHQUFHLElBQUEsZ0JBQVMsRUFBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFeEMsSUFBTSxHQUFHLEdBQUcsVUFBTyxJQUFZOzs7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