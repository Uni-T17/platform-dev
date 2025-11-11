// src/middlewares/cloudinaryUpload.ts
import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadToCloudinary(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) return next(); // allow routes that don't send an image

    const bufferStream = Readable.from(req.file.buffer);

    const result: any = await new Promise((resolve, reject) => {
      const up = cloudinary.uploader.upload_stream(
        {
          folder: "bookex/images",
          resource_type: "image",
        },
        (err, uploaded) => (err ? reject(err) : resolve(uploaded))
      );
      bufferStream.pipe(up);
    });

    // attach to req for the controller
    (req as any).cloudinary = {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };

    next();
  } catch (err) {
    next(err);
  }
}
