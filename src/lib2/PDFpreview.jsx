import { useState, useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js`;


const PDFpreview = (props) => {
    const {
        preparedPreviewPages,
        handlePreviewChange,
        previewOption,
        previewPageNumber
    } = props;




    return (<div className="PDFpreview" style={{
        ...previewOption.wrapperStyle,
        left: previewOption.show ? 0: -(previewOption.wrapperStyle.width+previewOption.pageMargin*2) 

    }}>
        {previewOption && preparedPreviewPages &&
            preparedPreviewPages.map((onePage, index) => {
                return (
                    <div className="onePageWrap"
                        style={{
                            marginTop: previewOption.pageMargin,
                            marginBottom: previewOption.pageMargin
                        }}
                        key={'preview_' + index}
                    >
                        <div style={{
                            position: 'relative',
                            width: onePage.wrapperSize.width,
                            height: onePage.wrapperSize.height,
                        }}>
                            <canvas
                                className="onePageCanvas"
                                style={{
                                    width: '100%',
                                    height: '100%'
                                }}
                                width={onePage.canvasSize.width} // Set the canvas width
                                height={onePage.canvasSize.height} // Set the canvas height

                                ref={(canvas) => {
                                    // console.log("onePage",onePage);
                                    if (canvas && onePage.canvas) {
                                        // Get the canvas's 2D rendering context
                                        const context = canvas.getContext('2d');
                                        // Draw the canvas content onto the canvas element
                                        context.drawImage(onePage.canvas, 0, 0);
                                        // delete onePage.canvas;
                                    }
                                }}

                            />
                            <div className={`onePageBlur ${previewPageNumber === (index * 1 + 1) ? 'selPage' : ''}`} onClick={() => {
                                if (handlePreviewChange) {
                                    handlePreviewChange(index + 1);
                                }
                            }} />
                        </div>


                        <div className="pageNumberWrapper">
                            {index + 1}
                        </div>
                    </div>)
            })
        }

    </div>)

}
export default PDFpreview;