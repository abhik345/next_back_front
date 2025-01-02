import db from "../../../models/index.js";
import { NextResponse } from "next/server";
import base64ToImage from "../../../middlewares/base64ToImage.js"; 


const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/\s+/g, '-')      
        .replace(/[^\w\-]+/g, '')  
        .replace(/--+/g, '-')      
        .replace(/^-+/, '')       
        .replace(/-+$/, '');       
};

export async function POST(req) {
    try {
        const body = await req.json();
        const mockRes = {
            status: (code) => ({ json: (data) => NextResponse.json(data, { status: code }) } ),
        };

        // Process the image using the middleware
        await new Promise((resolve, reject) => {
            base64ToImage(req, mockRes, (err) => {
                if (err) reject(err);
                resolve();
            });
        });

        const { title, description, image_url, userId } = body;

        // Check if all required fields are provided
        if (!title || !description || !image_url || !userId) {
            return NextResponse.json(
                { message: "Please fill all fields" },
                { status: 400 }
            );
        }

        // Generate the slug from the title
        const slug = generateSlug(title);

        // Create a new post with the image URL stored in the database
        const newPost = await db.Post.create({
            title,
            description,
            image_url,  // This is now the path to the uploaded image, not base64 string
            userId,
            slug,  // Store the generated slug
        });

        return NextResponse.json({
            message: "Post created",
            data: newPost
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({
            message: error.message
        }, { status: 500 });
    }
}
