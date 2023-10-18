import React, { useState, useEffect, useRef, useCallback, useMemo, forwardRef, useImperativeHandle } from "react";

import { Scrollbars } from "react-custom-scrollbars";


function arraysAreEqual(arr1, arr2) {
    if (!arr1 || !arr2) {
        return false;
    }
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].pageNumber !== arr2[i].pageNumber) {
            return false;
        }
        if (arr1[i].pageSize.width !== arr2[i].pageSize.width) {
            return false;
        }
    }

    return true;
}
function findMaxIndex(arr) {
    let max = -Infinity;
    let maxIndex = -1;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
            maxIndex = i;
        }
    }

    return maxIndex;
}

const PDFdynamicAllPage = forwardRef((props,ref) => {
    const { set_nowPage,preparePage, pages, percentPagesData, leftPreviewShow } = props;
    const scrollDivRef = useRef();

    const [shouldRenderHighQualityPageArray, set_shouldRenderHighQualityPageArray] = useState();
    const beforeHighqualityRef = useRef();
    const ismakingHighQualityRef = useRef();
    const changePercentPagesData = useCallback(() => {
        // console.log("@@@@@@@@@@@@@@@changePercentPagesData@@@@@@@@@@@")
        let beforehouldRenderHighQualityPageArray = beforeHighqualityRef.current;

        const { scrollTop, clientHeight } = scrollDivRef.current.getValues();
        const currentScroll = scrollTop;
        let visibleMin = currentScroll;
        let visibleMax = currentScroll + clientHeight;
        let hs = 0;
        let data = [];
        let shouldRenderPages = [];

        //#@! set_nowPage 를여기서 해주자.
        //메인페이지를 결정해줍시다.

        let partVisibleArr =[];
        for (let i = 0; i < percentPagesData.length; i++) {
            const onePage = percentPagesData[i];
            let onePageHeight = onePage.height + onePage.marginHeight;
            
            let ps = hs + onePage.marginHeight;
            let pe = hs + onePage.height + onePage.marginHeight;
            const partVisibleRatio = (Math.min(pe, visibleMax) - Math.max(ps, visibleMin)) / (pe - ps);
            partVisibleArr.push(partVisibleRatio)
            let partVisible = false;
            if (visibleMin <= ps && visibleMax >= ps) {
                partVisible = true;
            }
            if (visibleMin <= pe && visibleMax >= pe) {
                partVisible = true;
            }
            if (visibleMin >= ps && visibleMax <= pe) {
                partVisible = true;
            }
            
            // console.log("visibleMin",visibleMin);
            data.push({
                pageNumber: i+1,
                pageHeight:onePageHeight,
                viewMinScrollHeight:hs,
                viewMaxScrollHeight:hs+onePageHeight,
                page_s:hs+onePage.marginHeight,
                page_e:hs+onePage.height + onePage.marginHeight,
                partVisible:partVisible,
                partVisibleRatio:partVisibleRatio,
                visibleMin:visibleMin,
                visibleMax:visibleMax,
                ps:ps,
                pe:pe,
             
            });
         
         

            if (partVisible) {
                shouldRenderPages.push({
                    pageNumber: i + 1,
                    pageSize: {
                        width: onePage.width,
                        height: onePage.height
                    }
                });
            }

            hs += onePageHeight;
        }
        // console.log("partVisibleArr",partVisibleArr)
      
        set_nowPage(findMaxIndex(partVisibleArr)+1);

         console.log("data",data);


        if (beforehouldRenderHighQualityPageArray) {
            if (arraysAreEqual(beforehouldRenderHighQualityPageArray, shouldRenderPages)) {
                return;
            }
            else {
                if (ismakingHighQualityRef.current) {
                    return;
                }
                console.log("111111111이전값이 있지만 틀려서 생성중");
                //#@!어째서 여기가 계속 호출되는것인가?
                makeVirtualCanvasHighQualityPage().then(valid => {
                    ismakingHighQualityRef.current = false;
                    if (valid) {
                        // console.log("이전값 beforehouldRenderHighQualityPageArray",beforehouldRenderHighQualityPageArray);
                        // console.log("shouldRenderHighQualityPageArray 리사이즈할당")

                        set_shouldRenderHighQualityPageArray(shouldRenderPages);

                        beforeHighqualityRef.current = shouldRenderPages;
                    }
                });


            }
        }
        else {
            if (ismakingHighQualityRef.current) {
                return;
            }
            //맨처음 만드는경우다.
            console.log("2222222222이전값이 없고 신규 생성중");
            makeVirtualCanvasHighQualityPage().then(valid => {
                ismakingHighQualityRef.current = false;
                if (valid) {
                    // console.log("shouldRenderHighQualityPageArray 신규할당")

                    set_shouldRenderHighQualityPageArray(shouldRenderPages);

                    beforeHighqualityRef.current = shouldRenderPages;
                }
            });
        }

        function makeVirtualCanvasHighQualityPage() {
            ismakingHighQualityRef.current = true;
            return new Promise(async function (resolve) {

                // console.log("@@@@@@@@@@@@@만드는작업돌입")
                for (let i = 0; i < shouldRenderPages.length; i++) {
                    const pg = shouldRenderPages[i];
                    // console.log("pg",pg)
                    let res = await preparePage(pages[pg.pageNumber - 1], pg.pageNumber, pg.pageSize.width, pg.pageSize.width);

                    if (res.valid) {
                        shouldRenderPages[i].canvas = res.canvas;
                    }
                    else {
                        resolve(false);
                        return;
                    }
                }
                resolve(true);

            });

        }
    }, [percentPagesData, pages, preparePage]);


    const forceMoveScrollTop = useCallback((offset)=>{
        scrollDivRef.current.Top(offset);
    },[])

    useImperativeHandle(ref,()=>({
        set_scrollTop:(val)=>{
            forceMoveScrollTop(val);
        }
    }),[forceMoveScrollTop]);


    useEffect(() => {
        changePercentPagesData();
    }, [changePercentPagesData])


    const handleOnScroll = useCallback(() => {
        changePercentPagesData();
    }, [changePercentPagesData]);



    useEffect(() => {
        console.log("@@@@@@@@shouldRenderHighQualityPageArray ", shouldRenderHighQualityPageArray)
    }, [shouldRenderHighQualityPageArray])

    return (<div className="PDFdynamicAllPage" style={{
        marginLeft: leftPreviewShow ? 150 : 0,
        width: leftPreviewShow ? "calc(100% - 150px)" : "100%"
    }}>
        <Scrollbars onScroll={handleOnScroll} ref={scrollDivRef} className="scrollDiv" renderThumbHorizontal={(props) => <div {...props} className="thumb-horizontal" style={{ display: "none" }} />}>

            {percentPagesData && percentPagesData.map((onePage, index) => {

                // console.log("shouldRenderHighQualityPageArray",shouldRenderHighQualityPageArray)
                let highQualityData = null;
                if (shouldRenderHighQualityPageArray && shouldRenderHighQualityPageArray.find(d => d.pageNumber === index + 1)) {
                    highQualityData = shouldRenderHighQualityPageArray.find(d => d.pageNumber === index + 1);
                    // console.log("highQualityData",highQualityData);
                }
                // console.log("여기")
                return (
                    <div className="onePageWrap"
                        style={{
                            marginTop: onePage.marginHeight,
                        }}
                        key={'dynamic_page_' + index}
                    >
                        <div className="pageCanvasWrap" style={{
                            width: onePage.width,
                            height: onePage.height,
                        }}>
                            <canvas
                                className="onePageCanvas"
                                width={onePage.bluredCanvasSize.width} // Set the canvas width
                                height={onePage.bluredCanvasSize.height} // Set the canvas height

                                ref={(canvas) => {
                                    // console.log("onePage",onePage);
                                    if (canvas && onePage.bluredCanvas) {
                                        // Get the canvas's 2D rendering context
                                        const context = canvas.getContext('2d');
                                        // Draw the canvas content onto the canvas element
                                        context.drawImage(onePage.bluredCanvas, 0, 0);
                                        // delete onePage.canvas;
                                    }
                                }}

                            />
                            {highQualityData &&
                                <div className="highQualityCanvasWrap">
                                    <canvas
                                        className="onePageCanvas"
                                        width={highQualityData.pageSize.width} // Set the canvas width
                                        height={highQualityData.pageSize.height} // Set the canvas height

                                        ref={(canvas) => {
                                            // console.log("onePage",onePage);
                                            if (canvas && highQualityData.canvas) {
                                                // Get the canvas's 2D rendering context
                                                const context = canvas.getContext('2d');
                                                // Draw the canvas content onto the canvas element
                                                context.drawImage(highQualityData.canvas, 0, 0);
                                                // delete onePage.canvas;
                                            }
                                        }}

                                    />
                                </div>
                            }

                        </div>


                    </div>)
            })}
        </Scrollbars>

    </div>)
});

export default PDFdynamicAllPage;