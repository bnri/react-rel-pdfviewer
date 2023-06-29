"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
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
  }, "ReadersEye"));
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
  function onDocumentLoadSuccess(_x2) {
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
      offsetX = _e$nativeEvent.offsetX,
      offsetY = _e$nativeEvent.offsetY;
    setDrawing(true);
    if (drawStart) {
      drawStart({
        x: offsetX,
        y: offsetY,
        pageNumber: pageNumber
      });
      return;
    }

    /*
    const canvas = gazecanvasref.current;
    const context = canvas.getContext('2d');
      if (!tempDrawedMemory.current[pageNumber]) {
        tempDrawedMemory.current[pageNumber] = {
            drawArr: []
        }
    }
      context.beginPath();
    context.moveTo(offsetX, offsetY);
    tempDrawedMemory.current[pageNumber].drawArr.push({
        type: 'startDrawing',
        x: offsetX,
        y: offsetY,
    });
    */
  };

  var draw = function draw(e) {
    if (!drawing) return;
    var _e$nativeEvent2 = e.nativeEvent,
      offsetX = _e$nativeEvent2.offsetX,
      offsetY = _e$nativeEvent2.offsetY;
    if (drawIng) {
      drawIng({
        x: offsetX,
        y: offsetY,
        pageNumber: pageNumber
      });
      return;
    }

    /*
    const canvas = gazecanvasref.current;
    const context = canvas.getContext('2d');
    context.lineTo(offsetX, offsetY);
    context.stroke();
    tempDrawedMemory.current[pageNumber].drawArr.push({
        type: 'draw',
        x: offsetX,
        y: offsetY,
    });
    */
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