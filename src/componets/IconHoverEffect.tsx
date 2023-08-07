import { ReactNode } from "react";

type IconHoverEffectProps = {
    children: ReactNode;
}

export default function IconHoverEffect({ children}: IconHoverEffectProps) {
  return (
    <div
    className="rounded-full p-2 transition-colors duration-200 outline-gray-500 hover:bg-gray-300 group-hover-bg-gray-300 group-focus-visible:bg-gray-300 focus-visible:bg-gray-300"
    >
        {children}
    </div>
  )
}
