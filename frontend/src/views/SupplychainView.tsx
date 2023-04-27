type SupplychainViewProps = {
  value: object;
};

const SupplychainView = ({ value }: SupplychainViewProps) => {
  console.log(value);

  return (
    <>
      <p>{value.toString()}</p>
    </>
  );
};

export default SupplychainView;
