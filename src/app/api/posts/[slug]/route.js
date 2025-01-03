import db from "@/models/index.js";
import { NextResponse } from "next/server";

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export async function GET(req, { params }) {
  const { slug } = await params;
  try {
    try {
      const post = await db.Post.findOne({
        where: {
          slug,
        },
        attributes: ["id", "title", "description", "image_url", "slug"],
        include: [
          {
            model: db.User,
            as: "user",
            attributes: ["id", "username"],
          },
        ],
      });
      if (!post) {
        return NextResponse.json(
          {
            status: 404,
            message: "Post not found",
          },
          {
            status: 404,
          }
        );
      }

      return NextResponse.json({
        status: 200,
        message: "Post found",
        data: post,
      });
    } catch (error) {
      return NextResponse.json({
        status: 500,
        message: error.message,
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

export async function PUT(req, { params }) {
  const { slug } = await params;
  const body = await req.json();

  try {
    const { title, description, image_url } = body;
    const existingPost = await db.Post.findOne({
      where: {
        slug,
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        {
          status: 404,
          message: "Post not found",
        },
        {
          status: 404,
        }
      );
    }

    if (title) {
      existingPost.title = title;
      const newSlug = generateSlug(title);
      existingPost.slug = newSlug;
    }
    if (description) existingPost.description = description;
    if (image_url) {
      const processedImageUrl = processBase64Image(image_url);
     return existingPost.image_url = processedImageUrl;
    }

    await existingPost.save();

    return NextResponse.json({
      status: 200,
      message: "Post updated",
      data: existingPost,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

export async function DELETE(req, { params }) {
  const { slug } = await params;

  try {
    const existingPost = await db.Post.findOne({
      where: {
        slug,
      },
    });
    if (!existingPost) {
      return NextResponse.json(
        {
          status: 404,
          message: "Post not found",
        },
        {
          status: 404,
        }
      );
    }
    await existingPost.destroy();
    return NextResponse.json({
      status: 200,
      message: "Post deleted",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
