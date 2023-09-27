import React, { useState, useEffect, useMemo, useCallback } from 'react';

const NumberOnlyInput = ({ style, value, onChange, max, min, onBlur }) => {
    const [anyValue, setAnyValue] = useState(value);
    useEffect(() => {
        setAnyValue(value);
    }, [value])


    // 정수만 입력하도록 제어
    const handleInputChange = (e) => {
        let newValue = e.target.value;
        setAnyValue(newValue);

        // // 숫자만 허용 (소수점 및 기타 문자 제거)
        // newValue = newValue.replace(/[^0-9]/g, '');

        // // 최대값 및 최소값 적용
        // if (newValue !== '') {
        //   newValue = parseInt(newValue, 10);
        //   if (!isNaN(max) && newValue > max) {
        //     newValue = max;
        //   } else if (!isNaN(min) && newValue < min) {
        //     newValue = min;
        //   }
        // }
        // setAnyValue(newValue);
        // onChange(newValue);
    };
    const prevValidValue = useMemo(() => {
        return value || '';
    }, [value]);

    const validateAndSetPercentage = useCallback(() => {
        const parsedValue = parseInt(anyValue, 10);
    
        if (isNaN(parsedValue) || parsedValue < 0) {
          onChange(prevValidValue);
          setAnyValue(prevValidValue);
        } else if ((min === undefined || min === null) && (parsedValue < 0)) {
          // min이 undefined 또는 null이면서 입력 값이 음수일 때
          onChange(0);
          setAnyValue(0);
        } else if ((max === undefined || max === null) && (parsedValue > 100)) {
          // max가 undefined 또는 null이면서 입력 값이 100을 초과할 때
          onChange(100);
          setAnyValue(100);
        } else if (min !== undefined && parsedValue < min) {
          onChange(min);
          setAnyValue(min);
        } else if (max !== undefined && parsedValue > max) {
          onChange(max);
          setAnyValue(max);
        } else {
          onChange(parsedValue);
          setAnyValue(parsedValue);
        }
    
        if (onBlur) {
          onBlur();
        }
      }, [anyValue, onBlur, onChange, prevValidValue, min, max]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            // Enter 키를 눌렀을 때에도 anyValue를 현재 입력 값으로 업데이트하고, onBlur를 호출하여 25에서 100 사이 값으로 조정
            validateAndSetPercentage();
        }
    };




    useEffect(() => {
        setAnyValue(value);
    }, [value]);

    return (

        <input
            type="text"
            value={anyValue}
            onChange={handleInputChange}
            onBlur={validateAndSetPercentage}
            onKeyDown={handleKeyDown} // Enter 키 이벤트 핸들러 추가
            style={style}
        />

    );
};

export default NumberOnlyInput;
