"use client";
import Data from "../../Data/Data.json"
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import axios from "axios";

export default function SalesQoutation() {

  const [showWindow, setShowWindow] = useState(false);
  const [showWindow2, setShowWindow2] = useState(false);

  const toggleWindow = () => {
    setShowWindow(!showWindow);
  };

  const toggleWindow2 = () => {
    setShowWindow2(!showWindow2);
  };

  const handleDrag = (e: any, ui: any) => {
    e.stopPropagation(); // Stop the propagation of the drag event
  };

  return (
    <>
      <div style={{fontFamily: 'Arial'}}>
        <button onClick={toggleWindow}>Show Window</button>
        {showWindow && (
          <Draggable >
            <div style={{
            
          }} className=" bg-white container text-left SalesOrderDiv">
              <div className="p-1 float cursor-move grid grid-cols-2">
                <div>Items</div>
                <div className="flex justify-end">
                  <div><span className="text-sm text-indigo-400 cursor-pointer" onClick={toggleWindow}>❌</span></div>
                </div>
              </div>
              <div className="p-2 SalesOrderDivBody">
                <div>
                    <div className="grid grid-cols-2">
                      <div className="w-[300px] salesForms">
                        <div className="grid grid-cols-2 items-center">
                          <label htmlFor="documentnumber">Document Number</label>
                          <input type="text" />
                        </div>
                        <div className="grid grid-cols-2 items-center">
                          <label htmlFor="documentnumber">Draft Number</label>
                          <input type="text" readOnly/>
                        </div>
                        <div className="grid grid-cols-2 items-center">
                          <label htmlFor="entrynumber">Entry Number</label>
                          <input type="text" readOnly/>
                        </div>
                        <div className="grid grid-cols-2 items-center">
                          <label htmlFor="entrynumber">Document Date</label>
                          <input type="date" readOnly/>
                        </div>
                        <div className="grid grid-cols-2 items-center">
                          <label htmlFor="entrynumber">Posting Date</label>
                          <input type="date" readOnly/>
                        </div>
                        <div className="grid grid-cols-2 items-center">
                          <label htmlFor="entrynumber">Delivery Date</label>
                          <input type="date" />
                        </div>
                        <div className="grid grid-cols-2 items-center">
                          <label htmlFor="entrynumber">Due Date</label>
                          <input type="date" />
                          </div>
                      </div>
                      <button>Show Window 2</button>
                      <div>
                        {
                          showWindow2 && (
                            <Draggable onDrag={handleDrag}>
                              <div>
                                Hello
                              </div>
                            </Draggable>
                          )
                        }
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </Draggable>
        )}
      </div>
    </>
  );
}
