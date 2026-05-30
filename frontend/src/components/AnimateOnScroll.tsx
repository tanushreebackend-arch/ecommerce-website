'use client';

import { motion, useInView, type Easing } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

const EASE_OUT: Easing = 'easeOut';

export const scrollHidden = { opacity: 0, y: 40 };
export const scrollVisible = { opacity: 1, y: 0 };

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds (e.g. index * 0.1 for card grids) */
  delay?: number;
  /** Stagger direct children with 0.1s between each — use with AnimateOnScrollItem */
  stagger?: boolean;
}

export default function AnimateOnScroll({
  children,
  className = '',
  delay = 0,
  stagger = false,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.08,
    margin: '0px 0px -48px 0px',
  });

  if (stagger) {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.1, delayChildren: delay },
          },
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={scrollHidden}
      animate={isInView ? scrollVisible : scrollHidden}
      transition={{ duration: 0.6, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Wrap a grid item when using AnimateOnScroll with stagger=true */
export function AnimateOnScrollItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: scrollHidden,
        visible: {
          ...scrollVisible,
          transition: { duration: 0.6, ease: EASE_OUT },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
