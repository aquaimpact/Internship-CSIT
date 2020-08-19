import React from 'react'
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiYXF1YWltcGFjdCIsImEiOiJja2R0d2N3emswdzlwMnptcGliNTk4ZHNkIn0.jPYEzZD-aErgL25Zx9N_Kg';

let map

class MainGraph extends React.Component{
    
    constructor(props){
        super(props)

        this.state = {
            lng: 103.851959,
            lat: 1.290270,
            zoom: 9.5,
            movements:[],
            maps:{},
            profiles:[],
        };

        this.mapContainer = React.createRef();
    }

    componentDidMount(){
        map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });
    }

}