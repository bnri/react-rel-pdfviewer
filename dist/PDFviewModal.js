"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
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
var Loading = function Loading(_ref) {
  var props = _extends({}, (_objectDestructuringEmpty(_ref), _ref));
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "Loading"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "text"
  }, "Loading"));
};
var PDFviewModal = /*#__PURE__*/_react.default.forwardRef(function (_ref2, ref) {
  var props = _extends({}, (_objectDestructuringEmpty(_ref2), _ref2));
  var drawStart = props.drawStart,
    drawEnd = props.drawEnd,
    drawIng = props.drawIng,
    viewPercentChangeCallback = props.viewPercentChangeCallback,
    WORKERSRC = props.WORKERSRC,
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
    PDFonloadCallback = props.PDFonloadCallback;
  // console.log("WORKERSRC",WORKERSRC)
  // console.log("path",path);

  var filepath = _react.default.useMemo(function () {
    // console.log("filepath바뀜");
    return path;
  }, [path]);
  var canvasRef = _react.default.useRef();
  var wrapperRef = _react.default.useRef();
  var modalref = _react.default.useRef();
  var prettyscrollref = _react.default.useRef();
  var gazecanvasref = _react.default.useRef();
  var heatmapref = _react.default.useRef();
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
  }, []);
  // const [pdfScale, set_pdfScale] = React.useState(1);
  function onDocumentLoadSuccess(_x) {
    return _onDocumentLoadSuccess.apply(this, arguments);
  }
  function _onDocumentLoadSuccess() {
    _onDocumentLoadSuccess = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(obj) {
      var np;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            np = obj.numPages; //PDF의 실제 width height을 구할때 사용
            // const pageObj = await obj.getPage(1)
            // const pageHeight = pageObj.view[3];
            // const pageWidth = pageObj.view[2];
            setNumPages(np);
            if (PDFonloadCallback) {
              PDFonloadCallback(np);
            }
          case 3:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return _onDocumentLoadSuccess.apply(this, arguments);
  }
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    renderDone = _useState2[0],
    set_renderDone = _useState2[1];
  var _React$useState13 = _react.default.useState({
      height: 0,
      width: 0
    }),
    _React$useState14 = _slicedToArray(_React$useState13, 2),
    canvasSize = _React$useState14[0],
    set_canvasSize = _React$useState14[1];
  function onDocumentRenderSuccess() {
    // console.log("확인좀",some);
    // console.log("확인", canvasRef.current.width + 'x' + canvasRef.current.height);
    // set_pdfWidth({
    //     width: canvasRef.current.width,
    //     height: canvasRef.current.height
    // })
    set_renderDone(true);
    var tempratio = (canvasRef.current.height / canvasRef.current.width).toFixed(2);
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
  _react.default.useEffect(function () {
    if (pageNumber && pageCallback) {
      pageCallback(pageNumber);
    }
  }, [pageNumber, pageCallback]);
  var handleWrapperScroll = _react.default.useCallback(function (e) {
    // console.log(e.target.scrollTop,"스크롤위치");
    // console.log("scrollCallback",scrollCallback);
    if (scrollCallback) {
      scrollCallback(e.target.scrollTop);
    }

    //사실은 이때랑 같이 이동
  }, [scrollCallback]);

  //
  _react.default.useImperativeHandle(ref, function () {
    return {
      set_pageNumber: function set_pageNumber(val) {
        set_renderDone(false);
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
      get_heatmapRef: function get_heatmapRef() {
        return heatmapref;
      },
      reset_viewPerecent: function reset_viewPerecent(val) {
        set_viewPercent(val);
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
  }, [pdfWidth, pdfHeight]);
  _react.default.useEffect(function () {
    if (viewPercent) {
      if (!modalref || !modalref.current) return;
      var p = (viewPercent - 10) / 100;
      set_pageWidth(modalref.current.clientWidth * p);
    }
  }, [viewPercent]);
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    drawing = _useState4[0],
    setDrawing = _useState4[1];
  var tempDrawedMemory = _react.default.useRef();
  (0, _react.useEffect)(function () {
    tempDrawedMemory.current = {};
  }, []);
  var startDrawing = function startDrawing(e) {
    var _e$nativeEvent = e.nativeEvent,
      clientX = _e$nativeEvent.clientX,
      clientY = _e$nativeEvent.clientY;
    var canvas = gazecanvasref.current;
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width; // X축 비율
    var scaleY = canvas.height / rect.height; // X축 비율
    // Corrected coordinates
    var correctedX = (clientX - rect.left) * scaleX;
    var correctedY = (clientY - rect.top) * scaleY;

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
  var draw = function draw(e) {
    if (!drawing) return;

    // const { offsetX, offsetY } = e.nativeEvent;
    if (drawIng) {
      // const canvas = gazecanvasref.current;
      // const rect = canvas.getBoundingClientRect();
      // const scaleX = canvas.width / rect.width; // X축 비율

      // // 보정된 좌표 계산

      // const correctedX = offsetX * scaleX * window.devicePixelRatio;
      // const correctedY = offsetY * scaleX * window.devicePixelRatio;
      var _e$nativeEvent2 = e.nativeEvent,
        clientX = _e$nativeEvent2.clientX,
        clientY = _e$nativeEvent2.clientY;
      var canvas = gazecanvasref.current;
      var rect = canvas.getBoundingClientRect();
      var scaleX = canvas.width / rect.width; // X축 비율
      var scaleY = canvas.height / rect.height; // X축 비율
      // Corrected coordinates
      var correctedX = (clientX - rect.left) * scaleX;
      var correctedY = (clientY - rect.top) * scaleY;
      drawIng({
        x: correctedX,
        y: correctedY,
        pageNumber: pageNumber
      });
      return;
    }
  };
  var stopDrawing = function stopDrawing() {
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

  (0, _react.useEffect)(function () {
    if (renderDone && pageNumber && tempDrawedMemory.current[pageNumber]) {
      console.log("tempDrawedMemory.current[pageNumber]", tempDrawedMemory.current[pageNumber]);
      var drawArr = tempDrawedMemory.current[pageNumber].drawArr;
      var canvas = gazecanvasref.current;
      // console.log("canvas", canvas)
      var context = canvas.getContext('2d');
      // console.log("pageNumber", pageNumber);
      // console.log("drawArr", drawArr)
      for (var i = 0; i < drawArr.length; i++) {
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
  (0, _react.useEffect)(function () {
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
      var value = values.value;
      // console.log("formattedValue",formattedValue,"value",value);
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
      set_renderDone(false);
      setPageNumber(function (p) {
        return p - 1;
      });
      // }
    }
  }, "<")), /*#__PURE__*/_react.default.createElement("div", {
    className: "PageController-right"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "page-btn",
    disabled: pageNumber < numPages ? false : true,
    onClick: function onClick() {
      // if (pageNumber < numPages) {
      set_renderDone(false);
      setPageNumber(function (p) {
        return p + 1;
      });
      // }
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
    ref: prettyscrollref
    //    onScrollStop={()=>{
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
    onRenderError: function onRenderError() {
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
var _default = PDFviewModal;
exports.default = _default;