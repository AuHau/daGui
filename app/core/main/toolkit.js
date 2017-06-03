import fs from 'fs';
import md5 from 'js-md5';
import config from "../../config/electron";
import SaveMode from "../shared/enums/SaveMode";
import path from 'path';
import {dialog} from 'electron'

export function open(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) return reject(err);

      resolve(data);
    });
  });
}

export function saveImage(uri, path){
  const base64Data = uri.replace(/^data:image\/png;base64,/, "");

  return new Promise((resolve, reject) => {
    fs.writeFile(path, base64Data, 'base64', function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

export function save(path, code, graph, commentChar, saveMode) {
  return new Promise((resolve, reject) => {
    if(!code){
      code = ''
    }else{
      code += '\n';
    }

    const codeHash = md5(code);
    let daguiMetadata = '';
    daguiMetadata += commentChar + config.daguiTags.start + '\n';
    daguiMetadata += commentChar + 'version:' + config.version + ';hash:' + codeHash + ';' + graph + '\n';
    daguiMetadata += commentChar + config.daguiTags.end;

    if (saveMode == SaveMode.FULL_SAVE) {
      fs.writeFile(path, code + daguiMetadata, (err) => {
        if (err) return reject(err);
        resolve();
      });

    } else if (saveMode == SaveMode.ONLY_GRAPH_DATA) {
      fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
          if (err.code === 'ENOENT') { // File does not exists ==> write immediately
            fs.writeFile(path, daguiMetadata, function (err) {
              if (err) return reject(err);
              resolve();
            });
          } else {
            return reject(err);
          }
        }

        const replaceRegex = new RegExp(commentChar + config.daguiTags.start + "[\\s\\S]*?" + commentChar + config.daguiTags.end, "gm");

        let result;
        if (!replaceRegex.test(data)) {
          result = data + '\n' + daguiMetadata;
        } else {
          result = data.replace(replaceRegex, daguiMetadata);
        }

        fs.writeFile(path, result, function (err) {
          if (err) return reject(err);
          resolve();
        });
      });
    } else if (saveMode == SaveMode.ONLY_CODE) {
      reject(new Error("SaveMode.ONLY_CODE is yet not implemented!"))
    } else {
      reject(new Error("Unknown save mode '" + saveMode + "'!"))
    }
  });
}
