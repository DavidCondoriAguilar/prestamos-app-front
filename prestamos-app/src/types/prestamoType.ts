// Interfaz para tipar los datos de un préstamo completo
export interface Prestamo {
    id?: number; // Opcional porque se genera en el backend
    clienteId: number;
    monto: number;
    interes: number;
    fechaSolicitud: string;
    estado: string; // APROBADO, PENDIENTE, etc.
  }

  // Tipo personalizado para crear un préstamo
  export interface CrearPrestamo {
    clienteId: number;
    monto: number;
    interes: number;
    fechaVencimiento: string; // Requerido
    estado: string; // Requerido
  }