import React from 'react'
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiYXF1YWltcGFjdCIsImEiOiJja2R0d2N3emswdzlwMnptcGliNTk4ZHNkIn0.jPYEzZD-aErgL25Zx9N_Kg';

let map

let count = 0

class Maps extends React.Component{

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

    getMovements(id){
        fetch(`http://localhost:8080/getMovementbyID?IDs=${id}`).then(r => r.json()).then(data => this.setState({movements:data})).catch(err => {console.log(err)})
    }

    componentDidMount() {
        this.getMovements(this.props.UID)
    }

    getDatetime(datetime, selection){
        let date = new Date(datetime)
        date = (date + "").split(" ")
        let mon = date[1]
        let day = date[2]
        let year = date[3]
        let fullTime = date[4].split(":")
        let hh = fullTime[0]
        let min = fullTime[1]
        let sec = fullTime[2]

        // const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        let finalDatetime
        if(selection == "d"){
            finalDatetime = day + " " + mon + " " + year
        }
        else if(selection == "t"){
            let timing = "AM"
            if(parseInt(hh) == 12){
                timing = "PM"
            }
            if(parseInt(hh) > 12){
                hh = parseInt(hh) - 12
                timing = "PM"
            }
            finalDatetime = hh + ":" + min + " " + timing
        }
        else if(selection == "dt"){
            finalDatetime = new Date(datetime)
        }
        return finalDatetime
    }

    getPeople(id)
    {
        fetch(`http://localhost:8080/getPeopleTiming?IDs=${id}`).then(r => r.json()).then((data) => {this.props.callbackFromParent(data)}).catch(err => {console.log(err)})
    }

    componentDidUpdate(){

        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });

        let UPoints = this.state.movements.map(x => {
            return({
                'type': 'Feature',
                'properties': {
                    'movementID': x.id,
                    'description':
                        `<strong>${x.locationShortaddress}</strong><p>Time Entered: ${this.getDatetime(x.datetimeEntered, 't')}</p><p>Time Left: ${this.getDatetime(x.datetimeLeft, 't')}</p><p>Date: ${this.getDatetime(x.datetimeLeft, 'd')}</p>`
                    },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [x.locationLong, x.locationLat]
                }
            })
        })

        let UMovements = this.state.movements.map(x => {
            return([x.locationLong, x.locationLat])
        })

        let that = this

        map.on('load', function() {

            map.loadImage(
            'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
            // Add an image to use as a custom marker
            function(error, image) {
                if (error) throw error;
                map.addImage('custom-marker', image);
             
                map.addSource('places', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': UPoints
                    }
                });
             
                // Add a layer showing the places.
                map.addLayer({
                    'id': 'places',
                    'type': 'symbol',
                    'source': 'places',
                    'layout': {
                        'icon-image': 'custom-marker',
                        'icon-allow-overlap': true
                    }
                });

                map.addSource('route', {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': UMovements
                        }
                    }
                });
                
                map.addLayer({
                    'id': 'route',
                    'type': 'line',
                    'source': 'route',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': '#888',
                        'line-width': 8
                    }
                });

            });
             
            // Create a popup, but don't add it to the map yet.
            var popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });
            
            map.on('click', 'places', function(e){
                var description = e.features[0].properties.description;
                var movementID = e.features[0].properties.movementID;
                // console.log(movementID)
                that.getPeople(movementID)
            });

            map.on('mouseenter', 'places', function(e) {
                // Change the cursor style as a UI indicator.
                map.getCanvas().style.cursor = 'pointer';
                
                var coordinates = e.features[0].geometry.coordinates.slice();
                var description = e.features[0].properties.description;
                
                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                
                // Populate the popup and set its coordinates
                // based on the feature found.
                popup.setLngLat(coordinates).setHTML(description).addTo(map);
            });
             
            map.on('mouseleave', 'places', function() {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });
        });
    }

    render(){

        return(
            <div style={{position:"relative",height:"300px", width:"100%"}}>
                <div ref={el => this.mapContainer = el} style={{position:"reletive", width:"inherit", height:"inherit"}}/>
            </div>
            
        )
    }
}

export default Maps