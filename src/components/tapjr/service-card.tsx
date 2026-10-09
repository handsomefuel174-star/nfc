import { useMotionValue, useSpring, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Instagram, MessageCircle, Music2, Star, Utensils, Wifi } from "lucide-react";
import { Logo } from "./logo";

const services = [
  { title: "Tarjeta de Reseñas", category: "MÁS CONFIANZA", description: "Convierte una buena experiencia en una gran reseña. Un toque en el mostrador y tus clientes llegan directo a Google.", type: "reviews" },
  { title: "Tarjeta para Menú", category: "MENOS ESPERA", description: "Tu menú, siempre a la mano. Acercan el móvil en la mesa y descubren todo lo que tienes para ofrecer.", type: "menu" },
  { title: "Tarjeta para Redes Sociales", category: "MÁS CONEXIONES", description: "De un primer encuentro a un nuevo seguidor. Comparte Instagram, TikTok, WhatsApp y mucho más con un toque.", type: "social" },
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
      {service.type === "reviews" ? <div className="review-stand"><div className="stand-face"><Logo /><div className="generic-google">G</div><div className="review-stars">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={13} fill="currentColor" />)}</div><strong>Tu opinión cuenta.</strong><span>Acerca tu móvil y cuéntanos.</span><Wifi size={18} /></div><div className="stand-foot" /></div> : service.type === "menu" ? <><div className="menu-card-back" /><div className="mini-card menu-card"><Logo light /><Utensils size={36} strokeWidth={1} /><span>Buen gusto.<br />A un toque.</span><div className="mini-card-bottom">DESCUBRE EL MENÚ <Wifi size={15} /></div></div></> : <><div className="social-card-back" /><div className="mini-card social-card"><Logo /><span>Sigamos<br />conectados.</span><div className="social-icons"><Instagram size={21} /><Music2 size={21} /><MessageCircle size={21} /></div><div className="mini-card-bottom">ENCUÉNTRANOS AQUÍ <Wifi size={15} /></div></div></>}
      <span className="visual-arrow"><ArrowUpRight size={18} /></span>
    </motion.a>
    <div className="service-copy"><span className="eyebrow">{service.category}</span><h3>{service.title}</h3><p>{service.description}</p><a href="#ofertas" className="service-price">Desde $150.000 <ArrowUpRight size={16} /></a></div>
  </motion.article>;
}
