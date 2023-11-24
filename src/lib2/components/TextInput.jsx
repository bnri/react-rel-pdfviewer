import React, { useState, useCallback, useEffect, useRef } from 'react';
import "./TextInput.scss"
const TextInput = (props) => {
    const { value, onChange, style, className } = props;
    const [anyValue, setAnyValue] = useState(value || '');
    const [editMode, set_editMode] = useState(false);
    const inputRef = useRef();
    const donotcallblurref = useRef();
    const handleOnSave = useCallback((e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        // e.stopPropagation();
        donotcallblurref.current=true;
        console.log("--Save호출1111111111")
        if (onChange) {
            onChange(anyValue);
        }

        set_editMode(false)



    }, [onChange, anyValue]);


    const handleOnCancel = useCallback((e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        // e.stopPropagation();
        donotcallblurref.current=true;
        console.log("--Cancel호출")
        setAnyValue(value);
        set_editMode(false);
    }, [value]);

    const handleKeyDown = useCallback((event) => {
        // console.log("asf",event)
        if (event.key === 'Enter') {

            handleOnSave();

        }
        else if (event.key === "Escape") {
            handleOnCancel();
        }
    }, [handleOnSave, handleOnCancel]);

    const handleOnBlur = useCallback((e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        if(donotcallblurref.current){
            donotcallblurref.current=false;
            return;
        }
        const target = e.relatedTarget || document.activeElement;
        console.log("target",target)
        if (target &&!target.isSameNode(inputRef.current)) {
            console.log("--불러호출");
            if (value === anyValue) {
                set_editMode(false);
            } else {
                handleOnSave();
                set_editMode(false);
            }
        }
        // if (!e.currentTarget.contains(e.relatedTarget)) {
        //     console.log("--불러호출")
        //     if (value === anyValue) {
        //         // handleOnCancel();
        //         set_editMode(false);
        //     }
        //     else {
        //         handleOnSave();
        //         set_editMode(false);
        //     }
        // }


    }, [value, anyValue, handleOnSave]);

    const handleOnEditStart = useCallback((e) => {
        e.preventDefault(); // Prevents the default behavior (focus loss)
        set_editMode(true);
        
    }, [])

    useEffect(() => {
        if (editMode) {
            console.log("에딧모드돌입");            
       
       
            inputRef.current.focus();
        
        }
        else{

        }
    }, [editMode])



    return (<div className="TextInput">

        <div style={{ display: editMode ? 'flex' : 'none', alignItems: 'center' }} onBlur={handleOnBlur}      >
            <input
                ref={inputRef}
                type="text"
                value={anyValue}

                onChange={e => setAnyValue(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={12}
                className={`realInput ${className?className:''}`}
                style={{ ...style }}
            />
            <div style={{ display: 'flex' }}>
                <div className="textInputbtnWrap" onMouseDown={handleOnSave}>
                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#00ee00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                </div>
                <div className="textInputbtnWrap" onMouseDown={handleOnCancel}>
                    <svg fill="#ee0000" width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">

                        <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path>
                    </svg></div>
            </div>

        </div>

        <div style={{ display: editMode ? 'none' : 'flex' }}>
            <div className="textWrap">
                {anyValue}
            </div>
            <div className="textInputbtnWrap" onMouseDown={handleOnEditStart}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z" /></svg>
            </div>


        </div>


    </div>
    );
}


export default TextInput;