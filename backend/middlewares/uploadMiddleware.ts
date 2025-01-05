import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'grievances',
    format: 'png',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  }),
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5, // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.') as any, false);
    }
    cb(null, true);
  }
});

export const uploadImages = upload.array('images', 5);

export default upload;
