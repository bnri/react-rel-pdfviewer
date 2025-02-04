import React, { useEffect } from "react";
import './App.scss';
import PDFviewModal from './lib/PDFviewModal';


function App() {

  const [viewpercent, set_viewpercent] = React.useState(100);

  const openFullscreen = () => {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari & Opera 
      elem.webkitRequestFullscreen();

    } else if (elem.mozRequestFullScreen) { // Firefox 

      elem.mozRequestFullScreen();

    } else if (elem.msRequestFullscreen) { // IE/Edge 
      elem.msRequestFullscreen();

    }
  }
  const cancelFullScreen = () => {
    var el = document;
    var requestMethod = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullscreen || el.webkitExitFullscreen;
    if (requestMethod) { // cancel full screen.
      requestMethod.call(el);
    }
    // } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
    //   var wscript = new ActiveXObject("WScript.Shell");
    //   if (wscript !== null) {
    //     wscript.SendKeys("{F11}");
    //   }
    // }
  }


  const pdfviewref = React.useRef();
  const fileRef = React.useRef();
  const [previewURL, set_previewURL] = React.useState("");
  const [file, set_file] = React.useState(null);
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

  const handleOpenPreview = () => {



    if (!file) return;
    // console.log("파일", file);
    let logoURL = window.URL.createObjectURL(file);
    // console.log(logoURL);
    openFullscreen();
    set_previewURL(logoURL);

  }
  const handleScrollCallback = (s) => {
    // console.log("@@@@@@@@@@@@@@@@@@@@scroll콜백",s)
  }

  const handlePageCallback = (p) => {
    console.log("@@@@@@@@@@@@@@@@@page콜백",p);
  }



  const handlePDFCallback = (d) => {
    // console.log("pdf사이즈콜백", d)
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@pdf사이즈ㅂ콜백",d)
    const {pageNumber} = d;
    if(tempDrawedMemory.current[pageNumber]){
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
              context.moveTo(drawArr[i].x, drawArr[i].y);
          }
          else if (drawArr[i].type === 'draw') {
              // console.log("드라우")
              context.lineTo(drawArr[i].x, drawArr[i].y);
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
    console.log("x",x);
    console.log("y",y);
    //canvas 는 1728 2436 인데
    
    //568 805가 오는데 사이즈를 조절한뒤에..
    

    //1301 1836 좌표가 오는데?

    const canvasref = pdfviewref.current.get_canvasRef();
    const canvas = canvasref.current;
    const context = canvas.getContext('2d');
    if (!tempDrawedMemory.current[pageNumber]) {
      tempDrawedMemory.current[pageNumber] = {
        drawArr: []
      }
    }
    context.beginPath();
    context.moveTo(x, y);
    tempDrawedMemory.current[pageNumber].drawArr.push({
      type: 'startDrawing',
      x: x,
      y: y,
    });
  }
  const handleDrawIng = (obj) => {
    const { x, y, pageNumber } = obj;
    const canvasref = pdfviewref.current.get_canvasRef();
    const canvas = canvasref.current;
    const context = canvas.getContext('2d');
    context.lineTo(x, y);
    context.stroke();
    tempDrawedMemory.current[pageNumber].drawArr.push({
      type: 'draw',
      x: x,
      y: y,
    });
  }
  const handleDrawEnd = (obj) => {
    const { pageNumber } = obj;
    const canvasref = pdfviewref.current.get_canvasRef();
    const canvas = canvasref.current;
    const context = canvas.getContext('2d');
    context.closePath();
    tempDrawedMemory.current[pageNumber].drawArr.push({
      type: 'stopDrawing',
    });
  }



  return (
    <div className="App">
      <div className="tempFileZone">
        {file && <> {`임시파일이름 : ${file.name}`} <button className="deletefilebtn" onClick={() => set_file(null)}>삭제</button></>}
        <input ref={fileRef} style={{ display: 'none' }}

          // accept=".pdf"
          accept="application/pdf"

          type="file" onChange={handleAddFile} />

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

      {previewURL &&
        <>
          <div className="PDFpreView">
            <PDFviewModal
              ref={pdfviewref}
              PDFonloadCallback={(pages) => {
                console.log("콜백옴 page수", pages);
              }}
              path={previewURL}
              showViewMode={true}
              viewpercent={viewpercent}
              set_viewpercent={set_viewpercent}

              showConfirmBtn={true}
              onConfirm={() => {
                cancelFullScreen();
                // console.log("메모리해제")
                window.URL.revokeObjectURL(previewURL);
                set_previewURL(null);
              }}

              onClose={() => {
                cancelFullScreen();
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
      }
    </div>
  );
}

export default App;
