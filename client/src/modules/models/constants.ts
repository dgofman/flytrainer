export interface Session {
    correlationId: number;
    token: string;
    id: number;
    firstname: string;
    lastname: string;
    role: Role;
}

export enum Role {
    USER = 'USER',
    INSTRUCTOR = 'INSTRUCTOR',
    MECHANIC = 'MECHANIC',
    ASSISTANT = 'ASSISTANT',
    MANAGER = 'MANAGER',
    ADMIN = 'ADMIN'
}

export const RoleLevel = [
    Role.USER,
    Role.INSTRUCTOR,
    Role.MECHANIC,
    Role.ASSISTANT,
    Role.MANAGER,
    Role.ADMIN
];
