import React from 'react';
import { Container } from 'react-bootstrap';
import Chart from "./viz/Chart.jsx"
import TextAccordion from "./TextAccordion.jsx"
import Sources from "./Sources.jsx"

function Home(props) {



	return (

		<>
			<Sources />
		<Container className="box my-5 maindiv">

			<TextAccordion />
		</Container>

		<Container className="box my-5">
			<Chart />
		</Container>

		</>

		)
}

export default Home;
