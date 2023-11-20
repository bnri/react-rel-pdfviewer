import { useState, useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js`;


const PDFpreview = (props) => {
    const {
        preparedPreviewPages,
        handlePreviewChange,
        previewOption,
        leftPreviewShow,
        nowPage,
        dynamicAllPageRef,
        tempAOI
    } = props;

    const PDFpreviewRef = useRef();

    //스크롤 자동이동 nowPage이동에 따른
    useEffect(() => {
        if (PDFpreviewRef.current) {
            // 계산을 통해 onePageWrap이 보이게 하는 로직을 작성합니다.
            const pageWrapHeight = PDFpreviewRef.current.offsetHeight;
            // const scrollContainerHeight = PDFpreviewRef.current.scrollHeight;
            const currentScroll = PDFpreviewRef.current.scrollTop;

            let visibleMin = currentScroll;
            let visibleMax = currentScroll + pageWrapHeight;

            // console.log("pageWrapHeight",pageWrapHeight)
            // console.log("scrollContainerHeight",scrollContainerHeight);
            // console.log("visibleMin",visibleMin,visibleMax)

            // let data=[];
            let hs = 0;

            for (let i = 0; i < preparedPreviewPages.length; i++) {
                const onePage = preparedPreviewPages[i];
                let onePageHeight = onePage.wrapperSize.height + previewOption.pageMargin + 25;
                // data.push({
                //     pageNumber: i+1,
                //     pageHeight:onePageHeight,
                //     viewMinScrollHeight:hs,
                //     viewMaxScrollHeight:hs+onePageHeight,
                //     visible: hs>=visibleMin && (hs+onePageHeight)<=visibleMax ? true:false       
                // });

                if (nowPage === i + 1) {
                    let isneedtomovescroll = hs >= visibleMin && (hs + onePageHeight) <= visibleMax ? false : true;
                    if (isneedtomovescroll) {
                        //위아래인지 구분
                        PDFpreviewRef.current.scrollTop = hs;
                    }
                }
                hs += onePageHeight;
            }
        }
    }, [nowPage, preparedPreviewPages, previewOption]);

    const [foldPreview, set_foldPreview] = useState(false);
    const [foldAreaview, set_foldAreaview] = useState(true);
    const handleScrollTothePage = (pageNumber)=>{
        if (dynamicAllPageRef && dynamicAllPageRef.current) {
           // console.log(dynamicAllPageRef.current);
           dynamicAllPageRef.current.set_scrollMoveToPage(pageNumber);
       }
}
    return (<div className="PDFpreview no-drag"

        style={{
            ...previewOption.wrapperStyle,
            left: leftPreviewShow ? 0 : -(previewOption.wrapperStyle.width + previewOption.pageMargin * 2)

        }}>
        <div className="onePreView">
            <div className="previewTitle" onClick={() => set_foldPreview(d => !d)}>
                <svg fill="#fff"
                    style={{
                        transform: foldPreview ? "rotate(-90deg)" : "",
                    }}
                    width="16px" height="16px" viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M 4.21875 10.78125 L 2.78125 12.21875 L 15.28125 24.71875 L 16 25.40625 L 16.71875 24.71875 L 29.21875 12.21875 L 27.78125 10.78125 L 16 22.5625 Z" /></svg>
                &nbsp;PDF Page List
            </div>
            <div className="previewContents" style={{ maxHeight: foldPreview ? 0 : '100%' }} ref={PDFpreviewRef}>
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
                                        handleScrollTothePage(index+1);
                                    }} />
                                </div>


                                <div className="pageNumberWrapper">
                                    {index + 1}
                                </div>
                            </div>)
                    })
                }
                {/* <div style={{height:25}}/> */}
            </div>
            <div className="previewTitle" onClick={() => set_foldAreaview(d => !d)}>
                <svg fill="#fff"
                    style={{
                        transform: foldAreaview ? "rotate(-90deg)" : "",
                    }}
                    width="16px" height="16px" viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M 4.21875 10.78125 L 2.78125 12.21875 L 15.28125 24.71875 L 16 25.40625 L 16.71875 24.71875 L 29.21875 12.21875 L 27.78125 10.78125 L 16 22.5625 Z" /></svg>
                &nbsp;Area List
            </div>
            <div className="previewContents" style={{ maxHeight: foldAreaview ? '0' : '100%' }}>
                {tempAOI && tempAOI.map((pageAOI, index) => {
                    return (<div key={`pageAOI_${index}`}>
                        <div className="pageAOIGroup" onClick={()=>{
                            handleScrollTothePage(index+1);
                        }}>
                            {(index + 1) + 'page AOI'}
                        </div>
                        {pageAOI.map((oneAOI,AOIindex)=>{
                            // console.log("oneAOI",oneAOI)
                            const AOI_type = oneAOI.type;

                            return (<div className={`oneAOI ${AOI_type}`} onClick={()=>{
                                handleScrollTothePage(index+1);
                                if(dynamicAllPageRef&&dynamicAllPageRef.current){
                                    dynamicAllPageRef.current.set_focusAOIArea(index+1,AOIindex+1);
                                }
                            }}>
                                &nbsp;{(AOIindex+1)+'AOI - '+AOI_type}
                                </div>)
                        })}
                    </div>)
                }, [])}

            </div>
        </div>



    </div>)

}
export default PDFpreview;