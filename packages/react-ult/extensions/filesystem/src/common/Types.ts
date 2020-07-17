export type ReadDirItem = {
  name: string;                     // The name of the item
  path: string;                     // The absolute path to the item
  size: string;                     // Size in bytes
  ctime?: Date;                     // The creation date of the file (iOS only)
  mtime?: Date;                     // The last modified date of the file
  isFile: () => boolean;            // Is the file just a file?
  isDirectory: () => boolean;       // Is the file a directory?
};

export type StatResult = {
  path: string;                     // The path provided
  size: string;                     // Size in bytes
  mode: number;                     // UNIX file mode
  ctime?: number;                   // The creation date of the file
  mtime?: number;                   // The last modified date of the file
  originalFilepath?: string;        // Android: content uri = pointed file path, otherwise = path
  isFile: () => boolean;            // Is the file just a file?
  isDirectory: () => boolean;       // Is the file a directory?
};

export type DownloadFileOptions = {
  fromUrl: string;                  // URL to download file from
  toFile: string;                   // Local filesystem path to save the file to
  headers?: Headers;                // An object of headers to be passed to the server
  cacheable?: boolean;              // iOS only, whether the download can be stored in the shared NSURLCache
  background?: boolean;             // iOS only, continue the download in the background after the app terminates
  discretionary?: boolean;          // iOS only, allow the OS to control the timing and speed of the download
  backgroundTimeout?: number        // iOS only, max time (in ms) to download an entire resource
  connectionTimeout?: number        // Android only
  progressInterval?: number;
  progressDivider?: number;
  readTimeout?: number              // Android and iOS only
  resumable?: () => void;           // iOS only
  progress?: (res: DownloadProgressCallbackResult) => void;
  begin?: (res: DownloadBeginCallbackResult) => void;
};

export type DownloadResult = {
  jobId: number;                    // The download job ID, required if one wishes to cancel the download
  statusCode: number;               // The HTTP status code
  bytesWritten: number;             // The number of bytes written to the file
};

export type DownloadBeginCallbackResult = {
  jobId: number;                    // The download job ID, required if one wishes to cancel the download
  headers: Headers;                 // The HTTP response headers from the server
  statusCode: number;               // The HTTP status code
  contentLength: number;            // The total size in bytes of the download resource
};

export type DownloadProgressCallbackResult = {
  jobId: number;                    // The download job ID, required if one wishes to cancel the download
  contentLength: number;            // The total size in bytes of the download resource
  bytesWritten: number;             // The number of bytes written to the file so far
};

export type UploadFileOptions = {
  toUrl: string;                    // URL to upload file to
  binaryStreamOnly?: boolean        // Allow for binary data stream for file to be uploaded without extra headers, Default is 'false'
  files: UploadFileItem[];          // An array of objects with the file information to be uploaded.
  headers?: Headers;                // An object of headers to be passed to the server
  fields?: Fields;                  // An object of fields to be passed to the server
  method?: string;                  // Default is 'POST', supports 'POST' and 'PUT'
  progress?: (res: UploadProgressCallbackResult) => void;
  begin?: (res: UploadBeginCallbackResult) => void;
};

export type UploadResult = {
  jobId: number;                    // The upload job ID, required if one wishes to cancel the upload. See `stopUpload`.
  statusCode: number;               // The HTTP status code
  headers: Headers;                 // The HTTP response headers from the server
  body: string;                     // The HTTP response body
}; 

export type UploadFileItem = {
  name: string;                     // Name of the file, if not defined then filename is used
  filename: string;                 // Name of file
  filepath: string;                 // Path to file
  filetype: string;                 // The mimetype of the file to be uploaded, if not defined it will get mimetype from `filepath` extension
};

export type UploadBeginCallbackResult = {
  jobId: number;                    // The upload job ID, required if one wishes to cancel the upload. See `stopUpload`.
};

export type UploadProgressCallbackResult = {
  jobId: number;                    // The upload job ID, required if one wishes to cancel the upload. See `stopUpload`.
  totalBytesExpectedToSend: number; // The total number of bytes that will be sent to the server
  totalBytesSent: number;           // The number of bytes sent to the server
};

export type FSInfoResult = {
  totalSpace: number;               // The total amount of storage space on the device (in bytes).
  freeSpace: number;                // The amount of available storage space on the device (in bytes).
};

export type MkdirOptions = {
  NSURLIsExcludedFromBackupKey?: boolean
};

export type FileOptions = {
	NSFileProtectionKey?: string
}

export type Headers = {[name: string]: string}

export type Fields = {[name: string]: string}
