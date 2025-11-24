import { Request, Response } from 'express';
// import { adoptionRequestRepositorySingleton, animalRepositorySingleton } from 'src/dependencies/singletons';
import { SequelizeAdoptionRequestRepository } from '@infra/sequelize/repositories/SequelizeAdoptionRequestRepository';
import { SequelizeAnimalRepository } from '@infra/sequelize/repositories/SequelizeAnimalRepository';

import { createAdoptionRequest } from '@usecases/AdoptionRequest/createAdoptionRequest';
import { listAdoptionRequests } from '@usecases/AdoptionRequest/listAdoptionRequests';
import { reviewAdoptionRequest } from '@usecases/AdoptionRequest/reviewAdoptionRequest';

const adoptionRequestRepo = new SequelizeAdoptionRequestRepository();
const animalRepo = new SequelizeAnimalRepository();

export class AdoptionRequestController {
  static async create(req: Request, res: Response):Promise<any> {
    try {
      const { responsibleName, contactPhone, animalId, termsAccepted } = req.body;

      // Validate required fields
      if (!responsibleName || !contactPhone || !animalId || termsAccepted !== true) {
        return res.status(400).json({
          error: 'Todos os campos são obrigatórios e os termos devem ser aceitos.'
        });
      }

      const adoptionRequest = await createAdoptionRequest(adoptionRequestRepo, animalRepo)
      ({
        responsibleName,
        contactPhone,
        animalId,
        termsAccepted
      });

      res.status(201).json({
        id: adoptionRequest.props.id,
        responsibleName: adoptionRequest.props.responsibleName,
        contactPhone: adoptionRequest.props.contactPhone,
        animalId: adoptionRequest.props.animalId,
        status: adoptionRequest.props.status,
        submittedAt: adoptionRequest.props.submittedAt,
        message: 'Pedido de adoção enviado com sucesso!'
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const { status, animalId, page, pageSize } = req.query;

      const result = await listAdoptionRequests(adoptionRequestRepo)({
        status: status as string | undefined,
        animalId: animalId as string | undefined,
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined,
      });

      const items = 'items' in result ? result.items : result;

      const formatted = items.map((item: any) => ({
        id: item.props?.id || item.id,
        responsibleName: item.props?.responsibleName || item.responsibleName,
        contactPhone: item.props?.contactPhone || item.contactPhone,
        animalId: item.props?.animalId || item.animalId,
        status: item.props?.status || item.status,
        submittedAt: item.props?.submittedAt || item.submittedAt,
        reviewedAt: item.props?.reviewedAt || item.reviewedAt,
        reviewedBy: item.props?.reviewedBy || item.reviewedBy,
        notes: item.props?.notes || item.notes,
        animal: item.props?.animal || item.animal,
      }));

      if ('items' in result) {
      res.json({
        items: formatted,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
        hasNext: result.hasNext,
        hasPrevious: result.hasPrevious,
      });
      } else {
        res.json(formatted);
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req: Request, res: Response):Promise<any> {
    try {
      const { id } = req.params;
      const adoptionRequest = await adoptionRequestRepo.findById(id);
      
      if (!adoptionRequest) {
        return res.status(404).json({ error: 'Pedido de adoção não encontrado.' });
      }

      res.json({
        id: adoptionRequest.props.id,
        responsibleName: adoptionRequest.props.responsibleName,
        contactPhone: adoptionRequest.props.contactPhone,
        animalId: adoptionRequest.props.animalId,
        status: adoptionRequest.props.status,
        submittedAt: adoptionRequest.props.submittedAt,
        reviewedAt: adoptionRequest.props.reviewedAt,
        reviewedBy: adoptionRequest.props.reviewedBy,
        notes: adoptionRequest.props.notes,
        animal: adoptionRequest.props.animal
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getByPetId(req: Request, res: Response):Promise<any> {
    try {
      
      // Paginação e ordenação
      const session = req.session;

      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 20;
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

      //const includeRelations = req.query.includeRelations === 'true';

      const pagination = {
        page,
        pageSize,
        sortBy, 
        sortOrder,
        filters,
      };
      
      const { petId } = req.params;
      const result = await adoptionRequestRepo.findByAnimalId(petId, pagination);

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async review(req: Request, res: Response):Promise<any> {
    try {
      const { id } = req.params;
      const { action, notes } = req.body;
      const reviewedBy = req.user?.id; // From auth middleware

      if (!reviewedBy) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
      }

      if (!action || !['approve', 'reject'].includes(action)) {
        return res.status(400).json({ error: 'Ação inválida. Use "approve" ou "reject".' });
      }

      const updatedRequest = await reviewAdoptionRequest(
        adoptionRequestRepo,
        animalRepo
      )({
        adoptionRequestId: id,
        action,
        reviewedBy,
        notes
      });

      res.json({
        id: updatedRequest.props.id,
        status: updatedRequest.props.status,
        reviewedAt: updatedRequest.props.reviewedAt,
        reviewedBy: updatedRequest.props.reviewedBy,
        notes: updatedRequest.props.notes,
        message: `Pedido de adoção ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso!`
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async delete(req: Request, res: Response):Promise<any> {
    try {
      const { id } = req.params;

      const deleted = await adoptionRequestRepo.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Pedido de adoção não encontrado.' });
      }

      res.json({ message: 'Pedido de adoção removido com sucesso!' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
} 