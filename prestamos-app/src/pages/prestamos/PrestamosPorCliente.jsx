import React, { useEffect, useState } from "react";
import { obtenerPrestamosPorCliente } from "../../api/prestamoApi";

const PrestamosPorCliente = ({ clienteId }) => {
    const [prestamos, setPrestamos] = useState([]);

    useEffect(() => {
        const fetchPrestamos = async () => {
            const data = await obtenerPrestamosPorCliente(clienteId);
            setPrestamos(data);
        };
        fetchPrestamos();
    }, [clienteId]);

    return (
        <div>
            <h2>Préstamos del Cliente {clienteId}</h2>
            <ul>
                {prestamos.map((prestamo) => (
                    <li key={prestamo.id}>
                        ID: {prestamo.id}, Monto: {prestamo.monto}, Estado: {prestamo.estado}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PrestamosPorCliente;