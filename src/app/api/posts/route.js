import db from "../../../models/index.js";
import { NextResponse } from "next/server";
import { processBase64Image } from "../../../middlewares/processBase64Image.js";

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/\s+/g, '-')      
        .replace(/[^\w\-]+/g, '')  
        .replace(/--+/g, '-')      
        .replace(/^-+/, '')       
        .replace(/-+$/, '');       
};

/**
 * @api {post} /posts Create a new blog post
 * @apiName CreatePost
 * @apiGroup Posts
 * @apiPermission User
 *
 * @apiParam {String} title The title of the post
 * @apiParam {String} description The description of the post
 * @apiParam {String} image_url The image URL for the post (base64 encoded)
 * @apiParam {Number} userId The ID of the user who created the post
 *
 * @apiSuccess {Object} data The created post object
 * @apiSuccess {Number} data.id The ID of the post
 * @apiSuccess {String} data.title The title of the post
 * @apiSuccess {String} data.description The description of the post
 * @apiSuccess {String} data.image_url The image URL of the post
 * @apiSuccess {Number} data.userId The ID of the user who created the post
 * @apiSuccess {String} data.slug The slug for the post
 *
 * @apiError {String} message Please fill all fields
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Please fill all fields"
 *     }
 *
 * @apiError {String} message Post creation failed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Post creation failed"
 *     }
 */
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


/**
 * @api {get} /api/posts Fetch all blog posts
 * @apiName GetPosts
 * @apiGroup Posts
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 200,
 *       "message": "Posts found",
 *       "data": [
 *         {
 *           "id": 1,
 *           "title": "Post 1",
 *           "description": "This is a test post",
 *           "image_url": "https://example.com/image.jpg",
 *           "userId": 1,
 *           "slug": "post-1"
 *         },
 *         {
 *           "id": 2,
 *           "title": "Post 2",
 *           "description": "This is another test post",
 *           "image_url": "https://example.com/image2.jpg",
 *           "userId": 1,
 *           "slug": "post-2"
 *         }
 *       ]
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Post fetching failed"
 *     }
 */
export async function GET() {
    try {
        const allPosts = await db.Post.findAll({
            attributes: ["id", "title", "description", "image_url", "slug"],
                include: [
                    {
                        model: db.User,
                        as: "user",
                        attributes: ["id", "username"]
                    }
                ] 
        });
        
        if (!allPosts.length) {
            return NextResponse.json({
                status: 404,
                message: "allPosts not found",
            });
        }
        
        return NextResponse.json({
            status: 200,
            message: "allPosts found",
            data: allPosts,
        });
    } catch (error) {
        console.error("Error fetching allPosts:", error);
        return NextResponse.json({
            status: 500,
            message: error.message,
        });
    }
}


