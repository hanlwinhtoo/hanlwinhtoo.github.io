import {useState} from 'react';
import {Button} from '@/components/sodium/ui/button';
import {Icon, Moon, Sun} from '@/components/sodium/icon';

type Theme = 'light' | 'dark';

// Dark is the site's default. The inline script in each HTML file applies the theme before paint: dark, unless the
// visitor once chose light. A choice is saved only when the visitor presses the toggle, under "theme-choice". (The
// old "theme" key was written on every visit, light included, so it is ignored: everyone starts dark.)
const KEY = 'theme-choice';

/** The theme now on the page, as the inline script set it. */
function currentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/** Switches Sodium between its dark and light themes (data-theme="dark" on <html>) and remembers the choice. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  const choose = (next: Theme) => {
    const root = document.documentElement;
    if (next === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    try {
      localStorage.setItem(KEY, next);
      localStorage.removeItem('theme');
    } catch {
      // storage blocked: the choice lasts for this visit only
    }
    setTheme(next);
  };

  const next: Theme = theme === 'dark' ? 'light' : 'dark';
  return <Button variant="ghost" size="icon-sm" aria-label={`Switch to ${next} theme`} onClick={() => choose(next)}>
    <Icon icon={theme === 'dark' ? Sun : Moon} size={16}/>
  </Button>;
}
