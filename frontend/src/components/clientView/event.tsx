type Props = {
  description: string;
  date: string;
  hour: string;
  files: string[];
};

export default function Event(props: Props) {
  return (
    <>
      <div className="flex-start flex items-start justify-between gap-5 align-top">
        <div className="z-10 -ml-[5px] flex-none">
          <LogBulletPointSmall className="bg-sage" h-32 w-full />
        </div>
        <h4 className="-mt-1 flex-grow text-sm leading-tight ">
          {props.description} with regard to the following files:
        </h4>
        <div className="flex-none text-xs font-thin leading-tight">
          {props.date} · {props.hour}
        </div>
      </div>

      {/* Preview scroll */}
      <div className="ml-6 mt-3">
        <div className="relative flex w-full snap-x gap-2 overflow-x-auto pb-4">
          <div className="shrink-0 snap-center">
            <img
              className=" h-32 w-full shrink-0 rounded-lg shadow-md"
              src="https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=320&amp;h=160&amp;q=80"
            />
          </div>
          <div className="shrink-0 snap-center">
            <img
              className=" h-32 w-full shrink-0 rounded-lg shadow-md"
              src="https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=320&amp;h=160&amp;q=80"
            />
          </div>
          <div className="shrink-0 snap-center">
            <img
              className=" h-32 w-full shrink-0 rounded-lg shadow-md"
              src="https://images.unsplash.com/photo-1622890806166-111d7f6c7c97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80"
            />
          </div>{" "}
          <div className="shrink-0 snap-center">
            <img
              className=" h-32 w-full shrink-0 rounded-lg shadow-md"
              src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80"
            />
          </div>{" "}
          <div className="shrink-0 snap-center">
            <img
              className=" h-32 w-full shrink-0 rounded-lg shadow-md"
              src="https://images.unsplash.com/photo-1575424909138-46b05e5919ec?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80"
            />
          </div>{" "}
          <div className="shrink-0 snap-center">
            <img
              className=" h-32 w-full shrink-0 rounded-lg shadow-md"
              src="https://images.unsplash.com/photo-1559333086-b0a56225a93c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80"
            />
          </div>
        </div>
      </div>
    </>
  );
}

const LogBulletPointSmall = (props: { className: string }) => (
  <div className={`${props.className} h-2 w-2 rounded-full`}></div>
);
