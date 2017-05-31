import {ipcMain} from 'electron';
import fs from 'fs';

/**
 * Class of adapter for execution purpose.
 * It is run in the main process of Electron ==> NO RENDERER CODE CAN BE IMPORTED HERE!
 */
export default class BaseAdapterExecution {

  /**
   * Have to returns the same adapter's ID string as in BaseAdapter
   *
   * @return {string}
   */
  static getId() {
    throw new TypeError("Method 'getId' has to be implemented!");
  }

  /**
   * Method which not need to implement by default, it is called during initialization of daGui.
   * This method should start listening for IPC communication channels where the execution is launched.
   * The channels are prefixed with the adapter's ID and the values in the brackets means values which are passed
   * to the channel callback. The channels are following:
   *  - adapterId:launchExec(generatedCode, execConf, settings)
   *  - adapterId:terminateExec()
   *
   * To communicate with the ExecutionReporter use following channels:
   *  - execution:stdout
   *  - execution:stderr
   *  - execution:done
   */
  static bootstrap() {
    ipcMain.on(this.getId() + ':launchExec', this.handleStartExecution);
    ipcMain.on(this.getId() + ':terminateExec', this.handleTerminateExecution);
  }

  /**
   * Method which handles when the execution starts.
   * It has to do all the steps (compile, build, launch).
   *
   * @param event IPC event for communication with renderer process.
   * @param generatedCode String that contains the generated code which is supposed to be launched.
   * @param conf Object that contains the Execution Configuration which is supposed to be used.
   * @param settings General daGui's settings, including all the adapters settings.
   */
  static handleStartExecution(event, generatedCode, conf, settings){
    throw new TypeError("Method 'handleStartExecution' has to be implemented!");
  }

  /**
   * Method for terminating a running execution.
   *
   * @param event IPC event
   */
  static handleTerminateExecution(event){
    throw new TypeError("Method 'handleTerminateExecution' has to be implemented!");
  }

  /**
   * Helper method for sending data back to renderer.
   *
   * @param event IPC event
   * @param channel Channel over which should the data be send back.
   * @return {function(*=)}
   */
  static sendData(event, channel){
    return (data) => {
      event.sender.send(channel, data)
    };
  }

  static async storeTempFile(code){
    return new Promise((resolve, reject) => {
      fs.writeFile(path, code + daguiMetadata, (err) => {
        if (err) return reject(err);
        resolve();
      });
    })
  }
}
