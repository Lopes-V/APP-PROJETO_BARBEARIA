export function Card({ children, title, className, ...props }) {
  return (
    <div 
      className={`
        bg-zinc-900/40 backdrop-blur-sm 
        border border-zinc-800/50 
        p-8 rounded-2xl w-full 
        shadow-2xl shadow-black/50
        transition-all duration-300
        ${className || ""}
      `}
      {...props}
    >
      {title && (
        <div className="mb-8 relative">
          <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">
            {title}
          </h2>
          <div className="absolute -bottom-3 left-0 w-12 h-1 bg-amber-500 rounded-full" />
        </div>
      )}

      <div className="text-zinc-300">
        {children}
      </div>
    </div>
  );
}