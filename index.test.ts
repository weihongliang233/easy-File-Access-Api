import { EasyFileAccess } from './index'

import { isEqual } from 'lodash'


var fs_access: EasyFileAccess
var exists, mkdir, write, cat, remove, abs, rename, stat, sep, list, test_rename, add

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// 文件操作不能太频繁

const describe = async (description: string, func: any) => {

  console.log(`Start: ${description}`)
  await func()
  console.log(`Success: ${description}`)

}

const it = async (description: string, func: any) => {
  console.log(`   Start: ${description}`)
  await func()
  console.log(`   Success: ${description}`)

}
class expect_ {
  input: any

  constructor(input) {
    this.input = input
  }

  toBe(params) {
    if (params === this.input) {
      return
    } else {
      throw (`Tobe Assert Failed, ${params},  ${this.input}`)
    }
  }

  toContain(params) {
    if (this.input.includes(params)) {
      return
    } else {
      throw (`ToContain Assert Failed, ${params},  ${this.input}`)
    }
  }

  toEqual(params) {
    if (isEqual(params, this.input)) {
      return
    } else {
      throw (`ToEqual Assert Failed, ${params},  ${this.input}`)
    }
  }
}

function expect(inp) {
  return new expect_(inp)
}

const select_handle = async () => {
  const handle = await window.showDirectoryPicker()
  fs_access = new EasyFileAccess(handle);

  ({ exists, mkdir, write, cat, remove, abs, rename, stat, sep, list, add } = fs_access)

}

