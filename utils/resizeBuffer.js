const sharp = require('sharp');

const resizeBuffer = async (buffer, width, height) => {
  const resizedBuffer = await sharp(buffer)
    .resize({ width: width || 80, height: height || 80 }) // Adjust the width and height as needed
    .toBuffer();
  return resizedBuffer;
};
module.exports = resizeBuffer;
