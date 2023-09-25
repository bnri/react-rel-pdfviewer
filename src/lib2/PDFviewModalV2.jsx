import  { useState, useEffect, useRef, useMemo,forwardRef } from "react";
import './PDFviewModalV2.scss';

// import { Document, Page, pdfjs } from 'react-pdf';
// import pdfjsLib from "pdfjs-dist/build/pdf";
// import * as pdfjsLib from 'pdfjs-dist';
import usePDFLoader from "./hooks/usePDFLoader";

// import PDFJSWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry'

// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

//#@!
//1. 이상한 파일이 들어왔을시 예외처리


const PDFviewModalV2 = forwardRef(({ ...props }, ref) => {
    const {
        drawStart, drawEnd, drawIng, viewPercentChangeCallback, path, onClose, showViewMode, viewpercent,
        set_viewpercent, scrollCallback, pageCallback, pdfSizeCallback, onConfirm, showConfirmBtn, PDFonloadCallback } = props;
    // pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    // console.log("path",path);
    const PDFviewModalV2Ref = useRef(null); //가장 바깥 ref

    const { pages, maxPdfPageNumber } = usePDFLoader(path);
    // console.log("@@@@@@@@@@@@@랜더수")
    const preparedPDFPageInform = useRef(null);
    const prepareIngPDFPageInform = useRef(null);
    const renderCanvasRef = useRef();
    const PDFWrapperRef = useRef();
    const gazecanvasref = useRef();
    const heatmapref = useRef();
 
    // const [pages, set_pages] = useState(null);
    // const [maxPdfPageNumber, set_maxPdfPageNumber] = useState(null);
    const [nowPage, set_nowPage] = useState(1);


    const [isNowPageRenderPrepared, set_isNowPageRenderPrepared] = useState();
    const [isNextPageRenderPrepared, set_isNextPageRenderPrepared] = useState();
    const [isPrevPageRenderPrepared, set_isPrevPageRenderPrepared] = useState();
    const [first_preParing_loading, set_first_preParing_loading] = useState(true);
    const PDFrenderOption = useMemo(() => {
        //1모드는 랜더한페이지의 다음과 이전만 준비하는 방식.
        //2모드는 전체 페이지를 다하고,,,
        return {
            mode: 1,
            canvasWidth: 1920,
        }
    }, []);


    const [renderHeight, set_renderHeight] = useState(0);
    //랜더가 완료되면 값이 있음.
    const [renderedTarget, set_renderedTarget] = useState(null);
    const [drawing, setDrawing] = useState(false);


    //nowPage를 랜더준비를 하는곳
    useEffect(() => {

        if (!preparedPDFPageInform.current) {
            preparedPDFPageInform.current = [];
        }
        if (!prepareIngPDFPageInform.current) {
            prepareIngPDFPageInform.current = [];
        }
        if (!pages || !pages.length) {
            return;
        }
        set_isNowPageRenderPrepared(false);
        set_isNextPageRenderPrepared(false);
        set_isPrevPageRenderPrepared(false);

        const wrapperWidth = PDFWrapperRef.current.offsetWidth;
        const preparedPDFinform = preparedPDFPageInform.current; //배열형태임.
        console.log("@@@@@@@@@preparedPDFinform", preparedPDFinform);
        const prepareIngArr = prepareIngPDFPageInform.current;

        prepareRenderPage(nowPage).then(res_nowPageRender => {
            // console.log("res_nowPageRender",res_nowPageRender);
            if (res_nowPageRender.valid) {
                if (!res_nowPageRender.cache) {
                    preparedPDFinform.push(res_nowPageRender.data);
                }
                let resizeRatio = wrapperWidth / res_nowPageRender.data.canvasSize.width;
                let newCanvasHeight = res_nowPageRender.data.canvasSize.height * resizeRatio
                set_renderHeight(newCanvasHeight);
                set_isNowPageRenderPrepared(true);


                // console.log("targetPrepared를 생성하는데 성공");

            }
            else {
                // console.error("targetPrepared를 생성하는데 실패");
            }
            // console.log("@@@@@@@@@preparedPDFinform",preparedPDFinform)
        });


        if (PDFrenderOption.mode === 1) {
            // 현제페이지를 다 만든후에 생성
            let p = [];
            p[0] = prepareRenderPage(nowPage - 1).then(res_prevPageRender => {
                if (res_prevPageRender.valid) {
                    if (!res_prevPageRender.cache) {
                        preparedPDFinform.push(res_prevPageRender.data);
                    }
                    set_isPrevPageRenderPrepared(true);
                    // console.log("prevPage가 준비됨");
                }
                else {
                    // console.log("prevPage를 준비실패");
                }
                // console.log("@@@@@@@@@preparedPDFinform",preparedPDFinform)
            });

            p[1] = prepareRenderPage(nowPage + 1).then(res_nextPageRender => {
                if (res_nextPageRender.valid) {
                    if (!res_nextPageRender.cache) {
                        preparedPDFinform.push(res_nextPageRender.data)
                    }
                    set_isNextPageRenderPrepared(true);
                    // console.log("nextPage를 생성하는데 성공");
                }
                else {
                    // console.log("nextPage를 생성하는데 실패");
                }
                // console.log("@@@@@@@@@preparedPDFinform",preparedPDFinform)
            });
            Promise.all(p).then(res => {
                // console.log("끝남",res);
                set_first_preParing_loading(false);
            })


        }
        else if (PDFrenderOption.mode === 2) {
            let p = [];
            for (let i = 1; i <= pages.length; i++) {
                if (i === nowPage) {
                    console.log("패스,", i);
                    continue;
                }
                p[i] = prepareRenderPage(i).then(res_somepageRender => {
                    // console.log("res_nowPageRender",res_nowPageRender);
                    if (res_somepageRender.valid) {
                        if (!res_somepageRender.cache) {
                            preparedPDFinform.push(res_somepageRender.data);
                        }

                        if (i === (nowPage + 1) * 1) {
                            set_isNextPageRenderPrepared(true);
                        }
                        else if (i === (nowPage - 1) * 1) {
                            set_isPrevPageRenderPrepared(true);
                        }
                    }
                    else {
                        // console.error("targetPrepared를 생성하는데 실패");
                    }
                    // console.log("@@@@@@@@@preparedPDFinform",preparedPDFinform)
                });


            }

            Promise.all(p).then(res => {
                set_first_preParing_loading(false);
            })
        }



        //랜더할 width임. 어떤이미지든 여기 width 100% 기준임 지금은.
        //wrapper resize 시 다시 랜더해야함..

        function prepareRenderPage(pageNumber) {
            return new Promise(async function (resolve) {
                if (prepareIngArr.includes(pageNumber)) {
                    resolve({
                        valid: false,
                        msg: "이미 준비하고 있는 page임"
                    });
                    return;
                }
                if (!pages) {
                    resolve({
                        valid: false,
                        msg: "페이지정보가 준비되지 않음"
                    })
                    return;
                }
                const shouldPreparePage = pages[pageNumber - 1];
                if (!shouldPreparePage) {
                    resolve({
                        valid: false,
                        msg: "해당 페이지가 존재하지 않음"
                    })
                    return;
                }

                let targetPrepared = preparedPDFinform.find(d => d.pageNumber === pageNumber)
                if (targetPrepared) {
                    console.log(`이미있어서 ${targetPrepared.pageNumber}page를 다시 만들필요 없음`);
                    resolve({
                        valid: true,
                        data: targetPrepared,
                        cache: true,
                    });
                    return;
                }

                prepareIngArr.push(pageNumber);
                //해당페이지들의 실제 크기임.
                const pageOriginWidth = shouldPreparePage.view[2] - shouldPreparePage.view[0];
                const pageOriginHeight = shouldPreparePage.view[3] - shouldPreparePage.view[1];

                //목표 이미지사이즈가 1920 임.
                // 만약 pageOriginWidth로 랜더할꺼면 1920을 pageOriginWidth 로하면됨

                let myscale = PDFrenderOption.canvasWidth / pageOriginWidth;

                // console.log("myscale",myscale);
                //랜더할 가상캔버스 생성
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d', { willReadFrequently: true });
                const viewport = shouldPreparePage.getViewport({ scale: myscale }); // 원하는 스케일로 조정
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                //가상캔버스에 viewport 이미지사이즈를 랜더할거임
                // let scaleheight = wrapperWidth/viewport.width;
                // console.log("scaleheight",scaleheight)
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };
                await shouldPreparePage.render(renderContext).promise;
                console.log("prepareIngArr", prepareIngArr);
                console.log(`@생성- ${pageNumber}page`);


                resolve({
                    valid: true,
                    data: {
                        canvas: canvas,
                        pageNumber: pageNumber,
                        originScale: myscale,
                        PDForiginSize: {
                            width: pageOriginWidth,
                            height: pageOriginHeight
                        },
                        canvasSize: {
                            width: viewport.width,
                            height: viewport.height
                        },
                        // wrapperSize: {
                        //     width: wrapperWidth,
                        //     height : viewport.height*scaleheight
                        // }
                    }
                });

                let targetPreparedIndex = prepareIngArr.findIndex(d => d === pageNumber);
                prepareIngArr.splice(targetPreparedIndex, 1);
                console.log("prepareIngArr", prepareIngArr);



            });
        }

    }, [pages, nowPage, PDFrenderOption]);



    //실제 랜더가 되었나
    useEffect(() => {
        if (isNowPageRenderPrepared && nowPage) {
            let pa = preparedPDFPageInform.current;
            const targetPrepared = pa.find(d => d.pageNumber === nowPage)
            if (!targetPrepared) {
                console.error("target이 준비되지 않았습니다");
                return;
            }
            const renderCanvas = renderCanvasRef.current;
            const ctx = renderCanvas.getContext("2d");
            ctx.clearRect(0, 0, renderCanvasRef.current.offsetWidth, renderCanvasRef.current.offsetHeight);
            renderCanvas.width = targetPrepared.canvasSize.width;
            renderCanvas.height = targetPrepared.canvasSize.height;
            ctx.drawImage(targetPrepared.canvas, 0, 0);
            set_renderedTarget(targetPrepared);
        }
    }, [isNowPageRenderPrepared, nowPage]);


    //wrapper리사이즈시 canvas의 height 재설정 
    useEffect(() => {
        if (!PDFviewModalV2Ref.current) return;
        const resizeObserver = new ResizeObserver(entries => {
            // 크기 변경시 실행할 작업을 여기에 작성합니다.
            entries.forEach(entry => {
                console.log('PDF 껍데기의 크기가 변경되었습니다!', entry.contentRect.width, entry.contentRect.height);

                set_renderedTarget(rt => {
                    if (!rt) {
                        return rt;
                    }

                    let resizeRatio = entry.contentRect.width / rt.canvasSize.width;
                    let newCanvasHeight = rt.canvasSize.height * resizeRatio
                    rt.wrapperSize = {
                        width: entry.contentRect.width,
                        height: newCanvasHeight
                    }
                    set_renderHeight(newCanvasHeight)
                    return rt;
                });

            });
        });

        resizeObserver.observe(PDFviewModalV2Ref.current);
        return () => {
            resizeObserver.disconnect();
        }
    }, []);



    const startDrawing = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        setDrawing(true);
        if (drawStart) {
            drawStart({ x: offsetX, y: offsetY, pageNumber: nowPage });
            return;
        }
    };

    const draw = (e) => {
        if (!drawing) return;
        const { offsetX, offsetY } = e.nativeEvent;
        if (drawIng) {
            drawIng({ x: offsetX, y: offsetY, pageNumber: nowPage });
            return;
        }
    };

    const stopDrawing = () => {
        if (!drawing) return;
        setDrawing(false);
        if (drawEnd) {
            drawEnd({ pageNumber: nowPage });
            return;
        }
    };




    return (<div className="PDFviewModalV2 no-drag" ref={PDFviewModalV2Ref}>

        <div style={{ position: 'absolute', left: 0, top: 0, background: 'orange' }}>
            총페이지:{maxPdfPageNumber}<br />
            지금페이지:{nowPage}<br />
            <button disabled={isPrevPageRenderPrepared === true ? false : true} onClick={() => {
                set_nowPage(p => p > 1 ? p - 1 : p);
            }}>이전</button>
            <button disabled={isNextPageRenderPrepared === true ? false : true} onClick={() => {
                set_nowPage(p => p + 1 <= maxPdfPageNumber ? p + 1 : p);
            }}>다음</button>
            <br />
            <button onClick={() => {
                if (onClose) {
                    onClose();
                }
            }}>닫기</button>
        </div>



        <div className="PDFWrapper" style={{ width: '100%', height: '100%', overflowY: 'auto', position: 'relative' }}
            ref={PDFWrapperRef} >

            <canvas className="PDFcanvas" ref={renderCanvasRef}
                style={{
                    width: '100%',
                    height: renderHeight
                }} />

            <div className="heatmapWrapper">
                <div ref={heatmapref} style={{ width: '100%', height: renderHeight }} />
            </div>

            <canvas ref={gazecanvasref}
                className="pathwayGazeCanvas"
                style={{ width: '100%', height: renderHeight }}

                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
            />

        </div>




        {first_preParing_loading &&
            <div className="first_loading">
                Loading...
            </div>}
    </div>)
});

export default PDFviewModalV2;