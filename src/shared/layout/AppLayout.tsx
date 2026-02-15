import { NavLink, Outlet } from "react-router-dom";

const linkStyle = ({ isActive }: { isActive: boolean }) => {
  return {
    marginRight: "12px",
    textDecoration: "none",
    fontWeight: isActive ? "700" : "400",
    borderBottom: isActive ? "2px solid currentColor" : "2px solid transparent",
    paddingBottom: "4px",
  };
};

export default function AppLayout() {
  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>
      <header
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: "18px",
        }}
      >
        <div style={{ fontSize: "18px", fontWeight: 800 }}>QuantLab</div>
        <nav>
          <NavLink to="/prices" style={linkStyle}>
            Prices
          </NavLink>
          <NavLink to="/returns" style={linkStyle}>
            Returns
          </NavLink>
          <NavLink to="/volatility" style={linkStyle}>
            Volatility
          </NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
