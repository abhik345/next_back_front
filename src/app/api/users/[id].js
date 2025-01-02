import db from "@/models/index.js";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const foundUser = await db.user.findByPk(id, {
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });

    if (!foundUser) {
      return NextResponse.json(
        { status: 404, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 200,
      message: "User found",
      data: foundUser,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const { username, email, password } = body;

  try {
    const existingUser = await db.user.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!existingUser) {
      return NextResponse.json(
        { status: 404, message: "User not found" },
        { status: 404 }
      );
    }

    if (username) {
      existingUser.username = username;
    }

    if (email) {
      existingUser.email = email;
    }

    if (password) {
      const salt = bcrypt.genSaltSync(10);
      existingUser.password = bcrypt.hashSync(password, salt);
    }

    await existingUser.save();

    return NextResponse.json({
      status: 200,
      message: "User updated",
      data: existingUser,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const existingUser = await db.user.findByPk(id);

    if (!existingUser) {
      return NextResponse.json(
        { status: 404, message: "User not found" },
        { status: 404 }
      );
    }

    await existingUser.destroy();

    return NextResponse.json({
      status: 200,
      message: "User deleted",
    });
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: error.message },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json(null, { status: 204 });
}
