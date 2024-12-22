import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'grievances', // Specify the folder name in Cloudinary
      format: 'png', // Force the file format if necessary (optional)
      allowed_formats: ['jpg', 'jpeg', 'png'], // Restrict file types
    };
  },
});

const upload = multer({ storage });

export default upload;
