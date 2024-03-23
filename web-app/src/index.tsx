import { createRoot } from 'react-dom/client';

import { App } from './components/App';

const domNode = document.getElementById('root');

if (!domNode) {
  throw new Error('DOM node missing');
}

const root = createRoot(domNode);
root.render(<App />);
