// models/PrestamoModel.js

export const PrestamoModel = {
    id: null,
    monto: 0,
    interes: 0,
    interesMoratorio: 0,
    fechaCreacion: null,
    fechaVencimiento: null,
    estado: "PENDIENTE",
    clienteId: null,
    deudaRestante: 0,
    pagos: []
};
