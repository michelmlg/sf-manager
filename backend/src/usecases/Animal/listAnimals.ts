import { IAnimalRepository } from '@domain/repositories/IAnimalRepository';
import { PaginationOptions } from '@types/Pagination';
import { authServiceSingleton } from '@dependencies/singletons';

export function listAnimals(
  animalRepo: IAnimalRepository,
  session?: { token?: string }
) {
  return async (pagination: PaginationOptions) => {
    // Garante que a estrutura de filtros exista
    const paginationCopy: PaginationOptions = {
      ...pagination,
      filters: {
        ...(pagination.filters || {}),
        fieldFilters: {
          ...(pagination.filters?.fieldFilters || {}),
        },
      },
    };

    let onlyAvailable = true; // público por padrão

    // Se o token existir, valida
    if (session?.token) {
      try {
        authServiceSingleton.verifyToken(session.token);
        // Token válido → usuário logado
        onlyAvailable = false;
      } catch (error) {
        console.error('Erro ao validar token:', error);
        throw new Error('Token inválido ou expirado');
      }
    }

    // Aplica filtro de disponibilidade apenas se o usuário for público
    if (onlyAvailable) {
      paginationCopy.filters.fieldFilters.status = 'Disponível';
    }

    return await animalRepo.findPaginated(paginationCopy);
  };
}
