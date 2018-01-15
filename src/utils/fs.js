import fs from 'fs';
import path from 'path';

function scandir(dir, list = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = `${dir}${path.sep}${file}`;
    if (fs.statSync(filePath).isDirectory()) {
      list = scandir(filePath, list);
    } else {
      list.push(filePath);
    }
  });
  return list;
}

export { scandir };
