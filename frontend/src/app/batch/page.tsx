import GetBatch from "@/components/batch/getBatch";
import NewBatch from "@/components/batch/newBatch";
import UpdateBatch from "@/components/batch/updateBatch";

const BatchPage = () => {
  return (
    <main>
      <NewBatch />
      <GetBatch />
      <UpdateBatch />
    </main>
  );
};

export default BatchPage;
