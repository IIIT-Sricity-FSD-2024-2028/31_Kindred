import { Link } from '../routes/navigation.jsx';

export default function NotFoundPage() {
  return (
    <main className="main-content migration-content">
      <h1>Page not found</h1>
      <p>This address does not match a Kindred page.</p>
      <Link to="/">Return Home</Link>
    </main>
  );
}
