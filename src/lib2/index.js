import PDFviewModalV2 from "./PDFviewModalV2";
import PDFDocument from "./PDFDocument";
import Page from "./Page";
import PDFpreview from "./PDFpreview";
import PDFTopBar from "./PDFTopBar";
const output={
    PDFViewer:PDFviewModalV2, //측정할때 쓰는..
    PDFDocument:PDFDocument,
    Page:Page,
    PDFpreview:PDFpreview,
    PDFTopBar:PDFTopBar
};
export default output;
export {PDFviewModalV2,PDFDocument,Page,PDFpreview,PDFTopBar};