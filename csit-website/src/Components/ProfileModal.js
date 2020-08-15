import React, {useState} from 'react'
import * as rb from 'react-bootstrap'
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiYXF1YWltcGFjdCIsImEiOiJja2R0d2N3emswdzlwMnptcGliNTk4ZHNkIn0.jPYEzZD-aErgL25Zx9N_Kg';

class ProfileModal extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            lng: 5,
            lat: 34,
            zoom: 2
        };

        this.mapContainer = React.createRef();
    }

    componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });

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
                        'features': [
                            {
                                'type': 'Feature',
                                'properties': {
                                    'description':
                                        '<strong>Make it Mount Pleasant</strong><p>Make it Mount Pleasant is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>'
                                    },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [-77.038659, 38.931567]
                                }
                            },
                    
                        ]
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
                            'coordinates': [
                                [-122.48369693756104, 37.83381888486939],
                                [-122.48348236083984, 37.83317489144141],
                                [-122.48339653015138, 37.83270036637107],
                                [-122.48356819152832, 37.832056363179625],
                                [-122.48404026031496, 37.83114119107971],
                                [-122.48404026031496, 37.83049717427869],
                                [-122.48348236083984, 37.829920943955045],
                                [-122.48356819152832, 37.82954808664175],
                                [-122.48507022857666, 37.82944639795659],
                                [-122.48610019683838, 37.82880236636284],
                                [-122.48695850372314, 37.82931081282506],
                                [-122.48700141906738, 37.83080223556934],
                                [-122.48751640319824, 37.83168351665737],
                                [-122.48803138732912, 37.832158048267786],
                                [-122.48888969421387, 37.83297152392784],
                                [-122.48987674713133, 37.83263257682617],
                                [-122.49043464660643, 37.832937629287755],
                                [-122.49125003814696, 37.832429207817725],
                                [-122.49163627624512, 37.832564787218985],
                                [-122.49223709106445, 37.83337825839438],
                                [-122.49378204345702, 37.83368330777276]
                            ]
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
            <div>
                <rb.Modal.Header closeButton>
                    <rb.Modal.Title>Person Profile</rb.Modal.Title>
                </rb.Modal.Header>
                <rb.Modal.Body>
                    <text style={{fontSize:"20px", color:"#424761"}}><b>Name:</b> {this.props.profile.firstName + " " + this.props.profile.lastName}</text>
                    <br/>
                    <text style={{fontSize:"20px", color:"#424761"}}><b>Gender:</b> {this.props.profile.gender}</text>
                    <br/>
                    <text style={{fontSize:"20px", color:"#424761"}}><b>Case Number:</b> {this.props.profile.caseNumber}</text>
                    <br/>
                    <text style={{fontSize:"20px", color:"#424761"}}><b>Marital Status:</b> {this.props.profile.maritalStatus}</text>
                    <br/>
                    <text style={{fontSize:"20px", color:"#424761"}}><b>Phone Number:</b> {this.props.profile.phoneNumber}</text>
                    <br/>
                    <text style={{fontSize:"20px", color:"#424761"}}><b>Company:</b> {this.props.profile.company}</text>
                    <br/>
                    <br/>
                    <text style={{fontSize:"30px", color:"#424761"}}><b>Case Summary:</b></text>
                    <br/>
                    <text style={{fontSize:"30px", color:"#424761"}}><b>Movement Visualisation:</b></text>
                    <br/>

                    <div ref={el => this.mapContainer = el} style={{position:"absolute", top: 0, right: 0, left: 0, bottom: 0}}/>

                    <text style={{fontSize:"30px", color:"#424761"}}><b>Breakdown of movement:</b></text>
                    <br/>
    
                </rb.Modal.Body>
            </div>
        )
    }
   
}

export default ProfileModal
