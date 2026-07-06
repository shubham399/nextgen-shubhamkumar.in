export default function Divider({ className }: { className?: string }) {
  return (
    <div className={`h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent ${className ?? ""}`} />
  );
}
