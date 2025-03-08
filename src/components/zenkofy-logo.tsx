import { BookOpen } from "lucide-react";

export default function ZenkofyLogo({
  size = "default",
}: {
  size?: "small" | "default" | "large";
}) {
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-6 w-6",
    large: "h-8 w-8",
  };

  const textClasses = {
    small: "text-base",
    default: "text-xl",
    large: "text-2xl",
  };

  return (
    <div className="flex items-center gap-2">
      <BookOpen className={`${sizeClasses[size]} text-blue-600`} />
      <span className={`font-bold ${textClasses[size]}`}>Zenkofy</span>
    </div>
  );
}
