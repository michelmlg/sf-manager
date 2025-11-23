import { IRoleRepository } from '@domain/repositories/IRoleRepository';

export function updateRole(roleRepository: IRoleRepository) {
  return async (
    roleId: string,
    name: string,
    description: string,
    permissionIds: string[]
  ) => {
    const existingRole = await roleRepository.findById(roleId);
    if (!existingRole) {
      throw new Error('Cargo não encontrado');
    }

    const allRoles = await roleRepository.list();
    const isDuplicate = allRoles.some(
      (r: any) => r.props.name === name && r.props.id !== roleId
    );
    
    if (isDuplicate) {
      throw new Error('Já existe um cargo com esse nome');
    }

    const updatedRole = await roleRepository.update(
      roleId,
      name,
      description,
      Array.isArray(permissionIds)
        ? permissionIds
        : (existingRole.props.permissions || []).map(p => p.id)
    );

    return updatedRole;
  };
}
