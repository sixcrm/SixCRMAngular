export interface Entity<T> {
  id: string;
  copy(): T;
}
