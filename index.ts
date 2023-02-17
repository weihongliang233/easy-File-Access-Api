// @ts-nocheck

import * as fs from 'fs';
import * as path from 'path'
import { homedir, tmpdir } from "os";
import { promisify } from "util";
import * as BrowserFS  from 'browserfs'

function promisify_( asyncFn ) {
  // 方法内部我们需要调用asyncFn方法，并传递原始参数，所以需要返回一个方法来接收参数
  return function(...args) { // 由于需要接收参数，所以参数我们可以写为...args
          // 我们需要执行异步操作，并返回一个结果，所以返回一个 promise实例
          return new Promise(resolve => {
                  // asyncFn 需要执行一个回调，所以定义一个回调方法
                  const callback = function(...args) {
                        resolve(args)
                   }
                  args.push(callback)
                  asyncFn.apply(null, args)
          })
  }
}

console.log('sdf')
// Retrieve the full, absolute path for the path
const abs = (name = ".", base = '/') => {
  name = name;
  base = base;

  // Absolute paths do not need more absolutism
  if (path.isAbsolute(name)) return name;

  if (name.slice(0, 2) === "~/") {
    base = home();
    name = name.slice(2);
  }

  // We are off-base here; recover the viable base option
  if (!base || typeof base !== "string") {
    base = '/'
  }

  // Return the file/folder within the base
  return join(base, name);
};

// Read the contents of a single file
const readFile = promisify(fs.readFile);

const cat = async (name: string):Promise<string> => {
  name = await abs(name);
  return await readFile(name, "utf-8")
};

// Get the directory from path
const dir =  (name: string):string => {
  name = abs(name);
  return path.dirname(name);
};

// Check whether a filename exists or not
//const existsAsync = promisify(fs.exists);

const existsAsync = function (name:string){
  return new Promise((resolve, reject)=>{
    fs.exists(name, (e) =>{
      resolve(e)
    })
  })
}
// Need to catch since for some reason, sometimes promisify() will not work
//   properly and will return the first boolean arg of exists() as an error
const exists = async (name:string) :Promise<boolean>=> {
  name = await abs(name);
  const result = await existsAsync(name) as boolean
  return result
};

// Get the home directory: https://stackoverflow.com/a/9081436/938236
const home = (...args: string[]) => join(homedir(), ...args)

// Put several path segments together
const join = (...parts: string[]):string => abs(path.join(...parts));

// List all the files in the folder
const readDir = promisify(fs.readdir);
const list = async (dir:string):Promise<string[]> => {
  dir = await abs(dir);
  const files = await readDir(dir);
  return files.map((file) => abs(file, dir));
};

// Create a new directory in the specified path
// Note: `recursive` flag on Node.js is ONLY for Mac and Windows (not Linux), so
// it's totally worthless for us
const mkdirAsync = promisify(fs.mkdir);
const mkdir = async (name:string) => {
  name = await abs(name);

  // Create a recursive list of paths to create, from the highest to the lowest
  const list = name
    .split(path.sep)
    .map((part, i, all) => all.slice(0, i + 1).join(path.sep))
    .filter(Boolean);

  // Build each nested path sequentially
  for (let path of list) {
    if (await exists(path)) continue;
    await mkdirAsync(path)
  }
  return name;
};

const renameAsync = promisify(fs.rename);
const move = async (src:string, dst:string) => {
  try {
    src = await abs(src);
    dst = await abs(dst);
    await mkdir(dir(dst));
    await renameAsync(src, dst);
    return dst;
  } catch (error) {
    throw error
  }
};

// Get the path's filename
const name = (file:string) => path.basename(file);

// Delete a file or directory (recursively)
const removeDirAsync = promisify(fs.rmdir);
const removeFileAsync = promisify(fs.unlink);
const remove = async (name:string) => {
  name = await abs(name);
  if (name === "/") throw new Error("Cannot remove the root folder `/`");
  if (!(await exists(name))) return name;

  if ((await stat(name)).isDirectory()) {
    // Remove all content recursively
    await Promise.all((await list(name)).map(remove))
    await removeDirAsync(name)
  } else {
    await removeFileAsync(name)
  }
  return name;
};

const sep = path.sep;

// Get some interesting info from the path
const statAsync = promisify(fs.lstat);
const stat = async (name:string) => {
  name = await abs(name);
  return await statAsync(name);
};

// Get a temporary folder
const tmp = async (path:string) => {
  path = await abs(path, tmpdir());
  return await mkdir(path);
};

// Create a new file with the specified contents
const writeFile = promisify(fs.writeFile);
const write = async (name:string, body = "") => {
  name = await abs(name);
  await mkdir(dir(name));
  await writeFile(name, body, "utf-8");
  return name;
};

export  class EasyFileAccess {
  constructor(handle: FileSystemHandle) {
    BrowserFS.install(window);
    // Configures BrowserFS to use the LocalStorage file system.
    BrowserFS.configure({
      fs: "FileSystemAccess",
      options: { handle }
    }, function (e: any) {
      if (e) {
        throw e;
      }
      // Otherwise, BrowserFS is ready-to-use!
      console.log('Browserfs ready-to-use!')
    })
  }
  abs = abs
  cat = cat
  dir = dir
  exists =exists
  home = home
  join = join
  list = list
  mkdir = mkdir
  move = move
  name = name
  read = cat
  remove = remove
  rename = move
  sep = sep
  stat =stat
  tmp = tmp
  write = write
}