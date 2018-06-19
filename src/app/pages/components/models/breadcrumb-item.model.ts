export interface BreadcrumbItem {
  label: (any) => string;
  url?: string
  noTranslate?: boolean;
}