const start_test = async () => {
  await describe("abs", async () => {
    await it("gets the defaults right", async () => {
      expect(await abs()).toBe('/');
      expect(await abs("/demo")).toBe("/demo");
    });

  })

  await describe("cat", async () => {
    await it("can read a markdown file", async () => {
      expect(await cat("/demo/readme.md")).toContain("# Hello!");
    });
    await it("throw error when reading directory", async () => {
      try {
        expect(await cat("/demo"))
      } catch (e) {
        console.log(e)
      }

    });
    await it("can json parse it", async () => {
      expect(await cat("/demo/test.json").then(JSON.parse)).toEqual({
        hello: "world",
      });
    });

  })


  await describe("list", async () => {
    await it("can load the demo", async () => {
      const files = await list("/demo");
      //expect(files).not.toContain( sep + "files.js");
      expect(files).toContain(sep + `demo${sep}a/`);
      expect(files).toContain(sep + `demo${sep}readme.md`);
    });
  }),

    await describe("mkdir", async () => {
      await it("create a new directory", async () => {

        expect(await exists("/demo/b/")).toBe(false);
        const res = await mkdir("/demo/b/");
        expect(await exists("/demo/b/")).toBe(true);
        expect(res).toBe(await abs("/demo/b/"));
      });

      await it("does not throw if it already exists", async () => {
        expect(await exists("/demo/a/")).toBe(true);
        const res = await mkdir("/demo/a/");
        expect(await exists("/demo/a/")).toBe(true);
        expect(res).toBe(await abs("/demo/a/"));
      });

      await it("creates it even if the parent does not exist", async () => {
        await remove("/demo/c/");
        expect(await exists("/demo/c/")).toBe(false);
        const res = await mkdir("/demo/c/d/e/");
        expect(await exists("/demo/c/d/e/")).toBe(true);
        expect(res).toBe(await abs("/demo/c/d/e/"));
        await remove("/demo/c/");
      });

    })


  await describe("remove", async () => {
    await it("removes a file", async () => {
      await write("/demo/remove.md", "Hello!");
      console.log('write finished')


      const result = await cat("/demo/remove.md")
      console.log(result)



      await remove("/demo/remove.md");
      expect(await exists("/demo/remove.md")).toBe(false);
      //expect(file).toBe(await abs("/demo/remove.md"));
    });


    await it("removes a directory", async () => {
      await mkdir("/demo/b/");


      expect(await exists("/demo/b/")).toBe(true);
      const file = await remove("/demo/b/");


      expect(await exists("/demo/b/")).toBe(false);
      //expect(file).toBe(await abs("/demo/b"));
    });

    await it("removes a directory with files", async () => {
      await mkdir("/demo/b/");


      await write("/demo/b/remove.md", "Hello!");


      expect(await exists("/demo/b/")).toBe(true);
      expect(await cat("/demo/b/remove.md")).toBe("Hello!");
      const file = await remove("/demo/b/");



      expect(await exists("/demo/b/")).toBe(false);
      expect(file).toBe(await abs("/demo/b/"));
    });

    await it("removes a directory with deeply nested files", async () => {
      await mkdir("/demo/x/");


      await write("/demo/x/remove.md", "Hello!");



      await mkdir("/demo/x/c/");



      await write("/demo/x/c/remove.md", "Hello!");

      debugger;

      expect(await exists("/demo/x/")).toBe(true);
      expect(await cat("/demo/x/remove.md")).toBe("Hello!");
      expect(await exists("/demo/x/c/")).toBe(true);
      expect(await cat("/demo/x/c/remove.md")).toBe("Hello!");
      const file = await remove("/demo/x/");


      expect(await exists("/demo/x/")).toBe(false);
      expect(file).toBe(await abs("/demo/x/"));
    });

    await it("cannot remove the root", async () => {
      //await expect(remove("/")).rejects.toThrow(/remove the root/);
    });

    await it("will ignore a non-existing file", async () => {
      expect(await exists("/demo/d/")).toBe(false);
      await expect(await remove("/demo/d/")).toEqual(await abs("/demo/d/"));
    });
  });




  await describe("rename", async () => {
    const src = "/demo/rename.txt";
    console.log('outside start')

    await write(src, 'rename.content')
    console.log('break outside 1')

    await it("can simply move a file", async () => {
      console.log('Start execute')
      const dst = "/demo/rename-zzz.txt";
      expect(await exists(dst)).toBe(false);
      console.log('break 1')
      const res = await rename(src, dst);

      console.log('break 2')
      expect(await exists(src)).toBe(false);
      console.log('break 3')
      expect(await exists(dst)).toBe(true);
      console.log('break 4')
      expect(res).toBe(await abs(dst));

      console.log('break 5')
      await remove(dst);
    });

    await it("can work with nested folders", async () => {
      await write(src, "hello")
      
      const dst = "/demo/rename/zzz.txt";
      expect(await exists(dst)).toBe(false);

      const res = await rename(src, dst);

      expect(await exists(src)).toBe(false);
      expect(await exists(dst)).toBe(true);
      expect(res).toBe(await abs(dst));


      await remove("/demo/rename/");
      await remove(src)
    });

    await it("works with folders", async () => {
      const src = "/demo/rename/";
      const dst = "/demo/renamed/";
      
      await write("/demo/rename/test.txt", "hello");
      
      expect(await exists(dst)).toBe(false);
      const res = await rename(src, dst);


      expect(await exists(src)).toBe(false);
      expect(await exists(dst)).toBe(true);
      expect(res).toBe(await abs(dst));
      
      await remove(dst);

      await remove(src)
    });
  });




  await describe("stat", async () => {
    await it("can analyze whether a path is a directory or not", async () => {
      const result_demo = await stat("/demo/")
      const result_readme = await stat("/demo/readme.md")
      //sleep(1000)

      expect(result_demo.isDirectory()).toBe(true);
      expect(result_readme.isDirectory()).toBe(false);
    });

    await it("can read some dates", async () => {
      const middle = await stat("/demo/readme.md");



      const date = middle.atimeMs

      console.log(middle)
      //expect(date.constructor.name).toBe("Date");
      //expect(date).toEqual(new Date(date));
    });
  });

  await describe("write", async () => {
    await it("creates a new file", async () => {
      expect(await exists("/demo/deleteme.md")).toBe(false);
      await write("/demo/deleteme.md", "Hello!");



      expect(await cat("/demo/deleteme.md")).toBe("Hello!");
      expect(await exists("/demo/deleteme.md")).toBe(true);
      
    });


    await remove('/demo/deleteme.md')


    await it("creates a new empty file", async () => {
      expect(await exists("/demo/deleteme.md")).toBe(false);
      await write("/demo/deleteme.md");

      expect(await exists("/demo/deleteme.md")).toBe(true);
    });
  });

  await describe('other', async ()=>{
    await it('list a dir', async ()=>{
      const res = await list('/demo/a')
      console.log(res)
    })
    
    await it('add a file', async ()=>{
      await add('/demo/a/b/c/d.txt')
      expect(await exists('/demo/a/b/c/d.txt')).toBe(true)
      expect(await exists('/demo/a/b/c/d')).toBe(false)
    })
    
    await it('add a folder', async ()=>{
      await add('/demo/a/b/c/e/')
      expect(await exists('/demo/a/b/c/e')).toBe(false)
      expect(await exists('/demo/a/b/c/e/')).toBe(true)
    })
    
    
    
  })
  console.log('ALL TEST SUCCESS !!!')
}

//@ts-ignore
window.fs = fs_access

document.getElementById("select")?.addEventListener('click', select_handle)
document.getElementById("start")?.addEventListener('click', async () => {
  //test_rename()
  //console.log('out side assertion')
  start_test()
})