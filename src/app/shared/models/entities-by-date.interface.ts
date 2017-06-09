export interface EntitiesByDate<T> {
  label: string;
  entities: T[];
  contains: (e: T) => boolean;
}
