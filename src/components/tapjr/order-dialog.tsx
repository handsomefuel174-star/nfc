import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";
export function OrderDialog({ order, onClose }: { order: string | null; onClose: () => void }) {
  return <Dialog open={order !== null} onOpenChange={(open) => { if (!open) onClose(); }}><DialogContent className="order-dialog"><div className="order-symbol"><MessageCircle /></div><DialogHeader><DialogTitle>Conectemos tu negocio.</DialogTitle><DialogDescription>{order}</DialogDescription></DialogHeader><p>Estamos preparando nuestro canal de WhatsApp. El contacto directo de TAPJR estará disponible próximamente.</p></DialogContent></Dialog>;
}
