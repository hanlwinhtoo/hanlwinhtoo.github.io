import {useEffect, useState} from 'react';

// The time in Singapore, where Han is, for a visitor anywhere: "2:32 PM SGT". It follows Asia/Singapore whatever
// the visitor's own clock says, and moves on the minute. A <time> element carries the exact moment for machines;
// the label tells a screen reader what the number is, and it is not announced as it changes.

const format = new Intl.DateTimeFormat('en-SG', {timeZone: 'Asia/Singapore', hour: 'numeric', minute: '2-digit', hour12: true});

export function SingaporeTime({className}: {className?: string}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let interval = 0;
    // Wait for the next whole minute, then tick once a minute, so the clock turns over when the real one does.
    const timeout = window.setTimeout(() => {
      setNow(new Date());
      interval = window.setInterval(() => setNow(new Date()), 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => { window.clearTimeout(timeout); window.clearInterval(interval); };
  }, []);

  const time = format.format(now).replace(/\s?(am|pm)$/i, m => ` ${m.trim().toUpperCase()}`);
  return <time
    dateTime={now.toISOString()}
    aria-label={`Time in Singapore: ${time}`}
    className={className}
  >
    <span className="type-code-sm text-text-2">{time}</span>{' '}
    <span className="type-label-sm text-text-3">SGT</span>
  </time>;
}
