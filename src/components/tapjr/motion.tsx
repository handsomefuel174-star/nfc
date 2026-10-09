import { useEffect, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Lenis from "lenis";

export function SmoothScroll() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: true });
    let frame = 0;
    const animate = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(animate); };
    frame = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frame); lenis.destroy(); };
  }, [reduced]);
  return null;
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
