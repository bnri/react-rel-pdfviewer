import React, { useState, useEffect, useRef } from "react";
import './PDFviewModalV2.scss';

// import { Document, Page, pdfjs } from 'react-pdf';
// import pdfjsLib from "pdfjs-dist/build/pdf";
import * as pdfjsLib from 'pdfjs-dist';
import PDFpage from "./PDFpage";
// import PDFJSWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry'

// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js`;
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;


const PDFviewModalV2 = React.forwardRef(({ ...props }, ref) => {
    const {
        drawStart, drawEnd, drawIng, viewPercentChangeCallback, path, onClose, showViewMode, viewpercent,
        set_viewpercent, scrollCallback, pageCallback, pdfSizeCallback, onConfirm, showConfirmBtn, PDFonloadCallback } = props;
    // pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    // console.log("path",path);
    const virtualCanvasRef = useRef(null);

    const renderCanvasRef = useRef();
    const PDFWrapperRef = useRef();


    const [pdfPages, set_pdfPages] = useState(null);
    const [nowPage, set_nowPage] = useState(1);
    const [pages, set_pages] = useState(null);


    // const [pdf,set_pdf] = useState(null);
    useEffect(async () => {
        if (!path) return;
        console.log("pdfjsLib", pdfjsLib)
        console.log("path", path);
        var loadingTask = await pdfjsLib.getDocument(path);
        const pdf = await loadingTask.promise;
        // set_pdf(pdf);

        const pdfInfo = pdf._pdfInfo;
        const pdfPageNumbers = pdfInfo.numPages;
        const p = [];

        for (let i = 1; i <= pdfPageNumbers; i++) {
            const page = await pdf.getPage(i);
            p.push(page)
        }
        set_pages(p);


        set_pdfPages(pdfPageNumbers);
    }, [path])

    const [isPreparedRender, set_isPreparedRender] = useState(false);
    useEffect(() => {
        if (isPreparedRender && nowPage) {
            let pa = virtualCanvasRef.current;
            console.log("그릴거야 nowPage",nowPage);

            console.log("renderCanvasRef.current",renderCanvasRef.current);
            for (let i = 0; i < 2; i++) {
                if (pa[i].pageNumber === nowPage) {

                    const renderCanvas = renderCanvasRef.current;
                    const rctx = renderCanvas.getContext("2d");
                    rctx.clearRect(0, 0, renderCanvasRef.current.width, renderCanvasRef.current.height);
                    renderCanvas.width = pa[i].viewWidth;
                    renderCanvas.height = pa[i].viewHeight;
                    rctx.drawImage(pa[i].canvas, 0, 0);
                    break;
                }

            }

        }
    }, [isPreparedRender, nowPage]);




    useEffect(() => {
        //wrapper resize 시 다시 랜더해야함..
        async function renderPageToVirtualCanvas() {
            if (!pages) {
                return;
            }
            console.log("준비");

            set_isPreparedRender(false);
            if (!virtualCanvasRef.current) {
                virtualCanvasRef.current = [];
            }


            for (let i = 1; i <= 2; i++) {
                const canvas = document.createElement('canvas');
                let obj = {
                    canvas: canvas,
                    pageNumber: i,
                }

  
                const wrapperWidth = PDFWrapperRef.current.offsetWidth;
                obj.wrapperWidth = wrapperWidth;
                const page = pages[i - 1];

                const pageWidth = page.view[2] + page.view[0];
                const pageHeight = page.view[3] + page.view[1];
                console.log(page.view);
                //PDF 의 렌더크기를 . 지금 wrapper의 Width에 맞춤
                let myscale = wrapperWidth / pageWidth; //
                obj.myscale = myscale;
                console.log("myscale", myscale);
                // 캔버스 컨텍스트 가져오기
                const context = canvas.getContext('2d');
                // 페이지 크기를 가져오기
                const viewport = page.getViewport({ scale: myscale * 1 }); // 원하는 스케일로 조정
                // 캔버스 크기 설정
                obj.viewWidth = wrapperWidth;
                obj.viewHeight = pageHeight * myscale;
                // set_viewWidth(wrapperWidth);
                // set_viewHeight(pageHeight * myscale);

                canvas.width = viewport.width;
                canvas.height = viewport.height;
                // PDF 페이지를 캔버스에 렌더링
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };
                await page.render(renderContext);
                virtualCanvasRef.current.push(obj);
            }

            set_isPreparedRender(true);
            console.log("virtualCanvasRef.current", virtualCanvasRef.current)

        }
        renderPageToVirtualCanvas();

    }, [pages]);









    return (<div className="PDFviewModalV2 no-drag" >
        <div style={{ position: 'absolute', left: 0, top: 0, background: 'orange' }}>
            총페이지:{pdfPages}<br />
            지금페이지:{nowPage}<br />


            <button onClick={() => {
                set_nowPage(p => p > 1 ? p - 1 : p);
            }}>이전</button>
            <button onClick={() => {
                set_nowPage(p => p + 1 < pdfPages ? p + 1 : p);
            }}>다음</button>
        </div>

        <div className="PDFWrapper" style={{ width: '100%', height: '100%', overflowY: 'auto' }} ref={PDFWrapperRef} >
            {/* <PDFpage nowPage={nowPage} pages={pages} /> */}
            <canvas ref={renderCanvasRef} style={{width:'100%',height:'auto'}} />
        </div>


    </div>)
});

export default PDFviewModalV2;