import React, { useState, useEffect, useRef ,useMemo} from "react";
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
    const preparedPDFPageInform = useRef(null);

    const renderCanvasRef = useRef();
    const PDFWrapperRef = useRef();


    const [maxPdfPageNumber, set_maxPdfPageNumber] = useState(null);
    const [nowPage, set_nowPage] = useState(1);
    const [pages, set_pages] = useState(null);

    const [isNowPageRenderPrepared, set_isNowPageRenderPrepared] = useState();
    const [isNextPageRenderPrepared,set_isNextPageRenderPrepared] = useState();
    const [isPrevPageRenderPrepared,set_isPrevPageRenderPrepared] = useState();

    const PDFrenderOption = useMemo(()=>{
        return {
            mode:1 //1모드는 랜더한페이지의 다음과 이전만 준비하는 방식.
        }
    },[])

    
    //PDF document 를 얻는부분
    useEffect(() => {
        if (!path) return;
        // console.log("pdfjsLib", pdfjsLib)
        // console.log("path", path);
        async function getPDFdocumentByPath(){
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
            set_maxPdfPageNumber(pdfPageNumbers);
        }
        getPDFdocumentByPath();
    }, [path])


    //nowPage를 랜더준비를 하는곳
    useEffect(() => {
        if (!preparedPDFPageInform.current) {
            preparedPDFPageInform.current = [];
        }
        if(!pages){
            return;
        }
        set_isNowPageRenderPrepared(false);
        set_isNextPageRenderPrepared(false);
        set_isPrevPageRenderPrepared(false);

        const wrapperWidth = PDFWrapperRef.current.offsetWidth;
        const preparedPDFinform = preparedPDFPageInform.current; //배열형태임.

        let targetPrepared=preparedPDFinform.find(d=>d.pageNumber===nowPage)
        if(targetPrepared){

            if(targetPrepared.wrapperSize&&targetPrepared.wrapperSize.width===wrapperWidth){
                console.log("이미있어서 targetPrepared를 다시 만들필요 없음");
                set_isNowPageRenderPrepared(true);
            }
            else{
                //targetPrepared를삭제 preparedPDFinform에서
                console.log("targetPrepared를삭제",targetPrepared);
                let targetPreparedIndex = preparedPDFinform.findIndex(d => d.pageNumber === nowPage);
                preparedPDFinform.splice(targetPreparedIndex, 1);
                console.log("만들어야함")

            }
        }
        else{
            console.log("만들어야함")
        }
        //#@!#@! 이위에부분을 prepareRenderPage 안쪽에 넣자...

       

        prepareRenderPage(nowPage).then(res_nowPageRender=>{
            // console.log("res_nowPageRender",res_nowPageRender);
            if(res_nowPageRender.valid){
                preparedPDFinform.push(res_nowPageRender.data)
                set_isNowPageRenderPrepared(true);
                console.log("targetPrepared를 생성하는데 성공");

            }
            else{
                console.log("targetPrepared를 생성하는데 실패");
            }
        });

        if(PDFrenderOption.mode===1){
            //
            prepareRenderPage(nowPage-1).then(res_prevPageRender=>{
                if(res_prevPageRender.valid){
                    preparedPDFinform.push(res_prevPageRender.data)
                    set_isPrevPageRenderPrepared(true);
                    console.log("prevPage를 생성하는데 성공");
                }
                else{
                    console.log("prevPage를 생성하는데 실패");
                }
            });

            prepareRenderPage(nowPage+1).then(res_nextPageRender=>{
                if(res_nextPageRender.valid){
                    preparedPDFinform.push(res_nextPageRender.data)
                    set_isNextPageRenderPrepared(true);
                    console.log("nextPage를 생성하는데 성공");
                }
                else{
                    console.log("nextPage를 생성하는데 실패");
                }
            });
        }






 //랜더할 width임. 어떤이미지든 여기 width 100% 기준임 지금은.
        //wrapper resize 시 다시 랜더해야함..
        function prepareRenderPage(pageNumber){
            return new Promise(async function(resolve){
                if(!pages){
                    resolve({
                        valid:false,
                        msg:"페이지정보가 준비되지 않음"
                    }) 
                    return;
                }
                const shouldPreparePage = pages[pageNumber - 1];
                if(!shouldPreparePage){
                    resolve({
                        valid:false,
                        msg:"해당 페이지가 존재하지 않음"
                    })           
                    return;
                }
    

                //해당페이지들의 실제 크기임.
                const pageOriginWidth = shouldPreparePage.view[2] - shouldPreparePage.view[0];
                const pageOriginHeight = shouldPreparePage.view[3] - shouldPreparePage.view[1];
    
                //랜더하고자 하는 wrapperWidth만큼 scale필요
                let myscale = wrapperWidth / pageOriginWidth; 
    
                //랜더할 가상캔버스 생성
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d', { willReadFrequently: true });
                const viewport = shouldPreparePage.getViewport({ scale: myscale }); // 원하는 스케일로 조정
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                //가상캔버스에 viewport 이미지사이즈를 랜더할거임
    
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };
                await shouldPreparePage.render(renderContext).promise;
                resolve({
                    valid:true,
                    data:{
                        canvas:canvas,
                        pageNumber:pageNumber,
                        scale:myscale,
                        PDForiginSize:{
                            width:pageOriginWidth,
                            height:pageOriginHeight
                        },
                        canvasSize:{
                            width:viewport.width,
                            height:viewport.height
                        },
                        wrapperSize:{
                            width:wrapperWidth
                        }
                    }
                });
            });
        }

    }, [pages, nowPage,PDFrenderOption]);




    const [renderedTarget,set_renderedTarget]= useState(null);
    useEffect(() => {
        if (!pages) return;
        if (isNowPageRenderPrepared && nowPage) {
            let pa = preparedPDFPageInform.current;
            const targetPrepared=pa.find(d=>d.pageNumber===nowPage)
            if(!targetPrepared) {
                console.error("target이 준비되지 않았습니다");
                return;
            }
            console.log("targetPrepared 친구를 render하겠음");
            console.log("targetPrepared",targetPrepared);
            const renderCanvas = renderCanvasRef.current;
            const ctx = renderCanvas.getContext("2d");
            ctx.clearRect(0, 0, renderCanvasRef.current.offsetWidth, renderCanvasRef.current.offsetHeight);
            renderCanvas.width = targetPrepared.canvasSize.width;
            renderCanvas.height = targetPrepared.canvasSize.height;
            ctx.drawImage(targetPrepared.canvas, 0, 0);
            set_renderedTarget(targetPrepared);
        }
    }, [isNowPageRenderPrepared, nowPage, pages]);









    return (<div className="PDFviewModalV2 no-drag" >
        <div style={{ position: 'absolute', left: 0, top: 0, background: 'orange' }}>
            총페이지:{maxPdfPageNumber}<br />
            지금페이지:{nowPage}<br />


            <button disabled={isPrevPageRenderPrepared===true?false:true}onClick={() => {
                set_nowPage(p => p > 1 ? p - 1 : p);
            }}>이전</button>
            <button disabled={isNextPageRenderPrepared===true?false:true} onClick={() => {
                set_nowPage(p => p + 1 <= maxPdfPageNumber ? p + 1 : p);
            }}>다음</button>
        </div>

        <div className="PDFWrapper" style={{ width: '1500px', height: '800px', overflowY: 'auto' }}
            ref={PDFWrapperRef} >


            <canvas ref={renderCanvasRef}
                style={{
                    width: renderedTarget !== null ?
                    renderedTarget.wrapperSize.width : 0,
                    height: renderedTarget !== null ?
                    renderedTarget.canvas.height : 0
                }} />


        </div>


    </div>)
});

export default PDFviewModalV2;