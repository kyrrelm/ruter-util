import React from 'react';
import Kort from './app/Kort.jsx';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      avganger: [],
    };
    fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/3011450?datetime=2017-06-18T15:00")
        .then((res) => res.json())
        .then((body) => body.map((avgang) => {return {
          line: avgang.MonitoredVehicleJourney.PublishedLineName,
          destination: avgang.MonitoredVehicleJourney.MonitoredCall.DestinationDisplay,
          departureTime: avgang.MonitoredVehicleJourney.MonitoredCall.AimedDepartureTime,
        }})).then((avganger) => this.setState({avganger: avganger}));
  }

  render() {
    console.log("avganger" , this.state.avganger);
    const avgangskort = this.state.avganger.map(avgang =>
        <Kort key={avgang.departureTime} line={avgang.line} destination={avgang.destination} departureTime={avgang.departureTime}/>
    );
    console.log("avgang" , avgangskort);
    return (
      <div>
        <div style={{textAlign: 'center'}}>
          <h1>Hello World</h1>
        </div>
        <div className="kortliste">
          <ul>
            {avgangskort}
          </ul>
        </div>
      </div>
    );
  }
}