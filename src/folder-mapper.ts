import { getDirContentsByAbsolutePath } from "./get-dir-contents";
import {
  DirnameFormatter,
  FilenameFormatter,
  FolderMap,
  FolderQueueElement,
  FolderMapperConfig,
  FileOutputFormatter,
} from "./types";
import path from "node:path";
import * as fs from "fs";
import {
  DEFAULT_DIRNAME_FORMATTER,
  DEFAULT_FILENAME_FORMATTER,
  DEFAULT_FILE_OUTPUT_FORMATTER,
} from "./default-formatters";

export class FolderMapper {
  private _map: FolderMap = {};
  private rootPath: string;
  private filePathsRelativeTo: string;

  private filenameFormatter: FilenameFormatter;
  private dirnameFormatter: DirnameFormatter;
  private fileOutputFormatter: FileOutputFormatter;

  constructor({
    path,
    filePathsRelativeTo,
    filenameFormatter,
    dirnameFormatter,
    fileOutputFormatter,
  }: FolderMapperConfig) {
    this.rootPath = path;
    this.filePathsRelativeTo = filePathsRelativeTo ?? process.cwd();

    this.filenameFormatter = filenameFormatter ?? DEFAULT_FILENAME_FORMATTER;
    this.dirnameFormatter = dirnameFormatter ?? DEFAULT_DIRNAME_FORMATTER;
    this.fileOutputFormatter =
      fileOutputFormatter ?? DEFAULT_FILE_OUTPUT_FORMATTER;
  }

  get map() {
    return this._map;
  }

  async mapFolderByAbsolutePath(absolutePath: string): Promise<void> {
    const folderQueue: FolderQueueElement[] = [
      { relativePath: "/", name: path.dirname(absolutePath) },
    ];

    // Traverse folders in queue
    let currentFolder = folderQueue.pop();
    while (currentFolder) {
      // Get contents of currently processed folder
      const dirContents = await getDirContentsByAbsolutePath(
        path.join(absolutePath, currentFolder.relativePath)
      );

      for (const entry of dirContents) {
        // Map files
        if (entry.isFile()) {
          this.mapFileByRelativePath(
            path.join(currentFolder.relativePath, entry.name)
          );

          // Add sub-folders into the queue
        } else if (entry.isDirectory()) {
          folderQueue.push({
            name: entry.name,
            relativePath: path.join(currentFolder.relativePath, entry.name),
          });
        }
      }

      currentFolder = folderQueue.pop();
    }
  }

  async writeMapToFile(path: string): Promise<void> {
    fs.writeFile(
      path,
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
      const formattedFolderName = this.dirnameFormatter(folderName);

      if (!currentFolder[formattedFolderName]) {
        // Create a map entry for this folder
        currentFolder[formattedFolderName] = {};
      }

      currentFolder = currentFolder[formattedFolderName] as FolderMap;
    }

    return currentFolder;
  }
}
