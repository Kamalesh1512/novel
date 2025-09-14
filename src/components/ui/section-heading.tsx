// components/ui/section-heading.tsx
interface SectionHeadingProps {
  title: string;
  description?: string;
  fontStyle?: string;
  align?: "center" | "left" | "right";
  size?: "sm" | "md" | "lg";
  className?: string;
  letterSpacing?: string;
}

export const SectionHeading = ({
  title,
  description,
  fontStyle = "font-sans",
  align = "center",
  size = "md",
  className = "",
  letterSpacing = "",
}: SectionHeadingProps) => {
  const alignment = {
    center: "text-center",
    left: "text-left",
    right: "text-right",
  }[align];

  const headingSize = {
    sm: "text-xs lg:text-2xl",
    md: "text-xl lg:text-3xl",
    lg: "text-3xl lg:text-4xl",
  }[size];

  return (
    <div className={`${alignment} my-8 ${className}`}>
      <h2
        className={`${headingSize} font-bold text-green-700 mb-2 ${fontStyle}`}
        style={{ letterSpacing: letterSpacing }}
      >
        {title}
      </h2>
      {description && (
        <p className="text-[9px] md:text-lg text-gray-700 max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
};
