export interface BreadcrumbsItem {
  label: string;
  url?: string;
  current?: boolean;
}

export interface BreadcrumbsProps {
  className: string;
  separator: string;
  collapse: string;
  maxItems: string;
}
