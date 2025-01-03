import db from "@/models/index.js";
import { NextResponse } from "next/server";




export async function GET(req,{params}) {
    const {slug} = await params;
    try {
        
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: error.message
        })
    }
}