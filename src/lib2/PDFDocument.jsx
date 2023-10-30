import React, { useState, useEffect, useRef, useCallback, useMemo, forwardRef, useImperativeHandle } from "react";

import _ from "lodash";

import "./PDFDocument.scss";
import * as pdfjsLib from 'pdfjs-dist';
import { PDFTopBar, PDFdynamicAllPage, PDFpreview } from "./";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js`;


const PDFDocument = (props) => {
    const { pdfInform,previewOption, children, option, path, PDFDocumentOnLoadCallback } = props;

    const [pages, setPages] = useState();
    const documentRef = useRef(null);
    const dynamicAllPageRef = useRef();

    const [preparedPreviewPages, set_preparedPreviewPages] = useState();
    const [percentPagesData, set_percentPagesData] = useState();

    const [leftPreviewShow, set_leftPreviewShow] = useState(previewOption && previewOption.initLeftPreviewshow ? previewOption.initLeftPreviewshow : false);
    const [viewPercent, set_viewPercent] = useState(option.initViewPercent ? option.initViewPercent : '100%');
    const [nowPage, set_nowPage] = useState(1);
    const [fileName,set_fileName] = useState(pdfInform.fileName?pdfInform.fileName:'임시파일이름');
    const maxPageNumber = useMemo(() => {
        if (pages) {
            return pages.length;
        }
        else {
            return 0;
        }
    }, [pages])
    useEffect(() => {
        if (!path) return;

        async function getPDFdocumentByPath() {
            try {
                const loadingTask = await pdfjsLib.getDocument(path);
                const pdf = await loadingTask.promise;
    
                const pdfInfo = pdf._pdfInfo;
                const pdfPageNumbers = pdfInfo.numPages;
                const loadedPages = [];

                for (let i = 1; i <= pdfPageNumbers; i++) {
                    const page = await pdf.getPage(i);
                    loadedPages.push(page);
                }

                setPages(loadedPages);
                if (PDFDocumentOnLoadCallback) {
                    PDFDocumentOnLoadCallback(pdfPageNumbers);
                }

            } catch (error) {
                // 오류 처리
                console.error("PDF 로드 중 오류 발생:", error);
            }
        }

        getPDFdocumentByPath();
    }, [path, PDFDocumentOnLoadCallback]);
    
    const preparePage = useCallback((page, pageNumber, specificSize, renderWidth) => {


        return new Promise(async function (resolve, reject) {



            const shouldPreparePage = page;
            if (!shouldPreparePage) {
                reject({
                    valid: false,
                    msg: "해당 페이지가 존재하지 않음"
                })
                return;
            }
            const pageOriginWidth = shouldPreparePage.view[2];
            const pageOriginHeight = shouldPreparePage.view[3];

            let myscale;
            if (specificSize) {
                myscale = specificSize / pageOriginWidth;
            }
            else {
                myscale = 1 * renderWidth / pageOriginWidth;
            }


            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d', { willReadFrequently: true });
            const viewport = shouldPreparePage.getViewport({ scale: myscale }); // 원하는 스케일로 조정
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            // console.log("랜더컨택스 완료")
            const resizeRatio = renderWidth / viewport.width;

            await shouldPreparePage.render(renderContext).promise;


            resolve({
                valid: true,
                canvas: canvas,
                // pageNumber: pageNumber,
                // originScale: myscale,
                // PDForiginSize: {
                //     width: pageOriginWidth,
                //     height: pageOriginHeight
                // },
                canvasSize: {
                    width: viewport.width,
                    height: viewport.height
                },
                // wrapperSize: {
                //     resizeRatio: resizeRatio,
                //     width: renderWidth,
                //     height: viewport.height * resizeRatio
                // },
            })
        });


    }, [])
    /*
    useEffect(() => {
        if (!documentRef.current) return;
        if (!pages || !pages.length) return;

        const canvasWidth = option?.canvasWidth || 0; //고정사이즈
        console.log("@!@$!@$@!@$여기가호출", option, pages)

        const element = documentRef.current;
        let resizing = false; // Flag to track whether resizing is in progress

        const handleRemakeVirtualCanvas = _.debounce((entries) => {
            if (resizing) {
                return; // If resizing is already in progress, return early
            }

            resizing = true; // Set the resizing flag to true

            entries.forEach(entry => {
                console.log('@@@@@@@@@@@@@@@@PDFDocument 껍데기의 크기가 변경되었습니다!', entry.contentRect.width, entry.contentRect.height, viewPercent);
                // set_renderWidth(entry.contentRect.width * viewPercent / 100);
                const contentWidth = element.offsetWidth;
                const contentHeight = element.offsetHeight;
                // console.log('PDF 껍데기의 크기가 변경되었습니다!', contentWidth, contentHeight);
                const renderWidth = contentWidth * parseInt(viewPercent) / 100;
                // console.log("renderWidth", renderWidth)


                let p = [];
                for (let i = 0; i < pages.length; i++) {
                    p[i] = preparePage(i + 1, canvasWidth);
                }

                Promise.all(p).then(res => {
                    console.log("모든페이지준비res", res);
                    set_preparedPages(res);
                    resizing = false; // Reset the resizing flag
                }).catch(err => {
                    console.log("에러:", err.msg);
                    resizing = false; // Reset the resizing flag
                    // set_loadingmsg(err.msg);
                })
                //#@! 고정사이즈일경우 다시 가상캔버스를 그리지 않게 코딩할것


                function preparePage(pageNumber, specificSize) {
                    return new Promise(async function (resolve, reject) {
                        if (!pageNumber) {
                            reject({
                                valid: false,
                                msg: "페이지넘버가 없음"
                            })
                            return;
                        }


                        const shouldPreparePage = pages[pageNumber - 1];
                        if (!shouldPreparePage) {
                            reject({
                                valid: false,
                                msg: "해당 페이지가 존재하지 않음"
                            })
                            return;
                        }
                        const pageOriginWidth = shouldPreparePage.view[2];
                        const pageOriginHeight = shouldPreparePage.view[3];

                        let myscale;
                        if (specificSize) {
                            myscale = specificSize / pageOriginWidth;
                        }
                        else {
                            myscale = 1 * renderWidth / pageOriginWidth;
                        }


                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d', { willReadFrequently: true });
                        const viewport = shouldPreparePage.getViewport({ scale: myscale }); // 원하는 스케일로 조정
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport,
                        };
                        // console.log("랜더컨택스 완료")
                        const resizeRatio = renderWidth / viewport.width;

                        await shouldPreparePage.render(renderContext).promise;


                        resolve({
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
                            wrapperSize: {
                                resizeRatio: resizeRatio,
                                width: renderWidth,
                                height: viewport.height * resizeRatio
                            },
                        })
                    });

                }

            });
        }, 100);

        const resizeObserver = new ResizeObserver(entries => {
            // 크기 변경시 실행할 작업을 여기에 작성합니다.

            handleRemakeVirtualCanvas(entries);
        });

        resizeObserver.observe(documentRef.current);
        return () => {
            resizeObserver.disconnect();
        }
    }, [viewPercent, pages, option]);
    */


    useEffect(() => {
        if (!pages) return;
        if (!previewOption) return;
        if (preparedPreviewPages) return;


        const renderWidth = previewOption.wrapperStyle ? previewOption.wrapperStyle.width - previewOption.pageMargin * 2 : 200;
        // const renderWidth = previewOption.wrapperStyle.width-40;

        prepareAllPage(pages);
        async function prepareAllPage(pages) {

            console.log("pages", pages);

            let p = [];
            for (let i = 0; i < pages.length; i++) {
                p[i] = preparePage(i + 1, renderWidth);
            }
            Promise.all(p).then(res => {
                console.log("Preview준비res", res);
                // let preparedPages=res;
                set_preparedPreviewPages(res);

            }).catch(err => {
                console.log("에러:", err.msg);
                // set_loadingmsg(err.msg);
            })

            function preparePage(pageNumber, specificSize) {
                return new Promise(async function (resolve, reject) {
                    if (!pageNumber) {
                        reject({
                            valid: false,
                            msg: "페이지넘버가 없음"
                        })
                        return;
                    }


                    const shouldPreparePage = pages[pageNumber - 1];
                    if (!shouldPreparePage) {
                        reject({
                            valid: false,
                            msg: "해당 페이지가 존재하지 않음"
                        })
                        return;
                    }
                    const pageOriginWidth = shouldPreparePage.view[2];
                    const pageOriginHeight = shouldPreparePage.view[3];

                    let myscale;
                    if (specificSize) {
                        myscale = specificSize / pageOriginWidth;
                    }
                    else {
                        myscale = 1 * renderWidth / pageOriginWidth;
                    }


                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d', { willReadFrequently: true });
                    const viewport = shouldPreparePage.getViewport({ scale: myscale }); // 원하는 스케일로 조정
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                    };
                    // console.log("랜더컨택스 완료")
                    const resizeRatio = renderWidth / viewport.width;

                    await shouldPreparePage.render(renderContext).promise;


                    resolve({
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
                        wrapperSize: {
                            resizeRatio: resizeRatio,
                            width: renderWidth,
                            height: viewport.height * resizeRatio
                        },
                    })
                });

            }
        }
    }, [previewOption, pages, preparedPreviewPages])

    const prevRenderWidth = useRef();
    //레프트바의 preview에 대한..설정인데
    useEffect(() => {
        if (!preparedPreviewPages) return;
        const wrapEl = documentRef.current;
        let resizing = false; // Flag to track whether resizing is in progress

        const resizeObserver = new ResizeObserver(entries => {
            // 크기 변경시 실행할 작업을 여기에 작성합니다.
            entries.forEach(entry => {
                // console.log('@@@@@@@@@@@@@@@@PDFDocument 껍데기의 크기가 변경되었습니다!', entry.contentRect.width, entry.contentRect.height);
                // set_renderWidth(entry.contentRect.width * viewPercent / 100);
                // const contentWidth = wrapEl.offsetWidth;
                // const contentHeight = wrapEl.offsetHeight;

                const intViewPercent = parseInt(viewPercent);
                const sidebarSize = leftPreviewShow ? 150 : 0;
                const renderWidth = (wrapEl.offsetWidth - sidebarSize) * intViewPercent / 100;
  
                if(prevRenderWidth.current===renderWidth){
                    return;
                }
                prevRenderWidth.current = renderWidth;

                // console.log('PDF 껍데기의 크기가 변경되었습니다!', contentWidth, contentHeight);
                //   const renderWidth = contentWidth * parseInt(viewPercent) / 100;
                debouncedGeneratePercentPagesData(renderWidth);
            });
        });
   
        function generatePercentPagesData(renderWidth){
            if (resizing) {
                return; // If resizing is already in progress, return early
            }
            resizing = true; // Set the resizing flag to true
            console.log("generatePercentPagesData 호출")
            let viewPercentPagesData = [];
            // const intViewPercent = parseInt(viewPercent);
            // const sidebarSize = leftPreviewShow ? 150 : 0;
            // const renderWidth = (wrapEl.offsetWidth - sidebarSize) * intViewPercent / 100;
            // console.log("renderWidth",renderWidth)
            let hs = 0;
            for (let i = 0; i < preparedPreviewPages.length; i++) {
                const onePage = preparedPreviewPages[i];
                const { PDForiginSize } = onePage;
                let onePageWidth = renderWidth;
                let onePageHeight = renderWidth * PDForiginSize.height / PDForiginSize.width;
                let onePageMarginTop = 25;
                viewPercentPagesData.push({
                    pageNumber: i + 1,
                    bluredCanvas: onePage.canvas,
                    bluredCanvasSize: onePage.canvasSize,
                    width: onePageWidth,
                    height: onePageHeight,
                    marginHeight: onePageMarginTop,
                    viewMinScrollHeight: hs,
                    viewMaxScrollHeight: hs + onePageHeight + onePageMarginTop,
                    // visible: hs >= visibleMin && (hs + onePageHeight) <= visibleMax ? true : false
                });
                
                hs = hs + onePageHeight + onePageMarginTop;
            }
            set_percentPagesData(viewPercentPagesData);
            resizing=false;
        }
        const debouncedGeneratePercentPagesData =_.debounce((arg)=>{
            generatePercentPagesData(arg)
        },300);

        resizeObserver.observe(wrapEl);
        return () => {
            resizeObserver.disconnect();
        }
    }, [preparedPreviewPages, viewPercent, leftPreviewShow])

    const [AOI_moode,set_AOI_mode] = useState(0); // 0 아님, 1Quiz,2글,3사진,표
 



    return (<div className="PDFDocument" ref={documentRef}>
        {previewOption && preparedPreviewPages && percentPagesData ?
            <>
                <PDFTopBar
                    dynamicAllPageRef={dynamicAllPageRef}
                    fileName={fileName}
                    set_fileName={set_fileName}
                    AOI_moode={AOI_moode}
                    set_AOI_mode={set_AOI_mode}
                    viewPercent={viewPercent}
                    set_viewPercent={set_viewPercent}
                    maxPageNumber={maxPageNumber}
                    nowPage={nowPage}
            
                    handleChangeNowPage={(p) => {
                        set_nowPage(p)
                    }}
                    set_leftPreviewShow={set_leftPreviewShow}
                />
                <PDFpreview
                    dynamicAllPageRef={dynamicAllPageRef}
                    leftPreviewShow={leftPreviewShow}
                    nowPage={nowPage}
                    previewOption={previewOption}
                    preparedPreviewPages={preparedPreviewPages}
                    handlePreviewChange={(page) => {
                        // console.log("pageClick", page);
                        set_nowPage(page);
                    }}
                />
                <PDFdynamicAllPage
                    ref={dynamicAllPageRef}
                    leftPreviewShow={leftPreviewShow}
                    percentPagesData={percentPagesData}
                    set_nowPage={set_nowPage}
            
            
                    pages={pages}
                    preparePage={preparePage}
                />
            </>
            :
            <div className="LoadingScreen">Loading...</div>
        }



        {/* <div className="PDFScroll">
            {preparedPages ?
                React.Children.map(children, (child) => {
                    return React.isValidElement(child)
                        ? React.cloneElement(child, { handlePreviewChange, nowPage, preparedPages, preparedPreviewPages, previewOption })
                        : null
                })
                :
                <div className="LoadingScreen">Loading...</div>
            }
        </div>
         */}

    </div>)
}

export default PDFDocument;