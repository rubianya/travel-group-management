export interface UserResponseDTO {
    id: number;
    fullName: string;
    email: string;
    role: string;
    status: string;
    phone: number;
}

export interface UserRequestDTO {
    fullName: string;
    email: string;
    password: string;
    role: string;
    status: string;
    phone: number;
}
