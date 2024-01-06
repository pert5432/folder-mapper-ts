# Folder Mapper

Simple tool to generate a JS/TS object representation of a folder, its sub-folders and files in them.

# What is this useful for?

If your project contains a folder of assets which you want to use dynamically you will (most likely) need to work with paths to the individual assets. This library enables you to:

- Work with an object representation of the folder instead of paths to the individual files, making use of your IDEs hinting.

- Have the ability to simply re-generate the object when you add/remove files from your asset folders instead of having to change hardcoded paths in your code. This way you can also easily make sure you aren't trying to use some files which are not in your asset folders anymore.

# Example usage

There are 2 functions exported, `exportFolderMap` which writes the generated object to a file and `getMap` which returns the generated object so you can do whatever you want with it.

Both functions take a config object as an argument with the following options:

```typescript
{
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

    // Function to format the output that gets written to a file
    fileOutputFormatter?: FileOutputFormatter;

    // Function to filter which files should get included in the map, return true to include a file
    fileFilter?: FileFilter;

    // Function to filter which folders should get included in the map, return true to include a folder
    folderFilter?: FolderFilter;
}
```

Examples repo under construction, please come back later :)
