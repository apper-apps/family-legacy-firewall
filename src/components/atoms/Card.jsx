import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  children, 
  className,
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white border border-gray-200 shadow-lg hover:shadow-xl",
    gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg hover:shadow-xl",
    elevated: "bg-white shadow-xl hover:shadow-2xl border-0"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl transition-all duration-200 hover:scale-[1.01]",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;