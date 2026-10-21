"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import myLogo from "@/assets/favicon.ico";

/**
 * Page transition splash.
 *
 * The logo splash plays ONLY on client-side route changes — never on the very
 * first render. This means the initial page paints instantly (good LCP, no white
 * flash) while navigations still get the branded transition.
 */
export default function PageTransition({ children }) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setShowSplash(true);
    const timer = window.setTimeout(() => setShowSplash(false), 620);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Branded splash — route changes only */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-white pointer-events-none"
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={myLogo} alt="" width={120} height={120} priority={false} />
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </>
  );
}
