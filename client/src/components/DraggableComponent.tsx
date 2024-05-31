// DraggableComponent.tsx
import React, { ReactNode } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

interface DraggableComponentProps {
  children: ReactNode;
  initialPosition?: { x: number; y: number };
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  children,
  initialPosition = { x: 0, y: 0 },
}) => {
  const [{ x, y }, api] = useSpring(() => ({
    x: initialPosition.x,
    y: initialPosition.y,
  }));

  const bind = useDrag(({ offset: [x, y] }) => {
    api.start({ x, y });
  });

  return (
    <animated.div
      {...bind()}
      style={{ x, y, touchAction: "none", position: "absolute" }}
      className="bg-white shadow-lg"
    >
      {children}
    </animated.div>
  );
};

export default DraggableComponent;
