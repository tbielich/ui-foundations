export interface ButtonProps {
  variant?: "solid" | "outline" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";
  label?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  iconOnly?: boolean;
  ariaLabel?: string;
  children?: React.ReactNode;
}
