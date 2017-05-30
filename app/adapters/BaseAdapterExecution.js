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
   * Method which is called during initialization of daGui.
   * This method should start listening for IPC communication channels where the execution is launched.
   * The channels are prefixed with the adapter's ID and the values in the brackets means values which are passed
   * to the channel callback. The channels are following:
   *  - adapterId:launchExec(generatedCode, execConf)
   *  - adapterId:terminateExec()
   *
   * To communicate with the ExecutionReporter use following channels:
   *  - execution:stdout
   *  - execution:stderr
   *  - execution:done
   */
  static bootstrap() {
    throw new TypeError("Method 'bootstrap' has to be implemented!");
  }
}
