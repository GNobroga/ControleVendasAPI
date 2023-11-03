import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const updloadFolder = path.resolve('public', 'uploads');

export default {
  dest: updloadFolder,
  storage: multer.diskStorage({
    destination: updloadFolder,
    filename: (req, file, callback) => {
      const hash = crypto.randomBytes(10).toString('hex');
      const newName = `${hash}-${Date.now()}-${file.originalname}`;
      callback(null, newName);
    }
  })
};