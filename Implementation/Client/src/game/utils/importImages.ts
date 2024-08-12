// import { path } from "path";
// import { promises as fsPromises } from "fs";
import fs from "fs";

export const readDir = async () => {
  try {
    fs.readdir("./", function (err, filenames) {
      if (err) {
        console.error(err);
        return;
      }

      filenames.forEach((element) => {
        console.log(element);
      });
    });
  } catch (err) {
    console.error(err);
  }
};
