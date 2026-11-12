import {StrictMode} from 'react';
import {flushSync} from 'react-dom';
import {createRoot} from 'react-dom/client';
import '@/components/sodium/styles.css';
import '@/components/site/site.css';
import {Home} from '@/pages/home';

// Render at once, before the browser's first paint, so the page-change fade lands on the finished page.
const root = createRoot(document.getElementById('root')!);
flushSync(() => root.render(
  <StrictMode>
    <Home/>
  </StrictMode>,
));
