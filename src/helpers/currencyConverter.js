import axios from 'axios';

const API_KEY = process.env.EXCHANGE_API_KEY;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;


/**
 * Convierte un monto de una moneda a otra
 * @param {number} amount - Monto original
 * @param {string} fromCurrency - Moneda original (ej: 'GTQ')
 * @param {string} toCurrency - Moneda destino (ej: 'USD')
 * @returns {number} Monto convertido
 */
export const convertBalance = async (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return amount;

  try {
    const response = await axios.get(`${BASE_URL}${fromCurrency}`);
    const rate = response.data.conversion_rates[toCurrency];

    if (!rate) {
      throw new Error(`La moneda ${toCurrency} no está soportada`);
    }

    const converted = amount * rate;
    
    return parseFloat(converted.toFixed(2));

  } catch (error) {
    throw new Error('No se pudo convertir el saldo');
  }
};
