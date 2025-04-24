import * as React from 'react';
import { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { Header } from '@/components/Header';

import './global.css';

const metadata: Metadata = {
  title: 'Task Nerd',
  description: `Task Nerd manages your tasks so you don't have to.`,
};

const montserrat = Montserrat({
  weight: ['300', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

function RootLayout(props: React.PropsWithChildren) {
  const { children } = props;

  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <body>
        <Header></Header>
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
export { metadata };
