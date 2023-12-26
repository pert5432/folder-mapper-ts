export type FolderMap = { [key: string]: FolderMap | string };

export type FolderQueueElement = { name: string; relativePath: string };

export type FilenameFormatter = (filename: string) => string;

export type FoldernameFormatter = (foldername: string) => string;

export type FileOutputFormatter = (map: FolderMap) => string;

export type FileFilter = (filename: string) => boolean;

export type FolderFilter = (foldername: string) => boolean;

export type FolderMapperConfig = {
  path: string;
  filePathsRelativeTo?: string;

  filenameFormatter?: FilenameFormatter;
  foldernameFormatter?: FoldernameFormatter;
  fileOutputFormatter?: FileOutputFormatter;

  fileFilter?: FileFilter;
  folderFilter?: FolderFilter;
};
