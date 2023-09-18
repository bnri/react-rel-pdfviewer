import React, { useState, useEffect  ,useRef} from "react";
import './PDFviewModalV2.scss';

// import { Document, Page, pdfjs } from 'react-pdf';
// import pdfjsLib from "pdfjs-dist/build/pdf";
import * as pdfjsLib from 'pdfjs-dist';
// import PDFJSWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry'

// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js`;
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;


const PDFviewModalV2 = React.forwardRef(({ ...props }, ref) => {
    const {
        drawStart, drawEnd, drawIng, viewPercentChangeCallback,path, onClose, showViewMode, viewpercent, 
        set_viewpercent, scrollCallback, pageCallback, pdfSizeCallback, onConfirm, showConfirmBtn, PDFonloadCallback } = props;
    // pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    // console.log("path",path);
    const virtualCanvasRef = useRef(null);

    const canvasRef = useRef(null);
    const pdfWrapperRef = useRef(null);
    const [pdfPages,set_pdfPages] = useState(null);
    const [nowPage,set_nowPage] = useState(1);
    
    const [viewWidth,set_viewWidth] = useState(0);
    const [viewHeight,set_viewHeight] = useState(0);
    const [pdf,set_pdf] = useState(null);
    useEffect(async()=>{
        if(!path) return;
        console.log("pdfjsLib", pdfjsLib)
        console.log("path", path);
        var loadingTask = await pdfjsLib.getDocument(path);
        const pdf = await loadingTask.promise;
        set_pdf(pdf);
        const pdfInfo = pdf._pdfInfo;
        const pdfPageNumbers=pdfInfo.numPages;
        set_pdfPages(pdfPageNumbers);
    },[path])


    const temp=useRef();


    useEffect(() => {
        if(!pdf) return;
        if(temp.current&&temp.current.ing)return;
        async function renderPage(){
            temp.current={};
            temp.current.ing=true;
    
            const wrapperWidth=pdfWrapperRef.current.offsetWidth;
            const pageNumber = nowPage;
            const page = await pdf.getPage(pageNumber);
            const pageWidth = page.view[2]+page.view[0];
            const pageHeight = page.view[3]+page.view[1];
            console.log(page.view);
            //PDF 의 렌더크기를 . 지금 wrapper의 Width에 맞춤
            let myscale=wrapperWidth/pageWidth; //
            console.log("myscale",myscale);
            // 캔버스 컨텍스트 가져오기
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            // 페이지 크기를 가져오기
            const viewport = page.getViewport({ scale: myscale*3}); // 원하는 스케일로 조정
            // 캔버스 크기 설정
            set_viewWidth(wrapperWidth);
            set_viewHeight(pageHeight*myscale);
    
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            // PDF 페이지를 캔버스에 렌더링
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            await page.render(renderContext);
    
            temp.current.ing=false;
        }
        renderPage();

    }, [nowPage,pdf ]);




    return (<div className="PDFviewModalV2 no-drag" >
        <div style={{position:'absolute',left:0,top:0,background:'orange'}}>
            총페이지:{pdfPages}<br/>
            지금페이지:{nowPage}<br/>

            <button onClick={()=>{
                set_nowPage(p=>p+1<pdfPages?p+1:p);
            }}>다음</button>
            <button onClick={()=>{
                set_nowPage(p=>p>1?p-1:p);
            }}>이전</button>
        </div>

        <div className="PDFWrapper"style={{width:'100%',height:'100%',overflowY:'auto'}} ref={pdfWrapperRef}>
            <canvas className="mycanvas" style={{width:viewWidth,height:viewHeight}}ref={canvasRef}></canvas>
        </div>


    </div>)
});

export default PDFviewModalV2;