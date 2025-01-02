import fs from 'fs';
import path from 'path';

// Middleware to convert base64 image string to actual image file
const base64ToImage = (req, res, next) => {
    const { image_url } = req.body;

    if (!image_url) {
        return next();
    }

    if (typeof image_url !== 'string') {
        return res.status(400).json({ error: 'Please provide a base64 image URL' });
    }

    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    try {
        const matches = image_url.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw new Error('Invalid base64 image format');
        }

        const imageType = matches[1]; // e.g., 'png', 'jpeg'
        const imageData = matches[2];
        const imageBuffer = Buffer.from(imageData, 'base64');
        const imageName = `image-${Date.now()}.${imageType}`;
        const imagePath = path.join(uploadsDir, imageName);

        fs.writeFileSync(imagePath, imageBuffer);

        // Assign the image path (URL) to the request body
        req.body.image_url = `/uploads/${imageName}`;
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Error processing image' });
    }
};

export default base64ToImage;
