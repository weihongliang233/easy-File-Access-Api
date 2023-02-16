
import * as fs from 'fs';
import * as path from 'path'
import { homedir, tmpdir } from "os";
import { promisify } from "util";
import * as BrowserFS  from 'browserfs'

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

const cat = async (name: string) => {
  name = await abs(name);
  return readFile(name, "utf-8")
};

// Get the directory from path
const dir =  (name: string) => {
  name = abs(name);
  return path.dirname(name);
};

// Check whether a filename exists or not
const existsAsync = promisify(fs.exists);
// Need to catch since for some reason, sometimes promisify() will not work
//   properly and will return the first boolean arg of exists() as an error
const exists = async (name:string) :Promise<boolean>=> {
  name = await abs(name);
  return existsAsync(name).catch((res) => res);
};

// Get the home directory: https://stackoverflow.com/a/9081436/938236
const home = (...args: string[]) => join(homedir(), ...args)

// Put several path segments together
const join = (...parts: string[]):string => abs(path.join(...parts));

// List all the files in the folder
const readDir = promisify(fs.readdir);
const list = async (dir:string) => {
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
    await mkdirAsync(path).catch((err) => {});
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
    await removeDirAsync(name).catch((err) => {});
  } else {
    await removeFileAsync(name).catch((err) => {});
  }
  return name;
};

const sep = path.sep;

// Get some interesting info from the path
const statAsync = promisify(fs.lstat);
const stat = async (name:string) => {
  name = await abs(name);
  return statAsync(name);
};

// Get a temporary folder
const tmp = async (path:string) => {
  path = await abs(path, tmpdir());
  return mkdir(path);
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