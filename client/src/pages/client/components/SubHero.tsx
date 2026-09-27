import React from "react";
import type { IconType } from "react-icons";
import { LuCrown, LuLeaf, LuTruck } from "react-icons/lu";

interface Icons {
  text: string;
  icon: IconType;
}

function SubHero() {
  const icon: Icons[] = [
    { text: "Fresh ingredients", icon: LuLeaf },
    { text: "Fast Delivery", icon: LuTruck },
    { text: "Royal Taste", icon: LuCrown },
  ];

  return (
    <div className="w-full">
      <div className="flex lg:gap-40 xl:gap-48">
        {icon.map((items, index) => (
          <div key={index} className="flex gap-4 w-10 items-center">
            <div className="p-2 md:p-3 border border-secondary rounded-full">
              <items.icon className=" xl:w-6 xl:h-6 text-secondary" />
            </div>
            <p className="text-background/60 lg:text-xs xl:text-base">{items.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubHero;
