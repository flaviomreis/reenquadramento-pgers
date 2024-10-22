"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "../ui/separator";
import { CalendarIcon, Meh, ThumbsUp } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { ModeToggle } from "../mode-toogle";
import { ScrollArea } from "../ui/scroll-area";
import { SimulationType } from "@/app/api/savesimulation/route";

const vencimentos = {
  tecnico: {
    AI: 3655.28,
    AII: 4020.81,
    BI: 4422.89,
    BII: 4865.18,
    CI: 5351.7,
    CII: 5886.86,
    DI: 6475.55,
    DII: 7123.11,
  },
  analista: {
    AI: 8111.95,
    AII: 8923.15,
    BI: 9815.46,
    BII: 10797.01,
    CI: 11876.71,
    CII: 13064.38,
    DI: 0,
    DII: 0,
  },
};

const subsidios = {
  "10/2026": {
    tecnico: {
      AI: 4600,
      AII: 4738,
      AIII: 4880.14,
      BI: 5221.75,
      BII: 5378.4,
      BIII: 5539.75,
      CI: 5927.54,
      CII: 6105.36,
      CIII: 6228.52,
      DI: 6728.72,
      DII: 6930.58,
      DIII: 7138.5,
      EI: 7638.19,
      EII: 7867.34,
      EIII: 8103.36,
      FI: 8670.6,
      FII: 8930.71,
      FIII: 9198.64,
      FIII_esp: 9336.62,
    },
    analista: {
      AI: 10800,
      AII: 11124,
      AIII: 11457.72,
      BI: 12259.76,
      BII: 12627.55,
      BIII: 13006.38,
      CI: 13916.83,
      CII: 14334.33,
      CIII: 14764.36,
      DI: 15797.87,
      DII: 16271.8,
      DIII: 16759.96,
      EI: 17933.15,
      EII: 18471.15,
      EIII: 19025.28,
      FI: 20357.05,
      FII: 20967.76,
      FIII: 21596.8,
      FIII_esp: 21920.75,
    },
  },
};

const employeeFormSchema = z.union([
  z.object({
    cargo: z.literal("analista"),
    posicao: z.enum(["AI", "AII", "BI", "BII", "CI", "CII"], {
      required_error: "Você deve informar a posição na carreira",
    }),
    tempoEstado: z.coerce.number().int().gte(0),
    licencaPremio: z.coerce.number().int().gte(0),
    totalVantagens: z.coerce.number().gte(0),
    dataReferencia: z.date(),
    dataPublicacao: z.date(),
    escolaridade: z.enum(["superior", "lato-sensu", "stricto-sensu"], {
      required_error: "Você deve informar seu grau de instrução",
    }),
  }),
  z.object({
    cargo: z.literal("tecnico"),
    posicao: z.enum(["AI", "AII", "BI", "BII", "CI", "CII", "DI", "DII"], {
      required_error: "Você deve informar a posição na carreira",
    }),
    tempoEstado: z.coerce.number().int().gte(0),
    licencaPremio: z.coerce.number().int().gte(0),
    totalVantagens: z.coerce.number().gte(0),
    dataReferencia: z.date(),
    dataPublicacao: z.date(),
    escolaridade: z.enum(["medio", "superior", "lato-sensu", "stricto-sensu"], {
      required_error: "Você deve informar seu grau de instrução",
    }),
  }),
]);

type EmployeeFormSchema = z.infer<typeof employeeFormSchema>;

type SimulationResulType = {
  cargo?: string;
  posicaoAtual?: string;
  remuneracao?: number;
  novaPosicao?: string;
  tempoEstado?: number;
  diferencaProximoReenquadramanento?: number;
  escolaridade?: string;
  tabela?: [
    {
      quando: string;
      subsidio: number;
      parcela: number;
      ganho: number;
    }
  ];
  posicaoLP?: string;
  tabelaLP?: [
    {
      quando: string;
      subsidio: number;
      parcela: number;
      ganho: number;
    }
  ];
};

