import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const linkStyle = ({ isActive }: { isActive: boolean }) => {
  return {
    marginRight: "12px",
    textDecoration: "none",
    fontWeight: isActive ? "700" : "400",
    borderBottom: isActive ? "2px solid currentColor" : "2px solid transparent",
    paddingBottom: "4px",
  };
};

async function checkBackend(): Promise<boolean> {
  try {
    const response = await fetch("/api/health");
    return response.ok;
  } catch {
    return false;
  }
}

export default function AppLayout() {
  const [backendOk, setBackendOk] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    async function load(): Promise<void> {
      const ok = await checkBackend();
      if (isCancelled) {
        return;
      }
      setBackendOk(ok);
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>
      <header
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: "18px",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
          <div style={{ fontSize: "18px", fontWeight: 800 }}>QuantLab</div>
          <div style={{ fontSize: "12px", opacity: 0.75 }}>
            Backend: {backendOk ? "connected" : "not connected"}
          </div>
        </div>

        <nav>
          <NavLink to="/" style={linkStyle}>
            Home
          </NavLink>
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
