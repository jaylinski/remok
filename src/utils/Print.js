import colors from 'colors/safe';
import { namespace } from './../config/defaults';

export default class Print {
  static debug(message) {
    Print.log(colors.grey(message), 4);
  }

  static success(message) {
    Print.log(colors.green(message), 3);
  }

  static info(message) {
    Print.log(colors.bold(message), 2);
  }

  static warning(message) {
    Print.log(colors.yellow(message), 1);
  }

  static error(message) {
    Print.log(colors.red(message), 0);
  }

  /**
   * Prints a message to the console.
   *
   * @param {string} message
   * @param {int|null} level
   */
  static log(message, level = null) {
    if (global[namespace].verbose || level <= 1 || level === null) {
      console.log(message);
    }
  }
}
