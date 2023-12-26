export type FolderMap = { [key: string]: FolderMap | string };

export type FolderQueueElement = { name: string; relativePath: string };

export type FilenameFormatter = (filename: string) => string;

export type DirnameFormatter = (dirname: string) => string;

export type FileOutputFormatter = (map: FolderMap) => string;

export type FolderMapperConfig = {
  path: string;
  filePathsRelativeTo?: string;
  filenameFormatter?: FilenameFormatter;
  dirnameFormatter?: DirnameFormatter;
};
