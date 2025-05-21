// src/types/clienteTypes.ts

// Interfaz para tipar los datos de un cliente completo
export interface Cliente {
    id?: number;
    nombre: string;
    correo: string;
    cuenta: {
      numeroCuenta: string;
      saldo: number;
    };
  }

  // Tipo personalizado para crear un cliente
  export interface CrearCliente {
    nombre: string;
    correo: string;
    cuenta: {
      numeroCuenta: string;
      saldo: number;
    };
  }

  // Tipo personalizado para actualizar un cliente
  export interface ActualizarCliente {
    nombre?: string;
    correo?: string;
    cuenta?: {
      numeroCuenta?: string;
      saldo?: number;
    };
  }
