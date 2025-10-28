import { IEventRepository } from "@domain/repositories/IEventRepository";
import { Event, EventProps } from "@domain/entities/Event";
import { EventModel } from "@infra/sequelize/models/Event.model";
import { PaginationOptions, PaginatedResult } from "@shared-types/Pagination";
import { findPaginated } from "@infra/sequelize/utils/findPaginated";

export class SequelizeEventRepository implements IEventRepository {

  private mapToEntity(model: EventModel): Event {
    const json = model.toJSON();
    return new Event(json);
  }

  async create(name: string, description: string, place: string, start_at: Date, end_at: Date): Promise<Event> {
    const p = await EventModel.create({ name, description, place, start_at, end_at });
    return new Event(p.toJSON());
  }

  async list(): Promise<Event[]> {
    const all = await EventModel.findAll();
    return all.map(p => new Event(p.toJSON()));
  }

  async findPaginated(options: PaginationOptions): Promise<PaginatedResult<EventProps>> {
    const result = await findPaginated(EventModel, {
      page: options.page,
      pageSize: options.pageSize,
      filters: {
        ...options.filters,
      },
    });

    return {
      ...result,
      items: result.items.map(a => this.mapToEntity(a).props),
    };
  }

  async delete(id: string): Promise<void> {
    await EventModel.destroy({ where: { id: id } });
  }

  async update(id: string, data: Partial<{ name: string; description: string; place: string; start_at: Date; end_at: Date; }>): Promise<Event> {
    const instance = await EventModel.findByPk(id);
    if (!instance) {
      throw new Error('Evento não encontrado');
    }
    await instance.update(data as any);
    return new Event(instance.toJSON());
  }
}