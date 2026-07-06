interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <section className={`section-base ${className ?? ""}`}>
      {children}
    </section>
  );
}
