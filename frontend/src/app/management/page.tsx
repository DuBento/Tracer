import GetBatch from "@/components/batch/getBatch";
import NewBatch from "@/components/batch/newBatch";
import Transaction from "@/components/batch/transaction";
import UpdateBatch from "@/components/batch/updateBatch";

export const formSubmit = (
  e: React.FormEvent | React.MouseEvent,
  method: any,
) => {
  e.preventDefault();
  method();
};

const ManagementPage = () => {
  return (
    <main className="box-border flex h-screen w-full flex-col overflow-auto bg-bluegray-600 px-8 py-4  text-cyan-50">
      <div className="w-full flex-auto border-b-2 border-red-100 p-2">
        <NewBatch />
      </div>
      <div className="w-full flex-auto border-b-2 border-red-100 p-2">
        <GetBatch />
      </div>
      <div className="w-full flex-auto border-b-2 border-red-100 p-2">
        <UpdateBatch />
      </div>
      <div className="w-full flex-auto p-2">
        <Transaction />
      </div>
    </main>
  );
};

export default ManagementPage;
