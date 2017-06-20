import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class Kort extends React.Component {
  componentDidMount() {
    setInterval(() => this.forceUpdate() , 10000);
  }

  render() {
    const departureTime = this.props.departureTime;
    const diff = departureTime.diff(moment(), 'seconds');
    let displayTime = departureTime.fromNow();
    if(30 >= diff && diff >= -30){
      displayTime = 'now';
    }

    return (
      <li className = "kort">
        <div className = "kort-innhold">
          <h2><b>{this.props.line + ' ' + this.props.destination}</b></h2>
          <p>{displayTime}</p>
        </div>
      </li>
    )
  }
}

Kort.propsTypes = {
  departureTime: PropTypes.string.isRequired,
  line: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
};

export default Kort;
