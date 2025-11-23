"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Item = {
  id?: string | number;
  q: string;
  a: string;
};

type Props = {
  items: Item[];
  singleOpen?: boolean;
  className?: string;
};

export default function Accordion({ items, singleOpen = true, className = '' }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className={className}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06 } },
        }}
      >
        {items.map((item, idx) => {
          const isOpen = open === idx;
          return (
            <motion.div
              key={item.id ?? idx}
              className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 border border-gray-100"
              variants={{
                hidden: { opacity: 0, y: 6 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <button
                onClick={() => setOpen(singleOpen ? (isOpen ? null : idx) : (isOpen ? null : idx))}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 focus:outline-none"
                aria-expanded={isOpen}
                aria-controls={`accordion-content-${idx}`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 text-red-600 text-xl font-bold">+</div>
                  <span className="text-lg font-semibold text-primary">{item.q}</span>
                </div>

                <motion.span
                  className="ml-4 text-gray-400"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l5 5a1 1 0 11-1.414 1.414L10 5.414 5.707 9.707A1 1 0 114.293 8.293l5-5A1 1 0 0110 3z" clipRule="evenodd" />
                  </svg>
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`accordion-content-${idx}`}
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    style={{ overflow: 'hidden' }}
                    className="px-6 pb-6"
                  >
                    <div className="text-gray-700 leading-relaxed">{item.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
