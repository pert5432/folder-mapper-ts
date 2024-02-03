import {
  FoldernameFormatter,
  FileOutputFormatter,
  FilenameFormatter,
  FolderMap,
} from "./types";

export const DEFAULT_FILENAME_FORMATTER: FilenameFormatter = (
  filename: string
) => filename;

export const DEFAULT_FOLDERNAME_FORMATTER: FoldernameFormatter = (
  foldername: string
) => foldername;

export const DEFAULT_FILE_OUTPUT_FORMATTER: FileOutputFormatter = (
  constName: string,
  map: FolderMap
) => `export const ${constName} = ${JSON.stringify(map)}`;
