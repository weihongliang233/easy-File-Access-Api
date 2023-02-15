var fs = require('fs');

import {
  abs,
  cat,
  dir,
  exists,
  home,
  join,
  list,
  ls,
  mkdir,
  move,
  name,
  read,
  remove,
  rename,
  sep,
  stat,
  tmp,
  write,
} from './files.js'

const path = require('path')

let load_some = async ()=>{
  const handle = await window.showDirectoryPicker()
  
  
  BrowserFS.install(window);
  // Configures BrowserFS to use the LocalStorage file system.
  BrowserFS.configure({
    fs: "FileSystemAccess",
    options: { handle }
  }, function (e) {
    if (e) {
      // An error happened!
      throw e;
    }
    // Otherwise, BrowserFS is ready-to-use!
    console.log('ready-to-use!')
  })
  
}

var write_some= async ()=>{

  console.log('asdf')
  

  console.log( (await stat('/a/sfd')).isDirectory() )


}

document.getElementById("load_some").addEventListener('click', load_some)
document.getElementById("write_some").addEventListener('click', write_some)