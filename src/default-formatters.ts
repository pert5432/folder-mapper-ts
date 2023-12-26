import {
  DirnameFormatter,
  FileOutputFormatter,
  FilenameFormatter,
  FolderMap,
} from "./types";

export const DEFAULT_FILENAME_FORMATTER: FilenameFormatter = (
  filename: string
) => filename;

export const DEFAULT_DIRNAME_FORMATTER: DirnameFormatter = (dirname: string) =>
  dirname;

export const DEFAULT_FILE_OUTPUT_FORMATTER: FileOutputFormatter = (
  map: FolderMap
) => `export const MAP = ${JSON.stringify(map)}`;
