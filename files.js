// The best filesystem for promises and array manipulation
import fs from "fs";
import path from "path";
import { homedir, tmpdir } from "os";
import { promisify } from "util";


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
const cat = async (name) => {
  name = await abs(name);
  return readFile(name, "utf-8").catch((err) => "");
};

// Get the directory from path
const dir = async (name) => {
  name = await abs(name);
  return path.dirname(name);
};

// Check whether a filename exists or not
const existsAsync = promisify(fs.exists);
// Need to catch since for some reason, sometimes promisify() will not work
//   properly and will return the first boolean arg of exists() as an error
const exists = async (name) => {
  name = await abs(name);
  return existsAsync(name).catch((res) => res);
};

// Get the home directory: https://stackoverflow.com/a/9081436/938236
const home = (...args) => join(homedir(), ...args).then(mkdir)

// Put several path segments together
const join = (...parts) => abs(path.join(...parts));

// List all the files in the folder
const readDir = promisify(fs.readdir);
const list = async (dir) => {
  dir = await abs(dir);
  const files = await readDir(dir);
  return files.map((file) => abs(file, dir));
};

// Create a new directory in the specified path
// Note: `recursive` flag on Node.js is ONLY for Mac and Windows (not Linux), so
// it's totally worthless for us
const mkdirAsync = promisify(fs.mkdir);
const mkdir = async (name) => {
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
const move = async (src, dst) => {
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
const name = (file) => path.basename(file);

// Delete a file or directory (recursively)
const removeDirAsync = promisify(fs.rmdir);
const removeFileAsync = promisify(fs.unlink);
const remove = async (name) => {
  name = await abs(name);
  if (name === "/") throw new Error("Cannot remove the root folder `/`");
  if (!(await exists(name))) return name;

  if (await stat(name).isDirectory()) {
    // Remove all content recursively
    await list(name).map(remove);
    await removeDirAsync(name).catch((err) => {});
  } else {
    await removeFileAsync(name).catch((err) => {});
  }
  return name;
};

const sep = path.sep;

// Get some interesting info from the path
const statAsync = promisify(fs.lstat);
const stat = async (name) => {
  name = await abs(name);
  return statAsync(name).catch((err) => {});
};

// Get a temporary folder
const tmp = async (path) => {
  path = await abs(path, tmpdir());
  return mkdir(path);
};

// Create a new file with the specified contents
const writeFile = promisify(fs.writeFile);
const write = async (name, body = "") => {
  name = await abs(name);
  await mkdir(dir(name));
  await writeFile(name, body, "utf-8");
  return name;
};

const files = {
  abs,
  cat,
  dir,
  exists,
  home,
  join,
  list,
  ls: list,
  mkdir,
  move,
  name,
  read: cat,
  remove,
  rename: move,
  sep,
  stat,
  tmp,
  write,
};

export {
  abs,
  cat,
  dir,
  exists,
  home,
  join,
  list,
  list as ls,
  mkdir,
  move,
  name,
  cat as read,
  remove,
  move as rename,
  sep,
  stat,
  tmp,
  write,
};

export default files;
