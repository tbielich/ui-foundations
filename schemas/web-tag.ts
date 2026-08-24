export interface TagProps {
  className: string;
  text: string;
  size?: "md" | "sm";
  removable?: boolean;
  removeLabel?: string;
  selected?: boolean;
  startIcon?: string;
}

export interface TagGroupProps {
  className: string;
}
