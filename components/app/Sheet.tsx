"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "framer-motion";
import Icon from "@/components/ui/icons";

/**
 * A bottom sheet: slides up over the screen on phones, and can be flicked
 * back down by its handle. On wider screens the same thing is a centred
 * dialog. Closes on the backdrop, the close button, Escape or a downward
 * swipe. Rendered at the end of <body> so no animated parent can trap it.
 */
export default function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const drag = useDragControls();
  const panel = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="app-shell fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-night/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className="relative flex max-h-[88dvh] w-full flex-col rounded-t-[28px] bg-bone shadow-float outline-none md:max-w-md md:rounded-[28px]"
            initial={reduce ? { opacity: 0 } : { y: "100%" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "100%" }}
            transition={{ type: "spring", damping: 34, stiffness: 360 }}
            drag="y"
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
          >
            {/* The handle and title are the only part that drags, so the
                content underneath can still scroll. */}
            <div onPointerDown={(e) => drag.start(e)} className="shrink-0 cursor-grab touch-none px-5 pb-3 pt-2.5 active:cursor-grabbing">
              <span aria-hidden="true" className="mx-auto mb-3 block h-1.5 w-10 rounded-full bg-ink/20 md:hidden" />
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-serif text-xl font-semibold tracking-tightish text-ink">{title}</h2>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={onClose}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink/70 hover:bg-ink/[0.06]"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
