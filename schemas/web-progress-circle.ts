export interface ProgressCircleProps {
  className: string;
  ariaLabel?: string;
  indeterminate: boolean;
  size?: "sm" | "md" | "lg";
  value: number | string;
}
