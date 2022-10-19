import React from "react";
import './PDFviewModal.scss';

import {
    Document, Page
    //  ,pdfjs
} from 'react-pdf';
// import React from 'react';
import NumberFormat from 'react-number-format';
import { Scrollbars } from "react-custom-scrollbars";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js;`

const Loading = ({ ...props }) => {
    return <div className="Loading">

        <div className="text">
            ReadersEye
        </div>


    </div>
}


const PDFviewModal = React.forwardRef(({ ...props }, ref) => {
    const { workerSRC,path, onClose, showViewMode, viewpercent, set_viewpercent, scrollCallback, pageCallback, pdfSizeCallback ,onConfirm ,showConfirmBtn} = props;

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
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const [canvasSize,set_canavasSize] = React.useState({
        height:0,
        width:0
    });

    function onDocumentRenderSuccess() {
        // console.log("확인좀",some);
        // console.log("확인", canvasRef.current.width + 'x' + canvasRef.current.height);
        // set_pdfWidth({
        //     width: canvasRef.current.width,
        //     height: canvasRef.current.height
        // })
        set_canavasSize({
            width: canvasRef.current.width,
            height: canvasRef.current.height
        })


        if (pdfSizeCallback) {

            //canvasRef.current 는 실제 PDF의 크기를 의미합니다
            //wrapperRef.current 는 PDF wrapper 의 크기를 의미합니다
            //modalref.current 는 실제 스크린의 크기를 의미합니다.
            try{
                pdfSizeCallback({

                    PDF:{
                        width: canvasRef.current.width,
                        height: canvasRef.current.height,
                        leftPixel: (modalref.current.clientWidth - canvasRef.current.width)/2,
                        topPixel: canvasRef.current.height>=modalref.current.clientHeight?0:(modalref.current.clientHeight-canvasRef.current.height)/2                    
                    },
                    PDFwrap:{
                        width: modalref.current.clientWidth*0.9,
                        height: modalref.current.clientHeight
                    },
                    SCRwrap:{
                        width: modalref.current.clientWidth,
                        height: modalref.current.clientHeight
                    },
                    // Scrollwrap:{
                    //     width:prettyscrollref.current.clientWidth,
                    //     height:prettyscrollref.current.clientHeight,
                    // }
    
                });
            }
            catch(e){
                console.log("에러",e);
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




    const handleKeyDown = React.useCallback((e) => {
        // console.log(e.key);
        if (e.target.classList.contains('viewPercent')) {
            return;
        }

        if (e.key === "ArrowRight") {
            if (pageNumber < numPages) {
                setPageNumber(p => p + 1);
            }
        } else if (e.key === "ArrowLeft") {
            if (pageNumber > 1) {
                setPageNumber(p => p - 1);
            }
        }
    }, [pageNumber, numPages]);

    //키다운이벤트등록
    React.useEffect(() => {

        // console.log("이벤트등록")
        // window.removeEventListener("keydown", handleKeyDown, false);
        window.addEventListener("keydown", handleKeyDown, false);
        return () => {
            // console.log("이벤트해지")
            window.removeEventListener("keydown", handleKeyDown, false);
        };
    }, [handleKeyDown]);


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
        get_canvasRef:()=>{
            return gazecanvasref;
        },
        get_pdfSize:()=>{
            try{
                let obj={
                    PDF:{
                        width: canvasRef.current.width,
                        height: canvasRef.current.height,
                        leftPixel: (modalref.current.clientWidth - canvasRef.current.width)/2,
                        topPixel: canvasRef.current.height>=modalref.current.clientHeight?0:(modalref.current.clientHeight-canvasRef.current.height)/2                    
                    },
                    PDFwrap:{
                        width: canvasRef.current.width,
                        height: modalref.current.clientHeight
                    },
                    SCRwrap:{
                        width: modalref.current.clientWidth,
                        height: modalref.current.clientHeight
                    },                
                }
                return obj;
            }
            catch(e){
                console.log("get_pdfSize Error");
                return null;
            }

        }

    }), [pdfWidth, pdfHeight]);





    // const pageWidth = React.useMemo(() => {
    //     if (!modalref || !modalref.current ) return;

    //     let p = (viewPercent - 10) / 100;

    //     console.log("modalref", modalref.current);

    //     return window.screen.width * p - 18;
    // }, [viewPercent])


    React.useEffect(() => {
        if (viewPercent) {
            if (!modalref || !modalref.current) return;

            let p = (viewPercent - 10) / 100;
            set_pageWidth(modalref.current.clientWidth * p);
        }
    }, [viewPercent]);

    


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
                            PDF 사이즈
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
                        setPageNumber(p => p - 1);
                        // }

                    }}>{`<`}</button>
                </div>
                <div className="PageController-right">
                    <button className="page-btn" disabled={pageNumber < numPages ? false : true} onClick={() => {
                        // if (pageNumber < numPages) {
                        setPageNumber(p => p + 1);
                        // }
                    }}>{`>`}</button>
                </div>

                <div className="confirmTab" style={{display:showConfirmBtn?'':'none'}}>
                    <button className="confirmPDFbtn" onClick={()=>{
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
                        workerSrc: `${workerSRC}/pdf.worker.js`
                    }}

                    file={filepath}
                    // width={window.screen.width * 0.9}
                    // loading={<div>
                    //     갸갸갸갸갸
                    // </div>}
                    onLoadSuccess={onDocumentLoadSuccess}

                >


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
                    <canvas ref={gazecanvasref}  
                    className="pathwayGazeCanvas"
                    width={canvasSize.width}
                    height={canvasSize.height}

                     />
                    </Page>


                </Document>
             
            </Scrollbars>
        </div>


    </div>)
});

export default PDFviewModal;