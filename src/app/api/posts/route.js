import db from "../../../models/index.js";


import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { title, description, image } = body;

        if (!title || !description || !image) {
            return NextResponse.json(
                { status: 400, message: "Please fill all fields" },
                { status: 400 }
            );
        }
        
    } catch (error) {
        
    }
}