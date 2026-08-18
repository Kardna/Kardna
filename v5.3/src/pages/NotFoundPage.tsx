import { Link } from "react-router-dom";

type Props = { compact?: boolean; title?: string; text?: string };

export function NotFoundPage({ compact = false, title = "Signal lost.", text = "That page is not in the Kardna index." }: Props) {
  return <main id="main-content" className={`not-found ${compact ? "not-found--compact" : ""}`}><p className="channel-label">ERROR / ROUTE NOT FOUND</p><div className="not-found__number"><span>4</span><i>×</i><span>4</span></div><h1>{title}</h1><p>{text}</p><div><Link to="/">RETURN HOME</Link><Link to="/games">OPEN LIBRARY</Link></div></main>;
}
