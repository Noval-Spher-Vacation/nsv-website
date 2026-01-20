import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { Plane } from "lucide-react";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const glow = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const isLanding = location.pathname === "/";

  useEffect(() => {
    if (!isLanding) {
      setIsVisible(false);
      return undefined;
    }

    const canHover = window.matchMedia("(pointer: fine)").matches;
    if (!canHover) {
      return undefined;
    }

    document.body.classList.add("custom-cursor-active");

    const updatePosition = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.22;
      current.current.y += (target.current.y - current.current.y) * 0.22;
      glow.current.x += (target.current.x - glow.current.x) * 0.12;
      glow.current.y += (target.current.y - glow.current.y) * 0.12;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glow.current.x}px, ${glow.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener("mousemove", updatePosition);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      document.body.classList.remove("custom-cursor-active");
    };
  }, [isLanding]);

  if (!isLanding || !isVisible) return null;

  return (
    <>
      <div
        ref={glowRef}
        className="fixed pointer-events-none z-[9998] h-6 w-6 rounded-full bg-[radial-gradient(circle,rgba(255,120,214,0.6),rgba(255,120,214,0))] blur-[2px]"
      />
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999]"
      >
        <Plane className="w-5 h-5 text-[#ff64d2] drop-shadow-[0_0_10px_rgba(255,100,210,0.85)] -rotate-45" />
      </div>
    </>
  );
}
