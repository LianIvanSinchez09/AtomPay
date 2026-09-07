import { SidepanelProps } from "../../types/types";
import { JSX } from "react/jsx-runtime";
import { customWidth } from "../../types/types";


export default function Sidepanel({width, mainTitle, 
  children
}: SidepanelProps): JSX.Element {

const customWidth: customWidth = {
  sm: "w-64",
  md: "w-80",
  lg: "w-96",
}

return (
    <div className={`h-screen ${customWidth[width]} bg-[#4D869C] flex flex-col font-sans gap-10`}>
      <div className="flex items-center justify-between px-4 pt-5 pb-2">
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold">{mainTitle}</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {children}
      </div>
    </div>
  );
}