const { resolve } = require("path");
const { readdir } = require("fs").promises;
const Fuse = require("fuse.js");

const options = {
    isCaseSensitive: true,
    includeScore: true,
    shouldSort: true,
    includeMatches: false,
    findAllMatches: false,
    minMatchCharLength: 3,
    location: 0,
    threshold: 0.2,
    distance: 100,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    keys: ["path"],
  };
  

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);

    if (dirent.name === "node_modules") {
      return;
    }

    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

(async () => {
  console.time("search execution time");
  let searchText = "fusecommon"
  let searchPath = './node_modules'

  if (process.argv.length > 2) {
    searchText = process.argv[2]
    if (process.argv.length > 3) {
      searchPath = process.argv[3]
    }
  }

  console.log(process.argv, searchText, searchPath)

  let files = [];
  for await (const f of getFiles(`${searchPath}`)) {
    const relativePath = f.replace(`${__dirname}/${searchPath.replace('./', '')}`, '');
    files.push({
      fullPath: f,
      path: relativePath,
    });
  }

  const fuse = new Fuse(files, options);

  console.log(fuse.search(searchText));
  console.timeEnd("search execution time");
})();
