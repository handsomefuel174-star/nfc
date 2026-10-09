import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Check, Wifi } from "lucide-react";
import { Logo } from "./logo";

export function NFCScene() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scrollRotate = useTransform(scrollYProgress, [0, 1], [-13, 11]);
  const scrollY = useTransform(scrollYProgress, [0, 1], [35, -65]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [15, -25]);
  const mouseX = useMotionValue(0), mouseY = useMotionValue(0);
  const rotateY = useSpring(mouseX, { stiffness: 90, damping: 20 });
  const rotateX = useSpring(mouseY, { stiffness: 90, damping: 20 });
  return <div ref={ref} className="nfc-scene" onPointerMove={(event) => {
    if (reduced || event.pointerType === "touch") return;
    const box = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - box.left - box.width / 2) / 24);
    mouseY.set(-(event.clientY - box.top - box.height / 2) / 24);
  }} onPointerLeave={() => { mouseX.set(0); mouseY.set(0); }}>
    <div className="scene-floor" />
    <motion.div className="hero-nfc-card" style={{ rotateZ: reduced ? -8 : scrollRotate, y: reduced ? 0 : scrollY, rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY }}>
      <div className="nfc-card-top"><span>TU PRÓXIMA CONEXIÓN</span><Wifi size={25} /></div>
      <Logo light className="card-logo" />
      <div className="nfc-card-bottom"><span>ACERCA. CONECTA.</span><span>NFC</span></div>
      <div className="card-edge" />
    </motion.div>
    <div className="signal-waves" aria-hidden="true"><i /><i /><i /></div>
    <motion.div className="phone" style={{ rotateZ: 12, y: reduced ? 0 : phoneY }}>
      <div className="phone-camera" /><div className="phone-status"><span>9:41</span><span>••• ▰</span></div>
      <div className="phone-screen"><div className="phone-brand"><Logo /></div><span className="phone-welcome">BIENVENIDO A TU MUNDO</span><h3>Una conexión.<br />Mil posibilidades.</h3><div className="phone-link">Descubre nuestro menú <ArrowUpRight size={12} /></div><div className="phone-link">Déjanos una reseña <ArrowUpRight size={12} /></div><div className="phone-link">Conectemos en redes <ArrowUpRight size={12} /></div><div className="phone-connected"><Check size={12} /> Conectado al instante</div></div>
      <div className="phone-home" />
    </motion.div>
    <div className="scene-label label-card"><span className="label-line" />Diseñada para destacar.</div>
    <div className="scene-label label-phone">Un toque es todo lo que necesitas.<span className="label-line" /></div>
  </div>;
}
