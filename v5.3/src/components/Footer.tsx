import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__main"><Logo /><div><p>Kardna is a fast, polished home for browser games, local favorites, and one more round.</p><span>KARDNA ONLINE <i /></span></div><nav aria-label="Footer navigation"><Link to="/">Home</Link><Link to="/games">Games</Link><Link to="/mix">Mix</Link><Link to="/proxy">Proxy</Link><Link to="/settings">Settings</Link></nav></div>
      <div className="site-footer__bottom"><span>© {new Date().getFullYear()} KARDNA</span><span>NO ACCOUNT REQUIRED</span><span>BUILT FOR PLAY / OPTIMIZED FOR SPEED</span></div>
    </footer>
  );
}
