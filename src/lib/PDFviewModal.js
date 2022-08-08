import React from "react";
import './PDFviewModal.scss';

import {
    Document, Page
    // ,pdfjs
} from 'react-pdf';
// import React from 'react';
import NumberFormat from 'react-number-format';


const Loading = ({ ...props }) => {
    return <div className="Loading">

        <div className="text">
            ReadersEye
        </div>


    </div>
}


const PDFviewModal = ({ ...props }) => {
    const { path, onClose, showViewMode, viewpercent, set_viewpercent ,scrollCallback} = props;

    // console.log("path",path);

    const filepath = React.useMemo(() => {
        // console.log("filepath바뀜");
        return path;
    }, [path])
    const canvasRef = React.useRef();
    const wrapperRef = React.useRef();

    const [pdfWidth, set_pdfWidth] = React.useState(null);
    const [pdfHeight, set_pdfHeight] = React.useState(null);

    const [numPages, setNumPages] = React.useState(null);
    const [pageNumber, setPageNumber] = React.useState(1);
    // const [pdfScale, set_pdfScale] = React.useState(1);
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    function onDocumentRenderSuccess() {
        // console.log("확인좀",some);
        // console.log("확인", canvasRef.current.width + 'x' + canvasRef.current.height);
        // set_pdfWidth({
        //     width: canvasRef.current.width,
        //     height: canvasRef.current.height
        // })

        set_pdfWidth(canvasRef.current.width);
        set_pdfHeight(canvasRef.current.height);

        wrapperRef.current.scrollTop = 0;

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
    //wrapperRef


    const handleWrapperScroll = React.useCallback((e) => {

        // console.log(e.target.scrollTop,"스크롤위치");
        // console.log("scrollCallback",scrollCallback);
        if(scrollCallback){
            scrollCallback(e.target.scrollTop);
        }

        //사실은 이때랑 같이 이동

    },[scrollCallback]);
    // 0.4 ~ 0.9
    //       100%
    // + -  1% 씩 조정
    //
    // 



    const modalref = React.useRef();

    const [viewPercent, set_viewPercent] = React.useState(viewpercent ? viewpercent : 100);



    const option = React.useMemo(() => {
        return {
            max: 100,
            min: 40
        }
    }, []);



    // const pageWidth = React.useMemo(() => {
    //     if (!modalref || !modalref.current ) return;

    //     let p = (viewPercent - 10) / 100;

    //     console.log("modalref", modalref.current);

    //     return window.screen.width * p - 18;
    // }, [viewPercent])

    
        const [pageWidth, set_pageWidth] = React.useState(0);
    React.useEffect(() => {
        if (viewPercent) {
            if (!modalref || !modalref.current) return;

            let p = (viewPercent - 10) / 100;

            // console.log("modalref", modalref.current);

            set_pageWidth(modalref.current.clientWidth * p - 18);
        }
    }, [viewPercent])
    

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
                            <button className="resizebtn"onClick={() => set_viewPercent(option.max)}>최대</button>
                        </div>
                        <div className="row">
                            <button className="resizebtn"onClick={() => {
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
                            <button className="resizebtn"onClick={() => {
                                set_viewPercent((v) => {
                                    // console.log("v",v)
                                    if (v < option.min) return option.min * 1;
                                    else return v * 1 - 1;
                                })
                            }}>-</button>
                        </div>
                        <div className="row">
                            <button className="resizebtn"onClick={() => set_viewPercent(option.min * 1)}>
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
                <div className="closeTab">

                    <button className="closePDFbtn" onClick={() => {
                        if (showViewMode) {
                            set_viewpercent(viewPercent);
                        }

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

            onScroll={handleWrapperScroll}


            style={{
                // outline: '1px solid red',

                // width: pdfWidth ? `${pdfWidth.width}px` : 'auto',
                // height: pdfWidth ? `${pdfWidth.height}px` : '500px',
                width: '90%',
                height: '100%',

                display: pdfWidth && pdfHeight ? 'flex' : 'none',
                overflow: 'auto'
                // ,overflow:'auto'
            }}>


            <Document
                className="PDF-document"
                options={{
                    cMapUrl: 'cmaps/',
                    cMapPacked: true,
                    standardFontDataUrl: 'standard_fonts/',
                    workerSrc: "pdf.worker.js"
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
                        alert('Rendered the page!')
                    }}
                />


            </Document>

        </div>


    </div>)
}

export default PDFviewModal;