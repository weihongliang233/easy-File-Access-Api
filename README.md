# easy-File-Access-Api

这是一个易用的浏览器文件系统API。

浏览器读取文件是通过 [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) 实现的。但是这个API用法不太符合人类直觉。简单的想根据路径读取一个文本文件也要经过获取handle，处理流等等的过程。本项目对原生的File System Access Api进行封装，暴露出一套易用的接口。

|function            |description                                             |
|--------------------|--------------------------------------------------------|
|[abs()](#abs)       |retrieve the absolute path of the path                  |
|[cat()](#cat)*      |*alias* of [`read()`](#read)                            |
|[copy()](#copy)     |copy a file while keeping the original                  |
|[dir()](#dir)       |get the directory of the path                           |
|[exists()](#exists) |check whenever a file or folder exists                  |
|[home()](#home)     |get the home directory                                  |
|[join()](#join)     |put several path parts together in a cross-browser way  |
|[list()](#list)     |list all of the files and folders of the path           |
|[ls()](#list)*      |*alias* of [`.list()`](#list)                           |
|[mkdir()](#mkdir)   |create the specified directory                          |
|[move()](#move)     |copy a file while removing the original                 |
|[name()](#name)     |get the filename of the path                            |
|[read()](#read)     |read the file from the specified path                   |
|[remove()](#remove) |remove a file or folder (recursively)                   |
|[rename()](#rename) |*alias* of [`.move()`](#move)                           |
|[stat()](#stat)     |get some information about the current file             |
|[swear()](#swear)   |the promise wrapper that we use internally              |
|[tmp()](#tmp)       |find the temporary directory or a folder inside         |
|[walk()](#walk)     |recursively list all of the files and folders           |
|[write()](#write)   |create a new file or put data into a file               |

里面的每个函数都支持深层次的操作，可以直接write('/a/b/c/d/e/f.txt')，而不论这些目录是否存在（不存在则自动创建）



## 用法

```ts
import EasyFileAccess from 'easy-file-access-api'

var fs: EasyFileAccess

let load_some = async ()=>{
  const handle = await window.showDirectoryPicker()
  fs = new EasyFileAccess(handle)
}

var write_some= async ()=>{  

  console.log(  fs.write('/a/c.txt', 'asdfasdfasdfasdf') )
}

```

