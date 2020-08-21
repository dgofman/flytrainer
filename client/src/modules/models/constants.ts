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
    ASSISTANT = 'ASSISTANT',
    MANAGER = 'MANAGER',
    ADMIN = 'ADMIN'
}

export const RoleType = [
    Role.USER,
    Role.ASSISTANT,
    Role.MANAGER,
    Role.ADMIN
];

export enum AccountType {
    STUDENT = 'STUDENT',
    PILOT = 'PILOT',
    INSTRUCTOR = 'INSTRUCTOR',
    MECHANIC = 'MECHANIC',
    INSPECTOR = 'INSPECTOR'
}
