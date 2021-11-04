/**
 * 
 * ImageSlider - Contains multiple sliders of visualizations, a slider to gradually change one in focus
 * and a button group to toggle between them
 * 
 **/

import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Container, Nav, Navbar, Alert, ListGroup, Tab, Image, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const variants = ["Silvopasture", "Pasture Enrichment", "Forest Conversion"];

const navs = ["Overview", "Visualizations", "Economic Tool"]; 

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return Object.entries(images);
}



// Marks on slider for concrete images
let marks = [];

// Initial opacity state for the fist slider image
let def = [1];


function ImageSlider(props) {

    // What value the opacity slider is at
    const [timeSl, setTimeSl] = useState(0);

    // Which image array is active?
    const [active, setActive] = useState(props.groups[0]);

    // Opacity container for images
    const [opacity, setOpacity] = useState(def);


    // Create an updated array for slider marks
    function createMarks(arr) {

        marks = [];

        arr.forEach((d,idx) => {
            
            def.push(0);

            marks.push({
               value: idx/(arr.length-1)
            });

        });

        return marks;
       
    }

    // event - mouesevent
    // idx - slider index
    // arr - what array of images are we modifying
    function handleChange(event,idx) {
        

        // Value from slider
        setTimeSl(event.target.value);

        // Number of pictures to divide into
        let divs = (active.length)-1;

        // Scaled number with range
        let scaled = idx*divs;

        // Local copy of opacity array
        let opac = {opacity};

        // Which element should be entirely opaque
        let visible = (Math.round(scaled));


        // Iterate to update opacity of each image
        active.forEach((d,idx) => {

            opac[idx] = 0;

            // These two opacity values will be modified
            let floor = Math.floor(scaled);
            let ceil = Math.ceil(scaled);

            // Set accordingly to opacity layering
            opac[floor] = ceil-scaled;
            opac[ceil] = scaled-floor;


            });
            opac[visible] = 1;
            setOpacity(opac);

    }


	return (
		<>

                    <Row className="p-0 m-0 d-flex align-items-end">
                    <Col xs={8} className="ml-0 pl-0">
                    <ButtonToolbar aria-label="Slideshow Selection Toolbar">
                      <ButtonGroup className="mt-5">

                        <ListGroup.Item>Select Image Group</ListGroup.Item>
                        {props.labels.map((d,idx) => (
                                <Button
                                    key={d+idx}
                                    className="flat-butt"
                                    eventKey={idx} onClick={function(d) {
                                            // Manually set active image set on select
                                            setActive(props.groups[idx]);

                                            // Reset opacity / slider settings
                                            setTimeSl(0);
                                            setOpacity(() => {def[0]=1; return def;});
                                        }}
                                    >{d}</Button>
                            ))}

                      </ButtonGroup>
                    </ButtonToolbar>
                    </Col>
                    <Col xs={4} className="pr-5 d-flex justify-content-end">
                     {active.length > 1 && 

                        <Box sx={{ width: 250 }}>
                            <Typography gutterBottom>Slide to change</Typography>
                        
                            <Slider

                                getAriaLabel={() => 'Image Slider'}
                                min={0}
                                marks={createMarks(active)}
                                max={1}
                                step={0.01}
                                value={timeSl}
                                style={{position: "relative"}}
                                onChange={(event,idx) => handleChange(event,idx)}
                            />
                        </Box>
                            
                           }

                    </Col>
                    </Row>


                        {/* Fading images accompanying slider */}
                          <Box style={{'minHeight': '500px','position': 'relative'}}>

                                {/* Map the active image set to screen */}
                                {active.map((d,idx) => (

                                        <img
                                            key={d+idx}
                                            className="d-block w-100"
                                            style={{'position': 'absolute', 'opacity': opacity[idx]}}
                                            src={d[1].default} 
                                            alt={d[0]}
                                            />
                                    ))}

                          </Box>



	</>
		)
}

export default ImageSlider;