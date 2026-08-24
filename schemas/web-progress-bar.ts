export interface ProgressBarProps {
  value?: number;
  variant?: "default" | "positive" | "negative";
  size?: "sm" | "md" | "lg";
  label?: string;
  showValue?: boolean;
  indeterminate?: boolean;
}
