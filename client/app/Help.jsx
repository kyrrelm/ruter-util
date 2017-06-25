import React from 'react';
import StopCard from './StopCard.jsx';

export default class Help extends React.Component {

  constructor() {
    super();
    this.fetchStops = this.fetchStops.bind(this);
    this.fetchStops();
    this.state = {
      stops: []
    }
  }

  fetchStops() {
    fetch("http://reisapi.ruter.no/Place/GetStopsRuter")
        .then((res) => res.json())
        .then((body) => body.map((stop) => mapStop(stop)))
        .then((stops) => this.setState({stops}));
  }

  render() {
    const stopCards = this.state.stops.map((stop) => <StopCard stop={stop}/>);
    return (
        <div className="help">
          <div className="card-list">
            <div className="card-list-column">
              <input id="email" type="email"/>
              <ul>
                {stopCards}
              </ul>
            </div>
          </div>
        </div>
    );
  }
}

const mapStop = (stop) => {
  return {
    id: stop.ID,
    name: stop.Name,
    zone: stop.Zone,
    district: stop.District,
    placeType: stop.PlaceType,
    isHub: stop.IsHub,
    shortName: stop.ShortName,
    x: stop.X,
    y: stop.Y,
  };
};
