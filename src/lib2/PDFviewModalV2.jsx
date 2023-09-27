import { useState, useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import './PDFviewModalV2.scss';

// import { Document, Page, pdfjs } from 'react-pdf';
// import pdfjsLib from "pdfjs-dist/build/pdf";
// import * as pdfjsLib from 'pdfjs-dist';
import usePDFLoader from "./hooks/usePDFLoader";
import NumberOnlyInput from "./components/NumberOnlyInput";

// import PDFJSWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry'

// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

//#@!
//1. 이상한 파일이 들어왔을시 예외처리


//react-virtualized 를 같이 사용해서..해야할듯


const PDFviewModalV2 = forwardRef(({ ...props }, ref) => {
    const {
        renderOption,
        initViewPercent,
        minViewPercent,
        maxViewPercent,
        drawStart, drawEnd, drawIng, viewPercentChangeCallback, path, onClose, showViewMode,
        scrollCallback, pageCallback, pdfSizeCallback, onConfirm, showConfirmBtn, PDFonloadCallback } = props;
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
        //3모드는 해당 랜더페이지만
        if(!renderOption){
            return {
                mode: 3,
                // canvasWidth: 1920,
            }            
        }
        else{
            return renderOption;
        }
      
    }, [renderOption]);


    const [renderHeight, set_renderHeight] = useState(0);
    //랜더가 완료되면 값이 있음.
    const [renderedTarget, set_renderedTarget] = useState(null);
    const [drawing, setDrawing] = useState(false);


    useImperativeHandle(ref, () => ({
        // set_pageNumber(val) {
        //     set_renderDone(false);
        //     setPageNumber(val);
        // },
        // set_scrollTop: (val) => {
        //     // wrapperRef.current.scrollTop = val;
        //     prettyscrollref.current.scrollTop(val);
        // },
        // get_pdfSize2: () => {
        //     return {
        //         width: pdfWidth,
        //         height: pdfHeight,
        //     }
        // },
        get_canvasRef: () => {
            return gazecanvasref;
        },
        // get_heatmapRef: () => {
        //     return heatmapref;
        // },
        // reset_viewPerecent: (val) => {
        //     set_viewPercent(val);
        // },
        // get_pdfSize: () => {
        //     try {
        //         let obj = {
        //             PDF: {
        //                 width: canvasRef.current.width,
        //                 height: canvasRef.current.height,
        //                 leftPixel: (modalref.current.clientWidth - canvasRef.current.width) / 2,
        //                 topPixel: canvasRef.current.height >= modalref.current.clientHeight ? 0 : (modalref.current.clientHeight - canvasRef.current.height) / 2
        //             },
        //             PDFwrap: {
        //                 width: canvasRef.current.width,
        //                 height: modalref.current.clientHeight
        //             },
        //             SCRwrap: {
        //                 width: modalref.current.clientWidth,
        //                 height: modalref.current.clientHeight
        //             },
        //         }
        //         return obj;
        //     }
        //     catch (e) {
        //         console.log("get_pdfSize Error");
        //         return null;
        //     }

        // }

    }), []);

    const [renderWidth,set_renderWidth] = useState(initViewPercent?initViewPercent:40);




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


        if(!PDFrenderOption.canvasWidth){
            preparedPDFPageInform.current.splice(0, preparedPDFPageInform.current.length);
        
        }
        console.log("랜더준비 호출");


        const wrapperWidth = PDFWrapperRef.current.offsetWidth;
        const preparedPDFinform = preparedPDFPageInform.current; //배열형태임.
        // console.log("@@@@@@@@@preparedPDFinform", preparedPDFinform);
        const prepareIngArr = prepareIngPDFPageInform.current;
        let pa = preparedPDFPageInform.current;
        console.log("@@@@@@@@@@@@@@@@@@pa1",pa)

        if(PDFrenderOption.mode===3){
            set_first_preParing_loading(false);
        }
        prepareRenderPage(nowPage).then(res_nowPageRender => {
            // console.log("res_nowPageRender",res_nowPageRender);
            if (res_nowPageRender.valid) {
                if (!res_nowPageRender.cache ) {
                    console.log("넣어")
                    preparedPDFinform.push(res_nowPageRender.data);
                    console.log("preparedPDFinform",preparedPDFinform)
                }
                let resizeRatio = renderWidth / 100 * wrapperWidth / res_nowPageRender.data.canvasSize.width;
                let newCanvasHeight = res_nowPageRender.data.canvasSize.height * resizeRatio
                set_renderHeight(newCanvasHeight);
                set_isNowPageRenderPrepared(true);
                let pa = preparedPDFPageInform.current;
                console.log("@@@@@@@@@@@@@@@@@@pa2",pa)

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
                        if (!res_somepageRender.cache ) {
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
                const renderCanvas = renderCanvasRef.current;

                prepareIngArr.push(pageNumber);
                //해당페이지들의 실제 크기임.
                // const pageOriginWidth = shouldPreparePage.view[2] - shouldPreparePage.view[0];
                // const pageOriginHeight = shouldPreparePage.view[3] - shouldPreparePage.view[1];
                const pageOriginWidth = shouldPreparePage.view[2];
                const pageOriginHeight = shouldPreparePage.view[3];
                //목표 이미지사이즈가 1920 임.
                // 만약 pageOriginWidth로 랜더할꺼면 1920을 pageOriginWidth 로하면됨

                let myscale = PDFrenderOption.canvasWidth? PDFrenderOption.canvasWidth / pageOriginWidth:
                1*renderCanvas.offsetWidth/pageOriginWidth;

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
                // console.log("prepareIngArr", prepareIngArr);
                // console.log(`@생성- ${pageNumber}page`);


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
                // console.log("prepareIngArr", prepareIngArr);



            });
        }
        
    }, [pages, nowPage, PDFrenderOption,renderWidth]);



    //실제 랜더가 되었나
    useEffect(() => {
        // console.log("isNowPageRenderPrepared",isNowPageRenderPrepared,nowPage)
        if (isNowPageRenderPrepared && nowPage) {
            let pa = preparedPDFPageInform.current;
            console.log("@@@@@@@@@@@@@@@@@@pa3",pa)
            const targetPrepared = pa.find(d => d.pageNumber === nowPage)

            if (!targetPrepared) {

                console.error(`${nowPage}page가 준비되지 않았습니다`);
                return;
            }

            console.log(`임시 ${nowPage}page가 준비되서 랜더하고있음`);
            const renderCanvas = renderCanvasRef.current;
            const drawCanvas = gazecanvasref.current;
            const drawCanvasElSize = drawCanvas.getClientRects()[0];
            drawCanvas.width =  drawCanvasElSize.width;
            drawCanvas.height = drawCanvasElSize.height;

            const ctx = renderCanvas.getContext("2d");
            //필요가없음 사이즈할당해서 clear 됨
            // ctx.clearRect(0, 0, renderCanvasRef.current.offsetWidth, renderCanvasRef.current.offsetHeight);
            renderCanvas.width = targetPrepared.canvasSize.width;
            renderCanvas.height = targetPrepared.canvasSize.height;
            // drawCanvas.width =  targetPrepared.canvasSize.width;
            // drawCanvas.height =targetPrepared.canvasSize.height;
    
            //#@! 나머지 캔버스들도 크기지정필요

            ctx.drawImage(targetPrepared.canvas, 0, 0);
            if (pdfSizeCallback) {
                pdfSizeCallback({ pageNumber: nowPage })
            }

            set_renderedTarget(targetPrepared);
        }
    }, [isNowPageRenderPrepared, nowPage, pdfSizeCallback]);



    //wrapper리사이즈시 canvas의 height 재설정 
    useEffect(() => {
        if (!PDFviewModalV2Ref.current) return;
        const resizeObserver = new ResizeObserver(entries => {
            // 크기 변경시 실행할 작업을 여기에 작성합니다.
            entries.forEach(entry => {
                console.log('PDF 껍데기의 크기가 변경되었습니다!', entry.contentRect.width, entry.contentRect.height);
                if(!PDFrenderOption.canvasWidth){
                    preparedPDFPageInform.current.splice(0, preparedPDFPageInform.current.length);
                    set_isNowPageRenderPrepared(false);
                    // return;
                }

                set_renderedTarget(rt => {
                    if (!rt) {
                        return rt;
                    }

                    let resizeRatio = renderWidth / 100 * entry.contentRect.width / rt.canvasSize.width;
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
    }, [renderWidth,PDFrenderOption]);



    const startDrawing = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        // console.log("offsetX",offsetX)
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

        <div style={{ position: 'absolute', left: 0, top: 0, background: 'orange', zIndex: 5 }}>
            총페이지:{maxPdfPageNumber}<br />
            지금페이지:{nowPage}<br />
            <button disabled={PDFrenderOption.mode===3 || isPrevPageRenderPrepared === true ? false : true} onClick={() => {
                set_nowPage(p => p > 1 ? p - 1 : p);
                set_isNowPageRenderPrepared(false);
                set_isNextPageRenderPrepared(false);
                set_isPrevPageRenderPrepared(false);
            }}>이전</button>
            <button disabled={PDFrenderOption.mode===3 || isNextPageRenderPrepared === true ? false : true} onClick={() => {
                set_nowPage(p => p + 1 <= maxPdfPageNumber ? p + 1 : p);
                set_isNowPageRenderPrepared(false);
                set_isNextPageRenderPrepared(false);
                set_isPrevPageRenderPrepared(false);
            }}>다음</button>
            <br />
            <button disabled={renderWidth<=40?true:false}onClick={()=>set_renderWidth(e=>e-1)}>-</button>
            <br/>
            <NumberOnlyInput
                value={renderWidth}
                onChange={(newvalue)=>{
                    set_renderWidth(newvalue)
                }}
                max={maxViewPercent?maxViewPercent:100}
                min={minViewPercent?minViewPercent:40}
            />
            <br/>
            <button disabled={renderWidth>=100?true:false} onClick={()=>set_renderWidth(e=>e+1)}>+</button>
            <br/>
            <button onClick={() => {
                if (onClose) {
                    onClose();
                }
            }}>닫기</button>
        </div>

        
        <div className="leftBar">

        </div>
        <div className="PDFWrapper" ref={PDFWrapperRef} >
            <div className="PDFcanvasWrap" style={{ width: `${renderWidth}%`, height: renderHeight, }}>
                <canvas className="PDFcanvas" ref={renderCanvasRef}
                    style={{
                        width: '100%',
                        height: '100%'
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
        </div>
        <div className="rightBar">

        </div>



        {first_preParing_loading &&
            <div className="first_loading">
                Loading...
            </div>}
    </div>)
});

export default PDFviewModalV2;