import React from 'react';

const StopCard = ({stop, history}) => {

  return (
      <li className = "card" onClick={() => history.push(`/stop/${stop.id}`)}>
        <div className = "card-content">
          <h3>{stop.name}</h3>
          <p>{'id: '+stop.id}</p>
          <p>{'zone: '+stop.zone}</p>
        </div>
      </li>
  );
};

export default StopCard;

