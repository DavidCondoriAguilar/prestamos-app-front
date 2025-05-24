/**
 * Formatea un número como moneda en Soles Peruanos (PEN)
 * @param {number} amount - La cantidad a formatear
 * @param {boolean} includeSymbol - Si se debe incluir el símbolo de la moneda
 * @returns {string} La cantidad formateada como moneda
 */
const formatCurrency = (amount, includeSymbol = true) => {
  // Verificar si el valor es numérico
  if (isNaN(amount)) {
    return includeSymbol ? 'S/ 0.00' : '0.00';
  }

  // Formatear el número con separadores de miles y decimales
  const formatter = new Intl.NumberFormat('es-PE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const formattedAmount = formatter.format(amount);
  
  return includeSymbol ? `S/ ${formattedAmount}` : formattedAmount;
};

export default formatCurrency;
