"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

require("./PDFviewModal.scss");

var _reactPdf = require("react-pdf");

var _reactNumberFormat = _interopRequireDefault(require("react-number-format"));

var _reactCustomScrollbars = require("react-custom-scrollbars");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// pdfjs.GlobalWorkerOptions.workerSrc = 'http://localhost:3000/pdf.worker.min.js';
// pdfjs.GlobalWorkerOptions.workerSrc = 'react-pdf/dist/cjs/pdf.worker.min.js';
// console.log("WORKERSRC",a);
_reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.bnr.co.kr/externel_modules/react-pdf/5.7.2/pdf.worker.min.js"; // console.log("pdfjs.GlobalWorkerOptions.workerSrc",+pdfjs.GlobalWorkerOptions.workerSrc)
// console.log("window",window.location.origin)
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js;`
// console.log("pdfjs.version",pdfjs.version)
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

var Loading = function Loading(_ref) {
  var props = _extends({}, _ref);

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "Loading"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "text"
  }, "ReadersEye"));
};

var PDFviewModal = /*#__PURE__*/_react.default.forwardRef(function (_ref2, ref) {
  var props = _extends({}, _ref2);

  var WORKERSRC = props.WORKERSRC,
      path = props.path,
      onClose = props.onClose,
      showViewMode = props.showViewMode,
      viewpercent = props.viewpercent,
      set_viewpercent = props.set_viewpercent,
      scrollCallback = props.scrollCallback,
      pageCallback = props.pageCallback,
      pdfSizeCallback = props.pdfSizeCallback,
      onConfirm = props.onConfirm,
      showConfirmBtn = props.showConfirmBtn,
      PDFonloadCallback = props.PDFonloadCallback; // console.log("WORKERSRC",WORKERSRC)
  // console.log("path",path);

  var filepath = _react.default.useMemo(function () {
    // console.log("filepath??????");
    return path;
  }, [path]);

  var canvasRef = _react.default.useRef();

  var wrapperRef = _react.default.useRef();

  var modalref = _react.default.useRef();

  var prettyscrollref = _react.default.useRef();

  var gazecanvasref = _react.default.useRef();

  var _React$useState = _react.default.useState(null),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      pdfWidth = _React$useState2[0],
      set_pdfWidth = _React$useState2[1];

  var _React$useState3 = _react.default.useState(null),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      pdfHeight = _React$useState4[0],
      set_pdfHeight = _React$useState4[1];

  var _React$useState5 = _react.default.useState(null),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      numPages = _React$useState6[0],
      setNumPages = _React$useState6[1];

  var _React$useState7 = _react.default.useState(1),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      pageNumber = _React$useState8[0],
      setPageNumber = _React$useState8[1];

  var _React$useState9 = _react.default.useState(viewpercent ? viewpercent : 100),
      _React$useState10 = _slicedToArray(_React$useState9, 2),
      viewPercent = _React$useState10[0],
      set_viewPercent = _React$useState10[1];

  var _React$useState11 = _react.default.useState(0),
      _React$useState12 = _slicedToArray(_React$useState11, 2),
      pageWidth = _React$useState12[0],
      set_pageWidth = _React$useState12[1];

  var option = _react.default.useMemo(function () {
    return {
      max: 100,
      min: 40
    };
  }, []); // const [pdfScale, set_pdfScale] = React.useState(1);


  function onDocumentLoadSuccess(_ref3) {
    var numPages = _ref3.numPages;
    setNumPages(numPages);

    if (PDFonloadCallback) {
      PDFonloadCallback(numPages);
    }
  }

  var _React$useState13 = _react.default.useState({
    height: 0,
    width: 0
  }),
      _React$useState14 = _slicedToArray(_React$useState13, 2),
      canvasSize = _React$useState14[0],
      set_canavasSize = _React$useState14[1];

  function onDocumentRenderSuccess() {
    // console.log("?????????",some);
    // console.log("??????", canvasRef.current.width + 'x' + canvasRef.current.height);
    // set_pdfWidth({
    //     width: canvasRef.current.width,
    //     height: canvasRef.current.height
    // })
    set_canavasSize({
      width: canvasRef.current.width,
      height: canvasRef.current.height
    });

    if (pdfSizeCallback) {
      //canvasRef.current ??? ?????? PDF??? ????????? ???????????????
      //wrapperRef.current ??? PDF wrapper ??? ????????? ???????????????
      //modalref.current ??? ?????? ???????????? ????????? ???????????????.
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
          } // Scrollwrap:{
          //     width:prettyscrollref.current.clientWidth,
          //     height:prettyscrollref.current.clientHeight,
          // }

        });
      } catch (e) {
        console.log("??????", e);
      }
    } // console.log("?????????",prettyscrollref.current.getClientWidth(),'???',prettyscrollref.current.getClientHeight())


    set_pdfWidth(canvasRef.current.width);
    set_pdfHeight(canvasRef.current.height); //?????? ?????????
    // wrapperRef.current.scrollTop = 0;
    // prettyscrollref.current.scrollTop=0;

    prettyscrollref.current.scrollTop(0); // console.log("????????? x*y", wrapperRef.current.clientWidth, "x", wrapperRef.current.clientHeight);
    // //PDF view Modal ??? ???????????? ?????????
    // console.log("?????? ??? ???????????? x*y", modalref.current.clientWidth, "y", modalref.current.clientHeight);
  }

  var handleKeyDown = _react.default.useCallback(function (e) {
    // console.log(e.key);
    if (e.target.classList.contains('viewPercent')) {
      return;
    }

    if (e.key === "ArrowRight") {
      if (pageNumber < numPages) {
        setPageNumber(function (p) {
          return p + 1;
        });
      }
    } else if (e.key === "ArrowLeft") {
      if (pageNumber > 1) {
        setPageNumber(function (p) {
          return p - 1;
        });
      }
    }
  }, [pageNumber, numPages]); //????????????????????????


  _react.default.useEffect(function () {
    // console.log("???????????????")
    // window.removeEventListener("keydown", handleKeyDown, false);
    window.addEventListener("keydown", handleKeyDown, false);
    return function () {
      // console.log("???????????????")
      window.removeEventListener("keydown", handleKeyDown, false);
    };
  }, [handleKeyDown]); //??????????????????


  _react.default.useEffect(function () {
    if (pageNumber && pageCallback) {
      pageCallback(pageNumber);
    }
  }, [pageNumber, pageCallback]);

  var handleWrapperScroll = _react.default.useCallback(function (e) {
    // console.log(e.target.scrollTop,"???????????????");
    // console.log("scrollCallback",scrollCallback);
    if (scrollCallback) {
      scrollCallback(e.target.scrollTop);
    } //????????? ????????? ?????? ??????

  }, [scrollCallback]); //


  _react.default.useImperativeHandle(ref, function () {
    return {
      set_pageNumber: function set_pageNumber(val) {
        setPageNumber(val);
      },
      set_scrollTop: function set_scrollTop(val) {
        // wrapperRef.current.scrollTop = val;
        prettyscrollref.current.scrollTop(val);
      },
      get_pdfSize2: function get_pdfSize2() {
        return {
          width: pdfWidth,
          height: pdfHeight
        };
      },
      get_canvasRef: function get_canvasRef() {
        return gazecanvasref;
      },
      get_pdfSize: function get_pdfSize() {
        try {
          var obj = {
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
    };
  }, [pdfWidth, pdfHeight]); // const pageWidth = React.useMemo(() => {
  //     if (!modalref || !modalref.current ) return;
  //     let p = (viewPercent - 10) / 100;
  //     console.log("modalref", modalref.current);
  //     return window.screen.width * p - 18;
  // }, [viewPercent])


  _react.default.useEffect(function () {
    if (viewPercent) {
      if (!modalref || !modalref.current) return;
      var p = (viewPercent - 10) / 100;
      set_pageWidth(modalref.current.clientWidth * p);
    }
  }, [viewPercent]);

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
    onClick: function onClick() {
      return set_viewPercent(option.max);
    }
  }, "\uCD5C\uB300")), /*#__PURE__*/_react.default.createElement("div", {
    className: "row"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "resizebtn",
    onClick: function onClick() {
      set_viewPercent(function (v) {
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
    onValueChange: function onValueChange(values) {
      var value = values.value; // console.log("formattedValue",formattedValue,"value",value);

      var d = value;
      if (d > option.max) d = option.max * 1;
      if (d < option.min) d = option.min * 1;
      set_viewPercent(d);
    }
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "row"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "resizebtn",
    onClick: function onClick() {
      set_viewPercent(function (v) {
        // console.log("v",v)
        if (v < option.min) return option.min * 1;else return v * 1 - 1;
      });
    }
  }, "-")), /*#__PURE__*/_react.default.createElement("div", {
    className: "row"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "resizebtn",
    onClick: function onClick() {
      return set_viewPercent(option.min * 1);
    }
  }, "\uCD5C\uC18C")))), /*#__PURE__*/_react.default.createElement("div", {
    className: "PageController-left"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "page-btn",
    disabled: pageNumber > 1 ? false : true,
    onClick: function onClick() {
      // if (pageNumber > 1) {
      setPageNumber(function (p) {
        return p - 1;
      }); // }
    }
  }, "<")), /*#__PURE__*/_react.default.createElement("div", {
    className: "PageController-right"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "page-btn",
    disabled: pageNumber < numPages ? false : true,
    onClick: function onClick() {
      // if (pageNumber < numPages) {
      setPageNumber(function (p) {
        return p + 1;
      }); // }
    }
  }, ">")), /*#__PURE__*/_react.default.createElement("div", {
    className: "confirmTab",
    style: {
      display: showConfirmBtn ? '' : 'none'
    }
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "confirmPDFbtn",
    onClick: function onClick() {
      if (showViewMode) {
        set_viewpercent(viewPercent);
      }

      onConfirm();
    }
  }, "\uC644\uB8CC")), /*#__PURE__*/_react.default.createElement("div", {
    className: "closeTab"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "closePDFbtn",
    onClick: function onClick() {
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
    ref: prettyscrollref //    onScrollStop={()=>{
    //      console.log("onScrollStop@@");
    //    }}
    ,
    onScroll: handleWrapperScroll,
    renderThumbHorizontal: function renderThumbHorizontal(props) {
      return /*#__PURE__*/_react.default.createElement("div", _extends({}, props, {
        className: "thumb-horizontal",
        style: {
          display: "none"
        }
      }));
    }
  }, /*#__PURE__*/_react.default.createElement(_reactPdf.Document, {
    className: "PDF-document",
    options: {
      cMapUrl: 'cmaps/',
      cMapPacked: true,
      standardFontDataUrl: 'standard_fonts/',
      workerSrc: "".concat(WORKERSRC, "/pdf.worker.js")
    },
    file: filepath // width={window.screen.width * 0.9}
    // loading={<div>
    //     ???????????????
    // </div>}
    ,
    onLoadSuccess: onDocumentLoadSuccess
  }, /*#__PURE__*/_react.default.createElement(_reactPdf.Page // canvasBackground={"red"}
  // loading={"asfasfasfasf"}
  , {
    canvasRef: canvasRef,
    className: "PDF-page",
    pageNumber: pageNumber,
    renderTextLayer: false,
    renderAnnotationLayer: false // height={window.screen.height*0.9}
    ,
    width: pageWidth // scale={1}
    // rotate={90}
    ,
    onRenderSuccess: onDocumentRenderSuccess,
    onRenderError: function onRenderError() {
      console.log("????????????"); // alert('Rendered the page!')
    }
  }, /*#__PURE__*/_react.default.createElement("canvas", {
    ref: gazecanvasref,
    className: "pathwayGazeCanvas",
    width: canvasSize.width,
    height: canvasSize.height
  }))))));
});

var _default = PDFviewModal;
exports.default = _default;