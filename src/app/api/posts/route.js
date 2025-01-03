import db from "../../../models/index.js";
import { NextResponse } from "next/server";
import { processBase64Image } from "../../../middlewares/processBase64Image.js"; // Adjust path

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

        const { title, description, image_url, userId } = body;
        if (!title || !description || !image_url || !userId) {
            return NextResponse.json(
                { message: "Please fill all fields" },
                { status: 400 }
            );
        }
        const processedImagePath = processBase64Image(image_url);
        const slug = generateSlug(title);
        const newPost = await db.Post.create({
            title,
            description,
            image_url: processedImagePath,
            userId,
            slug,
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
