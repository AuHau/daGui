import {writeFile} from 'fs';
import md5 from 'js-md5';
import config from "../../config/electron";

export function save(path, code, graph, commentChar, saveMode) {
  return new Promise((resolve, reject) => {
    code += '\n';
    const codeHash = md5(code);


    let output = code;
    output += commentChar + config.daguiTags.start + '\n';
    output += commentChar + 'hash:' + codeHash + ';' + graph + '\n';
    output += commentChar + config.daguiTags.end;
    writeFile(path, output, (err) => {
      if (err) return reject(err);
      resolve();
    })
  });
}