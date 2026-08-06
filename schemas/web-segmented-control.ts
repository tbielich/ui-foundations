export interface SegmentedControlProps {
  ariaLabel: string;
  size: "md" | "sm" | "lg";
}

export interface SegmentedControlItemProps {
  label: string;
  value: string;
  selected: boolean;
  disabled: boolean;
  icon: string;
}
