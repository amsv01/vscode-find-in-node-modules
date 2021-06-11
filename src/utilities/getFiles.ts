

// export async function* getFiles(dir) {
//   const dirents = await readdir(dir, { withFileTypes: true });
//   for (const dirent of dirents) {
//     const res = Promise.resolve(dir, dirent.name);

//     if (dirent.name === "node_modules") {
//       return;
//     }

//     if (dirent.isDirectory()) {
//       yield* getFiles(res);
//     } else {
//       yield res;
//     }
//   }
// }