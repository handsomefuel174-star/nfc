import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MessageCircle, Minus, Plus } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Reveal } from "./motion";
import reviewCard from "@/assets/tarjeta-resenas.png";
import menuCard from "@/assets/tarjeta-menu.png";
import { MAX_QTY, tiers, tierIndex, unitPrice, total, savings, nextTier, formatGs } from "./pricing";
import { whatsappUrl } from "./whatsapp";

const products = [
  { id: "reviews", name: "Tarjeta de Reseñas", plural: "Tarjetas de Reseñas", place: "Para la caja", image: reviewCard, initial: 1 },
  { id: "menu", name: "Tarjeta para Menú", plural: "Tarjetas para Menú", place: "Para las mesas", image: menuCard, initial: 0 },
  { id: "waiters", name: "Tarjeta para Meseros", plural: "Tarjetas para Meseros", place: "Para cada mesero", image: reviewCard, initial: 0 },
] as const;
type Product = typeof products[number];

const label = (p: Product, q: number) => `${q} ${q === 1 ? p.name : p.plural}`;
const line = (p: Product, q: number) => `${label(p, q)} (${formatGs(unitPrice(q))}/und, total ${formatGs(total(q))})`;
const marks = tiers.map(t => t.from);

export function VolumeConfigurator() {
  const [qty, setQty] = useState<Record<string, number>>(() => Object.fromEntries(products.map(p => [p.id, p.initial])));
  const set = (id: string, v: number) => setQty(s => ({ ...s, [id]: Math.max(0, Math.min(MAX_QTY, v)) }));
  const selected = products.filter(p => (qty[p.id] ?? 0) > 0);
  const grand = selected.reduce((s, p) => s + total(qty[p.id] ?? 0), 0);
  const allMsg = `Hola TAPJR! Quiero hacer este pedido:\n${selected.map(p => `- ${line(p, qty[p.id] ?? 0)}`).join("\n")}\nTotal general: ${formatGs(grand)}.`;
  return <div className="configurator">
    <Reveal className="tier-scale">{tiers.map((t, i) => <div key={t.from} className="tier"><span>{t.to ? `${t.from}–${t.to} und` : `${t.from}+ und`}</span><strong>{formatGs(t.price)}</strong><small>{i === 0 ? "por unidad" : `−${Math.round((1 - t.price / tiers[0].price) * 100)}%`}</small></div>)}</Reveal>
    <div className="config-rows">{products.map((p, i) => <Reveal key={p.id} delay={i * .08}><Row product={p} qty={qty[p.id] ?? 0} onChange={v => set(p.id, v)} /></Reveal>)}</div>
    <Reveal className="config-summary">
      <div><span className="eyebrow">TU PEDIDO</span><ul>{selected.length ? selected.map(p => <li key={p.id}>{label(p, qty[p.id] ?? 0)} <span>{formatGs(total(qty[p.id] ?? 0))}</span></li>) : <li>Elige al menos una tarjeta.</li>}</ul></div>
      <div className="summary-total"><small>Total general</small><strong>{formatGs(grand)}</strong>
        {selected.length ? <Button asChild className="tap-button"><a href={whatsappUrl(allMsg)} target="_blank" rel="noopener noreferrer"><MessageCircle />Pedir todo por WhatsApp<ArrowUpRight /></a></Button> : <Button className="tap-button" disabled><MessageCircle />Pedir todo por WhatsApp</Button>}
      </div>
    </Reveal>
  </div>;
}

function Row({ product: p, qty, onChange }: { product: Product; qty: number; onChange: (v: number) => void }) {
  const reduced = useReducedMotion();
  const tier = tierIndex(Math.max(qty, 1));
  const next = qty > 0 ? nextTier(qty) : null;
  const save = savings(qty);
  return <div className={`config-row ${qty === 0 ? "is-empty" : ""}`}>
    <div className="row-product"><img src={p.image} alt={p.name} width={768} height={1152} loading="lazy" /><div><h3>{p.name}</h3><span>{p.place}</span></div></div>
    <div className="row-control">
      <div className="qty-line">
        <Button variant="outline" size="icon" className="qty-btn" aria-label={`Quitar una ${p.name}`} disabled={qty <= 0} onClick={() => onChange(qty - 1)}><Minus /></Button>
        <span className="qty-value" aria-live="polite">{qty} <small>und</small></span>
        <Button variant="outline" size="icon" className="qty-btn" aria-label={`Agregar una ${p.name}`} disabled={qty >= MAX_QTY} onClick={() => onChange(qty + 1)}><Plus /></Button>
      </div>
      <Slider className="tap-slider" min={0} max={MAX_QTY} step={1} value={[qty]} onValueChange={([v]) => onChange(v ?? 0)} aria-label={`Cantidad de ${p.plural}`} />
      <div className="slider-marks">{marks.map((m, i) => <span key={m} className={i === tier && qty > 0 ? "active" : ""} style={{ left: `${(m / MAX_QTY) * 100}%` }}>{m}</span>)}</div>
      <p className="row-hint">{qty === 0 ? "Desliza para agregar esta tarjeta." : next ? `Agrega ${next.missing} más y paga ${formatGs(next.price)} por unidad` : "Mejor precio"}</p>
    </div>
    <div className="row-price">
      <AnimatePresence mode="popLayout" initial={false}><motion.span key={unitPrice(Math.max(qty, 1))} className="row-unit" initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }} transition={{ duration: .25 }}>{formatGs(unitPrice(Math.max(qty, 1)))} / und</motion.span></AnimatePresence>
      <strong>{formatGs(total(qty))}</strong>
      <span className="saving">{save > 0 ? `Ahorras ${formatGs(save)}` : " "}</span>
      {qty > 0 ? <Button asChild variant="outline" className="tap-button"><a href={whatsappUrl(`Hola TAPJR! Quiero pedir ${line(p, qty)}.`)} target="_blank" rel="noopener noreferrer"><MessageCircle />Pedir por WhatsApp</a></Button> : <Button variant="outline" className="tap-button" disabled><MessageCircle />Pedir por WhatsApp</Button>}
    </div>
  </div>;
}
