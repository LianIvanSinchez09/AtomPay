import { Link } from "react-router-dom";
import "./NavLogo.css";

const NavLogo = () => {
  return (
    <>
      <div className=" flex gap-1 justify-center items-center">
        <Link
          to="/"
          data-text="AtomPay"
          className="navLogo font-bold dark:text-[#A7D129]"
        >
          AtomPay
        </Link>
      </div>
    </>
  );
};

export default NavLogo;
