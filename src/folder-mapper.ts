import { getDirContentsByAbsolutePath } from "./get-dir-contents";
import {
  FoldernameFormatter,
  FilenameFormatter,
  FolderMap,
  FolderQueueElement,
  FolderMapperConfig,
  FileOutputFormatter,
  FileFilter,
  FolderFilter,
} from "./types";
import path from "node:path";
import * as fs from "fs";
import {
  DEFAULT_FOLDERNAME_FORMATTER,
  DEFAULT_FILENAME_FORMATTER,
  DEFAULT_FILE_OUTPUT_FORMATTER,
} from "./default-formatters";
import { DEFAULT_FILE_FILTER, DEFAULT_FOLDER_FILTER } from "./default-filters";

export class FolderMapper {
  private _map: FolderMap = {};

  private rootPath: string;
  private outputPath: string | undefined;
  private filePathsRelativeTo: string;

  private filenameFormatter: FilenameFormatter;
  private foldernameFormatter: FoldernameFormatter;
  private fileOutputFormatter: FileOutputFormatter;

  private fileFilter: FileFilter;
  private folderFilter: FolderFilter;

  constructor({
    path,
    outputPath,
    filePathsRelativeTo,

    filenameFormatter,
    foldernameFormatter,
    fileOutputFormatter,

    fileFilter,
    folderFilter,
  }: FolderMapperConfig) {
    this.rootPath = path;
    this.outputPath = outputPath;
    this.filePathsRelativeTo = filePathsRelativeTo ?? process.cwd();

    this.filenameFormatter = filenameFormatter ?? DEFAULT_FILENAME_FORMATTER;
    this.foldernameFormatter =
      foldernameFormatter ?? DEFAULT_FOLDERNAME_FORMATTER;
    this.fileOutputFormatter =
      fileOutputFormatter ?? DEFAULT_FILE_OUTPUT_FORMATTER;

    this.fileFilter = fileFilter ?? DEFAULT_FILE_FILTER;
    this.folderFilter = folderFilter ?? DEFAULT_FOLDER_FILTER;
  }

  get map() {
    return this._map;
  }

  async mapFolder(): Promise<void> {
    const folderQueue: FolderQueueElement[] = [
      { relativePath: "/", name: path.dirname(this.rootPath) },
    ];

    // Traverse folders in queue
    let currentFolder = folderQueue.pop();
    while (currentFolder) {
      // Get contents of currently processed folder
      const dirContents = await getDirContentsByAbsolutePath(
        path.join(this.rootPath, currentFolder.relativePath)
      );

      for (const entry of dirContents) {
        // Map files
        if (entry.isFile()) {
          if (this.fileFilter(entry.name)) {
            this.mapFileByRelativePath(
              path.join(currentFolder.relativePath, entry.name)
            );
          }
          // Add sub-folders into the queue
        } else if (entry.isDirectory()) {
          if (this.folderFilter(entry.name)) {
            folderQueue.push({
              name: entry.name,
              relativePath: path.join(currentFolder.relativePath, entry.name),
            });
          }
        }
      }

      currentFolder = folderQueue.pop();
    }
  }

  async writeMapToFile(): Promise<void> {
    if (!this.outputPath) {
      throw new Error(
        "Attempted to export map without providing an output path"
      );
    }

    fs.writeFile(
      this.outputPath,
      this.fileOutputFormatter(this.map),
      { encoding: "utf-8" },
      (e) => {
        if (e) throw e;
      }
    );
  }

  //
  // Private
  //

  private mapFileByRelativePath(relativePath: string): void {
    const folder = this.getOrCreateFolderByRelativePath(relativePath);

    folder[this.filenameFormatter(path.basename(relativePath))] = path.relative(
      this.filePathsRelativeTo,
      path.join(this.rootPath, relativePath)
    );
  }

  private getOrCreateFolderByRelativePath(relativePath: string): FolderMap {
    if (path.dirname(relativePath) === "/") {
      return this._map;
    }

    const folders = path.dirname(relativePath).split(path.sep).slice(1);

    // Traverse existing map based on folders from the input relative path
    // Creates map entries in the map where they don't exist yet
    let currentFolder = this._map;
    for (const folderName of folders) {
      const formattedFolderName = this.foldernameFormatter(folderName);

      if (!currentFolder[formattedFolderName]) {
        // Create a map entry for this folder
        currentFolder[formattedFolderName] = {};
      }

      currentFolder = currentFolder[formattedFolderName] as FolderMap;
    }

    return currentFolder;
  }
}
