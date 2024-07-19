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

const employeeFormSchema = z.object({
  cargo: z.enum(["analista", "tecnico"], {
    required_error: "Você deve selecionar um cargo",
  }),
  posicao: z.enum(["AI", "AII", "BI", "BII", "CI", "CII", "DI", "DII"], {
    required_error: "Você deve informar a posição na carreira",
  }),
  tempoEstado: z.coerce.number().int().gte(0),
  totalVantagens: z.coerce.number().gte(0),
});

type EmployeeFormSchema = z.infer<typeof employeeFormSchema>;

export function EmployeeForm() {
  const form = useForm<EmployeeFormSchema>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      cargo: "analista",
      posicao: "AI",
      tempoEstado: 0,
      totalVantagens: 0,
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
