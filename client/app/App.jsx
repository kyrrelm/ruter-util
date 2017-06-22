import React from 'react';
import Card from './Card.jsx';
import  moment from 'moment';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      directions: [],
    };
    this.fetchdepartures = this.fetchdepartures.bind(this);
    this.assignDepartures = this.assignDepartures.bind(this);
    this.addDeparturesToState = this.addDeparturesToState.bind(this);
    this.fetchdepartures();
  }

  fetchdepartures() {
    //fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/3011450?datetime=2017-06-18T15:00")
    //fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/2190120") //ringstabekk
    //fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/3012120") //storo
    //fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/3010600") //tøyen
    //fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/3010020") //stortinget
    //fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/3010200") //majorstuen
    //fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/3012280") //sognsvann
    fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/3011450") //brynseng
        .then((res) => res.json())
        .then((body) => body.map((departure) => mapdeparture(departure)))
        .then((departures) => this.assignDepartures(departures));
  }

  assignDepartures(departures) {
    const uniqueDirections = [];
    departures.forEach((departure) => {
        uniqueDirections[departure.platformName] = true;
    });
    departures.forEach((departure) => departure.direction = mapDirection(departure.platformName, Object.keys(uniqueDirections).length));
    this.addDeparturesToState(departures);
  }

  addDeparturesToState(departures) {
    const firstDirection = departures[0].direction;
    const secondDirection = departures.find((departure) => departure.direction !== firstDirection).direction;
    const directions = [];
    directions.push({directionName: firstDirection, departures: departures.filter((departure) => departure.direction === firstDirection)});
    directions.push({directionName: secondDirection, departures: departures.filter((departure) => departure.direction === secondDirection)});
    console.log(directions);
    this.setState({directions});
  }

  render() {
    const columns = this.state.directions.map((direction) => <div><h1>{direction.directionName}</h1>{makeCardList(direction.departures)}</div>);
    return (
      <div className="card-list">
        {columns}
      </div>
    );
  }
}

const makeCardList = (departures) => {
  return <ul>{departures.map(departure =>
      <Card key={departure.departureTime} departure={departure}/>
  )}</ul>;
};

const mapdeparture = (departure) => {
  return {
    platformName: departure.MonitoredVehicleJourney.MonitoredCall.DeparturePlatformName,
    line: departure.MonitoredVehicleJourney.PublishedLineName,
    destination: departure.MonitoredVehicleJourney.MonitoredCall.DestinationDisplay,
    departureTime: moment(departure.MonitoredVehicleJourney.MonitoredCall.AimedDepartureTime),
  };
};

const mapDirection = (platformName, uniqueDirections) => {
  if (uniqueDirections <= 2)
    return platformName.replace(/[0-9] \(|\)/g, '');
  if(platformName.includes('sentrum'))
    return 'Mot Sentrum';
  if (platformName.includes('øst'))
    return 'Retning Øst';
  if (platformName.includes('vest'))
    return 'Retning Vest';
  return 'Fra Sentrum';
};
