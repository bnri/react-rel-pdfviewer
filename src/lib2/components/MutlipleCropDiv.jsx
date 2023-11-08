import React, { useRef } from 'react';
import shortid from 'shortid';
//https://github.com/beizhedenglong/react-multi-crops/blob/master/src/components/Crop.js


const isValidPoint = (point) => {
  const strictNumber = (number) => !Number.isNaN(number);
  return strictNumber(point.x) && strictNumber(point.y);
};

const MultipleCropDiv = (props) => {
    const { coordinates } = props;
    const drawingIndexRef = useRef(-1);
    const pointARef = useRef({});
    const idRef = useRef(shortid.generate());
  
    const getCursorPosition = (e) => {
      const { left, top } = containerRef.current.getBoundingClientRect();
      return {
        x: e.clientX - left,
        y: e.clientY - top,
      };
    };
  
    const handleMouseDown = (e) => {
      const { coordinates } = props;
      if (e.target === imgRef.current || e.target === containerRef.current) {
        const { x, y } = getCursorPosition(e);
  
        drawingIndexRef.current = coordinates.length;
        pointARef.current = { x, y };
        idRef.current = shortid.generate();
      }
    };
  
    const handleMouseMove = (e) => {
      const { onDraw, onChange, coordinates } = props;
      const pointA = pointARef.current;
  
      if (isValidPoint(pointA)) {
        const pointB = getCursorPosition(e);
  
        // Get the drawing coordinate
        const coordinate = {
          x: Math.min(pointA.x, pointB.x),
          y: Math.min(pointA.y, pointB.y),
          width: Math.abs(pointA.x - pointB.x),
          height: Math.abs(pointA.y - pointB.y),
          id: idRef.current,
        };
  
        const nextCoordinates = [...coordinates];
        nextCoordinates[drawingIndexRef.current] = coordinate;
  
        if (typeof onDraw === 'function') {
          onDraw(coordinate, drawingIndexRef.current, nextCoordinates);
        }
  
        if (typeof onChange === 'function') {
          onChange(coordinate, drawingIndexRef.current, nextCoordinates);
        }
      }
    };
  
    const handleMouseUp = () => {
      pointARef.current = {};
    };
  
    const containerRef = useRef(null);
    const imgRef = useRef(null);

    return (<div className="Cropcontainer"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={containerRef}
    >


    {coordinates.map((coordinate,index)=>{

        return (<div   key={coordinate.id || index}>
                a
            </div>
            //   <Crop
            //   key={coor.id || index}
            //   index={index}
            //   coordinate={coor}
            //   {...props}
            // />
            )

    })}


    </div>)
}


export default MultipleCropDiv;