import { useMotionValue, useSpring, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import reviewCard from "@/assets/tarjeta-resenas.png";
import menuCard from "@/assets/tarjeta-menu.png";

const services = [
  { title: "Tarjeta de Reseñas", category: "MÁS CONFIANZA", description: "Convierte una buena experiencia en una gran reseña. Un toque en el mostrador y tus clientes llegan directo a Google.", type: "reviews" },
  { title: "Tarjeta para Menú", category: "MENOS ESPERA", description: "Tu menú, siempre a la mano. Acercan el móvil en la mesa y descubren todo lo que tienes para ofrecer.", type: "menu" },
  { title: "Tarjeta para Meseros", category: "ATENCIÓN EN MESA", description: "Cada mesero lleva su propia tarjeta. Al terminar la atención, el cliente la acerca con su celular y deja su reseña en Google en segundos.", type: "waiters" },
] as const;

export function ServiceCards() {
  return <div className="service-grid">{services.map((service, i) => <ServiceCard key={service.type} service={service} index={i} />)}</div>;
}
function ServiceCard({ service, index }: { service: typeof services[number]; index: number }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0), y = useMotionValue(0);
  const rotateY = useSpring(x), rotateX = useSpring(y);
  return <motion.article className="service-item" initial={reduced ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: index * 0.12, duration: 0.6 }}>
    <motion.a href="#ofertas" aria-label={`Ver precios: ${service.title}`} className={`service-visual visual-${service.type}`} style={reduced ? {} : { rotateX, rotateY }} onPointerMove={(e) => { if (reduced || e.pointerType === "touch") return; const rect = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - rect.left - rect.width / 2) / 30); y.set(-(e.clientY - rect.top - rect.height / 2) / 30); }} onPointerLeave={() => { x.set(0); y.set(0); }}>
      <div className={`product-display product-${service.type}`}>
        {service.type === "reviews" && <div className="product-counter-base" aria-hidden="true" />}
        {service.type === "waiters" && <img className="product-image product-fan-back" src={reviewCard} alt="" aria-hidden="true" width={768} height={1152} loading="lazy" />}
        <img className="product-image product-front" src={service.type === "menu" ? menuCard : reviewCard} alt={service.type === "menu" ? "Tarjeta NFC negra de menú: MENÚ, Acerca tu celular aquí" : service.type === "waiters" ? "Tarjeta portátil de mesero para valorar la atención en Google, diseño TAPJR" : "Tarjeta TAPJR de reseñas: Valóranos en Google, cinco estrellas y Acerca tu celular aquí"} width={768} height={1152} loading="lazy" />
      </div>
      <span className="visual-arrow"><ArrowUpRight size={18} /></span>
    </motion.a>
    <div className="service-copy"><span className="eyebrow">{service.category}</span><h3>{service.title}</h3><p>{service.description}</p><a href="#ofertas" className="service-price">Desde $150.000 <ArrowUpRight size={16} /></a></div>
  </motion.article>;
}
