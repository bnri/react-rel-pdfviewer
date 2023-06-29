import React, { useState, useEffect } from "react";
import './PDFviewModal.scss';

import { Document, Page, pdfjs } from 'react-pdf';
// import { Document, Page  } from 'react-pdf/dist/esm/entry.webpack';
//	react-pdf/dist/esm/entry.webpack

// import React from 'react';
import NumberFormat from 'react-number-format';
import { Scrollbars } from "react-custom-scrollbars";
// pdfjs.GlobalWorkerOptions.workerSrc = 'http://localhost:3000/pdf.worker.min.js';
// pdfjs.GlobalWorkerOptions.workerSrc = 'react-pdf/dist/cjs/pdf.worker.min.js';

// console.log("WORKERSRC",a);
pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.bnr.co.kr/externel_modules/react-pdf/5.7.2/pdf.worker.min.js";

// console.log("pdfjs.GlobalWorkerOptions.workerSrc",+pdfjs.GlobalWorkerOptions.workerSrc)
// console.log("window",window.location.origin)
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js;`

// console.log("pdfjs.version",pdfjs.version)
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
const Loading = ({ ...props }) => {
    return <div className="Loading">

        <div className="text">
            ReadersEye
        </div>


    </div>
}


const PDFviewModal = React.forwardRef(({ ...props }, ref) => {
    const {
        drawStart, drawEnd, drawIng, viewPercentChangeCallback,
        WORKERSRC, path, onClose, showViewMode, viewpercent, set_viewpercent, scrollCallback, pageCallback, pdfSizeCallback, onConfirm, showConfirmBtn, PDFonloadCallback } = props;
    // console.log("WORKERSRC",WORKERSRC)
    // console.log("path",path);

    const filepath = React.useMemo(() => {
        // console.log("filepath바뀜");
        return path;
    }, [path])
    const canvasRef = React.useRef();
    const wrapperRef = React.useRef();
    const modalref = React.useRef();
    const prettyscrollref = React.useRef();
    const gazecanvasref = React.useRef();
    const heatmapref = React.useRef();

    const [pdfWidth, set_pdfWidth] = React.useState(null);
    const [pdfHeight, set_pdfHeight] = React.useState(null);

    const [numPages, setNumPages] = React.useState(null);
    const [pageNumber, setPageNumber] = React.useState(1);
    const [viewPercent, set_viewPercent] = React.useState(viewpercent ? viewpercent : 100);



    const [pageWidth, set_pageWidth] = React.useState(0);
    const option = React.useMemo(() => {
        return {
            max: 100,
            min: 40
        }
    }, []);
    // const [pdfScale, set_pdfScale] = React.useState(1);
    async function onDocumentLoadSuccess(obj) {
        const { numPages:np}=obj;
        
        //PDF의 실제 width height을 구할때 사용
        // const pageObj = await obj.getPage(1)
        // const pageHeight = pageObj.view[3];
        // const pageWidth = pageObj.view[2];
        

        setNumPages(np);
        if (PDFonloadCallback) {
            PDFonloadCallback(np);
        }

    }
    const [renderDone, set_renderDone] = useState(false);
    const [canvasSize, set_canvasSize] = React.useState({
        height: 0,
        width: 0
    });

    function onDocumentRenderSuccess() {
        // console.log("확인좀",some);
        // console.log("확인", canvasRef.current.width + 'x' + canvasRef.current.height);
        // set_pdfWidth({
        //     width: canvasRef.current.width,
        //     height: canvasRef.current.height
        // })
        set_renderDone(true);
        const tempratio = (canvasRef.current.height/canvasRef.current.width).toFixed(2);
      
        set_canvasSize({
            width: 1728,
            height: 1728*tempratio
        })
        
        // console.log("tempratio",tempratio);


        if (pdfSizeCallback) {

            //canvasRef.current 는 실제 PDF의 크기를 의미합니다
            //wrapperRef.current 는 PDF wrapper 의 크기를 의미합니다
            //modalref.current 는 실제 스크린의 크기를 의미합니다.
            try {
                pdfSizeCallback({

                    PDF: {
                        width: canvasRef.current.width,
                        height: canvasRef.current.height,
                        leftPixel: (modalref.current.clientWidth - canvasRef.current.width) / 2,
                        topPixel: canvasRef.current.height >= modalref.current.clientHeight ? 0 : (modalref.current.clientHeight - canvasRef.current.height) / 2
                    },
                    PDFwrap: {
                        width: modalref.current.clientWidth * 0.9,
                        height: modalref.current.clientHeight
                    },
                    SCRwrap: {
                        width: modalref.current.clientWidth,
                        height: modalref.current.clientHeight
                    },
                    pageNumber: pageNumber,
                    height_devided_width_ratio:tempratio,
                    // Scrollwrap:{
                    //     width:prettyscrollref.current.clientWidth,
                    //     height:prettyscrollref.current.clientHeight,
                    // }

                });
            }
            catch (e) {
                console.log("에러", e);
            }

        }

        // console.log("확인용",prettyscrollref.current.getClientWidth(),'랑',prettyscrollref.current.getClientHeight())
        set_pdfWidth(canvasRef.current.width);
        set_pdfHeight(canvasRef.current.height);

        //원래 스크롤
        // wrapperRef.current.scrollTop = 0;
        // prettyscrollref.current.scrollTop=0;
        prettyscrollref.current.scrollTop(0);


        // console.log("껍데기 x*y", wrapperRef.current.clientWidth, "x", wrapperRef.current.clientHeight);
        // //PDF view Modal 의 껍데기도 필요함

        // console.log("가장 큰 모달크기 x*y", modalref.current.clientWidth, "y", modalref.current.clientHeight);


    }





    //스크롤이벤트
    React.useEffect(() => {
        if (pageNumber && pageCallback) {
            pageCallback(pageNumber);
        }
    }, [pageNumber, pageCallback])

    const handleWrapperScroll = React.useCallback((e) => {

        // console.log(e.target.scrollTop,"스크롤위치");
        // console.log("scrollCallback",scrollCallback);
        if (scrollCallback) {
            scrollCallback(e.target.scrollTop);
        }

        //사실은 이때랑 같이 이동

    }, [scrollCallback]);





    //
    React.useImperativeHandle(ref, () => ({
        set_pageNumber(val) {
            set_renderDone(false);
            setPageNumber(val);
        },
        set_scrollTop: (val) => {
            // wrapperRef.current.scrollTop = val;
            prettyscrollref.current.scrollTop(val);
        },
        get_pdfSize2: () => {
            return {
                width: pdfWidth,
                height: pdfHeight,
            }
        },
        get_canvasRef: () => {
            return gazecanvasref;
        },
        get_heatmapRef: () => {
            return heatmapref;
        },
        reset_viewPerecent: (val) => {
            set_viewPercent(val);
        },
        get_pdfSize: () => {
            try {
                let obj = {
                    PDF: {
                        width: canvasRef.current.width,
                        height: canvasRef.current.height,
                        leftPixel: (modalref.current.clientWidth - canvasRef.current.width) / 2,
                        topPixel: canvasRef.current.height >= modalref.current.clientHeight ? 0 : (modalref.current.clientHeight - canvasRef.current.height) / 2
                    },
                    PDFwrap: {
                        width: canvasRef.current.width,
                        height: modalref.current.clientHeight
                    },
                    SCRwrap: {
                        width: modalref.current.clientWidth,
                        height: modalref.current.clientHeight
                    },
                }
                return obj;
            }
            catch (e) {
                console.log("get_pdfSize Error");
                return null;
            }

        }

    }), [pdfWidth, pdfHeight]);






    React.useEffect(() => {
        if (viewPercent) {
            if (!modalref || !modalref.current) return;

            let p = (viewPercent - 10) / 100;
            set_pageWidth(modalref.current.clientWidth * p);
        }
    }, [viewPercent]);





    const [drawing, setDrawing] = useState(false);

    const tempDrawedMemory = React.useRef();

    useEffect(() => {
        tempDrawedMemory.current = {};

    }, [])

    const startDrawing = (e) => {

        const { offsetX, offsetY } = e.nativeEvent;
        setDrawing(true);
        if (drawStart) {
            drawStart({ x: offsetX, y: offsetY, pageNumber: pageNumber });
            return;
        }

        /*
        const canvas = gazecanvasref.current;
        const context = canvas.getContext('2d');

        if (!tempDrawedMemory.current[pageNumber]) {
            tempDrawedMemory.current[pageNumber] = {
                drawArr: []
            }
        }

        context.beginPath();
        context.moveTo(offsetX, offsetY);
        tempDrawedMemory.current[pageNumber].drawArr.push({
            type: 'startDrawing',
            x: offsetX,
            y: offsetY,
        });
        */
    };

    const draw = (e) => {
        if (!drawing) return;

        const { offsetX, offsetY } = e.nativeEvent;
        if (drawIng) {
            drawIng({ x: offsetX, y: offsetY, pageNumber: pageNumber });
            return;
        }

        /*
        const canvas = gazecanvasref.current;
        const context = canvas.getContext('2d');
        context.lineTo(offsetX, offsetY);
        context.stroke();
        tempDrawedMemory.current[pageNumber].drawArr.push({
            type: 'draw',
            x: offsetX,
            y: offsetY,
        });
        */
    };

    const stopDrawing = () => {
        if (!drawing) return;
        setDrawing(false);
        if (drawEnd) {
            drawEnd({ pageNumber: pageNumber });
            return;
        }
        /*
        const canvas = gazecanvasref.current;
        const context = canvas.getContext('2d');
        context.closePath();
        tempDrawedMemory.current[pageNumber].drawArr.push({
            type: 'stopDrawing',
        });
        */
    };

    useEffect(() => {
        if (renderDone && pageNumber && tempDrawedMemory.current[pageNumber]) {
            console.log("tempDrawedMemory.current[pageNumber]", tempDrawedMemory.current[pageNumber]);

            let drawArr = tempDrawedMemory.current[pageNumber].drawArr;
            const canvas = gazecanvasref.current;
            // console.log("canvas", canvas)
            const context = canvas.getContext('2d');
            // console.log("pageNumber", pageNumber);
            // console.log("drawArr", drawArr)
            for (let i = 0; i < drawArr.length; i++) {
                if (drawArr[i].type === 'startDrawing') {
                    // console.log("드라우시작")
                    context.beginPath();
                    context.moveTo(drawArr[i].x, drawArr[i].y);
                }
                else if (drawArr[i].type === 'draw') {
                    // console.log("드라우")
                    context.lineTo(drawArr[i].x, drawArr[i].y);
                    context.stroke();
                }
                else if (drawArr[i].type === 'stopDrawing') {
                    // console.log("드라우끝")
                    context.closePath();
                }
            }

        }
    }, [pageNumber, renderDone])
    useEffect(() => {
        if (viewPercentChangeCallback) {
            viewPercentChangeCallback(viewPercent);
        }
    }, [viewPercent, viewPercentChangeCallback])
    return (<div className="PDFviewModal no-drag" ref={modalref}>

        {(!pdfWidth || !pdfHeight) ?
            <div className="PDF-loading">
                <Loading />
            </div>
            :
            <>
                <div className="PageInform">
                    <div>
                        <div>
                            page
                        </div>

                        <div>                   <span style={{ color: 'red' }}>{pageNumber}</span> {'/'} {numPages}
                        </div>

                    </div>



                </div>
                <div className="PageViewPercentWrap">
                    <div className="relativewrap" style={{ display: showViewMode ? 'block' : 'none' }}>
                        <div className="row wraplabel">
                            문서 배율
                        </div>
                        <div className="row">
                            <button className="resizebtn" onClick={() => set_viewPercent(option.max)}>최대</button>
                        </div>
                        <div className="row">
                            <button className="resizebtn" onClick={() => {
                                set_viewPercent((v) => {
                                    // console.log("v",v)
                                    if (v > option.max) return option.max * 1;
                                    else return v * 1 + 1;
                                })
                            }}>+</button>
                        </div>
                        <div className="row">
                            <NumberFormat
                                className="viewPercent" value={viewPercent}
                                suffix={'%'}
                                onValueChange={(values) => {
                                    const { value } = values;
                                    // console.log("formattedValue",formattedValue,"value",value);
                                    let d = value;
                                    if (d > option.max) d = option.max * 1;
                                    if (d < option.min) d = option.min * 1;

                                    set_viewPercent(d)
                                }}


                            />
                        </div>
                        <div className="row">
                            <button className="resizebtn" onClick={() => {
                                set_viewPercent((v) => {
                                    // console.log("v",v)
                                    if (v < option.min) return option.min * 1;
                                    else return v * 1 - 1;
                                })
                            }}>-</button>
                        </div>
                        <div className="row">
                            <button className="resizebtn" onClick={() => set_viewPercent(option.min * 1)}>
                                최소
                            </button>
                        </div>

                    </div>

                </div>
                <div className="PageController-left">
                    <button className="page-btn" disabled={pageNumber > 1 ? false : true} onClick={() => {
                        // if (pageNumber > 1) {
                        set_renderDone(false);
                        setPageNumber(p => p - 1);
                        // }

                    }}>{`<`}</button>
                </div>
                <div className="PageController-right">
                    <button className="page-btn" disabled={pageNumber < numPages ? false : true} onClick={() => {
                        // if (pageNumber < numPages) {
                        set_renderDone(false);
                        setPageNumber(p => p + 1);
                        // }
                    }}>{`>`}</button>
                </div>

                <div className="confirmTab" style={{ display: showConfirmBtn ? '' : 'none' }}>
                    <button className="confirmPDFbtn" onClick={() => {
                        if (showViewMode) {
                            set_viewpercent(viewPercent);
                        }

                        onConfirm();
                    }}>
                        완료
                    </button>
                </div>

                <div className="closeTab">

                    <button className="closePDFbtn" onClick={() => {
                        // if (showViewMode) {
                        //     set_viewpercent(viewPercent);
                        // }




                        onClose();
                    }}>  <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="80%"
                        height="80%"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg></button>
                </div>

            </>
        }


        <div ref={wrapperRef} className="PDF-wrapper"
            style={{
                display: pdfWidth && pdfHeight ? 'flex' : 'none',
            }}>

            <Scrollbars
                ref={prettyscrollref}
                //    onScrollStop={()=>{
                //      console.log("onScrollStop@@");
                //    }}
                onScroll={handleWrapperScroll}
                renderThumbHorizontal={(props) => <div {...props}
                    className="thumb-horizontal"
                    style={{ display: "none" }} />}
            >

                <Document
                    className="PDF-document"
                    options={{
                        cMapUrl: 'cmaps/',
                        cMapPacked: true,
                        standardFontDataUrl: 'standard_fonts/',
                        workerSrc: `${WORKERSRC}/pdf.worker.js`
                    }}

                    file={filepath}
                    // width={window.screen.width * 0.9}
                    // loading={<div>
                    //     갸갸갸갸갸
                    // </div>}
                    onLoadSuccess={onDocumentLoadSuccess}

                >

                    <div style={{ position: 'relative', margin: 'auto' }}>
                        <Page
                            // canvasBackground={"red"}
                            // loading={"asfasfasfasf"}
                            canvasRef={canvasRef}
                            className="PDF-page"
                            pageNumber={pageNumber}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            // height={window.screen.height*0.9}
                            width={pageWidth}
                            // scale={1}
                            // rotate={90}
                            onRenderSuccess={onDocumentRenderSuccess}
                            onRenderError={() => {
                                console.log("랜더에러")
                                // alert('Rendered the page!')
                            }}
                        >
                        </Page>


                        <div className="heatmapWrapper">
                            <div ref={heatmapref} style={{ width: '100%', height: '100%' }} />
                        </div>

                        <canvas ref={gazecanvasref}
                            className="pathwayGazeCanvas"
                            width={canvasSize.width}
                            height={canvasSize.height}

                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseOut={stopDrawing}
                        />
                    </div>



                </Document>

            </Scrollbars>
        </div>


    </div>)
});

export default PDFviewModal;