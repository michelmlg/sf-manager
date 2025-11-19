import { IAdoptionRequestRepository } from '@domain/repositories/IAdoptionRequestRepository';
import { AdoptionRequest, AdoptionRequestProps } from '@domain/entities/AdoptionRequest';
import { PaginatedResult } from '@shared-types/Pagination';

interface ListAdoptionRequestsFilters {
  status?: string;
  animalId?: string;
  page?: number;
  pageSize?: number;
}

export const listAdoptionRequests =
  (adoptionRequestRepository: IAdoptionRequestRepository) =>
  async (
    filters?: ListAdoptionRequestsFilters
  ): Promise<AdoptionRequest[] | PaginatedResult<AdoptionRequestProps>> => {
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 20;

    const defaultPagination = { page, pageSize };

    // 1. Filtrar por status (com paginação)
    if (filters?.status) {
      return await adoptionRequestRepository.findByStatus(filters.status);
    }

    // 2. Filtrar por animalId (com paginação)
    if (filters?.animalId) {
      return await adoptionRequestRepository.findByAnimalId(filters.animalId, defaultPagination);
    }

    // 3. Listar todos (com paginação padrão)
    return await adoptionRequestRepository.findAll();
  };