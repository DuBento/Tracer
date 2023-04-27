type SupplychainViewProps = {
  value: object;
};

const SupplychainView = ({ value }: SupplychainViewProps) => {
  console.log(value.description);

  return (
    <>
      <p>{value.description.toString()}</p>
    </>
  );
};

export default SupplychainView;
