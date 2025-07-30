export interface Cuenta {
    id?: number;
    clienteId: number;
    numeroCuenta: string;
    saldo: number;
    fechaCreacion?: string;
    tipoCuenta: string;
    estado?: boolean;
    // Agrega más campos según sea necesario
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}