import NumberOnlyInput from "./components/NumberOnlyInput";
import PercentageInput from "./components/PercentageInput";
import TextInput from "./components/TextInput";
import HamburgerSvg from "./svg/Hamburger_icon.svg";
// import MinusSvg from "./svg/Minus_symbol.svg";
import MinusSvg from "./svg/minus-sign-of-a-line-in-horizontal-position-svgrepo-com.svg";

import PlusSvg from "./svg/plus-large-svgrepo-com.svg";


const PDFTopBar = (props) => {
    const { dynamicAllPageRef,set_leftPreviewShow, handleChangeNowPage, viewPercent, set_viewPercent, maxPageNumber, nowPage 
    ,set_AOI_mode,AOI_mode,fileName,set_fileName} = props;
    return (<div className="PDFTopBar no-drag">
        <div className="oneTab exceptLeft">
            <div className="btnWrap" onClick={() => {
                if (set_leftPreviewShow) {
                    set_leftPreviewShow(v => !v);
                }
            }}>
                <img src={HamburgerSvg} alt=""  />
            </div>
            <div  className="oneTab" style={{marginLeft:15}}>
                <div>
                <TextInput
                    value={fileName}
                    onChange={(newFileName)=>{
                        set_fileName(newFileName)
                    }}
                />
                </div>
   
            </div>
        </div>

        <div className="oneTab">
            <NumberOnlyInput
                style={{ width: '25px' }}
                value={nowPage}
                onChange={(val) => {
                    if (handleChangeNowPage) {
                        handleChangeNowPage(val);
                        if(dynamicAllPageRef&&dynamicAllPageRef.current){
                            // console.log(dynamicAllPageRef.current);
                            dynamicAllPageRef.current.set_scrollMoveToPage(val);
                        }
                    }

                }}
                min={1}
                max={maxPageNumber}
                // onBlur={() => {

                // }}
            />
            <div style={{ marginBottom: 2 }}>
                &nbsp;&nbsp;/&nbsp;{maxPageNumber}
            </div>
        </div>
        <div className="grayBar" />
        <div className="oneTab">
            <div className="btnWrap" onClick={()=>{
                set_viewPercent(v=>parseInt(v)-1>25?(parseInt(v)-1)+'%':v);
            }}>
              <img alt="" src={MinusSvg}/>
            </div>

            <PercentageInput
                className="viewPercentInput"
                value={viewPercent}
                onChange={(v) => set_viewPercent(v)}
            />
            <div className="btnWrap" onClick={()=>{
           set_viewPercent(v=>parseInt(v)+1<=100?(parseInt(v)+1)+'%':v);
            }}>
                <img alt="" src={PlusSvg}/>
            </div>

        </div>
        <div className="grayBar" />
    </div>)
}
export default PDFTopBar;