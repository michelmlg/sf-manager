import { IAnimalVaccineRepository } from '@domain/repositories/IAnimalVaccineRepository';
import { PaginationOptions } from '@shared-types/Pagination';

export function listAnimalVaccines(repo: IAnimalVaccineRepository) {
  return async (petId: String, options?: PaginationOptions) => {
    return await repo.findAll(petId, options);
  };
}
