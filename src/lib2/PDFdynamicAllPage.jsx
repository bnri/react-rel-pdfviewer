import React, { createRef,useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";

import { Scrollbars } from "react-custom-scrollbars";
import _ from "lodash";
import MultipleCropDiv from "./components/MutlipleCropDiv";

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

const PDFdynamicAllPage = forwardRef((props, ref) => {
    const { set_tempAOI, tempAOI, AOI_mode, set_nowPage, preparePage, pages, percentPagesData, leftPreviewShow } = props;
    const scrollDivRef = useRef();

    const pageMultileCropDivRef = useRef(Array.from({ length: percentPagesData.length }, () => createRef()));
    // console.log("coordinates",coordinates)


    // console.log("tempAOI",tempAOI)

    //새로운 친구를 삽입할땠는것.
    const changeCoordinate = (pageIndex, coordinate, index, coordinates) => {
        set_tempAOI(aoi => {
            if (coordinates) {
                aoi[pageIndex] = coordinates;
            }
            // console.log("aoi",aoi)
            return JSON.parse(JSON.stringify(aoi));
        });

    }

    const deleteCoordinate = (pageIndex, targetCoordinate) => {
        console.log("@@@@삭제@@@@@@@@")
        console.log("pageIndex", pageIndex)
        console.log("coordinates", targetCoordinate);
        console.log("@@@@@@@@@@@@")
        set_tempAOI(aoi => {
            const pageAOI = aoi[pageIndex];
            for (let i = 0; i < pageAOI.length; i++) {
                if (pageAOI[i].id === targetCoordinate.id) {
                    pageAOI.splice(i, 1);
                    break;
                }

            }

            return JSON.parse(JSON.stringify(aoi));
        });
    }
    const moveCoordinate = useCallback((pageIndex, areaIndex, e, containerInform) => {
        set_tempAOI(aoi => {
            const { width: containerWidth, height: containerHeight } = containerInform;
            const pageAOI = aoi[pageIndex];
            let last_cropCoordinate = pageAOI[areaIndex];
            const { xr, yr, widthr, heightr } = last_cropCoordinate;
            const x = xr * containerWidth;
            const y = yr * containerHeight;
            const w = containerWidth * widthr;
            const h = containerHeight * heightr;
            const { dx, dy } = e;
            const movex = x + dx / 2 < 0 ? 0 : x + dx / 2;
            const movey = y + dy / 2 < 0 ? 0 : y + dy / 2;


            //   console.log("containerInform",containerInform)
            //     console.log("x2",x2);
            // console.log("top", top)
            // console.log("기존픽셀:", x, y, w, h);
            // console.log("바뀐픽셀:", x + left, y + top, width, height);
            const maxx = containerWidth - w;
            const maxxr = 1 - widthr;
            const maxy = containerHeight - h;
            const maxyr = 1 - heightr;

            let newCoordinate = {
                ...last_cropCoordinate,
                x: Math.min(movex, maxx),
                y: Math.min(movey, maxy),
                width: w,
                height: h,
                xr: Math.min((movex) / containerWidth, maxxr),
                yr: Math.min((movey) / containerHeight, maxyr),
                // widthr: width / containerWidth,
                // heightr: height / containerHeight,

            }
            console.log("newCoordinate", newCoordinate)
            pageAOI[areaIndex] = newCoordinate;
            // if(xr+widthr>1){
            //     newCoordinate.xr = 1-widthr;
            //     newCoordinate.x = x;
            // }

            // return aoi;
            return JSON.parse(JSON.stringify(aoi));
        });
    }, [set_tempAOI])

    const resizeCoordinate = useCallback((pageIndex, areaIndex, e, containerInform) => {
        // console.log("asfasf",pageIndex,areaIndex,newAOI);
        console.log("resizeCoordinate 호출")
        set_tempAOI(aoi => {
            const { width: containerWidth, height: containerHeight } = containerInform;
            const pageAOI = aoi[pageIndex];
            let last_cropCoordinate = pageAOI[areaIndex];
            const { xr, yr, widthr, heightr } = last_cropCoordinate;
            const x = xr * containerWidth;
            const y = yr * containerHeight;
            const w = containerWidth * widthr;
            const h = containerHeight * heightr;
            const { width, height } = e.rect; //바귄 높이이다.
            const { left, top } = e.deltaRect;
            // console.log("top", top)
            // console.log("기존픽셀:", x, y, w, h);
            // console.log("바뀐픽셀:", x + left, y + top, width, height);
            let newCoordinate = {
                ...last_cropCoordinate,
                x: x + left / 2,
                y: y + top / 2,
                width: width,
                height: height,
                xr: (x + left / 2) / containerWidth,
                yr: (y + top / 2) / containerHeight,
                widthr: width / containerWidth,
                heightr: height / containerHeight,

            }
            pageAOI[areaIndex] = newCoordinate;

            // return aoi;
            return JSON.parse(JSON.stringify(aoi));
        });
    }, [set_tempAOI]);

    const [shouldRenderHighQualityPageArray, set_shouldRenderHighQualityPageArray] = useState();
    const beforeHighqualityRef = useRef();
    const ismakingHighQualityRef = useRef();
    const firstPartVisibleInformRef = useRef();
    const prevFirstPartVisibleInformRef = useRef();
    const shouldMoveScrollPercent = useRef();

    const changePercentPagesData = useCallback(() => {
        console.log("@@@@@@@@@@@@@@@changePercentPagesData@@@@@@@@@@@");
        //#@! debounce 써서 고칠것
        let beforehouldRenderHighQualityPageArray = beforeHighqualityRef.current;

        const { scrollTop, clientHeight, scrollHeight } = scrollDivRef.current.getValues();
        // console.log("obj",scrollDivRef.current.getValues())
        const currentScroll = scrollTop;
        let visibleMin = currentScroll;
        let visibleMax = currentScroll + clientHeight;
        let hs = 0;
        let data = [];
        let shouldRenderPages = [];


        //메인페이지를 결정해줍시다.
        let firstPartVisibleInformation = null;

        let partVisibleArr = [];
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
                pageNumber: i + 1,
                pageHeight: onePageHeight,
                viewMinScrollHeight: hs,
                viewMaxScrollHeight: hs + onePageHeight,
                page_s: hs + onePage.marginHeight,
                page_e: hs + onePage.height + onePage.marginHeight,
                partVisible: partVisible,
                partVisibleRatio: partVisibleRatio,
                visibleMin: visibleMin,
                visibleMax: visibleMax,
                ps: ps,
                pe: pe,

            });



            if (partVisible) {
                if (firstPartVisibleInformation === null) {
                    firstPartVisibleInformation = {
                        partVisibleRatio: partVisibleRatio,
                        pageNumber: i + 1,
                        pageHeight: onePageHeight,
                        scrollHeight: scrollHeight,
                        clientHeight: clientHeight,
                        page_s: hs + onePage.marginHeight,
                        page_e: hs + onePage.height + onePage.marginHeight,
                        visibleMin: visibleMin,
                        visibleMax: visibleMax,
                        ps: ps,
                        pe: pe,
                    };
                    // console.log("moveToLastScrollPosition",moveToLastScrollPosition)
                    if (shouldMoveScrollPercent.current) {

                        shouldMoveScrollPercent.current = false;
                        // console.log("과거 스크롤정보",firstPartVisibleInformRef.current);
                        let prev = firstPartVisibleInformRef.current;
                        let now = firstPartVisibleInformation;
                        // console.log("지금보이는 스크롤정보",firstPartVisibleInformation);
                        let prevRatio = prev.visibleMin / prev.scrollHeight;

                        let shouldmove = now.scrollHeight * prevRatio;
                        // shouldmove;
                        //

                        scrollDivRef.current.scrollTop(shouldmove);
                        prevFirstPartVisibleInformRef.current = firstPartVisibleInformRef.current;
                        firstPartVisibleInformRef.current = firstPartVisibleInformation;
                        return;
                    }

                    // console.log("하..여기가...")
                    prevFirstPartVisibleInformRef.current = firstPartVisibleInformRef.current;
                    firstPartVisibleInformRef.current = firstPartVisibleInformation;

                }
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

        set_nowPage(np => {
            let newnp = findMaxIndex(partVisibleArr) + 1;
            if (np === newnp) {
                return np;
            }
            else {
                return newnp;
            }
        });



        //  console.log("data",data);


        if (beforehouldRenderHighQualityPageArray) {
            if (arraysAreEqual(beforehouldRenderHighQualityPageArray, shouldRenderPages)) {
                return;
            }
            else {
                if (ismakingHighQualityRef.current) {
                    return;
                }

                console.log("111111111이전값이 있지만 틀려서 생성중");
                //어째서 여기가 계속 호출되는것인가?
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


    }, [percentPagesData, pages, preparePage, set_nowPage]);



    const forceMoveScrollTopToPage = useCallback((pageNumber) => {
        if (!percentPagesData) return;
        // console.log("percentPagesData",percentPagesData);
        let sctop = null;
        for (let i = 0; i < percentPagesData.length; i++) {
            let p = percentPagesData[i];
            if (p.pageNumber === pageNumber) {
                sctop = p.viewMinScrollHeight + (p.marginHeight);
                break;
            }

        }
        if (sctop !== null) {
            // console.log("sctop",sctop)
            // console.dir(scrollDivRef.current)
            scrollDivRef.current.scrollTop(sctop);
        }

        // console.dir(scrollDivRef);
        // scrollDivRef.crTop(0);
    }, [percentPagesData])




    useImperativeHandle(ref, () => ({
        set_focusAOIArea: (pageNumber, AreaNumber) => {
            if(pageMultileCropDivRef.current){
                console.log("pageNumber",pageNumber)
                // console.log("pageMultileCropDivRef.current",pageMultileCropDivRef.current)
                // console.log(pageMultileCropDivRef.current[pageNumber-1]);
                
                pageMultileCropDivRef.current[pageNumber-1].current.set_focusArea(AreaNumber);

                // pageMultileCropDivRef.current[pageNumber - 1].set_focusArea(AreaNumber);
            }

        },
        set_scrollMoveToPage: (pageNumber) => {
            forceMoveScrollTopToPage(pageNumber);
        },
        // get_firstPartVisibleInform:()=>{
        //     if(firstPartVisibleInformRef===null){
        //         return null;
        //     }
        //     return firstPartVisibleInformRef.current;
        // },
        // set_scrollMoveToPagePercent:(pageNumber,startPercent)=>{
        //     forceMoveScrollTopToPagePercent(pageNumber,startPercent);
        // }
        moveTothePrevScroll: () => {
            //#@!#@! 
            //percentPagesData 가 바뀐후에 렌더가 끝나고 스크롤 이동을 해주자...
            shouldMoveScrollPercent.current = true;

            // console.log("@moveTothePrevScroll호출");
            // let prev=prevFirstPartVisibleInformRef.current
            // let now=firstPartVisibleInformRef.current
            // console.log("하 이동");
            // console.log("prev",prev);
            // console.log("now",now)
        }
    }), [forceMoveScrollTopToPage]);


    useEffect(() => {
        console.log("여긴?")

        const debouncedChangePercentPagesData = _.debounce((arg) => {
            changePercentPagesData(arg);
        }, 300);
        debouncedChangePercentPagesData();
    }, [changePercentPagesData])


    const handleOnScroll = useCallback(() => {
        changePercentPagesData();
    }, [changePercentPagesData]);

    console.log("~~!pageMultileCropDivRef",pageMultileCropDivRef)



    return (<div className="PDFdynamicAllPage" style={{
        marginLeft: leftPreviewShow ? 150 : 0,
        width: leftPreviewShow ? "calc(100% - 150px)" : "100%"
    }}>
        <Scrollbars onScroll={handleOnScroll} ref={scrollDivRef} className="scrollDiv" renderThumbHorizontal={(props) => <div {...props} className="thumb-horizontal" style={{ display: "none" }} />}>

            {percentPagesData && percentPagesData.map((onePage, index) => {
                // console.log("onePage",onePage);
                const pageNumber = onePage.pageNumber;
                // console.log("shouldRenderHighQualityPageArray",shouldRenderHighQualityPageArray)
                let highQualityData = null;
                if (shouldRenderHighQualityPageArray && shouldRenderHighQualityPageArray.find(d => d.pageNumber === index + 1)) {
                    highQualityData = shouldRenderHighQualityPageArray.find(d => d.pageNumber === index + 1);
                    // console.log("highQualityData",highQualityData);
                }
                // console.log("여기pageNumber",pageNumber,shouldRenderHighQualityPageArray)
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
                                                // console.log("하이퀄리티랜더", pageNumber)
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
                            <div className="AreaCanvasWrap">

                                {tempAOI && tempAOI[index] &&
                                    <MultipleCropDiv
                                        ref={pageMultileCropDivRef.current[index]}
                                        AOI_mode={AOI_mode}
                                        pageIndex={index}
                                        coordinates={tempAOI[index]}
                                        onChange={(p, i, np) => changeCoordinate(index, p, i, np)}
                                        onDelete={(p, i, np) => deleteCoordinate(index, p, i, np)}
                                        onResize={resizeCoordinate}
                                        onMove={moveCoordinate}
                                    />
                                }
                            </div>



                        </div>


                    </div>)
            })}
        </Scrollbars>

    </div>)
});

export default PDFdynamicAllPage;