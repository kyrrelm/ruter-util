import React from 'react';
import PropTypes from 'prop-types';

const Kort = ({line, destination, departureTime}) => {
  console.log(line);
  return (
      <li className = "kort">
        <div className = "kort-innhold">
          <h2><b>{line + ' ' + destination}</b></h2>
          <p>{departureTime}</p>
        </div>
      </li>
  );
};

Kort.propsTypes = {
  departureTime: PropTypes.string.isRequired,
  line: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
};

export default Kort;
