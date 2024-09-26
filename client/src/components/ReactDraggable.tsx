import React, { ReactNode } from "react";
import Draggable from "react-draggable";

interface DraggableComponentProps {
  children: ReactNode;
  initialPosition?: { x: number; y: number };
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  children,
  initialPosition = { x: 0, y: 0 },
}) => {
  return (
    <Draggable defaultPosition={initialPosition}>
      <div className="bg-white shadow-lg" style={{ position: "absolute" }}>
        {children}
      </div>
    </Draggable>
  );
};

export default DraggableComponent;
