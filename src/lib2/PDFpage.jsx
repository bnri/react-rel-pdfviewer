
import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from 'pdfjs-dist';
const PDFpage = ({ ...props }) => {
    const { nowPage, pages } = props;
    const canvasRef = useRef(null);
    const [viewWidth,set_viewWidth] = useState(0);
    const [viewHeight,set_viewHeight] = useState(0);
    const temp=useRef();
    const pdfWrapperRef = useRef(null);
    useEffect(() => {
        if (!pages) return;
        console.log("여기")
        async function renderPage() {
            console.log("페이지랜더 ,page",)
            temp.current = {};
            temp.current.ing = true;

            const wrapperWidth = pdfWrapperRef.current.offsetWidth;
            const pageNumber = nowPage;
            console.log("pageNumber",pageNumber)
            const page = pages[pageNumber-1];

            const pageWidth = page.view[2] + page.view[0];
            const pageHeight = page.view[3] + page.view[1];
            console.log(page.view);
            //PDF 의 렌더크기를 . 지금 wrapper의 Width에 맞춤
            let myscale = wrapperWidth / pageWidth; //
            console.log("myscale", myscale);
            // 캔버스 컨텍스트 가져오기
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            // 페이지 크기를 가져오기
            const viewport = page.getViewport({ scale: myscale * 1 }); // 원하는 스케일로 조정
            // 캔버스 크기 설정
            set_viewWidth(wrapperWidth);
            set_viewHeight(pageHeight * myscale);

            canvas.width = viewport.width;
            canvas.height = viewport.height;
            // PDF 페이지를 캔버스에 렌더링
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            await page.render(renderContext);

            temp.current.ing = false;
        }
        renderPage();

    }, [nowPage,pages]);
    

    return (<div className="PDFpage" ref={pdfWrapperRef}>
        <canvas className="mycanvas" style={{ width: viewWidth, height: viewHeight }} ref={canvasRef}></canvas>
    </div>)
}

export default PDFpage;