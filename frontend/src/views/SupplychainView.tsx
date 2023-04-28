type SupplychainViewProps = {
  description: string;
};

const SupplychainView = ({ description }: SupplychainViewProps) => {
  console.log(description);

  return (
    <>
      <p>{description}</p>
    </>
  );
};

export default SupplychainView;
