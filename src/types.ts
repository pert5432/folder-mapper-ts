import * as fs from "fs";

export type Folder = { [key: string]: string | Folder };

export type FolderQueueElement = { name: string; relativePath: string };

export type FilenameFormatter = (filename: string) => string;

export type DirnameFormatter = (dirname: string) => string;

export type FolderMapperConfig = {
  path: string;
  filePathsRelativeTo?: string;
  filenameFormatter?: FilenameFormatter;
  dirnameFormatter?: DirnameFormatter;
};
