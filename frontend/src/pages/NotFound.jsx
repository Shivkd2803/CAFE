import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-6 text-center">
      <div>
        <p className="font-display text-7xl">404</p>
        <p className="opacity-70 mt-2">This page brewed away.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">Back home</Link>
      </div>
    </div>
  );
}