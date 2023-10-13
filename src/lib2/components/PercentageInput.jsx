import React, { useState, useCallback, useMemo, useEffect } from 'react';

const PercentageInput = ({
    value,
    onChange,
    onBlur,
    style,
    className,
}) => {
    const [anyValue, setAnyValue] = useState(value || '');

    useEffect(() => {
        setAnyValue(value);
    }, [value]);

    const prevValidValue = useMemo(() => {
        return value || '';
    }, [value]);

    const handleChange = (event) => {
        setAnyValue(event.target.value);
    };

    const validateAndSetPercentage = useCallback(() => {
        const parsedValue = parseInt(anyValue, 10);
        if (isNaN(parsedValue)) {
            onChange(prevValidValue);
            setAnyValue(prevValidValue);
        } else if (parsedValue < 25) {
            onChange('25%');
            setAnyValue('25%');
        } else if (parsedValue > 100) {
            onChange('100%');
            setAnyValue('100%');
        } else {
            onChange(parsedValue + '%');
            setAnyValue(parsedValue + '%');
        }
        if (onBlur) {
            onBlur();
        }
    }, [anyValue, onBlur, onChange, prevValidValue]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            validateAndSetPercentage();
        }
    };

    return (
        <input
            type="text"
            value={anyValue}
            onChange={handleChange}
            onBlur={validateAndSetPercentage}
            onKeyDown={handleKeyDown}
            className={className}
            style={style}
        />
    );
};

export default React.memo(PercentageInput);
