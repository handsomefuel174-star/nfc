import { describe, expect, it } from "vitest";
import { plans, formatCOP } from "./pricing";
describe("TAPJR Colombian peso offers", () => {
  it("one card costs 150000 COP", () => { expect(plans[0].price).toBe(150000); });
  it("two cards are reduced from 300000 to 250000 COP", () => { expect(plans[1].original).toBe(300000); expect(plans[1].price).toBe(250000); expect(plans[1].price).toBeLessThan(plans[0].price * 2); });
  it("three-plus pack is reduced from 450000 to 350000 COP", () => { expect(plans[2].original).toBe(450000); expect(plans[2].price).toBe(350000); });
  it("formats Colombian pesos with dot separators", () => { expect(formatCOP(150000)).toBe("$150.000"); expect(formatCOP(250000)).toBe("$250.000"); expect(formatCOP(350000)).toBe("$350.000"); });
});
