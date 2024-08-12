import fs from "fs";
import path from "path";

const readImages = () => {
  fs.readdir(path.join(__dirname, "assets", "character"), (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    files.map((file) => {
      console.log(path.join(__dirname, "assets", "character", file));
    });
  });
};

readImages();
