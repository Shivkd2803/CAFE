export const CardSkeleton = () => (
  <div className="glass rounded-3xl overflow-hidden">
    <div className="skeleton h-52 rounded-none"/>
    <div className="p-5 space-y-3">
      <div className="skeleton h-5 w-2/3"/>
      <div className="skeleton h-3 w-full"/>
      <div className="skeleton h-3 w-5/6"/>
      <div className="skeleton h-8 w-1/3"/>
    </div>
  </div>
);