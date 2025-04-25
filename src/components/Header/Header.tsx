import Link from 'next/link';
import { Button } from '@mui/material';

function Header() {
  return (
    <header className="align-center flex flex-row justify-between px-4 py-2">
      <h1 className="text-heading-1 text-primary-100 font-sans font-bold">
        <Link href="/">
          task
          <span className="text-primary-900 -ml-1">nerd</span>
        </Link>
      </h1>
      <Button type="button" variant="contained" color="secondary">
        <Link href="/task">Create a task</Link>
      </Button>
    </header>
  );
}

export { Header };
