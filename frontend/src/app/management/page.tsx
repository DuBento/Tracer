import GetBatch from "@/components/batch/getBatch";
import NewBatch from "@/components/batch/newBatch";
import Transaction from "@/components/batch/transaction";
import UpdateBatch from "@/components/batch/updateBatch";

export const formSubmit = (
  e: React.FormEvent | React.MouseEvent,
  method: any
) => {
  e.preventDefault();
  method();
};

const ManagementPage = () => {
  return (
    <main className="flex flex-col box-border py-4 px-8 h-screen w-full overflow-auto text-cyan-50  bg-bluegray-600">
      <div
        className="flex-auto w-full p-2
                  border-b-2 border-red-100"
      >
        <NewBatch />
      </div>
      <div
        className="flex-auto w-full p-2
                  border-b-2 border-red-100"
      >
        <GetBatch />
      </div>
      <div
        className="flex-auto w-full p-2
                  border-b-2 border-red-100"
      >
        <UpdateBatch />
      </div>
      <div className="flex-auto w-full p-2">
        <Transaction />
      </div>
    </main>
  );
};

export default ManagementPage;
