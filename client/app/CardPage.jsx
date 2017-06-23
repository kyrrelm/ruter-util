import React from 'react';
import Card from './Card.jsx';
import  moment from 'moment';
import queryString from 'query-string';

export default class CardPage extends React.Component {
  constructor() {
    super();
    this.state = {
      directions: [],
    };
    this.fetchdepartures = this.fetchdepartures.bind(this);
    this.handleNewDepartures = this.handleNewDepartures.bind(this);
    this.fetchdepartures();
  }

  componentWillMount() {
    console.log("query", queryString.parse(location.search));
    setInterval(this.fetchdepartures, 10000000);
  }

  fetchdepartures() {
    //fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/3011450?datetime=2017-06-18T15:00")
    //fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/2190120") //ringstabekk
    //fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/3012120") //storo
    //fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/3010600") //tøyen
    //fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/3010020") //stortinget
    //fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/3010200") //majorstuen
    //fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/3012280") //sognsvann
    fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/3010012") //jernbanetorget (B.Gunnerus g.)
    //fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/3012500") //skøyen tog
    //fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/3011450") //brynseng
        .then((res) => res.json())
        .then((body) => body.map((departure) => mapDeparture(departure)))
        .then((departures) => this.handleNewDepartures(departures));
  }

  handleNewDepartures(departures) {
    const directions = splitInDirections(assignDirection(departures));
    this.setState({directions});
  }

  render() {
    const columns = this.state.directions.map((direction) => <div className="card-list-column"><h2>{direction.directionName}</h2>{makeCardList(direction.departures)}</div>);
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

const mapDeparture = (departure) => {
  return {
    platformName: departure.MonitoredVehicleJourney.MonitoredCall.DeparturePlatformName,
    line: departure.MonitoredVehicleJourney.PublishedLineName,
    destination: departure.MonitoredVehicleJourney.DestinationName,//MonitoredCall.DestinationDisplay,
    aimedDepartureTime: moment(departure.MonitoredVehicleJourney.MonitoredCall.AimedDepartureTime),
    expectedDepartureTime: moment(departure.MonitoredVehicleJourney.MonitoredCall.ExpectedArrivalTime),
  };
};

const splitInDirections = (departures) => {
  const directions = [];
  const firstDirection = departures[0].direction;
  directions.push({directionName: firstDirection, departures: departures.filter((departure) => departure.direction === firstDirection)});

  const different = departures.find((departure) => departure.direction !== firstDirection);
  if (different) {
    const secondDirection = different.direction;
    directions.push({directionName: secondDirection, departures: departures.filter((departure) => departure.direction === secondDirection)});
  }
  return directions;
};

const assignDirection = (departures) => {
  const uniqueDirections = [];
  departures.forEach((departure) => {
    uniqueDirections[departure.platformName] = true;
  });
  departures.forEach((departure) => departure.direction = mapDirection(departure.platformName, Object.keys(uniqueDirections).length));
  return departures;
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
