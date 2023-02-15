import EasyFileAccess from './index'

var fs: EasyFileAccess

let load_some = async ()=>{
  const handle = await window.showDirectoryPicker()
  fs = new EasyFileAccess(handle)
}

var write_some= async ()=>{

  console.log('asdf')
  

  console.log(  fs.abs('/a/sfd/ssdfasdfsd/c.txt') )


}

document.getElementById("load_some")?.addEventListener('click', load_some)
document.getElementById("write_some")?.addEventListener('click', write_some)