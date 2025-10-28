import { Event, EventProps } from '@domain/entities/Event';
import { PaginationOptions, PaginatedResult } from '@shared-types/Pagination';

export interface IEventRepository {
  create(name: string, description: string, place: string, start_at: Date, end_at: Date): Promise<Event>;
  list(): Promise<Event[]>;
  delete(id: string): Promise<void>;
  update(id: string, data: Partial<{ name: string; description: string; place: string; start_at: Date; end_at: Date; }>): Promise<Event>;
  findPaginated(options: PaginationOptions): Promise<PaginatedResult<EventProps>>;
}