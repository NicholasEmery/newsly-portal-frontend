import { NextRequest, NextResponse } from "next/server";
import { api } from "@/api/connection/http";
import { NewsletterSubscribeSchema } from "@/api/schemas/newsletter";
import { loadMocksAsync } from "@/api/mocks";
import { getDataSourceStatus } from "@/api/services/dataSourceStatus";
import axios from "axios";

/**
 * POST /api/newsletter
 * Subscribes an email to the newsletter
 *
 * Behavior:
 * - Mock mode: returns mocked data
 * - API mode: calls external API
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate the body
    const body = await request.json();
    const result = NewsletterSubscribeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid data",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { email } = result.data;
    const status = await getDataSourceStatus();

    // Use mocks (mock mode or API unavailable)
    if (String(status.reason).includes("mock")) {
      const mocks = await loadMocksAsync();

      if (!mocks) {
        // eslint-disable-next-line no-console
        console.debug(
          "[newsletter] mocks not available when trying to subscribe",
        );
        return NextResponse.json(
          { success: false, error: "Mocks not available" },
          { status: 500 },
        );
      }

      // Simulate duplicate check
      const subscribers = mocks.NEWSLETTER_SUBSCRIBERS_MOCK || [];
      if (subscribers.includes(email)) {
        return NextResponse.json(
          mocks.NEWSLETTER_ERROR_DUPLICATE_MOCK || {
            success: false,
            error: "This email is already registered.",
          },
          { status: 409 },
        );
      }

      // Return mocked success
      return NextResponse.json(
        mocks.NEWSLETTER_SUCCESS_RESPONSE_MOCK || {
          success: true,
          message: "Successfully subscribed!",
        },
        {
          status: 200,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    // Call external API
    try {
      await api.post("/newsletter/subscribe", { email });

      return NextResponse.json(
        {
          success: true,
          message: "Successfully subscribed!",
        },
        {
          status: 200,
          headers: { "Cache-Control": "no-store" },
        },
      );
    } catch (error) {
      // External API error handling
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorMessage = error.response?.data?.message || error.message;

        // Conflict - email already registered
        if (status === 409) {
          return NextResponse.json(
            {
              success: false,
              error: "This email is already registered in the newsletter.",
            },
            { status: 409 },
          );
        }

        // Bad request from external API
        if (status === 400) {
          return NextResponse.json(
            {
              success: false,
              error: errorMessage || "Invalid data.",
            },
            { status: 400 },
          );
        }

        // External API server error
        if (status && status >= 500) {
          return NextResponse.json(
            {
              success: false,
              error: "Service temporarily unavailable. Please try again later.",
            },
            { status: 503 },
          );
        }
      }

      throw error; // Re-throw for the outer catch to handle
    }
  } catch (error) {
    console.error("Error processing newsletter subscription:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Error processing your request. Please try again later.",
      },
      { status: 500 },
    );
  }
}
