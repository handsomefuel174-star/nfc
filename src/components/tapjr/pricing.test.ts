import { describe, expect, it } from "vitest";
import { unitPrice, total, formatGs, nextTier } from "./pricing";
describe("TAPJR guaraní volume pricing", () => {
  it.each([[1, 150000], [2, 150000], [3, 125000], [6, 125000], [7, 100000], [14, 100000], [15, 75000], [30, 75000]])("unitPrice(%i) = %i", (q, p) => { expect(unitPrice(q)).toBe(p); });
  it("total(3) = 375000", () => { expect(total(3)).toBe(375000); });
  it("total(15) = 1125000", () => { expect(total(15)).toBe(1125000); });
  it("next tier from 5 needs 2 more for 100000", () => { expect(nextTier(5)).toEqual({ missing: 2, price: 100000 }); expect(nextTier(15)).toBeNull(); });
  it("formats guaraníes with dots and Gs suffix", () => { expect(formatGs(150000)).toBe("150.000 Gs"); expect(formatGs(1125000)).toBe("1.125.000 Gs"); });
});
