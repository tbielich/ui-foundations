export interface BreadcrumbsItem {
  label: string;
  url?: string;
  current?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbsItem[];
  className?: string;
  separator?: string;
  collapse?: "responsive" | "always" | "none";
  maxItems?: number;
  ariaLabel?: string;
}
