import { AdoptionRequest, AdoptionRequestProps } from '@domain/entities/AdoptionRequest';
import { PaginatedResult, PaginationOptions } from '@shared-types/Pagination';

export interface IAdoptionRequestRepository {
    create(adoptionRequest: AdoptionRequest): Promise<AdoptionRequest>;
    findById(id: string): Promise<AdoptionRequest | null>;
    findAll(): Promise<AdoptionRequest[]>;
    findByAnimalId(animalId: string, pagination: PaginationOptions): Promise<PaginatedResult<AdoptionRequestProps>>;
    findByStatus(status: string): Promise<AdoptionRequest[]>;
    update(id: string, adoptionRequest: AdoptionRequest): Promise<AdoptionRequest | null>;
    delete(id: string): Promise<boolean>;
} 