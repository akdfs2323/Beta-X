export declare enum Role {
    USER = "user",
    ADMIN = "admin"
}
export declare class User {
    id: string;
    username: string;
    passwordHash: string;
    role: Role;
}
