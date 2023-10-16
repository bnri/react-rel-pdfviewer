import NumberOnlyInput from "./components/NumberOnlyInput";
import PercentageInput from "./components/PercentageInput";
import { ReactComponent as HamburgerSvg } from "./svg/Hamburger_icon.svg";
import { ReactComponent as MinusSvg } from "./svg/Minus_symbol.svg";
import { ReactComponent as PlusSvg } from "./svg/Plus_symbol.svg";
const PDFTopBar = (props) => {
    const { set_leftPreviewShow, handleChangeNowPage, viewPercent, set_viewPercent, maxPageNumber, nowPage } = props;
    return (<div className="PDFTopBar">
        <div className="oneTab exceptLeft">
            <div className="btnWrap" onClick={() => {
                if (set_leftPreviewShow) {
                    set_leftPreviewShow(v => !v);
                }
            }}>
                <HamburgerSvg  />
            </div>

        </div>
        <div className="oneTab">
            <NumberOnlyInput
                style={{ width: '25px' }}
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
            <div style={{ marginBottom: 2 }}>
                &nbsp;&nbsp;/&nbsp;{maxPageNumber}
            </div>
        </div>
        <div className="grayBar" />
        <div className="oneTab">
            <div className="btnWrap">
              <MinusSvg />
            </div>

            <PercentageInput
                className="viewPercentInput"
                value={viewPercent}
                onChange={(v) => set_viewPercent(v)}
            />
            <div className="btnWrap">
            <PlusSvg />
            </div>

        </div>
        <div className="grayBar" />
    </div>)
}
export default PDFTopBar;