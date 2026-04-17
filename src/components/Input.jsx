export function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-2 w-full text-left">
      {label && (
        <label className="text-sm font-medium text-zinc-400 ml-1">
          {label}
        </label>
      )}
      <input
        className="
          bg-zinc-950/50 
          border border-zinc-800 
          rounded-lg py-3 px-4 
          text-zinc-100 
          outline-none
          
          placeholder-zinc-400 

          focus:border-amber-500/50 
          focus:ring-1 focus:ring-amber-500/50
          transition-all
        "
        {...props}
      />
    </div>
  );
}