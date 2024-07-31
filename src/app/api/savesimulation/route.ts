import { prisma } from "@/db/connection";
import { Decimal } from "@prisma/client/runtime/library";
import { randomUUID, UUID } from "crypto";
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

async function saveSimulation(simulation: SimulationType): Promise<String> {
  const result = await prisma.simulation.create({
    data: {
      id: randomUUID(),
      ...simulation
    }
  });

  return result.id;
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { cargo, instrucao, posicao, posicaoAtual, dataReferencia, dataPrevistaLei, tempoServicoPublico, totalVantagens, produtividade } = body;

  if (!cargo || !instrucao || !posicaoAtual || !posicao || !dataReferencia || !dataPrevistaLei) {
    return NextResponse.json(
      {
        error: "Empty essential data",
      },
      { status: 200 }
    );
  }

  const uuid = await saveSimulation(body);
  console.log("simulations", uuid);

  return NextResponse.json(
    {
      message: "ok",
    },
    { status: 200 }
  );
}