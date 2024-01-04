import "../App.css";
// import Login from './Components/Login';
import Logo from "./Logo";
import TopNav from "./TopNav";

function Header() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        height: "95px",
      }}
    >
      <Logo />
      <TopNav />
    </div>
  );
}

export default Header;
