import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { equals, is, update, remove } from 'ramda';
import interact from 'interactjs';
import { DeleteIcon, NumberIcon } from './Icons';

const Crop = (props) => {
  const {
    coordinate,
    index,
    coordinates,
    onResize,
    onDrag,
    onDelete,
    onChange,
  } = props;

  const cropStyle = useCallback(() => {
    const { x, y, width, height } = coordinate;

    return {
      display: 'inline-block',
      position: 'absolute',
      width,
      height,
      top: y,
      left: x,
      boxShadow: '0 0 6px #000',
      background: '#8c8c8c',
      opacity: 0.6,
    };
  }, [coordinate]);

  useEffect(() => {
    const handleResizeMove = (e) => {
      const { x, y } = coordinate;
      const { width, height } = e.rect;
      const { left, top } = e.deltaRect;

      const nextCoordinate = { ...coordinate, x: x + left, y: y + top, width, height };
      const nextCoordinates = update(index, nextCoordinate, coordinates);

      if (is(Function, onResize)) {
        onResize(nextCoordinate, index, nextCoordinates);
      }

      if (is(Function, onChange)) {
        onChange(nextCoordinate, index, nextCoordinates);
      }
    };

    const handleDragMove = (e) => {
      const { x, y } = coordinate;
      const { dx, dy } = e;

      const nextCoordinate = { ...coordinate, x: x + dx, y: y + dy };
      const nextCoordinates = update(index, nextCoordinate, coordinates);

      if (is(Function, onDrag)) {
        onDrag(nextCoordinate, index, nextCoordinates);
      }

      if (is(Function, onChange)) {
        onChange(nextCoordinate, index, nextCoordinates);
      }
    };

    interact(cropRef.current)
      .draggable({})
      .resizable({
        edges: {
          left: true, right: true, bottom: true, top: true,
        },
      })
      .on('dragmove', handleDragMove)
      .on('resizemove', handleResizeMove);

    return () => {
      interact(cropRef.current).unset();
    };
  }, [coordinate, index, coordinates, onResize, onDrag, onDelete, onChange]);

  const handleDelete = () => {
    const nextCoordinates = remove(index, 1, coordinates);
    if (is(Function, onDelete)) {
      onDelete(coordinate, index, nextCoordinates);
    }
  };

  const cropRef = React.useRef(null);

  return (
    <div style={cropStyle()} ref={cropRef}>
      <NumberIcon number={index + 1} />
      <DeleteIcon onClick={handleDelete} />
    </div>
  );
};

export const coordinateType = PropTypes.shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
});

Crop.propTypes = {
  coordinate: coordinateType.isRequired,
  index: PropTypes.number.isRequired,
  onResize: PropTypes.func,
  onDrag: PropTypes.func,
  onDelete: PropTypes.func,
  onChange: PropTypes.func,
  coordinates: PropTypes.array,
};

export default Crop;