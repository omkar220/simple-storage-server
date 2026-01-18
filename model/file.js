'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const debug = require('debug')('http:file');
const { v4: uuidv4 } = require('uuid');

const File = mongoose.Schema({
  filename: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'auth' },
  objectKey: { type: String, required: true, unique: true },
  fileURI: { type: String, required: true, unique: true },
});

// Local upload instead of AWS
File.statics.upload = function (req) {
  return new Promise((resolve, reject) => {
    if (!req.file || !req.file.buffer) return reject(new Error('Missing file data'));

    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir); // auto-create folder

    const fileExt = path.extname(req.file.originalname);
    const uniqueFileName = `${uuidv4()}${fileExt}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    fs.writeFile(filePath, req.file.buffer, (err) => {
      if (err) return reject(err);

      resolve({
        filename: req.params.filename,
        userId: req.user._id,
        objectKey: filePath,
        fileURI: `file://${filePath}`,
      });
    });
  });
};

// Local delete
File.methods.delete = function () {
  return new Promise((resolve, reject) => {
    try {
      if (fs.existsSync(this.objectKey)) fs.unlinkSync(this.objectKey);
      this.remove().then(resolve).catch(reject);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = mongoose.model('file', File);
