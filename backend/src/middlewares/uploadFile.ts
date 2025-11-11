// import multer, { FileFilterCallback } from "multer";
// import { Request } from "express";

// const fileStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "/tmp");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + "." + ext);
//   },
// });

// function fileFilter(
//   req: Request,
//   file: Express.Multer.File,
//   cb: FileFilterCallback
// ) {
//   // The function should call `cb` with a boolean
//   // to indicate if the file should be accepted
//   const fileType = file.mimetype;

//   if (
//     fileType === "image/png" ||
//     fileType === "image/jpg" ||
//     fileType === "image/jpeg" ||
//     fileType === "image/webp"
//   ) {
//     // To accept the file pass `true`, like so:
//     cb(null, true);
//   } else {
//     // To reject this file pass `false`, like so:
//     cb(null, false);
//   }
// }

import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) {
  const ok = ["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(
    file.mimetype
  );
  cb(null, ok);
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default upload;

// src/utils/upload.ts

// Use memory storage so files never touch the container’s disk
