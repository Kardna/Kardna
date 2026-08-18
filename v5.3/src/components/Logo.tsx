import { Link } from "react-router-dom";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`brand ${compact ? "brand--compact" : ""}`} to="/" aria-label="Kardna home">
      <span className="brand__mark" aria-hidden="true"><i /><i /><i /></span>
      <span className="brand__word">KARDNA</span>
    </Link>
  );
}
