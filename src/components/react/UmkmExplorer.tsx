import { motion, useReducedMotion } from 'motion/react';
import type { UmkmExplorerProps } from '../../types/site';

/**
 * Checkpoint-only island. Nova replaces this implementation after branching,
 * while preserving the serialized UmkmExplorerProps contract.
 */
export default function UmkmExplorer({ businesses }: UmkmExplorerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      aria-label="Checkpoint direktori UMKM"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-card border border-kenteng-100 bg-white p-6 shadow-card"
    >
      <p className="font-bold text-kenteng-900">
        Fondasi React island siap untuk {businesses.length} data UMKM.
      </p>
    </motion.section>
  );
}
