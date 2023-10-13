import React, { useEffect, useMemo, useState, useCallback } from "react";
import './App.scss';
import PDFviewModal from './lib/PDFviewModal';
import A, { PDFTopBar,PDFviewModalV2, PDFDocument, Page,PDFpreview } from "./lib2";

// console.log("A", A);

function App() {


  const option = useMemo(() => {
    //pdf 고유의 사이즈를 무시, 현제의 width기준으로 랜더

    return {
      mode: 2, //지금페이지만 랜더 3, 전체preload 2 , 지금페이지 앞뒤 preload 1
      drawing: true,
      canvasResolution: 1,
      initViewPercent:'100%',
      // canvasWidth:200, //값을 안넣어주면 계속 리랜더함 
      //만약 전체 페이지 mode가 2번인상태로 값을 안넣어주면 전체페이지를 매번 리랜더.. viewpercent 바뀔때마다
    };
  }, [])

  const previewOption = useMemo(() => {

    return {
      show: true,
      // specifySize:400,
      pageMargin: 30,
      wrapperStyle: {
        position: "absolute",
        left: 0,
        width: 150,
      }
    }
  }, [])




  const pdfviewref = React.useRef();
  const fileRef = React.useRef();
  const [previewURL, set_previewURL] = React.useState("");
  const [file, set_file] = React.useState(null);
  const [maxPageNumber, set_maxPageNumber] = useState();


  const handleAddFile = (e) => {
    console.log(e.target.files[0]);
    //if (!e.target.files[0]) return;
    if (e.target.files[0].type !== 'application/pdf') {
      // Swal.fire("지원하지 않는 확장자 입니다");
      return;
    }

    if (previewURL) {
      console.log("메모리해제");
      window.URL.revokeObjectURL(previewURL);
      console.log("메모리끝");
    }

    let tmpfile = e.target.files[0];
    set_file(tmpfile);
  }



  const handleScrollCallback = (s) => {
    // console.log("@@@@@@@@@@@@@@@@@@@@scroll콜백",s)
  }

  const handlePageCallback = (p) => {
    console.log("@@@@@@@@@@@@@@@@@page콜백", p);
  }

  const handlePDFCallback = (d) => {
    // console.log("pdf사이즈콜백", d)
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@pdf사이즈ㅂ콜백", d)
    const { pageNumber } = d;
    if (tempDrawedMemory.current[pageNumber]) {
      const drawArr = tempDrawedMemory.current[pageNumber].drawArr;
      const canvasref = pdfviewref.current.get_canvasRef();
      const canvas = canvasref.current;
      // console.log("canvas", canvas)
      const context = canvas.getContext('2d');
      // console.log("pageNumber", pageNumber);
      // console.log("drawArr", drawArr)
      for (let i = 0; i < drawArr.length; i++) {
        if (drawArr[i].type === 'startDrawing') {
          // console.log("드라우시작")
          context.beginPath();
          context.moveTo(drawArr[i].x * canvasref.current.width,
            drawArr[i].y * canvasref.current.height);
        }
        else if (drawArr[i].type === 'draw') {
          // console.log("드라우")
          context.lineTo(drawArr[i].x * canvasref.current.width,
            drawArr[i].y * canvasref.current.height);
          context.stroke();
        }
        else if (drawArr[i].type === 'stopDrawing') {
          // console.log("드라우끝")
          context.closePath();
        }
      }
    }

  }


  const tempDrawedMemory = React.useRef();
  useEffect(() => {
    tempDrawedMemory.current = {};
  }, [])

  const handleDrawStart = (obj) => {
    const { x, y, pageNumber } = obj;
    // console.log("그려")
    const canvasref = pdfviewref.current.get_canvasRef();
    const drawCanvas = canvasref.current;


    const context = drawCanvas.getContext('2d');
    if (!tempDrawedMemory.current[pageNumber]) {
      tempDrawedMemory.current[pageNumber] = {
        drawArr: []
      }
    }
    context.beginPath();
    context.moveTo(x / canvasref.current.offsetWidth * canvasref.current.width,
      y / canvasref.current.offsetHeight * canvasref.current.height);
    tempDrawedMemory.current[pageNumber].drawArr.push({
      type: 'startDrawing',
      x: x / canvasref.current.offsetWidth,
      y: y / canvasref.current.offsetHeight,
    });
  }
  const handleDrawIng = (obj) => {
    const { x, y, pageNumber } = obj;
    const canvasref = pdfviewref.current.get_canvasRef();

    // console.log("canvasref",canvasref)
    const canvas = canvasref.current;
    const context = canvas.getContext('2d');
    // console.log("그려중")
    context.lineTo(x / canvasref.current.offsetWidth * canvasref.current.width,
      y / canvasref.current.offsetHeight * canvasref.current.height);
    context.stroke();
    tempDrawedMemory.current[pageNumber].drawArr.push({
      type: 'draw',
      x: x / canvasref.current.offsetWidth,
      y: y / canvasref.current.offsetHeight,
    });
  }
  const handleDrawEnd = (obj) => {
    // console.log("그려끝")
    const { pageNumber } = obj;
    const canvasref = pdfviewref.current.get_canvasRef();
    const canvas = canvasref.current;
    const context = canvas.getContext('2d');
    context.closePath();
    tempDrawedMemory.current[pageNumber].drawArr.push({
      type: 'stopDrawing',
    });
  }
  const handleOpenPreview = () => {
    if (!file) return;
    // console.log("파일", file);
    let logoURL = window.URL.createObjectURL(file);
    // console.log(logoURL);
    // openFullscreen();
    // set_istotal(false);
    set_previewURL(logoURL);

  }

  const [vp, set_vp] = useState(90);
  const [nowPage, set_nowPage] = useState(1);

  const handleDocumentLoadCallback = useCallback((pages) => {
    console.log("콜백옴 page수", pages);
    set_maxPageNumber(pages);
  }, []);


  // console.log("여기랜더111")
  return (
    <div className="App">
      <div className="tempFileZone">
        {"PageNumber:" + nowPage}
        <button onClick={() => set_nowPage(nowPage + 1 <= maxPageNumber ? nowPage + 1 : nowPage)}>+</button>
        <button onClick={() => set_nowPage(nowPage - 1 > 0 ? nowPage - 1 : nowPage)}>-</button>
        <br />
        <br />
        {"가로 퍼센트" + vp + '%'}
        <button onClick={() => set_vp(vp + 1 <= 100 ? vp + 1 : vp)}>+</button>
        <button onClick={() => set_vp(vp - 1 > 0 ? vp - 1 : vp)}>-</button>
        <br />
        {file && <> {`임시파일이름 : ${file.name}`} <button className="deletefilebtn" onClick={() => set_file(null)}>삭제</button></>}
        <input ref={fileRef} style={{ display: 'none' }}

          // accept=".pdf"
          accept="application/pdf"

          type="file" onChange={handleAddFile} />
        <br />
        <button
          className="btn"
          onClick={() => {
            fileRef.current.value = "";
            fileRef.current.click();

          }}>내컴퓨터에서 찾기</button>
        <button onClick={handleOpenPreview}>
          미리보기
        </button>

      </div>

      <button onClick={() => {
        console.log(pdfviewref);
        pdfviewref.current.set_pageNumber(2);
      }}>page 2</button>

      <button onClick={() => {
        console.log(pdfviewref);
        pdfviewref.current.set_scrollTop(100);
      }}>scroll100</button>

      <button onClick={() => {

        console.log("사이즈", pdfviewref.current.get_pdfSize());

      }}>pdfsize콜백</button>

      <button onClick={() => {
        let sizeobj = pdfviewref.current.get_pdfSize();

        let canvasref = pdfviewref.current.get_canvasRef();
        let canvas = canvasref.current;
        console.log(canvas);

        let rctx = canvas.getContext('2d');
        let cw = sizeobj.PDF.width * 1;
        let ch = sizeobj.PDF.height * 1;
        let r = sizeobj.PDF.width * 0.01 * 1;
        rctx.clearRect(0, 0, cw, ch);

        rctx.lineWidth = 0.5;
        rctx.strokeStyle = 'rgb(255,0,0,0.3)';
        rctx.fillStyle = 'rgb(255,0,0,0.3)';
        rctx.arc((0.1) * cw, (0.1) * ch, r, 0, Math.PI * 2);
        rctx.fill();


        rctx.beginPath();
        rctx.lineWidth = 0.5;
        rctx.strokeStyle = 'rgb(255,0,0,0.3)';
        rctx.fillStyle = 'rgb(255,0,0,0.3)';
        rctx.arc((0.2) * cw, (0.1) * ch, r, 0, Math.PI * 2);
        rctx.fill();


        rctx.stroke();



      }}>canvas위에그리기</button>

      {/* {istotal===false&&previewURL &&
        <>
          <div className="PDFpreView">
            <PDFviewModalV2
              ref={pdfviewref}
              PDFonloadCallback={(pages) => {
                console.log("콜백옴 page수", pages);
              }}
              path={previewURL}
              option={option}

              showViewMode={true}


              initViewPercent={25}

              minViewPercent={20}
              maxViewPercent={100}


              showConfirmBtn={true}
              onConfirm={() => {
                // cancelFullScreen();
                // console.log("메모리해제")
                window.URL.revokeObjectURL(previewURL);
                set_previewURL(null);
              }}

              onClose={() => {
                // cancelFullScreen();
                // console.log("메모리해제")
                window.URL.revokeObjectURL(previewURL);
                set_previewURL(null);

              }}

              drawStart={handleDrawStart}//그리기시작
              drawIng={handleDrawIng}//그리고있을때
              drawEnd={handleDrawEnd}//그리기끝남

              scrollCallback={handleScrollCallback} //스크롤 바뀔때 콜백
              pageCallback={handlePageCallback} //page 바뀔때 콜백
              pdfSizeCallback={handlePDFCallback} //PDF 사이즈 바뀔때 콜백
            />
          </div>

        </>
      } */}

      {previewURL &&
        <div className="PDFDocWrap">

          <PDFDocument
            PDFDocumentOnLoadCallback={handleDocumentLoadCallback}
            path={previewURL}
            option={option}
           

            previewOption={previewOption}
          >
            
            {/* <Page
              // ref={pdfviewref}
              pageNumber={nowPage}
            /> */}
          </PDFDocument>


        </div>
      }




    </div>
  );
}

export default App;
