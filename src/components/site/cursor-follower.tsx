import {useEffect, useRef} from 'react';

// Corner brackets, like a camera's focus frame: point at anything you can click (a link, a button, or a whole
// project row, which its link covers) and four small corners glide in from the pointer and snap around it. Move
// off and they fade. The system arrow and text cursor stay as they are; the brackets only mark the target.
//
// It runs only with a mouse or trackpad ((hover: hover) and (pointer: fine)) and never under reduced motion, so a
// touch screen or a person who turned motion off sees nothing. The frame is aria-hidden and takes no pointer
// events, so it never blocks a click or reaches a screen reader.

const CLICKABLE = 'a[href], button:not(:disabled), [role="button"]:not([aria-disabled="true"])';
const PAD = 6; // the gap between a target's edge and its brackets, in px
const REST = 16; // the frame's size while it waits at the pointer, so the brackets start small and spread out
const EASE = 0.25; // how far the frame closes on its goal each frame: a quick snap, not a lag

/** The box to bracket: the whole project row for a row link, else the control itself. */
function bracketTarget(el: Element): Element {
  return (el.matches('[data-slot="item-link"]') && el.closest('[data-slot="item"]')) || el;
}

const corner = 'absolute size-2 border-text-1';

export function CursorFollower() {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!frame || !fine.matches || reduce.matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let target: Element | null = null;
    const now = {x: -100, y: -100, w: REST, h: REST};
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onOver = (e: PointerEvent) => {
      const hit = e.target instanceof Element ? e.target.closest(CLICKABLE) : null;
      target = hit ? bracketTarget(hit) : null;
      if (target) frame.dataset.on = ''; else delete frame.dataset.on;
    };
    const onLeave = () => {
      target = null;
      delete frame.dataset.on;
    };

    const tick = () => {
      // Off a target the frame waits small at the pointer, so the next snap starts from where you are.
      let goal = {x: mouseX - REST / 2, y: mouseY - REST / 2, w: REST, h: REST};
      if (target?.isConnected) {
        const r = target.getBoundingClientRect();
        goal = {x: r.left - PAD, y: r.top - PAD, w: r.width + PAD * 2, h: r.height + PAD * 2};
      }
      now.x += (goal.x - now.x) * EASE;
      now.y += (goal.y - now.y) * EASE;
      now.w += (goal.w - now.w) * EASE;
      now.h += (goal.h - now.h) * EASE;
      frame.style.transform = `translate3d(${now.x}px, ${now.y}px, 0)`;
      frame.style.width = `${now.w}px`;
      frame.style.height = `${now.h}px`;
      raf = requestAnimationFrame(tick);
    };

    document.addEventListener('pointermove', onMove, {passive: true});
    document.addEventListener('pointerover', onOver, {passive: true});
    document.documentElement.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <div
    ref={frameRef}
    aria-hidden
    className="pointer-events-none fixed top-0 left-0 z-(--z-overlay) opacity-0 transition-opacity duration-(--dur-state) ease-out data-on:opacity-100"
  >
    <span className={`${corner} top-0 left-0 border-t border-l`}/>
    <span className={`${corner} top-0 right-0 border-t border-r`}/>
    <span className={`${corner} bottom-0 left-0 border-b border-l`}/>
    <span className={`${corner} right-0 bottom-0 border-r border-b`}/>
  </div>;
}
