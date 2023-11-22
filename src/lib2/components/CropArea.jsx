import React, { useState, useCallback, useEffect, useRef  ,forwardRef,useImperativeHandle} from 'react';
import interact from 'interactjs';
const CropArea = forwardRef((props, ref) => {
    const {set_selAOI, onMove,onResize, pageIndex, areaIndex, coordinate, containerInform, onDelete } = props;
    const [isFocused, setIsFocused] = useState(false);
    const cropAreaRef = useRef();
    
    useImperativeHandle(ref, () => ({
        set_focusArea() {
            cropAreaRef.current.focus();
        },
    }), []);



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
        if(!isFocused){
            set_selAOI(null);
        }
        else{
            set_selAOI({
                pageNumber:pageIndex+1,
                AOINumber:areaIndex+1
            })
        }
    },[isFocused,pageIndex,areaIndex,set_selAOI])

    useEffect(() => {
        if (!containerInform) return;
        // console.log("coordinate",coordinate);
        // console.log("@@@@@@@@@@이벤트등록")
        const interactInstance = interact(cropAreaRef.current);


        const handleResizeMove = (e) => {
            if (onResize) {
                onResize(pageIndex, areaIndex, e, containerInform);
            }
        };

        const handleDragMove = (e) => {
            if(onMove){
                onMove(pageIndex, areaIndex, e, containerInform);
            }
        };
        // console.log("containerInform",containerInform)

        interactInstance.draggable({
            modifiers: [
                // keep the edges inside the parent
                interact.modifiers.restrictEdges({
                    outer: 'parent',
                    
                }),
            ],
            autoScroll:true
        }).resizable({
            edges: {
                left: true, right: true, bottom: true, top: true,
            },
            modifiers: [
                // keep the edges inside the parent
                interact.modifiers.restrictEdges({
                    outer: 'parent'
                }),

                // minimum size
                interact.modifiers.restrictSize({
                    min: {
                        width: containerInform.width*0.05,
                        height: containerInform.height*0.05
                    }
                })
            ],
        }).on('dragmove',handleDragMove)
        .on('resizemove', handleResizeMove);


        // interactInstance.on('dragmove', handleDragMove);
        // interactInstance.on('resizemove', handleResizeMove);

        return () => {
            // Clean up the interact instance when the component unmounts
            interactInstance.unset();
        };
    }, [containerInform, pageIndex, areaIndex, onResize,onMove]);


    


    return (<div className="CropArea" ref={cropAreaRef} style={cropStyle()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
            // console.log("~~~불러호출?")
            setIsFocused(false)
            set_selAOI(null);
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
},[]);

export default CropArea;