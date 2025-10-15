import { IAnimalRepository } from '@domain/repositories/IAnimalRepository';
import { AnimalProps, Animal } from '@domain/entities/Animal';

type CreateAnimalInput = Omit<AnimalProps, 'id'> & { id?: string };

export function createAnimal(animalRepository: IAnimalRepository) {
  return async (data: CreateAnimalInput): Promise<AnimalProps> => {

    const requiredFields: (keyof CreateAnimalInput)[] = [
      'name',
      'speciesId',
      'breedId',
      'gender',
      'size',
      'status',
      'entryDate',
    ];

    const missingFields = requiredFields.filter(field => 
      data[field] === null || data[field] === undefined || data[field] === ''
    );

    if (missingFields.length > 0) {
      throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}.`);
    }

    const animalData = {
      ...data,
      id: data.id || undefined, // undefined deixa o repositório gerar se quiser
    };

    const animal = await animalRepository.create(animalData);

    return animal.props;
  };
}