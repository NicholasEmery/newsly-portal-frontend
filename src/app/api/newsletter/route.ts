import { NextRequest, NextResponse } from "next/server";
import { api } from "@/api/connection/http";
import { NewsletterSubscribeSchema } from "@/api/schemas/newsletter";
import { loadMocks } from "@/api/mocks";
import { getDataSourceStatus } from "@/api/services/dataSourceStatus";
import axios from "axios";

/**
 * POST /api/newsletter
 * Inscreve um email na newsletter
 *
 * Comportamento:
 * - Modo mock: retorna dados mockados
 * - Modo API: chama API externa
 */
export async function POST(request: NextRequest) {
  try {
    // Parse e validação do body
    const body = await request.json();
    const result = NewsletterSubscribeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { email } = result.data;
    const status = await getDataSourceStatus();

    // Se usar mocks (modo mock ou API indisponível)
    if (String(status.reason).includes("mock")) {
      const mocks = loadMocks();

      if (!mocks) {
        return NextResponse.json(
          { success: false, error: "Mocks não disponíveis" },
          { status: 500 },
        );
      }

      // Simula checagem de duplicata
      const subscribers = mocks.NEWSLETTER_SUBSCRIBERS_MOCK || [];
      if (subscribers.includes(email)) {
        return NextResponse.json(
          mocks.NEWSLETTER_ERROR_DUPLICATE_MOCK || {
            success: false,
            error: "Este email já está cadastrado.",
          },
          { status: 409 },
        );
      }

      // Retorna sucesso mockado
      return NextResponse.json(
        mocks.NEWSLETTER_SUCCESS_RESPONSE_MOCK || {
          success: true,
          message: "Inscrição realizada com sucesso!",
        },
        {
          status: 200,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    // Chama API externa
    try {
      await api.post("/newsletter/subscribe", { email });

      return NextResponse.json(
        {
          success: true,
          message: "Inscrição realizada com sucesso!",
        },
        {
          status: 200,
          headers: { "Cache-Control": "no-store" },
        },
      );
    } catch (error) {
      // Tratamento de erro da API externa
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorMessage = error.response?.data?.message || error.message;

        // Conflito - email já cadastrado
        if (status === 409) {
          return NextResponse.json(
            {
              success: false,
              error: "Este email já está cadastrado na newsletter.",
            },
            { status: 409 },
          );
        }

        // Bad request da API externa
        if (status === 400) {
          return NextResponse.json(
            {
              success: false,
              error: errorMessage || "Dados inválidos.",
            },
            { status: 400 },
          );
        }

        // Erro de servidor da API externa
        if (status && status >= 500) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Serviço temporariamente indisponível. Tente novamente mais tarde.",
            },
            { status: 503 },
          );
        }
      }

      throw error; // Re-throw para o catch externo lidar
    }
  } catch (error) {
    console.error("Erro ao processar inscrição na newsletter:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao processar sua solicitação. Tente novamente mais tarde.",
      },
      { status: 500 },
    );
  }
}
