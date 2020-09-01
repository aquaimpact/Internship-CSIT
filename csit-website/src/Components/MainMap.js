import React from 'react'
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiYXF1YWltcGFjdCIsImEiOiJja2R0d2N3emswdzlwMnptcGliNTk4ZHNkIn0.jPYEzZD-aErgL25Zx9N_Kg';

let map
let loaded = false
let IDs = []
let countMoves = 0
let counter = 0
// let colorIDs = []

class MainMap extends React.Component{
    
    constructor(props){
        super(props)

        this.state = {
            lng: 103.851959,
            lat: 1.290270,
            zoom: 9.5,

        };

        this.mapContainer = React.createRef();
    }

    componentDidMount() {
        map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });

        // if(this.props.profile.length > 0 && this.props.movement.length > 0){

        //     let mappedResults = this.props.profile.map(x => {
        //         return({
        //             profile: x,
        //             movements: this.props.movement.filter(xx => xx.suspectId == x.id)
        //         })
        //     })

        //     colorIDs = mappedResults.map(x => {
        //         return(color)
        //     })
        // }
    }

    generateColor(){
        let n = (Math.random() * 0xfffff * 1000000).toString(16);
        return '#' + n.slice(0, 6);
    }

    getDatetime(datetime, selection){

        // 20/7/2020 8:00
        let date = datetime.split(" ")
        let fulldate = date[0].split("/")
        

        let mon = fulldate[1]
        let day = fulldate[0]
        let year = fulldate[2]
        let fullTime = date[1].split(":")
        let hh = fullTime[0]
        let min = fullTime[1]

        // const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const shortmonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

        let finalDatetime
        if(selection == "d"){
            finalDatetime = day + " " + shortmonthNames[parseInt(mon)-1] + " " + year
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
        // else if(selection == "dt"){
        //     finalDatetime = new Date(datetime)
        // }
        return finalDatetime
    }

    componentDidUpdate(){

        let that = this
        if(this.props.profile.length > 0 && this.props.movement.length > 0 && counter != 1){
            // if(IDs.length != 0){
            //     IDs = []
            // }

            // console.log(this.props.profile)

            // timeformat: [this.convertDate(movement.datetimeEntered),this.convertDate(movement.datetimeLeft)]
            let mappedResults = this.props.profile.map(x => {
                return({
                    profile: x,
                    movements: this.props.movement.filter(xx => xx.suspectId == x.id)
                })
            })

                        // Accepts the array and key
            const groupBy = (array, key) => {
                // Return the end result
                return array.reduce((result, currentValue) => {
                // If an array already present for key, push it to the array. Else create an array and push the object
                (result[currentValue[key]] = result[currentValue[key]] || []).push(
                    currentValue
                );
                // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
                return result;
                }, {}); // empty object is the initial value for result object
            };
            
            // Group by location address as key to the person array
            const personGroupedByColor = groupBy(this.props.movement, 'locationShortaddress');
            
            console.log(personGroupedByColor)

            var UPoints = Object.keys(personGroupedByColor).map(function(key) {
                if(personGroupedByColor[key].length == 1){
                    let item = personGroupedByColor[key][0]
                    return({
                        'type': 'Feature',
                        'properties': {
                            'movementID':item.id,
                            'enter': item.datetimeEntered,
                            'leave': item.datetimeLeft,
                            'placeID': item.locationShortaddress,
                            'description':
                                `<strong>${item.locationShortaddress}</strong><p>Time Entered: ${that.getDatetime(item.datetimeEntered, 't')}</p><p>Time Left: ${that.getDatetime(item.datetimeLeft, 't')}</p><p>Date: ${that.getDatetime(item.datetimeLeft, 'd')}</p>`
                            },
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [item.locationLong, item.locationLat]
                        }
                    })
                }
                else{
                    let movementID = personGroupedByColor[key].map(x => x.id )
                    // console.log(movementID)

                    let enter = personGroupedByColor[key].map(x => x.datetimeEntered )
                    let leave = personGroupedByColor[key].map(x => x.datetimeLeft)
                    let placeID = key

                    let text = `<strong>${key}</strong>`
                    // console.log(placeID)
                    personGroupedByColor[key].forEach(xx => {
                        let name = that.props.profile.filter(x => x.id === xx.suspectId).map(x => {
                            return(x.firstName + " " + x.lastName)
                        })
                        text += `<p>${name}</p>`
                        text += `<p>Time Entered: ${that.getDatetime(xx.datetimeEntered, 't')}</p><p>Time Left: ${that.getDatetime(xx.datetimeLeft, 't')}</p><p>Date: ${that.getDatetime(xx.datetimeLeft, 'd')}</p>`
                    })

                    // console.log(text)
                    // let description = `<strong>${item.locationShortaddress}</strong><p>Time Entered: ${that.getDatetime(item.datetimeEntered, 't')}</p><p>Time Left: ${that.getDatetime(item.datetimeLeft, 't')}</p><p>Date: ${that.getDatetime(item.datetimeLeft, 'd')}</p>`

                    return({
                        'type': 'Feature',
                        'properties': {
                            'movementID': movementID,
                            'enter': enter,
                            'leave': leave,
                            'placeID': placeID,
                            'description': text,
                            },
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [personGroupedByColor[key][0].locationLong, personGroupedByColor[key][0].locationLat]
                        }
                    })
                }
            });

            map.loadImage(
                'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
                // Add an image to use as a custom marker
                function(error, image) {
                    if (error) throw error;
                    
                    map.addImage('Imgids', image);
                    
                    mappedResults.forEach(e => {

                        let lol = Math.floor(Math.random() * 101).toString()

                        let UMovements = e.movements.map(x => {
                            return([x.locationLong, x.locationLat])
                        })

                        console.log(UMovements)

                        map.addSource(lol, {
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
    
                        let color = that.generateColor()
    
                        map.addLayer({
                            'id': lol,
                            'type': 'line',
                            'source': lol,
                            'layout': {
                                'line-join': 'round',
                                'line-cap': 'round'
                            },
                            'paint': {
                                'line-color': color,
                                'line-width': 8
                            }
                        });
                    })

                    map.addSource('placeIDs', {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': UPoints
                        }
                    });
                    
                    // Add a layer showing the places.
                    map.addLayer({
                        'id': 'placeIDs',
                        'type': 'symbol',
                        'source': 'placeIDs',
                        'layout': {
                            // "line-cap": "round",
                            // "line-join": "round"
                            'icon-image': 'Imgids',
                            'icon-allow-overlap': true
                        }
                    });
    
                });

            // Create a popup, but don't add it to the map yet.
            var popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });

            map.on('click', 'placeIDs', function(e){

                var placeID = e.features[0].properties.placeID;           
                var description = e.features[0].properties.description;
                var movementID = e.features[0].properties.movementID;
                var enter = e.features[0].properties.enter;
                var leave = e.features[0].properties.leave;

                // count += 1
                // let m = that.props.movement.filter(x => x.id == movementID)
                // let p = that.props.profile.filter(x => x.id == m[0].suspectId)
                
                that.props.dataRetrieved(movementID)

                // if(Array.isArray(movementID)){

                // }
                // console.log(movementID)
            });

            map.on('mouseenter', 'placeIDs', function(e) {

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
                
            map.on('mouseleave', 'placeIDs', function() {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });

            counter += 1
        }   
    }

    render(){

        return(
            <div style={{position:"relative",height:"700px", width:"100%"}}>
                <div ref={el => this.mapContainer = el} style={{position:"reletive", width:"inherit", height:"inherit"}}/>
            </div>
            
        )
    }

}

export default MainMap