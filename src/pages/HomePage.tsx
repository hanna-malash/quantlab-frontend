import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <h2>Home</h2>
      <p>
        QuantLab is a backend-first analytics dashboard for exploring asset time
        series and risk metrics.
      </p>
      <ul>
        <li>
          Asset detail dashboard with price, returns, volatility, and drawdown
        </li>
        <li>Compare view with backend-powered correlation matrix analysis</li>
        <li>Range-based chart exploration with UTC-normalized date labels</li>
        <li>Typed frontend API layer backed by analytics endpoints</li>
      </ul>
      <p>
        Start with the <Link to="/assets">Assets</Link> page to explore the
        analytics dashboard for a symbol.
      </p>
    </div>
  );
}
