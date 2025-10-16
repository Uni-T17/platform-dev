import React from "react";
import { SketchLogoIcon, PlusIcon, PersonIcon } from "@radix-ui/react-icons";
import { MinusIcon } from "lucide-react";
import { PieChart } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { Clock } from "lucide-react";

function Icons() {
  return (
    <div>
      <SketchLogoIcon />
      <PlusIcon />
      <PersonIcon />
      <MinusIcon />
      <PieChart />
      <CheckCircle />
      <Clock />
    </div>
  );
}

export default Icons;
