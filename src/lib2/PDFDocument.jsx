import React, { useState, useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import usePDFLoader from "./hooks/usePDFLoader";
import _ from "lodash";

import "./PDFDocument.scss";
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js`;


const PDFDocument = (props) => {
    const { children, option, path, PDFDocumentOnLoadCallback, viewPercent } = props;
    // const { pages, maxPdfPageNumber } = usePDFLoader(path, PDFDocumentOnLoadCallback);
    // console.log("pages",pages)
    const [pages, setPages] = useState();
    const documentRef = useRef(null);
    const [preparedPages, set_preparedPages] = useState();
    

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
                if(PDFDocumentOnLoadCallback){
                  PDFDocumentOnLoadCallback(pdfPageNumbers);
                }

            } catch (error) {
                // 오류 처리
                console.error("PDF 로드 중 오류 발생:", error);
            }
        }

        getPDFdocumentByPath();
    }, [path,PDFDocumentOnLoadCallback]);


    useEffect(() => {
        if (!documentRef.current) return;
        if (!pages || !pages.length) return;
        
        const canvasWidth = option?.canvasWidth || 0; //고정사이즈
        console.log("@!@$!@$@!@$여기가호출", option, pages)

        const element = documentRef.current;
        const handleRemakeVirtualCanvas = _.debounce((entries)=>{
            entries.forEach(entry => {
                console.log('@@@@@@@@@@@@@@@@PDFDocument 껍데기의 크기가 변경되었습니다!', entry.contentRect.width, entry.contentRect.height, viewPercent);
                // set_renderWidth(entry.contentRect.width * viewPercent / 100);
                const contentWidth = element.offsetWidth;
                const contentHeight = element.offsetHeight;
                // console.log('PDF 껍데기의 크기가 변경되었습니다!', contentWidth, contentHeight);
                const renderWidth = contentWidth * viewPercent / 100;
                // console.log("renderWidth", renderWidth)
                

                let p = [];
                for (let i = 0; i < pages.length; i++) {
                    p[i] = preparePage(i + 1);
                }

                Promise.all(p).then(res => {
                    console.log("모든페이지준비res", res);
                    set_preparedPages(res);

                }).catch(err => {
                    console.log("에러:", err.msg);
                    // set_loadingmsg(err.msg);
                })
                //#@! 고정사이즈일경우 다시 가상캔버스를 그리지 않게 코딩할것


                function preparePage(pageNumber) {
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

                        let myscale = canvasWidth ? canvasWidth / pageOriginWidth :
                            1.5 * renderWidth / pageOriginWidth * 1;

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
                            wrapperSize:{
                                resizeRatio:resizeRatio,
                                width:renderWidth,
                                height:viewport.height*resizeRatio
                            },
                        })
                    });

                }

            });
        },100);

        const resizeObserver = new ResizeObserver(entries => {
            // 크기 변경시 실행할 작업을 여기에 작성합니다.
         
            handleRemakeVirtualCanvas(entries);
        });

        resizeObserver.observe(documentRef.current);
        return () => {
            resizeObserver.disconnect();
        }
    }, [viewPercent, pages, option]);



    return (<div className="PDFDocument" ref={documentRef}>
        <div className="PDFScroll">
            {preparedPages ?
                React.Children.map(children, (child) => {
                    return React.isValidElement(child)
                        ? React.cloneElement(child, { preparedPages })
                        : null
                })
                :
                <div className="LoadingScreen">Loading...</div>
            }
        </div>


    </div>)
}

export default PDFDocument;