import React from 'react';
import Kort from './app/Kort.jsx';
import  moment from 'moment';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      avganger: [],
    };
    //fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/3011450?datetime=2017-06-18T15:00")
    fetch("http://reisapi.ruter.no/StopVisit/GetDepartures/3011450")
        .then((res) => res.json())
        .then((body) => body.map((avgang) => {return {
          line: avgang.MonitoredVehicleJourney.PublishedLineName,
          destination: avgang.MonitoredVehicleJourney.MonitoredCall.DestinationDisplay,
          departureTime: moment(avgang.MonitoredVehicleJourney.MonitoredCall.AimedDepartureTime),
        }})).then((avganger) => this.setState({avganger: avganger}));
  }



  componentDidMount() {

  }

  render() {
    console.log("time" , moment());
    const avgangskort = this.state.avganger.map(avgang =>
        <Kort key={avgang.departureTime} line={avgang.line} destination={avgang.destination} departureTime={avgang.departureTime}/>
    );
    return (
      <div className="kortliste">
        <ul>
          {avgangskort}
        </ul>
      </div>
    );
  }
}