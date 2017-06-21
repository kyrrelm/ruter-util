import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class Card extends React.Component {
  componentDidMount() {
    setInterval(() => this.forceUpdate() , 10000);
  }

  render() {
    const departure = this.props.departure;
    
    const diff = departure.departureTime.diff(moment(), 'seconds');
    let displayTime = departure.departureTime.fromNow();
    if(30 >= diff && diff >= -30){
      displayTime = 'now';
    }

    return (
      <li className = "kort">
        <div className = "kort-innhold">
          <h2><b>{departure.line + ' ' + departure.destination}</b></h2>
          <p>{displayTime}</p>
        </div>
      </li>
    )
  }
}

Card.propsTypes = {
  avgang: PropTypes.object.isRequired,
};

export default Card;
