import React from 'react';
import DepartureCard from '../card/DepartureCard.jsx';
import  moment from 'moment';
import 'whatwg-fetch'

const LINGER_TIME = 60000;
const REFRESH_RATE = 60000;

export default class DeparturePage extends React.Component {
  constructor() {
    super();
    this.state = {
      directions: [],
    };
    this.fetchDepartures = this.fetchDepartures.bind(this);
    this.handleNewDepartures = this.handleNewDepartures.bind(this);
    this.updateDepartures = this.updateDepartures.bind(this);
  }

  componentWillMount() {
    const stopId = this.props.match.params.stopId;
    this.fetchDepartures(stopId);
    setInterval(() => this.fetchDepartures(stopId), REFRESH_RATE);
  }

  fetchDepartures(stopId) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    fetch(`https://reisapi.ruter.no/StopVisit/GetDepartures/${stopId}`, {headers})
        .then((res) => {
          if(res.ok) {
            console.log("Res ok");
            res.json()
                .then((body) => {console.log("Body", body); return body;})
                .then((body) => body.slice(0,20).map((departure) => mapDeparture(departure)))
                .then((departures) => this.handleNewDepartures(departures))
          } else {
            console.error("Noe gikk galt", res.error())
          }
        });
  }

  handleNewDepartures(departures) {
    console.log("departures", departures);
    const updatedDepartures = this.updateDepartures(departures);
    console.log("1");
    const directions = splitInDirections(assignDirection(updatedDepartures));
    console.log("2");
    this.setState({directions}, () => {console.log("departures2", this.state.directions)});
  }

  updateDepartures(departures) {
    const oldDirections = this.state.directions;
    let lingeringDepartures = [];
    Object.keys(oldDirections).forEach((key) => {
      lingeringDepartures = lingeringDepartures.concat(oldDirections[key].departures.filter(shouldDepartureLinger));
    });
    return lingeringDepartures.concat(departures);
  }

  render() {
    console.log("render");
    const columns = this.state.directions.map((direction) => <div className="card-list-column" key={direction.directionName}><h2>{direction.directionName}</h2>{makeCardList(direction.departures)}</div>);
    return (
      <div className="card-list">
        {columns}
      </div>
    );
  }
}

const makeCardList = (departures) => {
  const departureCards = departures.map(departure => <DepartureCard key={departure.id} departure={departure} lingerTime={LINGER_TIME}/>);
  return <ul>{departureCards}</ul>;
};

const mapDeparture = (departure) => {
  return {
    id: departure.MonitoredVehicleJourney.VehicleJourneyName,
    platformName: departure.MonitoredVehicleJourney.MonitoredCall.DeparturePlatformName,
    line: departure.MonitoredVehicleJourney.PublishedLineName,
    destination: departure.MonitoredVehicleJourney.DestinationName,//MonitoredCall.DestinationDisplay,
    aimedDepartureTime: moment(departure.MonitoredVehicleJourney.MonitoredCall.AimedDepartureTime),
    expectedDepartureTime: moment(departure.MonitoredVehicleJourney.MonitoredCall.ExpectedArrivalTime),
  };
};

const shouldDepartureLinger = (departure) => {
  const depTime = departure.expectedDepartureTime;
  return (depTime.diff(moment()) > -LINGER_TIME-30000) && (depTime.diff(moment()) < 0);
};

const splitInDirections = (departures) => {
  console.log("1.1");
  const directions = [];
  const firstDirection = departures[0].direction;
  directions.push({directionName: firstDirection, departures: departures.filter((departure) => departure.direction === firstDirection)});

  console.log("1.2");

  const different = departures.find((departure) => departure.direction !== firstDirection);
  if (different) {
    const secondDirection = different.direction;
    directions.push({directionName: secondDirection, departures: departures.filter((departure) => departure.direction === secondDirection)});
  }
  console.log("1.3");
  return directions;
};

const assignDirection = (departures) => {
  console.log("1.0.1");
  const uniqueDirections = [];
  departures.forEach((departure) => {
    if(uniqueDirections.indexOf(departure.platformName) === -1) {
      uniqueDirections.push(departure.platformName);
    }
  });
  console.log("1.0.2");
  console.log("unique dir", uniqueDirections);
  departures.forEach((departure) => departure.direction = mapDirection(departure.platformName, uniqueDirections.length));
  console.log("1.0.3");
  return departures;
};

const mapDirection = (platformName, uniqueDirections) => {
  console.log("1.0.0.1");
  console.log("1.0.0.1", platformName);
  console.log("1.0.0.1", uniqueDirections);
  if (uniqueDirections <= 2) {
    console.log("1.0.0.2");
    return platformName.replace(/[0-9] \(|\)/g, '');
  }
  if(platformName.indexOf('sentrum') !== -1) {
    console.log("1.0.0.3");
    return 'Mot Sentrum';
  }
  if (platformName.indexOf('øst') !== -1) {
    console.log("1.0.0.4");
    return 'Retning Øst';
  }
  if (platformName.indexOf('vest') !== -1) {
    console.log("1.0.0.5");
    return 'Retning Vest';
  }
  return 'Fra Sentrum';
};
