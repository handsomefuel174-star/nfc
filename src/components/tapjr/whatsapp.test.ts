import { describe, expect, it } from "vitest";
import { whatsappUrl, infoUrl } from "./whatsapp";
describe("WhatsApp links", () => {
  it("uses the Paraguay number with an encoded message", () => {
    expect(whatsappUrl("Hola TAPJR! 7 und")).toBe("https://wa.me/595994533990?text=Hola%20TAPJR!%207%20und");
  });
  it("info link encodes the info message", () => {
    expect(infoUrl).toBe("https://wa.me/595994533990?text=Hola%20TAPJR!%20Quiero%20informaci%C3%B3n%20sobre%20las%20tarjetas%20NFC.");
  });
});
