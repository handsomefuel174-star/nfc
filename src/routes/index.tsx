import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Battery, Check, Coffee, CreditCard, Instagram, Menu, MessageCircle, Music2, Paintbrush, ShieldCheck, Smartphone, Sparkles, Store, Utensils, Wifi, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/tapjr/logo";
import { SmoothScroll, Reveal } from "@/components/tapjr/motion";
import { NFCScene } from "@/components/tapjr/nfc-scene";
import { ServiceCards } from "@/components/tapjr/service-card";
import { plans, formatCOP } from "@/components/tapjr/pricing";
import { OrderDialog } from "@/components/tapjr/order-dialog";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "TAPJR — Un toque. Todo conectado." },
    { name: "description", content: "Tarjetas NFC para reseñas en caja, menús en mesas y meseros. Conecta tu negocio con un toque. Desde $150.000 COP." },
    { property: "og:title", content: "TAPJR — Un toque. Todo conectado." },
    { property: "og:description", content: "Diseño premium. Conexiones al instante. Descubre las tarjetas NFC de TAPJR para tu negocio." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Index,
});

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [order, setOrder] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const ribbonRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: ribbonProgress } = useScroll({ target: ribbonRef, offset: ["start end", "end start"] });
  const ribbonX = useTransform(ribbonProgress, [0, 1], [80, -220]);
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20);
    handle(); window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);
  const requestOrder = (item = "Quiero una tarjeta NFC para mi negocio.") => setOrder(item);
  return <div className="page-shell">
    <SmoothScroll />
    <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container nav-inner">
        <a href="#inicio" aria-label="TAPJR, inicio"><Logo /></a>
        <nav aria-label="Navegación principal" className={`nav-links ${menuOpen ? "mobile-open" : ""}`}>
          {[ ["Servicios", "servicios"], ["Ofertas", "ofertas"], ["Cómo funciona", "como-funciona"], ["Contacto", "contacto"] ].map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <div className="nav-actions"><Button className="tap-button nav-button" onClick={() => requestOrder()}>Pedir ahora <ArrowUpRight /></Button><Button variant="ghost" size="icon" className="mobile-toggle" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button></div>
      </div>
    </header>
    <main>
      <section className="hero" id="inicio">
        <Reveal><div className="hero-eyebrow"><span className="status-dot" /> PEQUEÑA TARJETA. GRANDES POSIBILIDADES.</div><h1>Un toque.<br /><em>Todo conectado.</em></h1><p className="hero-description">Tu negocio, a un toque de distancia. Tarjetas NFC que conectan a tus clientes con lo que importa. Sin apps. Sin complicaciones.</p><div className="hero-actions"><Button asChild className="tap-button"><a href="#servicios">Descubre tu tarjeta <ArrowUpRight /></a></Button><Button asChild variant="outline" className="tap-button secondary-cta"><a href="#como-funciona">Cómo funciona <ArrowRight /></a></Button></div></Reveal>
        <NFCScene />
        <div className="hero-benefits"><span><Smartphone /> iPhone y Android</span><span><Wifi /> Sin apps</span><span><Sparkles /> Hecha para tu marca</span></div>
      </section>
      <div className="intro-strip"><div className="container strip-inner"><p>Una nueva forma de conectar. <strong>Para negocios como el tuyo.</strong></p><div className="use-cases"><span><Utensils /> Restaurantes</span><span><Coffee /> Cafeterías</span><span><Store /> Tiendas</span></div></div></div>
      <section className="section container" id="servicios"><Reveal className="section-heading"><div><span className="eyebrow">CONEXIONES QUE HACEN LA DIFERENCIA</span><h2 className="section-title">Una tarjeta.<br />Muchas posibilidades.</h2></div><p>Elige cómo quieres conectar con tus clientes.<br />Nosotros hacemos que suceda.</p></Reveal><ServiceCards /></section>
      <section className="section how-section" id="como-funciona"><div className="container"><Reveal className="center-heading"><span className="eyebrow">ASÍ DE SIMPLE</span><h2 className="section-title">Tres pasos. Y estás conectado.</h2><p>Nos encargamos de la tecnología.<br />Tú te encargas de crear buenas experiencias.</p></Reveal><div className="steps-grid">{[
        ["01", "Elige tu tarjeta", "Reseñas en caja, menú en mesas o tarjetas para meseros. Encuentra la tarjeta que mejor se adapta a tu negocio."],
        ["02", "La configuramos", "Personalizamos el diseño con tu marca y conectamos el enlace que tú elijas."],
        ["03", "Un toque. Listo.", "Tus clientes acercan el móvil a la tarjeta y llegan directo a tu contenido. Así de fácil."],
      ].map(([number, title, text], i) => <Reveal className="step" delay={i * .12} key={number}><div className="step-top"><span className="step-number">{number}</span><span className="step-line" /><ArrowUpRight size={17} /></div><h3>{title}</h3><p>{text}</p></Reveal>)}</div></div></section>
      <div className="connection-ribbon" ref={ribbonRef} aria-hidden="true"><motion.div className="ribbon-track" style={{ x: reduced ? 0 : ribbonX }}>{[0,1,2].map(i => <div className="contents" key={i}><span>Más reseñas.</span><div className="ribbon-nfc"><Logo light /><Wifi /></div><span className="ribbon-muted">Más conexiones.</span><div className="ribbon-nfc ribbon-nfc-paper"><Logo /><Wifi /></div><span>Menos complicaciones.</span><div className="ribbon-nfc"><Logo light /><Wifi /></div></div>)}</motion.div></div>
      <section className="section container" id="ofertas"><Reveal className="center-heading"><span className="eyebrow">UNA PEQUEÑA INVERSIÓN. UN GRAN CAMBIO.</span><h2 className="section-title">Conecta más. Paga menos.</h2><p>Diseño personalizado y configuración incluidos.<br />Elige tu pack y dale un nuevo toque a tu negocio.</p></Reveal><div className="pricing-grid">{plans.map((plan, i) => <Reveal className={`price-card ${i === 1 ? "popular" : ""}`} delay={i * .1} key={plan.quantity}>{plan.tag && <span className="plan-tag">{i === 1 && "✦ "}{plan.tag}</span>}<span className="plan-quantity">{plan.quantity}</span><h3>{plan.name}</h3><p>{plan.description}</p><div className="price-value"><strong>{formatCOP(plan.price)}</strong><span>COP / pack</span></div><div className="original-price">{plan.original ? <><s>{formatCOP(plan.original)}</s><span className="saving">Ahorras {formatCOP(plan.original - plan.price)}</span></> : <span>Tu primera tarjeta, a tu medida.</span>}</div><ul>{plan.features.map(feature => <li key={feature}><Check />{feature}</li>)}</ul><Button variant={i === 1 ? "default" : "outline"} className="tap-button" onClick={() => requestOrder(`Me interesa ${plan.quantity.toLowerCase()} por ${formatCOP(plan.price)} COP.`)}><MessageCircle />Pedir por WhatsApp<ArrowUpRight /></Button></Reveal>)}</div><p className="pricing-note">Precios en pesos colombianos. ¿Necesitas más tarjetas? Hablemos de tu negocio.</p></section>
      <section className="benefits-section"><div className="container benefits-grid">{[
        { icon: Smartphone, title: "Sin descargar apps", text: "Acerca el móvil y listo." },
        { icon: ShieldCheck, title: "iPhone y Android", text: "Compatible con móviles NFC." },
        { icon: Battery, title: "Sin baterías", text: "Siempre lista para conectar." },
        { icon: Paintbrush, title: "100% tu marca", text: "Un diseño hecho para ti." },
      ].map(({ icon: Icon, title, text }, i) => <Reveal className="benefit" delay={i * .08} key={title}><Icon /><div><h3>{title}</h3><p>{text}</p></div></Reveal>)}</div></section>
      <section className="final-cta container" id="contacto"><Reveal><span className="eyebrow">EL SIGUIENTE PASO ES UN TOQUE</span><h2 className="section-title">Tu negocio merece<br />estar conectado.</h2><p>Hagamos que cada encuentro se convierta en una oportunidad.</p><Button className="tap-button" onClick={() => requestOrder()}><MessageCircle />Hablemos por WhatsApp<ArrowUpRight /></Button></Reveal></section>
    </main>
    <footer className="footer"><div className="container"><div className="footer-top"><a href="#inicio" aria-label="TAPJR, volver al inicio"><Logo /></a><div className="footer-socials"><a className="contact-link" href="#contacto">Conectemos</a><Button variant="ghost" size="icon" aria-label="Instagram de TAPJR" title="Instagram" onClick={() => requestOrder("Conecta con TAPJR en Instagram.")}><Instagram /></Button><Button variant="ghost" size="icon" aria-label="TikTok de TAPJR" title="TikTok" onClick={() => requestOrder("Conecta con TAPJR en TikTok.")}><Music2 /></Button></div></div><div className="footer-bottom"><span>© 2026 TAPJR. Todos los derechos reservados.</span><span>Diseñado para conectar. Hecho para ti.</span></div></div></footer>
    <OrderDialog order={order} onClose={() => setOrder(null)} />
  </div>;
}
