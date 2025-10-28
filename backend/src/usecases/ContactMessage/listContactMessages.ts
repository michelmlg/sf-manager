import { IContactMessageRepository, ContactMessageFilters } from '@domain/repositories/IContactMessageRepository';
import { PaginationOptions } from '@shared-types/Pagination';

export function listContactMessages(contactRepo: IContactMessageRepository) {
  return async (options: PaginationOptions, filters?: ContactMessageFilters) => {
    return await contactRepo.list(options, filters);
  };
}


