// @ts-nocheck

import * as fs from 'fs';
import * as path from 'path'
import { promisify } from "util";
import * as BrowserFS  from 'browserfs'



// Retrieve the full, absolute path for the path
const abs = (name = ".", base = '/') => {
  name = name;
  base = base;

  // Absolute paths do not need more absolutism
  if (path.isAbsolute(name)) return name;

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
  if (name === '/'){
    return path.dirname(name);
  }
  if (name.endsWith('/')){
    name = name.slice(0,name.length-1)
  }
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
  if (!await existsAsync(name) as boolean){
    return false
  }
  
  if (name.endsWith('/')){
    if (!(await stat(name)).isDirectory()){
      return false
    } 
  } else {
    if ((await stat(name)).isDirectory()){
      return false
    } 
  }
  
  return true
};

// Put several path segments together
const join = (...parts: string[]):string => abs(path.join(...parts));

// List all the files in the folder
const readDir = promisify(fs.readdir);
const list = async (dir:string):Promise<string[]> => {
  dir = await abs(dir);
  const files = await readDir(dir);
  return Promise.all(files.map(async (file) => {
    const full_path = abs(file, dir)
    if ((await stat(full_path)).isDirectory()){
      return join(full_path, path.sep)
    } else if ((await stat(full_path)).isFile()) {
      return full_path
    } else {
      throw Error('The path is not either a file or directory')
    }
  }));
  
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
    .map((part, i, all) => all.slice(0, i + 1).join(path.sep)).map(
      p=>{return path.join(p, path.sep)}
    )
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
  if ((src.endsWith('/') && dst.endsWith('/')) || (!src.endsWith('/') && !dst.endsWith('/'))){
  } else{
    throw new Error('Only rename file to file or folder to folder')
  }
  try {
    src = await abs(src);
    dst = await abs(dst);
    console.log(dir(dst))
    await mkdir(dir(dst));
    await renameAsync(src, dst);
    return dst;
  } catch (error) {
    throw error
  }
};

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



// Create a new file with the specified contents
const writeFile = promisify(fs.writeFile);
const write = async (name:string, body = "") => {
  name = await abs(name);
  await mkdir(dir(name));
  await writeFile(name, body, "utf-8");
  return name;
};

const add = async (full_path: string)=>{
  if (full_path.endsWith('/')) {
    await mkdir(full_path)
  } else{
    await write(full_path, '')
  }
}

const add_for = async (par: string, child: string) => {
  var part1, part2
  if (par.endsWith('/')){
    part1 = par
  }else{
    part1 = dir(par)
  }
  
  await add(path.join(part1, child))
}

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
  write = write
  add = add
  add_for = add_for
}