import path from 'path';
import config from '../config';
import FileManager from './file-manager';

export default class ServerUtils {
  static getLogsDir(domain: string): string {
    const dom = !domain || domain == '_' ? 'default' : domain;
    return path.join(config.nginx.logs, dom);
  }

  static getLogFilePath(domain: string, logFile: string): string {
    const dir = this.getLogsDir(domain);

    FileManager.mkdirSync(dir);

    return path.join(dir, logFile);
  }
}
