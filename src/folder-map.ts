import {
  DirnameFormatter,
  FilenameFormatter,
  Folder,
  MapConfig,
} from "./types";
import path from "node:path";

const DEFAULT_FILENAME_FORMATTER: FilenameFormatter = (filename: string) =>
  filename;

const DEFAULT_DIRNAME_FORMATTER: DirnameFormatter = (dirname: string) =>
  dirname;

export class FolderMap {
  private _map: Folder = {};
  private rootPath: string;

  private filenameFormatter: FilenameFormatter;
  private dirnameFormatter: DirnameFormatter;

  constructor({ path, filenameFormatter, dirnameFormatter }: MapConfig) {
    this.rootPath = path;
    this.filenameFormatter = filenameFormatter ?? DEFAULT_FILENAME_FORMATTER;
    this.dirnameFormatter = dirnameFormatter ?? DEFAULT_DIRNAME_FORMATTER;
  }

  get map() {
    return this._map;
  }

  insertFileByRelativePath(relativePath: string): void {
    const folder = this.getOrCreateFolderByRelativePath(relativePath);

    folder[this.filenameFormatter(path.basename(relativePath))] = path.join(
      this.rootPath,
      relativePath
    );
  }

  private getOrCreateFolderByRelativePath(relativePath: string): Folder {
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

      currentFolder = currentFolder[formattedFolderName] as Folder;
    }

    return currentFolder;
  }
}
