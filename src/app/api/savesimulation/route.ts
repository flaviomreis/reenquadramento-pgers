import { prisma } from "@/db/connection";
import { NextRequest, NextResponse } from "next/server";

export type SimulationType = {
  cargo: string;
  instrucao: string;
  posicaoAtual: string;
  posicao: string;
  produtividade: number;
  dataReferencia: Date;
  dataPrevistaLei: Date;
  totalVantagens: number;
  tempoServicoPublico: number;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log(body);

  const { cargo, instrucao, posicao, posicaoAtual, dataReferencia, dataPrevistaLei, tempoServicoPublico, totalVantagens, produtividade } = body;

  if (!cargo || !instrucao || !posicaoAtual || !posicao || !dataReferencia || !dataPrevistaLei) {
    return NextResponse.json(
      {
        error: "Empty essential data",
      },
      { status: 400 }
    );
  }

  const simulations = await prisma.simulation.findMany();
  console.log("simulations", simulations);

  return NextResponse.json(
    {
      message: "ok",
    },
    { status: 200 }
  );
}