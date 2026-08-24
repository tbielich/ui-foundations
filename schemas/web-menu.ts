export interface MenuProps {
  role?: string;
  ariaLabel?: string;
}

export interface MenuItemProps {
  label: string;
  icon?: string;
  disabled?: boolean;
  selected?: boolean;
}
