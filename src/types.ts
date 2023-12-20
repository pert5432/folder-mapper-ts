import * as fs from "fs";

export type Folder = { [key: string]: string | Folder };

export type QueueElement = { entry: fs.Dirent; relativePath: string };

export type FilenameFormatter = (filename: string) => string;

export type DirnameFormatter = (dirname: string) => string;

export type MapConfig = {
  path: string;
  filenameFormatter?: FilenameFormatter;
  dirnameFormatter?: DirnameFormatter;
};
