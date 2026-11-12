import {useEffect, useState} from 'react';
import {Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/sodium/ui/dialog';

// A project photo that enlarges on the page: select it and it opens over the page in Sodium's dialog, as large as
// the screen allows and always whole, with the panel wrapped tight around it. Close it with the X, Escape or a click
// outside. The dialog is controlled (open and onOpenChange), as Sodium asks, so it plays its exit and hands focus
// back to the photo.

export type Photo = {src: string; full?: string; alt: string; caption: string; width: number; height: number; crop?: boolean};

// What the dialog itself takes around the photo, in px: Sodium's 16px side margin and 32px top and bottom margin on
// the screen, the 38px header, the 12px inset on each side of the body and the 1px edges. The widest it grows is 1152.
const MARGIN_X = 16 * 2;
const MARGIN_Y = 32 * 2;
const CHROME_X = 12 * 2 + 2;
const CHROME_Y = 38 + 12 * 2 + 3;
const MAX_WIDTH = 1152;

/** The largest size of the photo's shape that fits the screen inside the dialog. */
function fitToScreen(width: number, height: number) {
  const roomW = Math.min(window.innerWidth - MARGIN_X, MAX_WIDTH) - CHROME_X;
  const roomH = window.innerHeight - MARGIN_Y - CHROME_Y;
  const scale = Math.min(roomW / width, roomH / height);
  return {w: Math.max(0, Math.floor(width * scale)), h: Math.max(0, Math.floor(height * scale))};
}

export function PhotoView({photo}: {photo: Photo}) {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState({w: 0, h: 0});

  useEffect(() => {
    if (!open) return;
    const sync = () => setSize(fitToScreen(photo.width, photo.height));
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [open, photo.width, photo.height]);

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger
      aria-label={`Enlarge photo: ${photo.caption}`}
      className="block w-full cursor-zoom-in focus-visible:focus-ring-inset"
    >
      <img
        src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy"
        className={photo.crop ? 'block aspect-16/9 h-auto w-full object-cover' : 'block h-auto w-full'}
      />
    </DialogTrigger>
    {/* The panel is exactly the photo's width plus its inset, so a long caption shortens in the header instead of
        widening the panel past the photo or the screen. */}
    <DialogContent
      className="w-(--dialog-w) max-w-288"
      style={{'--dialog-w': `${size.w + CHROME_X}px`} as React.CSSProperties}
    >
      <DialogHeader>
        <DialogTitle>{photo.caption}</DialogTitle>
      </DialogHeader>
      <DialogBody className="flex-none overflow-hidden">
        <img
          src={photo.full ?? photo.src} alt={photo.alt}
          className="block h-(--photo-h) w-(--photo-w) max-w-none"
          style={{'--photo-w': `${size.w}px`, '--photo-h': `${size.h}px`} as React.CSSProperties}
        />
      </DialogBody>
    </DialogContent>
  </Dialog>;
}
