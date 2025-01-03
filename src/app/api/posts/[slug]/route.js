import db from "@/models/index.js";
import { NextResponse } from "next/server";




export async function GET(req,{params}) {
    const {slug} = await params;
    try {
        try {
            const post = await db.Post.findOne({
                where: {
                    slug
                },
                attributes: ["id", "title", "description", "image_url", "slug"],
                include: [
                    {
                        model: db.User,
                        as: "user",
                        attributes: ["id", "username"]
                    }
                ]
            });
            if (!post) {
                return NextResponse.json({
                    status: 404,
                    message: "Post not found"
                }, {
                    status: 404
                });
            }

            return NextResponse.json({
                status: 200,
                message: "Post found",
                data: post
            })

        } catch (error) {
            return NextResponse.json({
                status: 500,
                message: error.message
            })
            
        }
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: error.message
        })
    }
}

export async function DELETE(req,{params}){
    const {slug} = await params;

    try {
        const existingPost = await db.Post.findOne({
            where : {
                slug
            }
        })
        if(!existingPost){
            return NextResponse.json({
                status: 404,
                message: "Post not found"
            }, {
                status: 404
            })
        }
        await existingPost.destroy();
        return NextResponse.json({
            status: 200,
            message: "Post deleted"
        })
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: error.message
        })
    }
}