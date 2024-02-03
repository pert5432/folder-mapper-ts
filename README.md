# Folder Mapper

Super light-weight tool to generate a JS/TS object representation of a folder, its sub-folders and files in them. Using this tool you can fully leverage your IDEs hinting and make sure you aren't trying to use asset files that aren't in your codebase.

# Example usage

I highly recommend having a look at [the examples repository](https://github.com/pert5432/folder-mapper-ts-examples)

Installation:

```bash
yarn add folder-mapper-ts
```

To generate the map:

```typescript
import { exportFolderMap } from "folder-mapper-ts";

await exportFolderMap({
  path: "/absolute/path/to/the/folder/you/want/to/map",
  outputPath: "/absolute/path/to/the/file/where/you/want/the/map.ts",
});
```

And then when you want to use the generated paths:

```typescript
import { MAP } from "./path/to/map";

// Render the image
<Image src={MAP.assets.image_1} />;

// Or

// Read the file contents for further processing etc..
const contents = fs.readFileSync(MAP.assets.image_1);
```

If you now delete the file `image_1.png` from your assets folder and re-generate the map your IDE will tell you that you are trying to use a not-existing field of the `MAP` object, `tsc` will refuse to compile the project etc... this will prevent you from shipping the now broken code to production.

More configuration options can be found in the examples repo and by looking at the `FolderMapperConfig` type (this is the type of the config object passed to the `exportFolderMap` function).

# Relative file paths

If you want the file paths in the generated map to be relative to some particular folder you will have to pass the `filePathsRelativeTo` option in the config like so:

```typescript
import { exportFolderMap } from "folder-mapper-ts";

await exportFolderMap({
  path: "/absolute/path/to/the/folder/you/want/to/map",
  outputPath: "/absolute/path/to/the/file/where/you/want/the/map.ts",
  filePathsRelativeTo: "/absolute/path/to/which/file/paths/will/be/relative",
});
```

If you don't pass this option it will default to `process.cwd()` which is the path from which the the script is launched (not the path where the script is stored).

I recommend looking at [the examples repo](https://github.com/pert5432/folder-mapper-ts-examples) if you are facing issues.
