export default function LoadingEvent() {
  return (
    <div
      role="status"
      className="flex flex-col px-4 py-8 gap-4 card animate-pulse ">
      {[...Array(5)].map((x, i) => (
        <div
          className="flex items-center justify-between border-b pb-4"
          key={x}>
          <div>
            <div className="h-2.5 bg-gray-300 rounded-full  w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full "></div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full  w-12"></div>
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
