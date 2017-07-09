import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class DepartureCard extends React.Component {
  componentDidMount() {
    this.updateTime = setInterval(() => this.forceUpdate() , 1000);
  }

  componentWillUnmount() {
    clearInterval(this.updateTime);
  }

  render() {
    const departure = this.props.departure;
    //const delay = departure.expectedDepartureTime.to(departure.aimedDepartureTime, true);
    const expectedTime = formatTime(departure.expectedDepartureTime);
    const shouldCollapse = !(departure.expectedDepartureTime.diff(moment()) > -60000);
    const classSelected = shouldCollapse ? 'card card-collapse' : 'card';
    return (
        <li className = {classSelected}>
          <div className = "card-content">
            <h3>{departure.line + ' ' + departure.destination}</h3>
            <p>{expectedTime}</p>
          </div>
        </li>
    )
  }
}

DepartureCard.propsTypes = {
  avgang: PropTypes.object.isRequired,
};

export default DepartureCard;

const formatTime = (time) => {
  const diff = time.diff(moment(), 'seconds');
  let displayTime = time.fromNow();
  if(30 >= diff && diff >= -30){
    displayTime = 'now';
  }
  return displayTime;
};

