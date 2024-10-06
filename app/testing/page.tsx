import { CreateTables, InsertDummyData } from "@/lib/DBManager";

export default function Home() {
  CreateTables();
  InsertDummyData();

  return (
    <div>
        <h1>Creating new tables</h1>
    </div>
  );
}