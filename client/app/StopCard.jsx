import React from 'react';

const StopCard = ({stop}) => {
  return (
      <li className = "card">
        <div className = "card-content">
          <h3>{stop.name}</h3>
          <p>{'id: '+stop.id}</p>
          <p>{'zone: '+stop.zone}</p>
        </div>
      </li>
  );
};

export default StopCard;

