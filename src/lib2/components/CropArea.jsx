import React, { useState, useCallback, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import interact from 'interactjs';
import TextInput from './TextInput';

//#@!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!@@!
const CropArea = forwardRef((props, ref) => {
    const { onFixCropName, set_selAOI, onMove, onResize, pageIndex, areaIndex, coordinate, containerInform, onDelete } = props;
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

    useEffect(() => {
        if (!isFocused) {
            console.log("포커스풀림", pageIndex, areaIndex)
            set_selAOI(null);

        }

    }, [isFocused, set_selAOI, pageIndex, areaIndex]);

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
            if (onMove) {
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
            autoScroll: true
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
                        width: containerInform.width * 0.05,
                        height: containerInform.height * 0.05
                    }
                })
            ],
        }).on('dragmove', handleDragMove)
            .on('resizemove', handleResizeMove);


        // interactInstance.on('dragmove', handleDragMove);
        // interactInstance.on('resizemove', handleResizeMove);

        return () => {
            // Clean up the interact instance when the component unmounts
            interactInstance.unset();
        };
    }, [containerInform, pageIndex, areaIndex, onResize, onMove]);



    const handleFocus = () => {
        setIsFocused(true);
        if (set_selAOI) {
            set_selAOI({
                pageNumber: pageIndex + 1,
                AOINumber: areaIndex + 1
            });
        }
    };
    const handleBlur = (e) => {
        console.log("공통 Blur")
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        e.stopPropagation();
        const isChildElement = (parent, target) => {
            if (!parent || !target) {
                return false;
            }
        
            if (parent === target) {
                return true;
            }
        
            for (let i = 0; i < parent.children.length; i++) {
                const child = parent.children[i];
                if (isChildElement(child, target)) {
                    return true;
                }
            }
        
            return false;
        };

        // const isChildClick = e.currentTarget.contains(e.relatedTarget);
        const isChildClick = isChildElement(e.currentTarget, e.relatedTarget);
        // e.target // input.realInput 인데 이미

        console.log("isChildClick",isChildClick);
        // console.log("isTextInputChildClick",isTextInputChildClick)
        if (!isChildClick ) {
            console.log("1.CropArea의 handleBlur");
            console.log("e.target",e)
            //여기 e를 찍어봤는데..
            //<TextInput 밖에를 클릭해서..여기 blur가 호출되는것은 정상이다.
            //<TExtInput 내의 다른 버튼을 눌렀는데도 여기가 호출이 되는버그가 발생..
            //이것을 고쳐야한다..
            // setIsFocused(false);

            // if (set_selAOI) {
            //     set_selAOI(null);
            // }
        }
        else {
            console.log("2.차일드클릭")
        }
    };
    //   console.log("coordinate",coordinate)
    return (<div className="CropArea" ref={cropAreaRef} style={cropStyle()}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
    >
        <div className={`CropAreaWrapper ${isFocused ? 'active-animatioon' : ''}`}>
            {isFocused &&
                <div className="topBar">
                    <div className="fixCropName">
                        <TextInput
                            value={coordinate.name}
                            onChange={(newFileName) => {
                                // set_fileName(newFileName)

                                if (onFixCropName) {
                                    onFixCropName(coordinate, newFileName);
                                    // cropAreaRef.current.focus();
                                    // handleBlur();
                                    //onChange이후에 밖으로 마우스클릭시 handleBLur가
                                    //호출되지 않아서 그냥 강제로 호출하니까 해결하긴했는데
                                    //올바른 해결방법이 아님..포커싱이 풀림
                                }
                            }}
                        />
                    </div>
                    <div className="delCrop" onClick={() => {
                        onDelete(coordinate)
                    }}>
                        X
                    </div>
                </div>

            }

        </div>

    </div>)
}, []);

export default CropArea;