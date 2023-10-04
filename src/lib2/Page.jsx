import { useState, useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from "react";
const Page = forwardRef((props, ref) => {
    const {
        // renderWidth,
        pageNumber,
        // canvasWidth 
        preparedPages
    } = props;


    const renderCanvasRef = useRef();


    useEffect(() => {

        if (!renderCanvasRef.current) return;
        if (!preparedPages) return;

        let targetPrepared = preparedPages.find(d => d.pageNumber === pageNumber);
        if (!targetPrepared) {
            console.log("에러...targetPrepared 없다");
            return;
        }
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        let canvasWidth = targetPrepared.canvas.width;
        let renderWidth = targetPrepared.wrapperSize.width;

        console.log("targetPrepared", targetPrepared)
        drawCanvas(targetPrepared);

        function drawCanvas(targetPrepared) {
            // console.log("targetPrepared",targetPrepared)
            const renderCanvas = renderCanvasRef.current;
            const ctx = renderCanvas.getContext("2d");
            renderCanvas.width = targetPrepared.canvasSize.width;
            renderCanvas.height = targetPrepared.canvasSize.height;
            ctx.drawImage(targetPrepared.canvas, 0, 0);

            console.log("pageNumber", pageNumber, "그리기완료")

        }
    }, [pageNumber, preparedPages]);

    const renderSize = useMemo(()=>{
        let targetPrepared = preparedPages.find(d => d.pageNumber === pageNumber);
        if(targetPrepared){
            return targetPrepared.wrapperSize;
        }
        else{
            return{
                width:0,
                height:0
            }

        }
    },[pageNumber,preparedPages])



    return (<div className="Page" style={{ width: `${renderSize.width}px` }} >

        <canvas className="PDFcanvas" ref={renderCanvasRef}
            style={{
                width: '100%',
                height: renderSize.height
            }} />

    </div>)
});
export default Page;