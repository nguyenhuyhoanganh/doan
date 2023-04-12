import React from 'react';

function Radio(props) {
  return (
    <div className="flex items-center">
      <input
        id={props.id}
        name={props.name}
        type="radio"
        value={props.value}
        className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
        checked={props.checked}
        onChange={props.onChange}
      />
      <label htmlFor={props.id} className="ml-2">
        {props.label}
      </label>
    </div>
  );
}

export default Radio;
