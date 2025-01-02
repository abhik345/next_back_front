import db from "@/models/index.js";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json(); 
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { status: 400, message: "Please fill all fields" },
        { status: 400 }
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await db.user.create({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { status: 201, message: "User created", data: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { status: 500, message: error.message },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const users = await db.user.findAll();

    if (!users.length) {
      return NextResponse.json(
        { status: 404, message: "Users not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 200, message: "Users found", data: users },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { status: 500, message: error.message },
      { status: 500 }
    );
  }
}