export function EmployeeForm() {
  const form = useForm<EmployeeFormSchema>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      cargo: "analista",
      posicao: "AI",
      tempoEstado: 0,
      licencaPremio: 0,
      dataReferencia: new Date(2024, 8, 30),
      dataPublicacao: new Date(2025, 0, 1),
      escolaridade: "superior",
      totalVantagens: 0,
    },
  });
  const [open, setOpen] = React.useState<boolean>(false);
  const [submitDisabled, setSubmitDisabled] = React.useState<boolean>(false);
  const [simulationResult, setSimulationResult] =
    React.useState<SimulationResulType>({});

  type posicoes = keyof (typeof subsidios)["10/2026"]["analista"];
  const arrayPosicoes = Object.keys(
    subsidios["10/2026"]["analista"]
  ) as posicoes[];

  function calculaItemTabela(
    quando: "10/2026",
    data: EmployeeFormSchema,
    remuneracao: number,
    posicao: posicoes
  ): { quando: string; subsidio: number; parcela: number; ganho: number } {
    const subsidio = subsidios[quando][data.cargo][posicao];
    const parcela = subsidio < remuneracao ? remuneracao - subsidio : 0;
    const ganho = parcela > 0 ? 0 : subsidio - remuneracao;

    return {
      quando,
      subsidio,
      parcela,
      ganho,
    };
  }

  function toLocaleString(valor: number | undefined | false): string {
    return valor !== undefined
      ? valor.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : "";
  }

  async function handleEmployeeForm(data: EmployeeFormSchema) {
    setSubmitDisabled(true);
    const vencimento = vencimentos[data.cargo][data.posicao];
    const remuneracao = vencimento + data.totalVantagens;
    const diasAtePublicacao = Math.round(
      Math.abs(data.dataPublicacao.getTime() - data.dataReferencia.getTime()) /
        86400 /
        1000
    );
    const tempoEstado = (data.tempoEstado + diasAtePublicacao) / 365;
    //console.log(diasAtePublicacao, data.tempoEstado, tempoEstado);

    let posicao: posicoes = "AI";
    let diferencaProximoReenquadramanento = -1;

    if (data.cargo == "tecnico") {
      if (data.posicao == "AI") {
        if (tempoEstado <= 3) {
          posicao = "AI";
          diferencaProximoReenquadramanento = (3 - tempoEstado) * 365;
        } else if (tempoEstado > 3 && tempoEstado <= 6) {
          posicao = "AII";
          diferencaProximoReenquadramanento = (6 - tempoEstado) * 365;
        } else if (tempoEstado > 6) {
          posicao = "AIII";
        }
      } else if (data.posicao == "AII") {
        if (tempoEstado <= 6) {
          posicao = "BI";
          diferencaProximoReenquadramanento = (6 - tempoEstado) * 365;
        } else if (tempoEstado > 6 && tempoEstado <= 9) {
          posicao = "BII";
          diferencaProximoReenquadramanento = (9 - tempoEstado) * 365;
        } else if (tempoEstado > 9 && tempoEstado <= 12) {
          posicao = "BIII";
          diferencaProximoReenquadramanento = (12 - tempoEstado) * 365;
        } else if (tempoEstado > 12 && tempoEstado <= 15) {
          posicao = "CI";
          diferencaProximoReenquadramanento = (15 - tempoEstado) * 365;
        } else if (tempoEstado > 15) {
          posicao = "CII";
        }
      } else if (data.posicao == "BI") {
        if (tempoEstado <= 15) {
          posicao = "CIII";
          diferencaProximoReenquadramanento = (15 - tempoEstado) * 365;
        } else if (tempoEstado > 15) {
          posicao = "DI";
        }
      } else if (data.posicao == "BII") {
        if (tempoEstado <= 15) {
          posicao = "DII";
          diferencaProximoReenquadramanento = (15 - tempoEstado) * 365;
        } else if (tempoEstado > 15) {
          posicao = "DIII";
        }
      } else if (data.posicao == "CI") {
        if (tempoEstado <= 15) {
          posicao = "EI";
          diferencaProximoReenquadramanento = (15 - tempoEstado) * 365;
        } else if (tempoEstado > 15) {
          posicao = "EII";
        }
      } else if (data.posicao == "CII") {
        if (tempoEstado <= 15) {
          posicao = "EIII";
          diferencaProximoReenquadramanento = (15 - tempoEstado) * 365;
        } else if (tempoEstado > 15) {
          posicao = "FI";
        }
      } else if (data.posicao == "DI") {
        posicao = "FII";
      } else if (data.posicao == "DII") {
        posicao = "FIII";
      }
    } else if (data.cargo == "analista") {
      if (data.posicao == "AI") {
        if (tempoEstado <= 3) {
          posicao = "AI";
          diferencaProximoReenquadramanento = (3 - tempoEstado) * 365;
        } else if (tempoEstado > 3 && tempoEstado <= 6) {
          posicao = "AII";
          diferencaProximoReenquadramanento = (6 - tempoEstado) * 365;
        } else if (tempoEstado > 6) {
          posicao = "AIII";
        }
      } else if (data.posicao == "AII") {
        if (tempoEstado <= 6) {
          posicao = "BI";
          diferencaProximoReenquadramanento = (6 - tempoEstado) * 365;
        } else if (tempoEstado > 6 && tempoEstado <= 9) {
          posicao = "BII";
          diferencaProximoReenquadramanento = (9 - tempoEstado) * 365;
        } else if (tempoEstado > 9 && tempoEstado <= 12) {
          posicao = "BIII";
          diferencaProximoReenquadramanento = (12 - tempoEstado) * 365;
        } else if (tempoEstado > 12 && tempoEstado <= 15) {
          posicao = "CI";
          diferencaProximoReenquadramanento = (15 - tempoEstado) * 365;
        } else if (tempoEstado > 15) {
          posicao = "CII";
        }
      } else if (data.posicao == "BI") {
        if (tempoEstado <= 15) {
          posicao = "CIII";
          diferencaProximoReenquadramanento = (15 - tempoEstado) * 365;
        } else if (tempoEstado > 15) {
          posicao = "DI";
        }
      } else if (data.posicao == "BII") {
        if (tempoEstado <= 15) {
          posicao = "DII";
          diferencaProximoReenquadramanento = (15 - tempoEstado) * 365;
        } else if (tempoEstado > 15) {
          posicao = "DIII";
        }
      } else if (data.posicao == "CI") {
        if (tempoEstado <= 15) {
          posicao = "EI";
          diferencaProximoReenquadramanento = (15 - tempoEstado) * 365;
        } else if (tempoEstado > 15) {
          posicao = "EII";
        }
      } else if (data.posicao == "CII") {
        if (tempoEstado <= 15) {
          posicao = "FII";
          diferencaProximoReenquadramanento = (15 - tempoEstado) * 365;
        } else if (tempoEstado > 15) {
          posicao = "FIII";
        }
      }
    }

    let posicaoIndex = arrayPosicoes.findIndex((item) => item == posicao);
    console.log(diferencaProximoReenquadramanento);

    if (data.cargo == "tecnico") {
      if (
        (data.escolaridade != "medio" && posicao == "FIII") ||
        (data.escolaridade == "lato-sensu" && posicao == "FII") ||
        (data.escolaridade == "stricto-sensu" && posicao == "FII")
      ) {
        posicaoIndex = arrayPosicoes.length - 1;
      } else if (data.escolaridade == "superior") {
        posicaoIndex++;
      } else if (
        data.escolaridade == "lato-sensu" ||
        data.escolaridade == "stricto-sensu"
      ) {
        posicaoIndex = posicaoIndex + 2;
      }
    }

    if (data.cargo == "analista") {
      if (
        (data.escolaridade == "lato-sensu" && posicao == "FIII") ||
        (data.escolaridade == "stricto-sensu" && posicao == "FII") ||
        (data.escolaridade == "stricto-sensu" && posicao == "FIII")
      ) {
        posicaoIndex = arrayPosicoes.length - 1;
      } else if (data.escolaridade == "lato-sensu") {
        posicaoIndex++;
      } else if (data.escolaridade == "stricto-sensu") {
        posicaoIndex = posicaoIndex + 2;
      }
    }

    let posicaoIndexLP = posicaoIndex;

    if (
      posicaoIndex < arrayPosicoes.length - 1 &&
      diferencaProximoReenquadramanento >= 0 &&
      diferencaProximoReenquadramanento <= data.licencaPremio * 2
    ) {
      posicaoIndexLP++;
    } else {
      diferencaProximoReenquadramanento = -1;
    }
    console.log(
      diferencaProximoReenquadramanento,
      data.licencaPremio,
      posicaoIndex,
      posicaoIndexLP
    );

    posicao = arrayPosicoes[posicaoIndex];
    const posicaoLP = arrayPosicoes[posicaoIndexLP];

    const tabela: [
      { quando: string; subsidio: number; parcela: number; ganho: number }
    ] = [calculaItemTabela("10/2026", data, remuneracao, posicao)];

    const tabelaLP: [
      { quando: string; subsidio: number; parcela: number; ganho: number }
    ] = [calculaItemTabela("10/2026", data, remuneracao, posicaoLP)];

    // await saveSimulation({
    //   cargo: data.cargo,
    //   instrucao: data.escolaridade,
    //   posicaoAtual: data.posicao,
    //   posicao,
    //   dataReferencia: data.dataReferencia,
    //   dataPrevistaLei: data.dataPublicacao,
    //   totalVantagens: data.totalVantagens,
    //   tempoServicoPublico: data.tempoEstado,
    // });

    setSimulationResult({
      cargo: data.cargo,
      posicaoAtual: data.posicao,
      novaPosicao: posicao,
      posicaoLP,
      remuneracao,
      tempoEstado,
      diferencaProximoReenquadramanento,
      tabela,
      tabelaLP,
    });

    setOpen(true);
    setSubmitDisabled(false);
  }

  async function saveSimulation(data: SimulationType) {
    const result = await fetch(`/api/savesimulation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEmployeeForm)}>
        <ScrollArea className="h-full  max-h-screen overflow-y-auto">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>
                <div className="flex flex-row justify-between">
                  Simulação de Reequadramento
                  <ModeToggle />
                </div>
              </CardTitle>
              <CardDescription>PGE-RS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={form.control}
                  name="cargo"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Cargo</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row justify-between space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="analista" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Analista
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="tecnico" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Técnico
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="posicao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Posição Atual na Carreira</FormLabel>
                      <FormControl>
                        <Input placeholder="AI" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="escolaridade"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Grau de Instrução:</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col justify-between space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="medio" />
                            </FormControl>
                            <FormLabel className="font-normal">Médio</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="superior" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Superior
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="lato-sensu" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Especialização
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="stricto-sensu" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Mestrado ou Doutorado
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tempoEstado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo de Serviço Público (em dias)</FormLabel>
                      <FormControl>
                        <Input placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="licencaPremio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estoque de Licença-Prêmio (em dias)</FormLabel>
                      <FormControl>
                        <Input placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataPublicacao"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Data prevista entrada em vigor da Lei
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalVantagens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Total das vantagens temporais (em R$)
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Use ponto para decimal. Ex.: 1500.31
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button disabled={submitDisabled}>Simular</Button>
            </CardFooter>
          </Card>
        </ScrollArea>
      </form>

      <Dialog open={open} onOpenChange={setOpen}>
        <ScrollArea className="h-full  max-h-screen overflow-y-auto">
          <DialogContent className="text-sm w-[350px] gap-4">
            <DialogHeader>
              <DialogTitle>Resultado da Simulação</DialogTitle>
              <DialogDescription>
                Não tem valor legal e pode conter erros
              </DialogDescription>
            </DialogHeader>
            <div>
              Cargo: {simulationResult.cargo?.toUpperCase()} há{" "}
              {simulationResult.tempoEstado &&
                simulationResult.tempoEstado.toFixed(2)}{" "}
              anos
            </div>
            <div>
              Remuneração Atual:{" "}
              <span className="font-semibold">
                {toLocaleString(simulationResult.remuneracao)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              Reenquadrado de{" "}
              <div className="font-semibold border border-black px-3 py-1 rounded-sm">
                {simulationResult.posicaoAtual}
              </div>{" "}
              para{" "}
              <div className="font-semibold border border-black px-3 py-1 rounded-sm">
                {simulationResult.novaPosicao}
              </div>
            </div>

            {simulationResult.tabela?.map((item) => (
              <div key={item.quando} className="flex flex-col gap-4">
                <Separator className="mt-4" />
                <div className="font-semibold">{item.quando}</div>
                <div>Subsídio: {toLocaleString(item.subsidio)}</div>
                <div>
                  Parcela de Irredutibilidade: {toLocaleString(item.parcela)}
                </div>
                <div>
                  Ganho com Reenquadramento:{" "}
                  <span className="font-semibold">
                    {toLocaleString(item.ganho)}
                  </span>
                </div>
                {item.ganho > 0 ? (
                  <div className="flex flex-row items-center gap-2">
                    <ThumbsUp className="text-green-600 font-bold" />
                  </div>
                ) : (
                  <div className="flex flex-row items-center gap-2">
                    <Meh className="text-blue-600 font-bold" />
                  </div>
                )}
              </div>
            ))}

            <Separator className="mt-4" />
            {simulationResult?.diferencaProximoReenquadramanento !==
              undefined &&
            simulationResult.diferencaProximoReenquadramanento >= 0 ? (
              <div>
                <div className="flex items-center gap-2">
                  Convertendo{" "}
                  {(
                    simulationResult.diferencaProximoReenquadramanento / 2
                  ).toFixed(0)}{" "}
                  dias de L.P.
                  <div className="font-semibold border border-black px-3 py-1 rounded-sm">
                    {simulationResult.posicaoLP}
                  </div>
                </div>
                {simulationResult.tabelaLP?.map((item, index) => (
                  <div key={item.quando} className="flex flex-col gap-4">
                    <Separator className="mt-4" />
                    <div className="font-semibold">{item.quando}</div>
                    <div>Subsídio: {toLocaleString(item.subsidio)}</div>
                    <div>
                      Parcela de Irredutibilidade:{" "}
                      {toLocaleString(item.parcela)}
                    </div>
                    <div>
                      Ganho com Reenquadramento:{" "}
                      <span className="font-semibold">
                        {toLocaleString(item.ganho)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </DialogContent>
        </ScrollArea>
      </Dialog>
    </Form>
  );
}
