export default function Divider({ className }: { className?: string }) {
  return (
    <div className={`h-px bg-divider ${className ?? ""}`} />
  );
}
