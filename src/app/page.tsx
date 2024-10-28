import { EmployeeForm } from "@/components/app/EmployeeForm";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const simulationTables = (searchParams.q as string) || "last";
  console.log(simulationTables);

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <EmployeeForm simulationTables={simulationTables}></EmployeeForm>
    </main>
  );
}
