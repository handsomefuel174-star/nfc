# TAPJR — Tarjetas NFC

Landing page minimalista de TAPJR, construida con [Lovable](https://lovable.dev/projects/14fa6d16-18a1-49f0-af22-9850d3f335e0) (TanStack Start + React + Tailwind + framer-motion + Lenis).

- **Servicios:** Tarjeta de Reseñas (caja / mostrador), Tarjeta para Menú y Tarjeta para Meseros.
- **Precios por volumen (guaraníes, por tipo de tarjeta):** 1–2 und 150.000 Gs · 3–6 und 125.000 Gs · 7–14 und 100.000 Gs · 15+ und 75.000 Gs. Configurador con slider por tipo.
- **Pedidos:** WhatsApp 0994 533 990 (`src/components/tapjr/whatsapp.ts`).
- **Animaciones:** tarjeta NFC 3D que sigue al ratón y gira con la rueda del ratón, parallax, cinta horizontal ligada al scroll, barra de progreso, scroll suave y animaciones de entrada. Respeta `prefers-reduced-motion`.

## Desarrollo

```sh
bun install   # o npm install
bun run dev
bun run test
```

Precios: `src/components/tapjr/pricing.ts` · Logo: `src/components/tapjr/logo.tsx` (logo original en `public/logo-original.png`).
