"use client";
import { EmployeeForm } from "@/components/app/EmployeeForm";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const simulationTables = searchParams.get("q") || "last";
  console.log(simulationTables);

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <EmployeeForm simulationTables={simulationTables}></EmployeeForm>
    </main>
  );
}
