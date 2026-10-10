export const WHATSAPP_NUMBER = "595994533990";
export const WHATSAPP_DISPLAY = "0994 533 990";
export const INFO_MESSAGE = "Hola TAPJR! Quiero información sobre las tarjetas NFC.";
export function whatsappUrl(message: string) { return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`; }
export const infoUrl = whatsappUrl(INFO_MESSAGE);
