"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "section" | "div" | "article";
  direction?: "up" | "left" | "right" | "none";
}

export function AnimatedSection({
  children,
  delay = 0,
  className,
  as = "section",
  direction = "up",
}: AnimatedSectionProps) {
  const reduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: reduceMotion || direction !== "up" ? 0 : 24,
      x:
        reduceMotion || direction === "up" || direction === "none"
          ? 0
          : direction === "left"
            ? 24
            : -24,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.7,
        ease: [0.21, 0.47, 0.32, 0.98],
        delay,
      },
    },
  };

  const MotionComp = motion[as];

  return (
    <MotionComp
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      className={className}
    >
      {children}
    </MotionComp>
  );
}
