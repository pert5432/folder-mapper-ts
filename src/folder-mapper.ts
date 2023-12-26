import { getDirContentsByAbsolutePath } from "./get-dir-contents";
import {
  DirnameFormatter,
  FilenameFormatter,
  Folder,
  FolderQueueElement,
  FolderMapperConfig,
} from "./types";
import path from "node:path";

const DEFAULT_FILENAME_FORMATTER: FilenameFormatter = (filename: string) =>
  filename;

const DEFAULT_DIRNAME_FORMATTER: DirnameFormatter = (dirname: string) =>
  dirname;

export class FolderMapper {
  private _map: Folder = {};
  private rootPath: string;
  private filePathsRelativeTo: string;

  private filenameFormatter: FilenameFormatter;
  private dirnameFormatter: DirnameFormatter;

  constructor({
    path,
    filePathsRelativeTo,
    filenameFormatter,
    dirnameFormatter,
  }: FolderMapperConfig) {
    this.rootPath = path;
    this.filePathsRelativeTo = filePathsRelativeTo ?? process.cwd();
    this.filenameFormatter = filenameFormatter ?? DEFAULT_FILENAME_FORMATTER;
    this.dirnameFormatter = dirnameFormatter ?? DEFAULT_DIRNAME_FORMATTER;
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

  private mapFileByRelativePath(relativePath: string): void {
    const folder = this.getOrCreateFolderByRelativePath(relativePath);

    folder[this.filenameFormatter(path.basename(relativePath))] = path.relative(
      this.filePathsRelativeTo,
      path.join(this.rootPath, relativePath)
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
