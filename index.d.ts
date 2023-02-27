export declare class EasyFileAccess {
    constructor(handle: FileSystemHandle);
    abs: (name?: string, base?: string) => string;
    cat: (name: string) => Promise<string>;
    dir: (name: string) => string;
    exists: (name: string) => Promise<boolean>;
    join: (...parts: string[]) => string;
    list: (dir: string) => Promise<string[]>;
    mkdir: (name: string) => Promise<string>;
    move: (src: string, dst: string) => Promise<string>;
    name: void;
    read: (name: string) => Promise<string>;
    remove: (name: string) => Promise<string>;
    rename: (src: string, dst: string) => Promise<string>;
    sep: any;
    stat: (name: string) => Promise<any>;
    write: (name: string, body?: string) => Promise<string>;
    add: (full_path: string) => Promise<void>;
    add_for: (par: string, child: string) => Promise<void>;
}
