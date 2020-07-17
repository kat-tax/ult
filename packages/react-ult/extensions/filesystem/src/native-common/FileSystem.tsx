import * as RNFS from 'react-native-fs';
import * as Types from '../common/Types';
import * as Interfaces from '../common/Interfaces';

// RESEARCH, passing base64 won't do: https://github.com/joltup/rn-fetch-blob

export class FileSystem extends Interfaces.FileSystem {
  constructor() {
    super();
  }

  read(filePath: string, length?: number, position?: number, options?: any) {
    return RNFS.read(filePath, length, position, options);
  }

  write(filePath: string, contents: string, position?: number, options?: any) {
    return RNFS.write(filePath, contents, position, options);
  }

  moveFile(filePath: string, destPath: string, options?: Types.FileOptions) {
    return RNFS.moveFile(filePath, destPath, options);
  }

  copyFile(filePath: string, destPath: string, options?: Types.FileOptions) {
    return RNFS.copyFile(filePath, destPath, options);
  }

  readFile(filePath: string, options?: any) {
    return RNFS.readFile(filePath, options);
  }

  writeFile(filePath: string, contents: string, options?: any) {
    return RNFS.writeFile(filePath, contents, options);
  }

  appendFile(filePath: string, contents: string, options?: any) {
    return RNFS.appendFile(filePath, contents, options);
  }

  exists(filePath: string) {
    return RNFS.exists(filePath);
  }

  unlink(filePath: string) {
    return RNFS.unlink(filePath);
  }

  touch(filePath: string, mtime?: Date, ctime?: Date) {
    return RNFS.touch(filePath, mtime, ctime);
  }

  hash(filePath: string, algorithm: string) {
    return RNFS.hash(filePath, algorithm);
  }

  stat(filePath: string) {
    return RNFS.stat(filePath);
  }

  mkdir(filePath: string, options?: Types.MkdirOptions) {
    return RNFS.mkdir(filePath, options);
  }

  readDir(dirPath: string) {
    return RNFS.readDir(dirPath);
  }

  getFSInfo() {
    return RNFS.getFSInfo();
  }
}

export default new FileSystem();
