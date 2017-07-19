import React from 'react';
import StopCard from '../card/StopCard.jsx';
import 'whatwg-fetch'

let ID = 0;

export default class SetupPage extends React.Component {

  constructor() {
    super();
    this.fetchStops = this.fetchStops.bind(this);
    this.containsSearchWord= this.containsSearchWord.bind(this);
    this.fetchStops();
    this.state = {
      stops: [],
      searchWord: ''
    }
  }

  fetchStops() {
    fetch('https://reisapi.ruter.no/Place/GetStopsRuter')
      .then((res) => {
        if (res.ok) {
          res.json()
              .then((body) => body.map((stop) => mapStop(stop)))
              .then((stops) => this.setState({stops}));
        } else {
          console.error("Noe gikk galt", res.error());
        }
      });
  }

  containsSearchWord(stop) {
    if(this.state.searchWord === '') return true;
    return stop.name.toLowerCase().includes(this.state.searchWord.toLowerCase());
  }

  render() {
    const stopCards = this.state.stops.filter(this.containsSearchWord).slice(0, 50).map((stop) => <StopCard key={ID++} stop={stop} history={this.props.history}/>);
    return (
        <div className="setup">
          <div className="card-list">
            <div className="card-list-column">
              <input
                  type="text"
                  className="search-input"
                  placeholder="Søk..."
                  value={this.state.searchWord}
                  onChange={(e) => this.setState({searchWord: e.target.value})}/>
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
