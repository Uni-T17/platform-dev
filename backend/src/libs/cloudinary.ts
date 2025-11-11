import { v2 as cloudinary } from "cloudinary";

const hasUrl = !!process.env.CLOUDINARY_URL;

cloudinary.config(
  hasUrl
    ? {} // CLOUDINARY_URL covers all values
    : {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
        api_key: process.env.CLOUDINARY_API_KEY!,
        api_secret: process.env.CLOUDINARY_API_SECRET!,
      }
);

export { cloudinary };
