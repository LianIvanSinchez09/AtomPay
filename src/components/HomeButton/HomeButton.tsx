import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../pages/public/Home/Logo";

const NATIVE = 400;
const ORBIT2 = 1.2;
const SLOT = 60;
const SCALE = SLOT / (NATIVE * ORBIT2);

const HomeButton = () => {
  return (
    <Link
      to="/dashboard"
      className="group m-5 inline-flex items-center font-bold"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none relative shrink-0"
        style={{ width: SLOT, height: SLOT }}
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: NATIVE, height: NATIVE, zoom: SCALE }}
        >
          <Logo
            spinning={true}
            circle={false}
            bubbles={false}
            width={NATIVE}
            height={NATIVE}
          />
        </div>
      </div>

      <span className="text-2xl transition-colors group-hover:text-[#A7D129]">
        AtomPay
      </span>
    </Link>
  );
};

export default HomeButton;