"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import * as React from "react";

import { useToast } from "@/components/ui/use-toast";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const vencimento = {
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
  analistas: {
    AI: 8111.95,
    AII: 8923.15,
    BI: 9815.46,
    BII: 10797.01,
    CI: 11876.71,
    CII: 13064.38,
  },
};

const subsidio = {
  "01/2025": {
    tecnico: {
      AI: 4600,
      AII: 4738,
      AIII: 4880.14,
      BI: 5221.75,
      BII: 5378.4,
      BIII: 5539.75,
      CI: 5543,
      CII: 5612,
      CIII: 5658,
      DI: 5704,
      DII: 5750,
      DIII: 5796,
      EI: 5842,
      EII: 5888,
      EIII: 5934,
      FI: 5980,
      FII: 6026,
      FIII: 6072,
    },
    analista: {
      AI: 10800,
      AII: 11124,
      AIII: 11457.72,
      BI: 12259.76,
      BII: 12627.55,
      BIII: 13006.38,
      CI: 13014,
      CII: 13176,
      CIII: 13284,
      DI: 13392,
      DII: 13500,
      DIII: 13607,
      EI: 13716,
      EII: 13824,
      EIII: 13932,
      FI: 14040,
      FII: 14148,
      FIII: 14256,
    },
  },
  "10/2025": {
    tecnico: {
      AI: 4600,
      AII: 4738,
      AIII: 4880.14,
      BI: 5221.75,
      BII: 5378.4,
      BIII: 5539.75,
      CI: 5937.54,
      CII: 6105.36,
      CIII: 6288.52,
      DI: 6728.72,
      DII: 6930.58,
      DIII: 7138.5,
      EI: 7176,
      EII: 7222,
      EIII: 7268,
      FI: 7314,
      FII: 7360,
      FIII: 7406,
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
      EI: 16848,
      EII: 16956,
      EIII: 17064,
      FI: 17172,
      FII: 17280,
      FIII: 17388,
    },
  },
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
    totalVantagens: z.coerce.number().gte(0),
    tabela: z.enum(["01/2025", "10/2025", "10/2026"], {
      required_error: "Você deve informar a tabela de reenquadramento",
    }),
  }),
  z.object({
    cargo: z.literal("tecnico"),
    posicao: z.enum(["AI", "AII", "BI", "BII", "CI", "CII", "DI", "DII"], {
      required_error: "Você deve informar a posição na carreira",
    }),
    tempoEstado: z.coerce.number().int().gte(0),
    totalVantagens: z.coerce.number().gte(0),
    tabela: z.enum(["01/2025", "10/2025", "10/2026"], {
      required_error: "Você deve informar a tabela de reenquadramento",
    }),
  }),
]);

// const employeeFormSchema = z.object({
//   cargo: z.enum(["analista", "tecnico"], {
//     required_error: "Você deve selecionar um cargo",
//   }),
//   posicao: z.enum(["AI", "AII", "BI", "BII", "CI", "CII", "DI", "DII"], {
//     required_error: "Você deve informar a posição na carreira",
//   }),
//   tempoEstado: z.coerce.number().int().gte(0),
//   totalVantagens: z.coerce.number().gte(0),
// });

type EmployeeFormSchema = z.infer<typeof employeeFormSchema>;

export function EmployeeForm() {
  const form = useForm<EmployeeFormSchema>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      cargo: "analista",
      posicao: "AI",
      tempoEstado: 0,
      totalVantagens: 0,
      tabela: "01/2025",
    },
  });
  const { toast } = useToast();

  function handleEmployeeForm(data: EmployeeFormSchema) {
    toast({
      title: "Simulação de Reenquadramento",
      description: "Reenquadrado como...",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEmployeeForm)}>
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle>Simulação de Reenquadramento</CardTitle>
            <CardDescription>PGE-RS: PL 240/2024.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-2">
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
                          className="flex flex-col space-y-1"
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
              </div>

              <div className="flex flex-col space-y-2">
                <FormField
                  control={form.control}
                  name="posicao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Posição na Carreira</FormLabel>
                      <FormControl>
                        <Input placeholder="AI" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <FormField
                  control={form.control}
                  name="tempoEstado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo de Estado (em anos)</FormLabel>
                      <FormControl>
                        <Input placeholder="3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <FormField
                  control={form.control}
                  name="totalVantagens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor total das vantagens (em R$)</FormLabel>
                      <FormControl>
                        <Input placeholder="1500,31" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tabela"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Tabela de Reenquadramento</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="01/2025" />
                          </FormControl>
                          <FormLabel className="font-normal">01/2025</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="10/2025" />
                          </FormControl>
                          <FormLabel className="font-normal">10/2025</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="10/2026" />
                          </FormControl>
                          <FormLabel className="font-normal">10/2026</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button>Simular</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
