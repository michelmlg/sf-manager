import { IEventRepository } from '@domain/repositories/IEventRepository';
import { PaginationOptions } from '@types/Pagination';

export function listEvents(eventRepository: IEventRepository) {
  return async (pagination: PaginationOptions) => {

    const paginationCopy: PaginationOptions = {
      ...pagination,
      filters: {
        ...(pagination.filters || {}),
        fieldFilters: {
          ...(pagination.filters?.fieldFilters || {}),
        },
      },
    };

    return await eventRepository.findPaginated(paginationCopy);
  };
}
