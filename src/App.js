import React, { useEffect ,useMemo} from "react";
import './App.scss';
import PDFviewModal from './lib/PDFviewModal';
import PDFviewModalV2 from "./lib2/PDFviewModalV2";


function App() {


  const option= useMemo(()=>{
    //pdf 고유의 사이즈를 무시, 현제의 width기준으로 랜더
    
    return {
        mode:3 , //지금페이지만 랜더 3, 전체preload 2 , 지금페이지 앞뒤 preload 1
        canvasWidth:0, //값을 안넣어주면, 리랜더 하는방식으로..
    };
  },[])




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
    // openFullscreen();
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
              context.moveTo(drawArr[i].x*canvasref.current.width,
                 drawArr[i].y*canvasref.current.height);
          }
          else if (drawArr[i].type === 'draw') {
              // console.log("드라우")
              context.lineTo(drawArr[i].x*canvasref.current.width,
                 drawArr[i].y*canvasref.current.height);
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
    context.moveTo( x/canvasref.current.offsetWidth*canvasref.current.width,
     y/canvasref.current.offsetHeight*canvasref.current.height);
    tempDrawedMemory.current[pageNumber].drawArr.push({
      type: 'startDrawing',
      x: x/canvasref.current.offsetWidth,
      y: y/canvasref.current.offsetHeight,
    });
  }
  const handleDrawIng = (obj) => {
    const { x, y, pageNumber } = obj;
    const canvasref = pdfviewref.current.get_canvasRef();

    // console.log("canvasref",canvasref)
    const canvas = canvasref.current;
    const context = canvas.getContext('2d');
    // console.log("그려중")
    context.lineTo(x/canvasref.current.offsetWidth*canvasref.current.width,
    y/canvasref.current.offsetHeight*canvasref.current.height);
    context.stroke();
    tempDrawedMemory.current[pageNumber].drawArr.push({
      type: 'draw',
      x: x/canvasref.current.offsetWidth,
      y: y/canvasref.current.offsetHeight,
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
            <PDFviewModalV2
              ref={pdfviewref}
              PDFonloadCallback={(pages) => {
                console.log("콜백옴 page수", pages);
              }}
              path={previewURL}
              renderOption={option}

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
      }
    </div>
  );
}

export default App;
