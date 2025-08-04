import multer from 'multer';

export interface File {
  name: string;
  size: number;
  type: string;
  extension: string;
  content: ArrayBuffer;
}
const allowedImageExtensionsRegex = /\.(jpg|jpeg|png|webp|heic)$/;

export const uploadFiles = multer({
  limits: {
    // 限制上傳檔案的大小為 1MB
    fileSize: 10_000_000,
  },
  fileFilter(_req, file, cb) {
    // 只接受三種圖片格式
    if (!allowedImageExtensionsRegex.test(file.originalname)) {
      cb(null, false);
      return;
    }
    cb(null, true);
  },
});
