import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/images");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "." + ext);
  },
});

function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted
  const fileType = file.mimetype;

  if (
    fileType === "image/png" ||
    fileType === "image/jpg" ||
    fileType === "image/jpeg" ||
    fileType === "image/webp"
  ) {
    // To accept the file pass `true`, like so:
    cb(null, true);
  } else {
    // To reject this file pass `false`, like so:
    cb(null, false);
  }
}

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 }, // 10 mb maximum
});

export default upload;
