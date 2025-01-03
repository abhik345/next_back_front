import fs from 'fs';
import path from 'path';

/**
 * Processes a base64 image URL, saves it as an image file in the "uploads" directory, and returns its relative path.
 * @param {string} imageUrl - The base64-encoded image string.
 * @returns {string} The relative path to the saved image file.
 * @throws {Error} If the imageUrl is invalid or if an error occurs during processing.
 */
export const processBase64Image = (imageUrl) => {
    if (!imageUrl) {
        throw new Error('No image URL provided');
    }
    if (typeof imageUrl !== 'string') {
        throw new Error('Invalid image URL format');
    }
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const matches = imageUrl.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 image format');
    }
    const imageType = matches[1]; 
    const imageData = matches[2];
    const imageBuffer = Buffer.from(imageData, 'base64');
    const imageName = `image-${Date.now()}.${imageType}`;
    const imagePath = path.join(uploadsDir, imageName);
    fs.writeFileSync(imagePath, imageBuffer);
    return `/uploads/${imageName}`;
};
