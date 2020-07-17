import * as Types from './Types';

export abstract class FileSystem {
  // General
  abstract read(filePath: string, length: number, position: number, encodingOrOptions?: any): Promise<string>
  abstract write(filePath: string, contents: string, position?: number, encoding?: string): Promise<void>
  abstract move(filePath: string, destPath: string, options?: Types.FileOptions): Promise<void>
  abstract copy(filePath: string, destPath: string, options?: Types.FileOptions): Promise<void>
  abstract readFile(filePath: string, encoding?: string): Promise<string>
  abstract writeFile(filePath: string, contents: string, encoding?: string): Promise<void>
  abstract appendFile(filePath: string, contents: string, encoding?: string): Promise<void>
  abstract exists(filePath: string): Promise<boolean>
  abstract unlink(filePath: string): Promise<void>
  abstract touch(filePath: string, mtime?: Date, ctime?: Date): Promise<void>
  abstract hash(filePath: string, algorithm: string): Promise<string>
  abstract stat(filePath: string): Promise<Types.StatResult>
  abstract mkdir(filePath: string, options?: Types.MkdirOptions): Promise<void>
  abstract readDir(dirPath: string): Promise<Types.ReadDirItem[]>
  abstract getFSInfo(): Promise<Types.FSInfoResult>

  // Download
  // abstract downloadFile(options: Types.DownloadFileOptions): {jobId: number, promise: Promise<Types.DownloadResult>}
  // abstract stopDownload(jobId: number): void
  // abstract resumeDownload(jobId: number): void // ios only
  // abstract isResumable(jobId: number): Promise<boolean> // ios only
  // abstract completeHandlerIOS(jobId: number): void // ios only

  // Upload
  // abstract uploadFiles(options: Types.UploadFileOptions): {jobId: number, promise: Promise<Types.UploadResult>}
  // abstract stopUpload(jobId: number): Promise<void> // ios only

  // Platform
  // abstract scanFile(path: string): Promise<string[]>
  // abstract getAllExternalFilesDirs(): Promise<string[]>
  // abstract pathForGroup(groupIdentifier: string): Promise<string>
  // abstract existsRes(filename: string): Promise<boolean>
  // abstract existsAssets(filePath: string): Promise<boolean>
  // abstract readFileRes(filename:string, encoding?: string): Promise<string>
  // abstract copyFileRes(filename: string, destPath: string): Promise<void>
  // abstract copyFileAssets(filePath: string, destPath: string): Promise<void>
  // abstract readFileAssets(filePath:string, encoding?: string): Promise<string>
  // abstract readDirAssets(dirPath: string): Promise<Types.ReadDirItem[]>
  // abstract copyAssetsFileIOS(imageUri: string, destPath: string, width: number, height: number, scale: number, compression: number, resizeMode: string): Promise<string>
  // abstract copyAssetsVideoIOS(videoUri: string, destPath: string): Promise<string>;
}

export interface PluginInterface {
  Types: typeof Types;
  default: FileSystem;
}
