import NumberOnlyInput from "./components/NumberOnlyInput";
import PercentageInput from "./components/PercentageInput";


const PDFTopBar = (props) => {
    const { handleChangeNowPage, viewPercent, set_viewPercent, maxPageNumber, nowPage } = props;
    return (<div className="PDFTopBar">

        <div className="oneTab">
            <NumberOnlyInput
                style={{width:'25px'}}
                value={nowPage}
                onChange={(val) => {
                    if (handleChangeNowPage) {
                        handleChangeNowPage(val);
                    }

                }}
                min={1}
                max={maxPageNumber}
                onBlur={() => {

                }}
            />
            <div style={{marginBottom:2}}>
                &nbsp;&nbsp;/&nbsp;{maxPageNumber}
            </div>
        </div>
        <div className="grayBar"/>
        <div className="oneTab">
            <button>-</button>
            <PercentageInput
                className="viewPercentInput"
                value={viewPercent}
                onChange={(v) => set_viewPercent(v)}
            />
            <button>+</button>
        </div>
        <div className="grayBar"/>
    </div>)
}
export default PDFTopBar;