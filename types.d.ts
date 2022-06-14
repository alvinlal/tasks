import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      strike: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
