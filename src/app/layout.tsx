import * as React from 'react';
import { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Task Nerd',
  description: `Task Nerd manages your tasks so you don't have to.`,
};

function RootLayout(props: React.PropsWithChildren) {
  const { children } = props;

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;
export { metadata };
