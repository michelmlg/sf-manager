import { Request, Response } from 'express';

import { createEvent } from '@usecases/Event/createEvent';
import { listEvents } from '@usecases/Event/listEvents';
import { deleteEvent } from '@usecases/Event/deleteEvent';
import { updateEvent } from '@usecases/Event/updateEvent';
import { SequelizeEventRepository } from '@infra/sequelize/repositories/SequelizeEventRepository';

const eventRepository = new SequelizeEventRepository();

export class EventController {
  static async create(req: Request, res: Response):Promise<any> {
    try {
      const { name, description, place, start_at, end_at } = req.body;

      const requiredFields = { name, start_at, end_at };

      for (const [field, value] of Object.entries(requiredFields)) {
        if (!value) {
          res.status(400).json({ message: `Campo obrigatório: ${field}` });
          return;
        }
      }

      // Parse datetime-local strings into Date
      const startDate = new Date(start_at);
      const endDate = new Date(end_at);

      const event = await createEvent(eventRepository)(name, description, place, startDate, endDate);
      res.status(201).json(event);

    } catch (err: any) {
      console.error(err);
      res.status(400).json({ message: err.message });
    } finally {
      return;
    }
  }

  static async list(req: Request, res: Response):Promise<any> {

    const session = req.session;

    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;
    const sortBy = (req.query.sortBy as string) || 'entry_date';
    const sortOrder =
      (req.query.sortOrder as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc' as 'asc' | 'desc';

    // Filtros (JSON string)
    let filters: Record<string, any> = {};
    if (req.query.filters && typeof req.query.filters === 'string') {
      try {
        filters = JSON.parse(req.query.filters);
      } catch {
        return res.status(400).json({ error: 'Invalid filters JSON format' });
      }
    }

    const pagination = {
      page,
      pageSize,
      sortBy, 
      sortOrder,
      filters,
    };


    try {
      const events = await listEvents(eventRepository)(pagination);
      res.json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao buscar eventos' });
    } finally {
      return;
    }
  }

  static async delete(req: Request, res: Response):Promise<any> {
    try {
      const { id } = req.body;

      if (!id) {
        res.status(400).json({ message: 'ID do evento é obrigatório' });
        return;
      }

      await deleteEvent(eventRepository)(id);
      res.status(200).json({ message: 'Evento deletada com sucesso' });

    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }finally{
      return;
    }
  }

  static async update(req: Request, res: Response):Promise<any> {
    try {
      const { id } = req.params;
      const { name, description, place, start_at, end_at } = req.body;

      const data: any = {};
      if (name !== undefined) data.name = name;
      if (description !== undefined) data.description = description;
      if (place !== undefined) data.place = place;
      if (start_at !== undefined) data.start_at = new Date(start_at);
      if (end_at !== undefined) data.end_at = new Date(end_at);

      const updated = await updateEvent(eventRepository)(id, data);
      res.status(200).json(updated);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    } finally {
      return;
    }
  }
}
