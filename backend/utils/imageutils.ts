import cloudinary from './cloudinary';

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log('Image deleted:', publicId);
  } catch (err) {
    console.error('Error deleting image:', (err as Error).message);
  }
};
