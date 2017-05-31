import BaseAdapterExecution from '../BaseAdapterExecution';
import {dialog} from 'electron';
import {spawn} from 'child_process';

const FILE = "/home/adam/thesis/experiments/compilation/Runnable.py";

let processHandler;

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

    processHandler = spawn(sparkHome + '/bin/spark-submit', ['--master', 'local[*]', FILE]);

    processHandler.stdout.on('data', this.sendData(event, 'execution:stdout'));
    processHandler.stderr.on('data', this.sendData(event, 'execution:stderr'));
    processHandler.on('error', (err) => {
      dialog.showErrorBox("Unknown execution error!", "An error happend during the execution with following message: " + err.message);
    });
    processHandler.on('exit', (code) => {
      processHandler = null;
      this.sendData(event, 'execution:done')(code);
    });
  }

  static handleTerminateExecution(event){
    if (processHandler) {
      processHandler.kill();
      processHandler = null;
    }
  }
}
