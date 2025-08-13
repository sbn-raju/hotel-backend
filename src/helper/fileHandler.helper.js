const { GridFSBucket } = require("mongodb");
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const filesUploadMongoDb = async (file) => {
  if (!file || !file.path || !file.id) {
    console.log("Invalid file input");
    return false;
  }

  const db = mongoose.connection.db; // Get native MongoDB db object
  const bucket = new GridFSBucket(db, {
    bucketName: 'room-images'
  });

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(path.basename(file.path), {
      metadata: {
        fileId: file.id,
        isMain: file.isMain,
        isThumbnail: file.isThumbnail,
        uploadedAt: new Date()
      }
    });

    fs.createReadStream(file.path)
      .pipe(uploadStream)
      .on('finish', () => {
        console.log(`File with the ID ${file.id} successfully saved!`);
        resolve(true);
      })
      .on('error', (error) => {
        console.error(`Saving file with the ID ${file.id} failed`, error);
        reject(false);
      });
  });
};

module.exports = filesUploadMongoDb;
