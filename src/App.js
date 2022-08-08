import React from "react";
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
  const handleScrollCallback = (a)=>{
    console.log("콜백",a);
    
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

      {previewURL &&
        <div className="PDFpreView">
          <PDFviewModal
            path={previewURL}
            showViewMode={true}
            viewpercent={viewpercent}
            set_viewpercent={set_viewpercent}
            onClose={() => {
              cancelFullScreen();
              // console.log("메모리해제")
              window.URL.revokeObjectURL(previewURL);
              set_previewURL(null);

            }}
            scrollCallback={handleScrollCallback}
          />
        </div>
      }
    </div>
  );
}

export default App;
