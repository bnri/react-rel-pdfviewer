import React, { useState, useCallback, useEffect, useRef } from 'react';
import interact from 'interactjs';
const CropArea = (props) => {
    const { onResize, pageIndex, areaIndex, coordinate, containerInform, onDelete } = props;
    const [isFocused, setIsFocused] = useState(false);
    const cropAreaRef = useRef();

    const cropStyle = useCallback(() => {
        if (!containerInform) return;
        const { xr, yr, widthr, heightr, type } = coordinate;
        const containerWidth = containerInform.width;
        const containerHeight = containerInform.height;
        // console.log("containerWidth",containerWidth)
        let backgroundColor;
        if (type === 'quiz') {
            backgroundColor = 'red';
        }
        else if (type === 'pic') {
            backgroundColor = "green"
        }
        else if (type === 'text') {
            backgroundColor = "blue";
        }


        return {
            display: 'inline-block',
            position: 'absolute',
            width: containerWidth * widthr,
            height: containerHeight * heightr,
            top: containerHeight * yr,
            left: containerWidth * xr,
            //   boxShadow: '0 0 6px #000',
            //   background: '#8c8c8c',
            background: backgroundColor,
            opacity: 0.3,
        };
    }, [coordinate, containerInform]);

    useEffect(()=>{
        console.log("isFocused",isFocused);
    },[isFocused]);
    

    useEffect(() => {
        if (!containerInform) return;
        console.log("coordinate",coordinate);
        console.log("????????isFocused",isFocused)
        const interactInstance = interact(cropAreaRef.current);
    

        const handleResizeMove = (e) => {
            const { width: containerWidth, height: containerHeight } = containerInform;
            const { xr, yr, widthr, heightr } = coordinate;
            const x = xr * containerWidth;
            const y = yr * containerHeight;
            const w = containerWidth * widthr;
            const h = containerHeight * heightr;
            //기존의 xr,yr 좌표를 구해야한다.


            const { width, height } = e.rect; //바귄 높이이다.
            const { left, top } = e.deltaRect;
            console.log("top", top)
            console.log("기존픽셀:", x, y, w, h);
            console.log("바뀐픽셀:", x + left, y + top, width, height);
            // console.log("left",left);
            // console.log("top",top);
            // console.log("width",width);
            // console.log("height",height);
            let newCoordinate = {
                ...coordinate,
                x: x + left,
                y: y + top,
                width: width,
                height: height,
                xr: (x + left) / containerWidth,
                yr: (y + top) / containerHeight,
                widthr: width / containerWidth,
                heightr: height / containerHeight,

            }

            console.log("newCoordinate", newCoordinate);
            console.log(coordinate);

            if (onResize) {
                onResize(pageIndex, areaIndex, newCoordinate);
            }




            // const nextCoordinate = { ...coordinate, x: x + left, y: y + top, width, height };
            // const nextCoordinates = update(index, nextCoordinate, coordinates);

            // if (is(Function, onResize)) {
            //   onResize(nextCoordinate, index, nextCoordinates);
            // }

            // if (is(Function, onChange)) {
            //   onChange(nextCoordinate, index, nextCoordinates);
            // }
        };

        const handleDragMove = (e) => {
            const { x, y } = coordinate;
            const { dx, dy } = e;

            // const nextCoordinate = { ...coordinate, x: x + dx, y: y + dy };
            // const nextCoordinates = update(index, nextCoordinate, coordinates);

            // if (is(Function, onDrag)) {
            //   onDrag(nextCoordinate, index, nextCoordinates);
            // }

            // if (is(Function, onChange)) {
            //   onChange(nextCoordinate, index, nextCoordinates);
            // }
        };


        if (isFocused) {
            //포커스중일때 다시 등록..
            interactInstance.draggable({
                onmove: handleDragMove,
            }).resizable({
                edges: {
                    left: true, right: true, bottom: true, top: true,
                },
            });

        } else {
            console.log("해제 포커스")
            interactInstance.draggable(false);
            interactInstance.resizable(false)
        }
        interactInstance.on('dragmove', handleDragMove);
        interactInstance.on('resizemove', handleResizeMove);

        return () => {
            // Clean up the interact instance when the component unmounts
            interactInstance.unset();
        };
    }, [coordinate, isFocused, containerInform, pageIndex, areaIndex, onResize]);

    


    return (<div className="CropArea" ref={cropAreaRef} style={cropStyle()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
            console.log("~~~불러호출?")
            setIsFocused(false)
        }}
        tabIndex={0}
    >
        <div className={`CropAreaWrapper ${isFocused ? 'active-animatioon' : ''}`}>
            {isFocused &&
                <div className="topBar">
                    <div className="delCrop" onClick={() => {
                        onDelete(coordinate)
                    }}>
                        x
                    </div>
                </div>

            }

        </div>

    </div>)
}
export default CropArea;