import fs from 'fs';
import path from 'path';

export const processBase64Image = (imageUrl) => {
    if (!imageUrl) {
        throw new Error('No image URL provided');
    }

    if (typeof imageUrl !== 'string') {
        throw new Error('Invalid image URL format');
    }

    const uploadsDir = path.join(process.cwd(), 'uploads'); 
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
