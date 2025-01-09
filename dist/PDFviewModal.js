"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
require("./PDFviewModal.scss");
var _reactPdf = require("react-pdf");
var _reactNumberFormat = _interopRequireDefault(require("react-number-format"));
var _reactCustomScrollbars = require("react-custom-scrollbars");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure " + obj); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } // import { Document, Page  } from 'react-pdf/dist/esm/entry.webpack';
//	react-pdf/dist/esm/entry.webpack
// import React from 'react';
// pdfjs.GlobalWorkerOptions.workerSrc = 'http://localhost:3000/pdf.worker.min.js';
// pdfjs.GlobalWorkerOptions.workerSrc = 'react-pdf/dist/cjs/pdf.worker.min.js';

// console.log("WORKERSRC",a);
_reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.bnr.co.kr/externel_modules/react-pdf/5.7.2/pdf.worker.min.js";

// console.log("pdfjs.GlobalWorkerOptions.workerSrc",+pdfjs.GlobalWorkerOptions.workerSrc)
// console.log("window",window.location.origin)
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js;`

// console.log("pdfjs.version",pdfjs.version)
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
const Loading = _ref => {
  let props = _extends({}, (_objectDestructuringEmpty(_ref), _ref));
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "Loading"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "text"
  }, "Loading"));
};
const PDFviewModal = /*#__PURE__*/_react.default.forwardRef((_ref2, ref) => {
  let props = _extends({}, (_objectDestructuringEmpty(_ref2), _ref2));
  const {
    drawStart,
    drawEnd,
    drawIng,
    viewPercentChangeCallback,
    WORKERSRC,
    path,
    onClose,
    showViewMode,
    viewpercent,
    set_viewpercent,
    scrollCallback,
    pageCallback,
    pdfSizeCallback,
    onConfirm,
    showConfirmBtn,
    PDFonloadCallback
  } = props;
  // console.log("WORKERSRC",WORKERSRC)
  // console.log("path",path);

  const filepath = _react.default.useMemo(() => {
    // console.log("filepath바뀜");
    return path;
  }, [path]);
  const canvasRef = _react.default.useRef();
  const wrapperRef = _react.default.useRef();
  const modalref = _react.default.useRef();
  const prettyscrollref = _react.default.useRef();
  const gazecanvasref = _react.default.useRef();
  const heatmapref = _react.default.useRef();
  const [pdfWidth, set_pdfWidth] = _react.default.useState(null);
  const [pdfHeight, set_pdfHeight] = _react.default.useState(null);
  const [numPages, setNumPages] = _react.default.useState(null);
  const [pageNumber, setPageNumber] = _react.default.useState(1);
  const [viewPercent, set_viewPercent] = _react.default.useState(viewpercent ? viewpercent : 100);
  const [pageWidth, set_pageWidth] = _react.default.useState(0);
  const option = _react.default.useMemo(() => {
    return {
      max: 100,
      min: 40
    };
  }, []);
  // const [pdfScale, set_pdfScale] = React.useState(1);
  async function onDocumentLoadSuccess(obj) {
    const {
      numPages: np
    } = obj;

    //PDF의 실제 width height을 구할때 사용
    // const pageObj = await obj.getPage(1)
    // const pageHeight = pageObj.view[3];
    // const pageWidth = pageObj.view[2];

    setNumPages(np);
    if (PDFonloadCallback) {
      PDFonloadCallback(np);
    }
  }
  const [renderDone, set_renderDone] = (0, _react.useState)(false);
  const [canvasSize, set_canvasSize] = _react.default.useState({
    height: 0,
    width: 0
  });
  function onDocumentRenderSuccess() {
    // console.log("확인좀",some);
    // console.log("확인", canvasRef.current.width + 'x' + canvasRef.current.height);
    // set_pdfWidth({
    //     width: canvasRef.current.width,
    //     height: canvasRef.current.height
    // })
    set_renderDone(true);
    const tempratio = (canvasRef.current.height / canvasRef.current.width).toFixed(2);
    set_canvasSize({
      width: 1728,
      height: 1728 * tempratio
    });

    // console.log("tempratio",tempratio);

    if (pdfSizeCallback) {
      //canvasRef.current 는 실제 PDF의 크기를 의미합니다
      //wrapperRef.current 는 PDF wrapper 의 크기를 의미합니다
      //modalref.current 는 실제 스크린의 크기를 의미합니다.
      try {
        pdfSizeCallback({
          PDF: {
            width: canvasRef.current.width,
            height: canvasRef.current.height,
            leftPixel: (modalref.current.clientWidth - canvasRef.current.width) / 2,
            topPixel: canvasRef.current.height >= modalref.current.clientHeight ? 0 : (modalref.current.clientHeight - canvasRef.current.height) / 2
          },
          PDFwrap: {
            width: modalref.current.clientWidth * 0.9,
            height: modalref.current.clientHeight
          },
          SCRwrap: {
            width: modalref.current.clientWidth,
            height: modalref.current.clientHeight
          },
          pageNumber: pageNumber,
          height_devided_width_ratio: tempratio
          // Scrollwrap:{
          //     width:prettyscrollref.current.clientWidth,
          //     height:prettyscrollref.current.clientHeight,
          // }
        });
      } catch (e) {
        console.log("에러", e);
      }
    }

    // console.log("확인용",prettyscrollref.current.getClientWidth(),'랑',prettyscrollref.current.getClientHeight())
    set_pdfWidth(canvasRef.current.width);
    set_pdfHeight(canvasRef.current.height);

    //원래 스크롤
    // wrapperRef.current.scrollTop = 0;
    // prettyscrollref.current.scrollTop=0;
    prettyscrollref.current.scrollTop(0);

    // console.log("껍데기 x*y", wrapperRef.current.clientWidth, "x", wrapperRef.current.clientHeight);
    // //PDF view Modal 의 껍데기도 필요함

    // console.log("가장 큰 모달크기 x*y", modalref.current.clientWidth, "y", modalref.current.clientHeight);
  }

  //스크롤이벤트
  _react.default.useEffect(() => {
    if (pageNumber && pageCallback) {
      pageCallback(pageNumber);
    }
  }, [pageNumber, pageCallback]);
  const handleWrapperScroll = _react.default.useCallback(e => {
    // console.log(e.target.scrollTop,"스크롤위치");
    // console.log("scrollCallback",scrollCallback);
    if (scrollCallback) {
      scrollCallback(e.target.scrollTop);
    }

    //사실은 이때랑 같이 이동
  }, [scrollCallback]);

  //
  _react.default.useImperativeHandle(ref, () => ({
    set_pageNumber(val) {
      set_renderDone(false);
      setPageNumber(val);
    },
    set_scrollTop: val => {
      // wrapperRef.current.scrollTop = val;
      prettyscrollref.current.scrollTop(val);
    },
    get_pdfSize2: () => {
      return {
        width: pdfWidth,
        height: pdfHeight
      };
    },
    get_canvasRef: () => {
      return gazecanvasref;
    },
    get_heatmapRef: () => {
      return heatmapref;
    },
    reset_viewPerecent: val => {
      set_viewPercent(val);
    },
    get_pdfSize: () => {
      try {
        let obj = {
          PDF: {
            width: canvasRef.current.width,
            height: canvasRef.current.height,
            leftPixel: (modalref.current.clientWidth - canvasRef.current.width) / 2,
            topPixel: canvasRef.current.height >= modalref.current.clientHeight ? 0 : (modalref.current.clientHeight - canvasRef.current.height) / 2
          },
          PDFwrap: {
            width: canvasRef.current.width,
            height: modalref.current.clientHeight
          },
          SCRwrap: {
            width: modalref.current.clientWidth,
            height: modalref.current.clientHeight
          }
        };
        return obj;
      } catch (e) {
        console.log("get_pdfSize Error");
        return null;
      }
    }
  }), [pdfWidth, pdfHeight]);
  _react.default.useEffect(() => {
    if (viewPercent) {
      if (!modalref || !modalref.current) return;
      let p = (viewPercent - 10) / 100;
      set_pageWidth(modalref.current.clientWidth * p);
    }
  }, [viewPercent]);
  const [drawing, setDrawing] = (0, _react.useState)(false);
  const tempDrawedMemory = _react.default.useRef();
  (0, _react.useEffect)(() => {
    tempDrawedMemory.current = {};
  }, []);
  const startDrawing = e => {
    const {
      clientX,
      clientY
    } = e.nativeEvent;
    const canvas = gazecanvasref.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width; // X축 비율
    const scaleY = canvas.height / rect.height; // X축 비율
    // Corrected coordinates
    const correctedX = (clientX - rect.left) * scaleX;
    const correctedY = (clientY - rect.top) * scaleY;

    // const { offsetX, offsetY } = e.nativeEvent;

    // // Canvas의 실제 크기와 CSS 크기 비교
    // const canvas = gazecanvasref.current;
    // const rect = canvas.getBoundingClientRect();
    // const scaleX = canvas.width / rect.width; // X축 비율
    // // console.log("offsetX",offsetX);
    // // console.log("offsetY",offsetY)
    // // console.log("scaleX",scaleX);
    // // 보정된 좌표 계산
    // // console.log("devicePixelRatio", window.devicePixelRatio);

    // const correctedX = offsetX * scaleX * window.devicePixelRatio;
    // const correctedY = offsetY * scaleX * window.devicePixelRatio;
    // console.log("offsetX", offsetX);
    // console.log("offsetY", offsetY);
    // console.log("scaleX", scaleX);
    // console.log("rect.width", rect.width);
    setDrawing(true);
    if (drawStart) {
      drawStart({
        x: correctedX,
        y: correctedY,
        pageNumber: pageNumber
      });
      return;
    }
  };
  const draw = e => {
    if (!drawing) return;

    // const { offsetX, offsetY } = e.nativeEvent;
    if (drawIng) {
      // const canvas = gazecanvasref.current;
      // const rect = canvas.getBoundingClientRect();
      // const scaleX = canvas.width / rect.width; // X축 비율

      // // 보정된 좌표 계산

      // const correctedX = offsetX * scaleX * window.devicePixelRatio;
      // const correctedY = offsetY * scaleX * window.devicePixelRatio;
      const {
        clientX,
        clientY
      } = e.nativeEvent;
      const canvas = gazecanvasref.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width; // X축 비율
      const scaleY = canvas.height / rect.height; // X축 비율
      // Corrected coordinates
      const correctedX = (clientX - rect.left) * scaleX;
      const correctedY = (clientY - rect.top) * scaleY;
      drawIng({
        x: correctedX,
        y: correctedY,
        pageNumber: pageNumber
      });
      return;
    }
  };
  const stopDrawing = () => {
    if (!drawing) return;
    setDrawing(false);
    if (drawEnd) {
      drawEnd({
        pageNumber: pageNumber
      });
      return;
    }
    /*
    const canvas = gazecanvasref.current;
    const context = canvas.getContext('2d');
    context.closePath();
    tempDrawedMemory.current[pageNumber].drawArr.push({
        type: 'stopDrawing',
    });
    */
  };

  (0, _react.useEffect)(() => {
    if (renderDone && pageNumber && tempDrawedMemory.current[pageNumber]) {
      console.log("tempDrawedMemory.current[pageNumber]", tempDrawedMemory.current[pageNumber]);
      let drawArr = tempDrawedMemory.current[pageNumber].drawArr;
      const canvas = gazecanvasref.current;
      // console.log("canvas", canvas)
      const context = canvas.getContext('2d');
      // console.log("pageNumber", pageNumber);
      // console.log("drawArr", drawArr)
      for (let i = 0; i < drawArr.length; i++) {
        if (drawArr[i].type === 'startDrawing') {
          // console.log("드라우시작")
          context.beginPath();
          context.moveTo(drawArr[i].x, drawArr[i].y);
        } else if (drawArr[i].type === 'draw') {
          // console.log("드라우")
          context.lineTo(drawArr[i].x, drawArr[i].y);
          context.stroke();
        } else if (drawArr[i].type === 'stopDrawing') {
          // console.log("드라우끝")
          context.closePath();
        }
      }
    }
  }, [pageNumber, renderDone]);
  (0, _react.useEffect)(() => {
    if (viewPercentChangeCallback) {
      viewPercentChangeCallback(viewPercent);
    }
  }, [viewPercent, viewPercentChangeCallback]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "PDFviewModal no-drag",
    ref: modalref
  }, !pdfWidth || !pdfHeight ? /*#__PURE__*/_react.default.createElement("div", {
    className: "PDF-loading"
  }, /*#__PURE__*/_react.default.createElement(Loading, null)) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "PageInform"
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", null, "page"), /*#__PURE__*/_react.default.createElement("div", null, "                   ", /*#__PURE__*/_react.default.createElement("span", {
    style: {
      color: 'red'
    }
  }, pageNumber), " ", '/', " ", numPages))), /*#__PURE__*/_react.default.createElement("div", {
    className: "PageViewPercentWrap"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "relativewrap",
    style: {
      display: showViewMode ? 'block' : 'none'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "row wraplabel"
  }, "\uBB38\uC11C \uBC30\uC728"), /*#__PURE__*/_react.default.createElement("div", {
    className: "row"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "resizebtn",
    onClick: () => set_viewPercent(option.max)
  }, "\uCD5C\uB300")), /*#__PURE__*/_react.default.createElement("div", {
    className: "row"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "resizebtn",
    onClick: () => {
      set_viewPercent(v => {
        // console.log("v",v)
        if (v > option.max) return option.max * 1;else return v * 1 + 1;
      });
    }
  }, "+")), /*#__PURE__*/_react.default.createElement("div", {
    className: "row"
  }, /*#__PURE__*/_react.default.createElement(_reactNumberFormat.default, {
    className: "viewPercent",
    value: viewPercent,
    suffix: '%',
    onValueChange: values => {
      const {
        value
      } = values;
      // console.log("formattedValue",formattedValue,"value",value);
      let d = value;
      if (d > option.max) d = option.max * 1;
      if (d < option.min) d = option.min * 1;
      set_viewPercent(d);
    }
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "row"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "resizebtn",
    onClick: () => {
      set_viewPercent(v => {
        // console.log("v",v)
        if (v < option.min) return option.min * 1;else return v * 1 - 1;
      });
    }
  }, "-")), /*#__PURE__*/_react.default.createElement("div", {
    className: "row"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "resizebtn",
    onClick: () => set_viewPercent(option.min * 1)
  }, "\uCD5C\uC18C")))), /*#__PURE__*/_react.default.createElement("div", {
    className: "PageController-left"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "page-btn",
    disabled: pageNumber > 1 ? false : true,
    onClick: () => {
      // if (pageNumber > 1) {
      set_renderDone(false);
      setPageNumber(p => p - 1);
      // }
    }
  }, "<")), /*#__PURE__*/_react.default.createElement("div", {
    className: "PageController-right"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "page-btn",
    disabled: pageNumber < numPages ? false : true,
    onClick: () => {
      // if (pageNumber < numPages) {
      set_renderDone(false);
      setPageNumber(p => p + 1);
      // }
    }
  }, ">")), /*#__PURE__*/_react.default.createElement("div", {
    className: "confirmTab",
    style: {
      display: showConfirmBtn ? '' : 'none'
    }
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "confirmPDFbtn",
    onClick: () => {
      if (showViewMode) {
        set_viewpercent(viewPercent);
      }
      onConfirm();
    }
  }, "\uC644\uB8CC")), /*#__PURE__*/_react.default.createElement("div", {
    className: "closeTab"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "closePDFbtn",
    onClick: () => {
      // if (showViewMode) {
      //     set_viewpercent(viewPercent);
      // }

      onClose();
    }
  }, "  ", /*#__PURE__*/_react.default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "80%",
    height: "80%",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/_react.default.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/_react.default.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }))))), /*#__PURE__*/_react.default.createElement("div", {
    ref: wrapperRef,
    className: "PDF-wrapper",
    style: {
      display: pdfWidth && pdfHeight ? 'flex' : 'none'
    }
  }, /*#__PURE__*/_react.default.createElement(_reactCustomScrollbars.Scrollbars, {
    ref: prettyscrollref
    //    onScrollStop={()=>{
    //      console.log("onScrollStop@@");
    //    }}
    ,
    onScroll: handleWrapperScroll,
    renderThumbHorizontal: props => /*#__PURE__*/_react.default.createElement("div", _extends({}, props, {
      className: "thumb-horizontal",
      style: {
        display: "none"
      }
    }))
  }, /*#__PURE__*/_react.default.createElement(_reactPdf.Document, {
    className: "PDF-document",
    options: {
      cMapUrl: 'cmaps/',
      cMapPacked: true,
      standardFontDataUrl: 'standard_fonts/',
      workerSrc: "".concat(WORKERSRC, "/pdf.worker.js")
    },
    file: filepath
    // width={window.screen.width * 0.9}
    // loading={<div>
    //     갸갸갸갸갸
    // </div>}
    ,
    onLoadSuccess: onDocumentLoadSuccess
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      position: 'relative',
      margin: 'auto'
    }
  }, /*#__PURE__*/_react.default.createElement(_reactPdf.Page
  // canvasBackground={"red"}
  // loading={"asfasfasfasf"}
  , {
    canvasRef: canvasRef,
    className: "PDF-page",
    pageNumber: pageNumber,
    renderTextLayer: false,
    renderAnnotationLayer: false
    // height={window.screen.height*0.9}
    ,
    width: pageWidth
    // scale={1}
    // rotate={90}
    ,
    onRenderSuccess: onDocumentRenderSuccess,
    onRenderError: () => {
      console.log("랜더에러");
      // alert('Rendered the page!')
    }
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "heatmapWrapper"
  }, /*#__PURE__*/_react.default.createElement("div", {
    ref: heatmapref,
    style: {
      width: '100%',
      height: '100%'
    }
  })), /*#__PURE__*/_react.default.createElement("canvas", {
    ref: gazecanvasref,
    className: "pathwayGazeCanvas",
    width: canvasSize.width,
    height: canvasSize.height,
    onMouseDown: startDrawing,
    onMouseMove: draw,
    onMouseUp: stopDrawing,
    onMouseOut: stopDrawing
  }))))));
});
var _default = exports.default = PDFviewModal;