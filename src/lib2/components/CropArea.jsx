import React, { useState, useCallback, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import interact from 'interactjs';
import TextInput from './TextInput';

//#@!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!@@!
const CropArea = forwardRef((props, ref) => {
    const { onFixCropName, set_selAOI, onMove, onResize, pageIndex, areaIndex, coordinate, containerInform, onDelete } = props;
    const [isFocused, setIsFocused] = useState(false);
    const cropAreaRef = useRef();

    const textInputRef = useRef();
    const [editMode, set_editMode] = useState(false);


    useImperativeHandle(ref, () => ({
        set_focusArea() {
            cropAreaRef.current.focus();
        },
        set_textEditMode(val){
            // console.log("CropArea의 set_textEditMode 호출")
            set_editMode(val);
        }
    }), []);
    useEffect(()=>{
        if(editMode&&textInputRef.current){
            // console.log("하 다시")
            textInputRef.current.set_textEditMode(true);
            // console.log("editMode",editMode)
            // console.log("textInputRef.current",textInputRef.current)
        }
    },[editMode])

    const cropStyle = useCallback(() => {
        if (!containerInform) return;
        const { xr, yr, widthr, heightr, type } = coordinate;
        const containerWidth = containerInform.width;
        const containerHeight = containerInform.height;
        // console.log("containerWidth",containerWidth)
        let backgroundColor;
        if (type === 'quiz') {
            backgroundColor = 'rgba(255,0,0,.3)';
        }
        else if (type === 'pic') {
            backgroundColor = "rgba(0,255,0,.3)"
        }
        else if (type === 'text') {
            backgroundColor = "rgba(0,0,255,.3)";
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
            // opacity: 0.3,
        };
    }, [coordinate, containerInform]);

    useEffect(() => {
        if (!isFocused) {
            // console.log("포커스풀림", pageIndex, areaIndex)
            set_selAOI(null);

        }
        else {
            // console.log("asfasf")
        }

    }, [isFocused, set_selAOI]);

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
        // console.log("크롭불러호출")
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        e.stopPropagation();
        // console.log("CropArea Blur")

        setIsFocused(false);

    };


    //   console.log("coordinate",coordinate)
    return (<div className="CropArea" ref={cropAreaRef} style={cropStyle()}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
    >
        <div className={`CropAreaWrapper ${isFocused ? 'active-animatioon' : ''}`}>
            {isFocused &&
                <div className="topAOIBar" style={{opacity:1}}>

                    <div className="fixCropName">
                        <TextInput
                            ref={textInputRef}
                            value={coordinate.name}
                            onChange={(newFileName) => {
                                // set_fileName(newFileName)
                                if (onFixCropName) {
                                    onFixCropName(coordinate, newFileName);
                                    // console.log("바뀜")
                                    // cropAreaRef.current.focus();
                                    // handleBlur();
                                    //onChange이후에 밖으로 마우스클릭시 handleBLur가
                                    //호출되지 않아서 그냥 강제로 호출하니까 해결하긴했는데
                                    //올바른 해결방법이 아님..포커싱이 풀림
                                    // setTimeout(function(){
                                        cropAreaRef.current.focus();
                                    // },100);

                                }
                            }}
                            onBlur={(newFileName)=>{
                                if (onFixCropName) {
                                    onFixCropName(coordinate, newFileName);
                                }
                            }}
                            onCancel={()=>{
                                cropAreaRef.current.focus();
                            }}

                            onEditModeChanged={(editMode) => {
                                // console.log("editMode바뀜", editMode)
                                set_editMode(editMode);
                            }}

                        />
                    </div>
                    {!editMode &&
                        <div className="delCrop"
                            onMouseDown={() => {
                                // console.log("딜링트마우스다운")
                                onDelete(coordinate)
                            }}
                        >
                            X
                        </div>
                    }

                </div>

            }

        </div>

    </div>)
}, []);

export default CropArea;