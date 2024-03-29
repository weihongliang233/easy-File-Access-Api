# easy-File-Access-Api

这是一个易用的浏览器文件系统API。

浏览器读取文件是通过 [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) 实现的。但是这个API用法不太符合人类直觉。简单的想根据路径读取一个文本文件也要经过获取handle，处理流等等的过程。本项目对原生的File System Access Api进行封装，暴露出一套易用的接口。

![image-20230221174655562](C:\Users\hlwei\AppData\Roaming\Typora\typora-user-images\image-20230221174655562.png)

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

## demo

```shell
git clone https://github.com/weihongliang233/easy-File-Access-Api.git

cd easy-File-Access-Api
npm install 
npm run watch
```

打开浏览器，访问http://localhost:8000/

打开F12开发者工具

网页上有两个按钮：Load和test

点击Load弹出文件夹选择窗，选中本项目中的test文件（选其他文件夹不行）

![image-20230221174948566](C:\Users\hlwei\AppData\Roaming\Typora\typora-user-images\image-20230221174948566.png)

选完后点击test

![image-20230221175133459](C:\Users\hlwei\AppData\Roaming\Typora\typora-user-images\image-20230221175133459.png)

会自动开始遍历测试用例，控制台输出直至全部成功。

各函数用法请看`index.test.ts`
