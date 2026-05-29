"use client";

import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  container?: Element | string | null;
  distance?: number;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  disappearAfter?: number;
  disappearDuration?: number;
  disappearEase?: string;
  onComplete?: () => void;
  onDisappearanceComplete?: () => void;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  container,
  distance = 100,
  direction = 'vertical',
  reverse = false,
  duration = 0.8,
  ease = 'power3.out',
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  disappearAfter = 0,
  disappearDuration = 0.5,
  disappearEase = 'power3.in',
  onComplete,
  onDisappearanceComplete,
  className = '',
  style,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    let scrollerTarget: Element | Window = window;
    if (container instanceof Element) {
      scrollerTarget = container;
    } else if (typeof container === 'string') {
      const found = document.querySelector(container);
      if (found) scrollerTarget = found;
    } else {
      const main = document.getElementById('snap-main-container');
      if (main) scrollerTarget = main;
    }

    const axis = direction === 'horizontal' ? 'x' : 'y';
    const offset = reverse ? -distance : distance;
    const startPct = (1 - threshold) * 100;

    gsap.set(el, {
      [axis]: offset,
      scale,
      opacity: animateOpacity ? initialOpacity : 1,
    });

    const tl = gsap.timeline({ paused: true, delay });

    tl.to(el, {
      [axis]: 0,
      scale: 1,
      opacity: animateOpacity ? 1 : 1,
      duration,
      ease,
      onStart: () => { 
        el.style.visibility = 'visible'; 
      },
      onComplete: () => {
        onComplete?.();
        gsap.set(el, { clearProps: "opacity, transform" });
        
        if (disappearAfter > 0) {
          gsap.to(el, {
            [axis]: reverse ? distance : -distance,
            scale: 0.8,
            opacity: 0,
            delay: disappearAfter,
            duration: disappearDuration,
            ease: disappearEase,
            onComplete: () => onDisappearanceComplete?.(),
          });
        }
      }
    });

    const st = ScrollTrigger.create({
      trigger: el,
      scroller: scrollerTarget,
      start: `top ${startPct}%`,
      once: true,
      onEnter: () => tl.play(),
    });

    const frameId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (st.isActive || (el.getBoundingClientRect().top < window.innerHeight)) {
        tl.play();
      }
    });

    return () => {
      st.kill();
      tl.kill();
      cancelAnimationFrame(frameId);
    };
  }, [container, distance, direction, reverse, duration, ease, initialOpacity, animateOpacity, scale, threshold, delay, disappearAfter, disappearDuration, disappearEase, onComplete, onDisappearanceComplete]);

  return (
    <div 
      ref={ref} 
      className={className} 
      style={{ visibility: 'hidden', ...style }} 
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedContent;