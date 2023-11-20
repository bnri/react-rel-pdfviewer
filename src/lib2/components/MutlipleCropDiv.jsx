import React, { useRef, useState, useEffect ,forwardRef,useImperativeHandle,createRef} from 'react';
import shortid from 'shortid';
import "./MultipleCropDiv.scss";
// import Crop from './Crop';
import CropArea from './CropArea';
import _ from "lodash";
//https://github.com/beizhedenglong/react-multi-crops/blob/master/src/components/Crop.js


const isValidPoint = (point) => {
  const strictNumber = (number) => !Number.isNaN(number);
  return strictNumber(point.x) && strictNumber(point.y);
};

const MultipleCropDiv = forwardRef((props,ref) => {
  const { AOI_mode, coordinates, pageIndex } = props;
  const drawingIndexRef = useRef(-1);
  const pointARef = useRef(null);


  const idRef = useRef(shortid.generate());
  const containerRef = useRef(null);
  const cropAreaRefArr = useRef(Array.from({ length: coordinates.length }, () => createRef()));

  useImperativeHandle(ref, () => ({
    set_focusArea(AreaNumber) {
        // cropAreaRef.current.focus();
        // console.log("cropAreaRefArr",cropAreaRefArr)
        console.log("cropAreaRefArr.current",cropAreaRefArr.current)
        // console.log("cropAreaRefArr[AreaNumber-1]",cropAreaRefArr.current[AreaNumber-1])
        if(cropAreaRefArr.current&&cropAreaRefArr.current[AreaNumber-1]){
          cropAreaRefArr.current[AreaNumber-1].current.set_focusArea();
        }

        // cropAreaRefArr[AreaNumber-1].current.set_focusArea();
    },
    

  }), []);


  const getCursorPosition = (e) => {
    const { left, top } = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    const x = e.clientX - left;
    const y = e.clientY - top;
    return {
      x: x,
      y: y,
      xr: x / containerWidth,
      yr: y / containerHeight,

    };
  };

  const handleMouseDown = (e) => {
    const { coordinates } = props;
    if (e.target === containerRef.current) {
      const pointA = getCursorPosition(e);
      // console.log("마우스다운위치", pointA)
      drawingIndexRef.current = coordinates.length;
      pointARef.current = pointA;


      idRef.current = shortid.generate();
    }
  };

  const handleMouseMove = (e) => {
    const { onDraw, onChange, coordinates } = props;
    const pointA = pointARef.current;
    if (!pointA) return;
    if (!AOI_mode) return;

    if (pointA) {
      // console.log("pointA", pointA)
      const pointB = getCursorPosition(e);

      let type;
      if (AOI_mode === 1) {
        type = "quiz"
      }
      else if (AOI_mode === 2) {
        type = "pic"
      }
      else if (AOI_mode === 3) {
        type = "text"
      }


      // Get the drawing coordinate
      const tempCoordinate = {
        x: Math.min(pointA.x, pointB.x),
        y: Math.min(pointA.y, pointB.y),
        widthr: Math.abs(pointA.xr - pointB.xr),
        heightr: Math.abs(pointA.yr - pointB.yr),
        xr: Math.min(pointA.xr, pointB.xr),
        yr: Math.min(pointA.yr, pointB.yr),
        id: idRef.current,
        type: type
      };

      const nextCoordinates = [...coordinates];
      nextCoordinates[drawingIndexRef.current] = tempCoordinate;

      if (typeof onDraw === 'function') {
        onDraw(tempCoordinate, drawingIndexRef.current, nextCoordinates);
      }

      if (typeof onChange === 'function') {
        onChange(tempCoordinate, drawingIndexRef.current, nextCoordinates);
      }
    }
  }

  const [containerInform, set_containerInform] = useState();
  useEffect(() => {
    if (!containerRef.current) return;
    const wrapEl = containerRef.current;

    function resetContainerInform() {
      const containerWidth = wrapEl.offsetWidth;
      const containerHeight = wrapEl.offsetHeight;
      set_containerInform({
        width: containerWidth,
        height: containerHeight,

      })
    }
    // const debouncedResetContainerInform = _.debounce((arg) => {
    //   resetContainerInform(arg)
    // }, 10);

    const resizeObserver = new ResizeObserver(entries => {
      // 크기 변경시 실행할 작업을 여기에 작성합니다.
      entries.forEach(entry => {
        // console.log('@@@@@@@@@@@@@@@@PDFDocument 껍데기의 크기가 변경되었습니다!', entry.contentRect.width, entry.contentRect.height);
        // set_renderWidth(entry.contentRect.width * viewPercent / 100);
        // const contentWidth = wrapEl.offsetWidth;
        // const contentHeight = wrapEl.offsetHeight;
        // debouncedResetContainerInform();
        resetContainerInform();
      });
    });
    resizeObserver.observe(wrapEl);
    return () => {
      resizeObserver.disconnect();
    }

  }, []);



  const handleMouseUp = () => {
    pointARef.current = null;
    // const {onAddCoordinate}= props;
    // if (typeof onAddCoordinate === 'function') {
    //   onAddCoordinate()
    // }

  };

  const handleMouseLeave = () => {
    pointARef.current = null;

  }


  return (<div className="Cropcontainer no-drag"
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave}
    onMouseUp={handleMouseUp}
    ref={containerRef}
  >

    {containerInform && coordinates && coordinates.map((coordinate, index) => {
      // console.log("coordinate",coordinate)
      return (
        <CropArea
          ref={cropAreaRefArr.current[index]}
          key={coordinate.id || index}
          areaIndex={index}
          pageIndex={pageIndex}
          containerInform={containerInform}
          coordinate={coordinate}
          {...props}
        />
      )
    })}


  </div>)
},[]);



export default MultipleCropDiv;