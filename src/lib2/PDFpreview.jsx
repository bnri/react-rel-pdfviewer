import { useState, useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js`;


const PDFpreview = (props) => {
    const {
        preparedPreviewPages,
        handlePreviewChange,
        previewOption,
        leftPreviewShow,
        nowPage
    } = props;

    const PDFpreviewRef = useRef();

    useEffect(() => {
        if (PDFpreviewRef.current) {
            // 계산을 통해 onePageWrap이 보이게 하는 로직을 작성합니다.
            const pageWrapHeight = PDFpreviewRef.current.offsetHeight;
            // const scrollContainerHeight = PDFpreviewRef.current.scrollHeight;
            const currentScroll=PDFpreviewRef.current.scrollTop;

            let visibleMin = currentScroll;
            let visibleMax = currentScroll+pageWrapHeight;

            // console.log("pageWrapHeight",pageWrapHeight)
            // console.log("scrollContainerHeight",scrollContainerHeight);
            // console.log("visibleMin",visibleMin,visibleMax)
            
            // let data=[];
            let hs = 0;

            for(let i = 0 ; i<preparedPreviewPages.length; i++){
                const onePage = preparedPreviewPages[i];
                let onePageHeight=onePage.wrapperSize.height + previewOption.pageMargin+25;
                // data.push({
                //     pageNumber: i+1,
                //     pageHeight:onePageHeight,
                //     viewMinScrollHeight:hs,
                //     viewMaxScrollHeight:hs+onePageHeight,
                //     visible: hs>=visibleMin && (hs+onePageHeight)<=visibleMax ? true:false       
                // });
                
                if(nowPage===i+1){
                    let isneedtomovescroll=hs>=visibleMin && (hs+onePageHeight)<=visibleMax ?false:true;
                    if(isneedtomovescroll){
                        //위아래인지 구분
                        PDFpreviewRef.current.scrollTop=hs;
                    }
                }
                hs+=onePageHeight;
            }
        }
    }, [nowPage, preparedPreviewPages,previewOption]);


    return (<div className="PDFpreview" 
        ref={PDFpreviewRef}
        style={{
        ...previewOption.wrapperStyle,
        left: leftPreviewShow ? 0: -(previewOption.wrapperStyle.width+previewOption.pageMargin*2) 

    }}>
        {previewOption && preparedPreviewPages &&
            preparedPreviewPages.map((onePage, index) => {
                return (
                    <div className="onePageWrap"
                        style={{
                            marginTop: previewOption.pageMargin,
                        }}
                        key={'preview_' + index}
                    >
                        <div style={{
                            position: 'relative',
                            width: onePage.wrapperSize.width,
                            height: onePage.wrapperSize.height,
                        }}>
                            <canvas
                                className="onePageCanvas"
                                style={{
                                    width: '100%',
                                    height: '100%'
                                }}
                                width={onePage.canvasSize.width} // Set the canvas width
                                height={onePage.canvasSize.height} // Set the canvas height

                                ref={(canvas) => {
                                    // console.log("onePage",onePage);
                                    if (canvas && onePage.canvas) {
                                        // Get the canvas's 2D rendering context
                                        const context = canvas.getContext('2d');
                                        // Draw the canvas content onto the canvas element
                                        context.drawImage(onePage.canvas, 0, 0);
                                        // delete onePage.canvas;
                                    }
                                }}

                            />
                            <div className={`onePageBlur ${nowPage === (index * 1 + 1) ? 'selPage' : ''}`} onClick={() => {
                                if (handlePreviewChange) {
                                    handlePreviewChange(index + 1);
                                    //#@! 스크롤이 있다면 이동

                                }
                            }} />
                        </div>


                        <div className="pageNumberWrapper">
                            {index + 1}
                        </div>
                    </div>)
            })
        }

    </div>)

}
export default PDFpreview;