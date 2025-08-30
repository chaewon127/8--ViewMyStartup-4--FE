import Header from "./Header";
import { Outlet } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <div className="inner-container">
          <Outlet />
        </div>
      </main>
    </>
  );
}
