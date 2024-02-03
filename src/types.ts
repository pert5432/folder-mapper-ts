export type FolderMap = { [key: string]: FolderMap | string };

export type FolderQueueElement = { name: string; relativePath: string };

export type FilenameFormatter = (filename: string) => string;

export type FoldernameFormatter = (foldername: string) => string;

export type FileOutputFormatter = (map: FolderMap) => string;

export type FileFilter = (filename: string) => boolean;

export type FolderFilter = (foldername: string) => boolean;

export type FolderMapperConfig = {
  // Absolute path to the folder which you want to map
  path: string;
  // Absolute path to the file you want the generated map written to (required for exportFolderMap function)
  outputPath?: string;
  // Makes the output file paths be relative to this path, defaults to process.cwd
  filePathsRelativeTo?: string;

  // Function to format keys of the generated object (for ex. to make them all UPPERCASE)
  filenameFormatter?: FilenameFormatter;
  // Function to format keys of the generated object (for ex. to make them all kebab-case)
  foldernameFormatter?: FoldernameFormatter;
  // Function to format the output that gets written to a file, default implementation can be found in src/default-formatters.ts
  fileOutputFormatter?: FileOutputFormatter;

  // Function to filter which files should get included in the map, return true to include a file
  fileFilter?: FileFilter;
  // Function to filter which folders should get included in the map, return true to include a folder
  folderFilter?: FolderFilter;
};
