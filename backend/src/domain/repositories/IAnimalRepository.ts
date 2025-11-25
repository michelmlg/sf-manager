import { AnimalProps, Animal } from '@domain/entities/Animal';
import { PaginationOptions, PaginatedResult } from '@shared-types/Pagination';

export interface IAnimalRepository {
  findById(id: string): Promise<AnimalProps | null>;
  searchByName(name: string, pagination?: PaginationOptions): Promise<PaginatedResult<Animal>>;
  create(data: Omit<AnimalProps, 'id'>): Promise<Animal>;
  update(id: string, data: Partial<Omit<AnimalProps, 'id'>>): Promise<AnimalProps | null>;
  delete(id: string): Promise<boolean>;
  markAsAdopted(id: string): Promise<boolean>;
  findPaginated(pagination: PaginationOptions): Promise<PaginatedResult<Animal>>;
  countAnimalsByStatus(status: string): Promise<number>;
}