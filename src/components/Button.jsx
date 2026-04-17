import { Loader2 } from "lucide-react";

export function Button({ children, variant = 'primary', className, isLoading, ...props }) {
  const baseStyle = "w-full font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-500/50";
  
  const variants = {
    primary: "bg-amber-600 hover:bg-amber-700 text-zinc-50 shadow-lg shadow-amber-900/20",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 hover:border-zinc-600",
    danger: "bg-red-600 hover:bg-red-700 text-zinc-50 shadow-lg shadow-red-900/20",
    ghost: "bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className || ""}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}