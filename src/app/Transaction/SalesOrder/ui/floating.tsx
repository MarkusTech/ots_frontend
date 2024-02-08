import React from "react";

const FloatingPanel = () => {
  return (
    <div className="absolute bottom-2 right-2 rounded-lg bg-white flex gap-3 shadow-xl text-[13px]">
      <div className="flex gap-2 p-2 transition-all hover:text-[#F0AB00]">
        <div className="">User:</div>
        <span className="underline">Administrator</span>
      </div>
      <div className="flex gap-2 p-2">
        <div>Branch ID:</div>
        <span className="underline">4</span>
      </div>
      <div className="flex gap-2 p-2">
        <div>Branch:</div>
        <span className="underline">GENSAN BRANCH</span>
      </div>
      <div className="flex gap-2 p-2">
        <div>WHS Code:</div>
        <span className="underline">GSCNAPGS</span>
      </div>
      <div className="flex gap-2 p-2">
        <div>Pricelist Num:</div>
        <span className="underline">14</span>
      </div>
    </div>
  );
};

export default FloatingPanel;
