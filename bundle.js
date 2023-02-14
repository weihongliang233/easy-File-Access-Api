load= async ()=>{
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

write_something= async ()=>{
  console.log('start ')
  var fs = require('fs');
  console.log('fs loaded')
  
  
  fs.writeFile('/test.txt', 'Cool, I can do this in the browser!', function (err) {
    console.log('start')
    fs.readFile('/test.txt', function (err, contents) {
      console.log(contents.toString());
    })
}) 
}

print = ()=> {
  console.log('print')
}

async function test () {
  console.log('run')
  await load()
  await write()
}

//test()