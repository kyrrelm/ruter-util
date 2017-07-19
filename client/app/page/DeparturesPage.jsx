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
    fetch(`https://reisapi.ruter.no/StopVisit/GetDepartures/${stopId}`)
        .then((res) => {
          if(res.ok) {
            res.json()
                .then((body) => body.map((departure) => mapDeparture(departure)))
                .then((departures) => this.handleNewDepartures(departures));
          } else {
            console.error("Noe gikk galt", res.error())
          }
        });
  }

  handleNewDepartures(departures) {
    const updatedDepartures = this.updateDepartures(departures);
    const directions = splitInDirections(assignDirection(updatedDepartures));
    this.setState({directions});
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
