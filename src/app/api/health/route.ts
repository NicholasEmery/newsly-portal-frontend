import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/health`, {
      timeout: 3000,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          status: "error",
          message: error.message,
        },
        { status: error.response?.status || 503 },
      );
    }

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to check API health",
      },
      { status: 503 },
    );
  }
}
