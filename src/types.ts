import * as fs from "fs";

export type Folder = { [key: string]: string | Folder };

export type QueueElement = { entry: fs.Dirent; relativePath: string };
