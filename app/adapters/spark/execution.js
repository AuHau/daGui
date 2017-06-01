import BaseAdapterExecution from '../BaseAdapterExecution';
import {dialog} from 'electron';
import {spawn} from 'child_process';
import temp from 'temp';
import fs from 'fs';
import path from 'path';

let processHandler;

function storeCode(generatedCode){
  return new Promise((resolve, reject) => {
    temp.open({prefix: 'daGui.', suffix: '.py'}, (err, info) => {
      if(err) reject(err);

      fs.write(info.fd, generatedCode, (err) => {
        if(err) reject(err);

        fs.close(info.fd, (err) => {
          if(err) reject(err);
          resolve(info.path);
        })
      });
    });
  });
}

// TODO: [Critical] Escaping the shell parameters
function buildArgs(execConf, settings, filePath){
  let output = [];
  for(let key in execConf){
    if(!execConf.hasOwnProperty(key) || key == 'name') continue;

    if(key == 'app-name'){
      output.push('--name');
      output.push("'" + execConf[key] + "'");
    }else{
      output.push('--' + key);
      output.push("'" + execConf[key] + "'");
    }
  }

  output.push(' \\\n' + filePath);

  return output;
}

function getStringCommand(bin, args){
    let output = bin;

    for(let arg of args){
      if(arg.startsWith('--')){
        output += ' \\\n';
      }

      output += arg + ' ';
    }

    return output;
}

export default class SparkExecution extends BaseAdapterExecution {

  static getId() {
    return 'spark'
  }

  static handleStartExecution(event, generatedCode, conf, settings){
    if (processHandler) {
      dialog.showErrorBox("Execution error!", "Execution is still running!");
      return;
    }

    const sparkHome = process.env.SPARK_HOME;
    if(!sparkHome){
      dialog.showErrorBox("Execution error!", "SPARK_HOME environment variable is not set! The execution can not continue.");
      return;
    }

    if(!generatedCode){
      dialog.showErrorBox("Execution error!", "The code to run is empty string.");
      return;
    }

    storeCode(generatedCode)
      .then(file_path => {
        const args = buildArgs(conf, settings, file_path);
        const script_path = path.join(sparkHome, 'bin', 'spark-submit');
        const cmd = getStringCommand(script_path, args);

        // Print the execution command
        super.sendData(event, 'execution:stdout')(cmd);

        processHandler = spawn(script_path, args, {shell: true});
        processHandler.stdout.on('data', super.sendData(event, 'execution:stdout'));
        processHandler.stderr.on('data', super.sendData(event, 'execution:stderr'));
        processHandler.on('error', (err) => {
          dialog.showErrorBox("Unknown execution error!", "An error happend during the execution with following message: " + err.message);
          super.sendData(event, 'execution:done')(1);
        });
        processHandler.on('exit', (code) => {
          processHandler = null;
          super.sendData(event, 'execution:done')(code);
        });
      })
      .catch(err => {
        dialog.showErrorBox("Unknown execution error!", "An error happend during the execution with following message: " + err.message);
        super.sendData(event, 'execution:done')(1);
      });
  }

  static handleTerminateExecution(event){
    if (processHandler) {
      processHandler.kill();
      processHandler = null;
    }
  }
}
