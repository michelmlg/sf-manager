import bcrypt from 'bcrypt';
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { User } from '@domain/entities/User';
import { UserModel } from '@infra/sequelize/models/User.model';
import { RoleModel } from '@infra/sequelize/models/Role.model';
import { PermissionModel } from '@infra/sequelize/models/Permission.model';

export class SequelizeUserRepository implements IUserRepository {

    async save(user: User): Promise<User> {
        const created = await UserModel.create(user.toPersistence());
        const plain = created.toJSON() as any;

        return new User({
            ...plain,
            role: plain.role?.name || undefined,
        });
    }

    async update(user: User): Promise<User> {
        const persistedUser = await UserModel.findByPk(user.props.id, {
            include: { model: RoleModel, as: 'role', attributes: ['name'] }
        });

        if (!persistedUser) {
            throw new Error(`Usuário com id ${user.props.id} não encontrado para atualização.`);
        }

        await persistedUser.update(user.toPersistence());

        const plain = persistedUser.toJSON() as any;
        return new User({
            ...plain,
            role: plain.role?.name || undefined,
        });
    }

    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findByPk(id, {
            include: { model: RoleModel, as: 'role', attributes: ['name'] }
        });

        if (!user) return null;

        const plain = user.toJSON() as any;
        return new User({
            ...plain,
            role: plain.role?.name || undefined,
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({
            where: { email },
            include: { model: RoleModel, as: 'role', attributes: ['name'] }
        });

        if (!user) return null;

        const plain = user.toJSON() as any;
        return new User({
            ...plain,
            role: plain.role?.name || undefined,
        });
    }

    async findByUsername(username: string): Promise<User | null> {
        const user = await UserModel.findOne({
            where: { username },
            include: { model: RoleModel, as: 'role', attributes: ['name'] }
        });

        if (!user) return null;

        const plain = user.toJSON() as any;
        return new User({
            ...plain,
            role: plain.role?.name || undefined,
        });
    }

    async findByName(name: string): Promise<User[]> {
        const users = await UserModel.findAll({
            where: { name },
            include: { model: RoleModel, as: 'role', attributes: ['name'] }
        });

        return users.map(u => {
            const plain = u.toJSON() as any;
            return new User({
                ...plain,
                role: plain.role?.name || undefined,
            });
        });
    }

    async list(): Promise<User[]> {
        const users = await UserModel.findAll({
            include: { model: RoleModel, as: 'role', attributes: ['name'] }
        });

        return users.map(u => {
            const plain = u.toJSON() as any;
            return new User({
                ...plain,
                role: plain.role?.name || undefined,
            });
        });
    }

    async getUserPermissions(userId: string): Promise<string[]> {
        const user = await UserModel.findByPk(userId, {
            include: {
                model: RoleModel,
                as: 'role',
                include: [{ model: PermissionModel, as: 'Permissions' }]
            }
        });

        if (!user) return [];

        const plain = user.toJSON() as any;

        if (!plain.role || !plain.role.Permissions) return [];

        return plain.role.Permissions.map((p: any) => p.name);
    }

    async getUserRoleWithPermissions(userId: string): Promise<{
        id: string;
        name: string;
        description?: string;
        permissions: {
            id: string;
            name: string;
            description?: string;
        }[];
    } | null> {
        const user = await UserModel.findByPk(userId, {
            include: {
                model: RoleModel,
                as: 'role',
                include: [{ model: PermissionModel, as: 'Permissions' }]
            }
        });

        if (!user) return null;

        const role = (user.toJSON() as any).role;

        if (!role) return null;

        return {
            id: role.id,
            name: role.name,
            description: role.description,
            permissions: role.Permissions?.map((perm: any) => ({
                id: perm.id,
                name: perm.name,
                description: perm.description
            })) || []
        };
    }

    async deleteById(id: string): Promise<void> {
        const deletedCount = await UserModel.destroy({ where: { id } });

        if (deletedCount === 0) {
            throw new Error(`Usuário com id ${id} não encontrado para exclusão.`);
        }
    }
}
