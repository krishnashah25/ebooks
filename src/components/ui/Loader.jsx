export default function Loader({ size = "md", text = "" }) {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-9 w-9 border-2",
    lg: "h-14 w-14 border-3",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-amber-400 border-t-transparent animate-spin`}
      />
      {text && <p className="text-sm text-gray-400">{text}</p>}
    </div>
  );
}
