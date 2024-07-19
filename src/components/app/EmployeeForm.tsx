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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EmployeeForm() {
  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Simulação de Reenquadramento</CardTitle>
        <CardDescription>PGE-RS: PL 240/2024.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Cargo</Label>
              <Select>
                <SelectTrigger id="cargo">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="analista">Analista</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Grau/Nível Atual</Label>
              <Select>
                <SelectTrigger id="carreira">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="AI">A-I</SelectItem>
                  <SelectItem value="AII">A-II</SelectItem>
                  <SelectItem value="BI">B-I</SelectItem>
                  <SelectItem value="BII">B-II</SelectItem>
                  <SelectItem value="CI">C-I</SelectItem>
                  <SelectItem value="CII">C-II</SelectItem>
                  <SelectItem value="DI">D-I</SelectItem>
                  <SelectItem value="DII">D-II</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button>Simular</Button>
      </CardFooter>
    </Card>
  );
}
