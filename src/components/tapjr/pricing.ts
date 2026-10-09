export const plans = [
  { name: "Una gran conexión", quantity: "1 tarjeta", price: 150000, original: null, tag: null, description: "El primer paso para conectar mejor.", features: ["1 tarjeta NFC personalizada", "Configuración de tu enlace", "Diseño con tu marca"] },
  { name: "El doble de posibilidades", quantity: "Pack 2 tarjetas", price: 250000, original: 300000, tag: "Más popular", description: "Dos puntos de contacto. Más oportunidades.", features: ["2 tarjetas NFC personalizadas", "Enlaces iguales o diferentes", "Diseño con tu marca"] },
  { name: "Tu negocio, conectado", quantity: "Pack 3+ tarjetas", price: 350000, original: 450000, tag: "Ideal para negocios", description: "Una conexión en cada rincón de tu negocio.", features: ["Pack de 3 tarjetas NFC", "Configuración de cada tarjeta", "Consulta por unidades adicionales"] },
] as const;
export function formatCOP(value: number) { return `$${new Intl.NumberFormat("es-CO").format(value)}`; }
