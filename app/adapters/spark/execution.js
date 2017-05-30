import BaseAdapterExecution from '../BaseAdapterExecution';
import {ipcMain} from 'electron';
import {spawn} from 'child_process';

const SPARK_HOME = "/home/adam/thesis/experiments/compilation/spark-2.1.0-bin-hadoop2.7";
const FILE = "/home/adam/thesis/experiments/compilation/Runnable.py";

let processHandler;

function sendData(event, channel) {
  return (data) => {
    console.log(channel + ": " + data);
    event.sender.send(channel, data)
  };
}

function handleStartExecution(event, generatedCode, execConf) {
  console.log(generatedCode, execConf);

  if (processHandler) {
    console.error("Execution is still running!");
    return;
  }

  processHandler = spawn(SPARK_HOME + '/bin/spark-submit', ['--master', 'local[*]', FILE]);

  processHandler.stdout.on('data', sendData(event, 'execution:stdout'));
  processHandler.stderr.on('data', sendData(event, 'execution:stderr'));
  processHandler.on('error', (err) => {
    console.log("ERROR! " + err.message)
  });
  processHandler.on('exit', (code) => {
    processHandler = null;
    sendData(event, 'execution:done')(code);
  });
}

function handleTerminatingExecution(event) {
  if (processHandler) {
    processHandler.kill();
  }
}

export default class SparkExecution extends BaseAdapterExecution {

  static getId() {
    return 'spark'
  }

  static bootstrap() {
    ipcMain.on('spark:launchExec', handleStartExecution);
    ipcMain.on('spark:terminateExec', handleTerminatingExecution);
  }
}
