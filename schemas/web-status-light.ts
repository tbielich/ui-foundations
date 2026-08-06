export interface StatusLightProps {
  className: string;
  text: string;
  variant?: "neutral" | "positive" | "negative" | "notice" | "info";
  size?: "md" | "sm";
}
