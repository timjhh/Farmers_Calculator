// This is a smart component to control Calculator and CalcForm's state - supplying CalcForm's options and passing its I/O to Calculator
import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Alert } from 'react-bootstrap';
import Calculator from "./Calculator.jsx"
import CalcShow from "./CalcShow.jsx"


function FormController(props) {



// Forced update - implemented for adding and removing crops
const [, updateState] = React.useState();
const forceUpdate = React.useCallback(() => updateState({}), []);
// const sizeRef = React.createRef();

// Possible units for user to set
const units = ["Acres", "Hectares"];

//
// Default generalized values for calculator
// 
let data = {
	unit: "Acres",
	land: 10,
	method: [],
	selected: [],
	crops: [{ type: "Unknown", amount: 0, idx: 0 }],
	length: 20,
	rate: 0.05
};	

/* Specific options for methods - these should be in the format of:
* value: [default: integer, 
* 			unit: string,
* 			display name: string,
* 			(optional) tooltip description: string,
* 			(optional) tooltip link: string(preferably url)]
* e.g.
* costPerUnit: [5, "$/Unit", "Cost Per Unit", "This is the cost per unit of x", "www.costperunit.com" (not a real website)]
*/
const silvoptions = {
	maturingYears:
	[10, "yrs", "Maturing Years", "How long will these trees take to mature?"],
	baseCropRevenue: 
	[450, "$", "Base Pasture Revenue", "Assumes area is 100% Pasture"],
	baseCropCost: 
	[300, "$", "Base Pasture Cost", "Assumes area is 100% Pasture"],
	treeSpacing: 
	[30, "ft", "Tree Spacing", "Economic Budgeting for Agroforestry Practices(University of Missouri)", "https://extension.missouri.edu/publications/af1006"],
	// 2.24.22 Changed treePlantingCost of $9.5 to $4.75/ea for seedling / labor costs
	treeSeedlingCost: 
	[4.75, "$", "Tree Planting Seedling Cost", "Coder, Kim D. 2017. Number of trees per acre by spacing distance. Warnell School of Forestry & Natural Resources, University of Georgia, Outreach Publication WSFNR-17-WMJ. Pp.7.",
	"https://bugwoodcloud.org/bugwood/productivity/pdfs/Jx_WOODLAND_MANAGEMENT_Trees_per_Acre_Spacing_Dist_CODER_2017.pdf"],
	treeLaborCost:
	[4.75, "$", "Tree Planting Labor Cost", "Coder, Kim D. 2017. Number of trees per acre by spacing distance. Warnell School of Forestry & Natural Resources, University of Georgia, Outreach Publication WSFNR-17-WMJ. Pp.7.",
	"https://bugwoodcloud.org/bugwood/productivity/pdfs/Jx_WOODLAND_MANAGEMENT_Trees_per_Acre_Spacing_Dist_CODER_2017.pdf"],
	treesPerAcre: 
	[48, "Tr/Acre", "Trees Per Acre"],
	treeCost: 
	[2.50, "$/yr", "Tree Maintenance Cost"],
	treeCropYield: 
	[2, "$/Unit", "Tree Crop Yield"],
	treeCropPrice: 
	[5, "$/Unit", "Tree Crop Price"],
	effectiveProperty: 
	[80, "%", "Effective Property", "Mean productivity based on Pent (2020)", "https://link.springer.com/article/10.1007/s10457-020-00494-6"]
}

// Spray Irrigation Options
const irroptions = {
	baseCropRevenue: 
	[2500, "$/Acre", "Base Crop Revenue", "Assumes area is 100% Vegetables"],
	baseCropCost: 
	[1500, "$/Acre", "Base Crop Cost", "Assumes area is 100% Vegetables"],
	sprinklerSpacing: 
	[40, "Ft", "Sprinkler Spacing", "Based on NRCS Practice 442, Scenario #6: Solid Set Sprinkler System", "https://www.nrcs.usda.gov/wps/PA_NRCSConsumption/download?cid=NRCSEPRD1854519&ext=pdf"],
	//sprinklerCount: [27, "Head/Acre", "Sprinkler Count"],
	sprinklerCost: 
	[62.50, "$/Head", "Sprinkler Cost"],
	pipeCost: 
	[2.80, "$/Ft", "Pipe Cost", "Based on NRCS Practice 430, Scenario #7: 2\" Surface HDPE Irrigation Pipeline", "https://www.nrcs.usda.gov/wps/PA_NRCSConsumption/download?cid=NRCSEPRD1854519&ext=pdf"],
	pumpSize: 
	[10, "HP", "Pump Size"],
	pumpCost: 
	[710, "$/HP", "Pump Cost", "Diesel Fuel Cost", "NRCS Practice 533, Scenario $5: Electric-powered pump 10-40HP", "https://www.nrcs.usda.gov/wps/PA_NRCSConsumption/download?cid=NRCSEPRD1854519&ext=pdf"],
	dailyPumpUse : 
	[8, "Hr/Day", "Daily Pump Use"],
	hourlyPump: 
	[90, "Days/Yr", "Hourly Pump"],
	dieselCost: 
	[3.40, "$/Gal", "Diesel Fuel Cost", "EIA Fuel Prices", "https://www.eia.gov/petroleum/gasdiesel/"],
	maintenanceCost: 
	[100, "$/Acre/Yr", "Maintenance Cost", "This is an umbrella term miscellaneous annual costs not explicitly included in the calculator"],
	effectiveProperty: 
	[225, "%", "Productivity With Irrigation"]
}

// Drip Irrigation Variant
const dripIrroptions = {
	dripIrrigation:
	[525600, "$$$", "Test Extra Drip Irrigation Option"],
	baseCropRevenue: 
	[2500, "$/Acre", "Base Crop Revenue", "Assumes area is 100% Vegetables"],
	baseCropCost: 
	[1500, "$/Acre", "Base Crop Cost", "Assumes area is 100% Vegetables"],
	sprinklerSpacing: 
	[40, "Ft", "Sprinkler Spacing", "Based on NRCS Practice 442, Scenario #6: Solid Set Sprinkler System", "https://www.nrcs.usda.gov/wps/PA_NRCSConsumption/download?cid=NRCSEPRD1854519&ext=pdf"],
	//sprinklerCount: [27, "Head/Acre", "Sprinkler Count"],
	sprinklerCost: 
	[62.50, "$/Head", "Sprinkler Cost"],
	pipeCost: 
	[2.80, "$/Ft", "Pipe Cost", "Based on NRCS Practice 430, Scenario #7: 2\" Surface HDPE Irrigation Pipeline", "https://www.nrcs.usda.gov/wps/PA_NRCSConsumption/download?cid=NRCSEPRD1854519&ext=pdf"],
	pumpSize: 
	[10, "HP", "Pump Size"],
	pumpCost: 
	[710, "$/HP", "Pump Cost", "Diesel Fuel Cost", "NRCS Practice 533, Scenario $5: Electric-powered pump 10-40HP", "https://www.nrcs.usda.gov/wps/PA_NRCSConsumption/download?cid=NRCSEPRD1854519&ext=pdf"],
	dailyPumpUse : 
	[8, "Hr/Day", "Daily Pump Use"],
	hourlyPump: 
	[90, "Days/Yr", "Hourly Pump"],
	dieselCost: 
	[3.40, "$/Gal", "Diesel Fuel Cost", "EIA Fuel Prices", "https://www.eia.gov/petroleum/gasdiesel/"],
	maintenanceCost: 
	[100, "$/Acre/Yr", "Maintenance Cost", "This is an umbrella term miscellaneous annual costs not explicitly included in the calculator"],
	effectiveProperty: 
	[225, "%", "Productivity With Irrigation"]
}


const tarpoptions = {
	baseCropRevenue: 
	[2500, "$", "Base Crop Revenue", "Assumes area is 100% Vegetables"],
	baseCropCost: 
	[1500, "$", "Base Crop Cost", "Assumes area is 100% Vegetables"],
	bedSpacing: 
	[8, "Ft", "Bed Spacing"],
	tarpLength: 
	[5445, "Ft", "Tarp Length"],
	tarpCost: 
	[0.70, "$/Sq. Ft", "Tarp Cost"],
	tarpLabor: 
	[4, "Hr/Acre", "Tarp Labor"],
	tarpLaborCost: 
	[20.00, "$/Hr", "Tarp Labor Cost"],
	coverCropCost: 
	[150, "$/Ac", "Cover Crop Cost", "Based on NRCS Practice 340, Scenario #57: Cover Crop, 1 ac or less (includes materials + labor)", "https://www.nrcs.usda.gov/wps/PA_NRCSConsumption/download?cid=NRCSEPRD1854519&ext=pdf"], // Effective every OTHER year, starting with 0
	maintenanceCost: 
	[50, "$/Acre/Yr", "Maintenance Cost", "This is an umbrella term miscellaneous annual costs not explicitly included in the calculator"],
	effectiveProperty: 
	[120, "%", "Productivity With Tarp & Cover Crop"]
}

//, "Efficiency Based On OKSU Irrigation Cost Calculator", "https://extension.okstate.edu/fact-sheets/comparative-energy-costs-for-irrigation-pumping.html"

// Discount rate for NPV
const [rate, setRate] = useState(data.rate);

const [land, setLand] = useState(data.land);

const [crops, setCrops] = useState(data.crops);

const [unit, setUnit] = useState(data.unit);



// Length of project(yrs)
const [length, setLength] = useState(data.length);

// Select Drip / Spray Irrigation
const [irrTech, setIrrTech] = useState("Spray Irrigation")

// Set initial state of options
const [opts, setOpts] = useState(() => {
	if (props.variant === "silvopasture") {
		return silvoptions;
	} else if(props.variant === "irrigation") {
		return irroptions;
	} else return tarpoptions;
});

// Set options back to default
function setDefault() {

	setRate(data.rate);
	setLand(data.land);
	setCrops(data.crops);
	setUnit(data.unit);
	setLength(data.length);


	if (props.variant === "silvopasture") {
		setOpts(silvoptions);
	} else if(props.variant === "irrigation") {
		if(irrTech === "Spray Irrigation") {
			setOpts(irroptions);
		} else setOpts(dripIrroptions);
	} else {
		setOpts(tarpoptions);
		setLand(1);
	}

	
}

/*
*
* Optional extra modifications per method
* e.g. Default land for tarping should be 1 acre
*
*/
useEffect(() => {

if (props.variant === "silvopasture") {
	setOpts(silvoptions);
} else if(props.variant === "irrigation") {
	if(irrTech === "Spray Irrigation") {
		setOpts(irroptions);
	} else setOpts(dripIrroptions);
} else {
	setOpts(tarpoptions);
	setLand(1);
}

}, [props.variant]);


useEffect(() => {

	if(props.variant === "irrigation") {
		if(irrTech === "Spray Irrigation") {
			setOpts(irroptions);
		} else setOpts(dripIrroptions);
	}


}, [irrTech]);

// Optional table view
const [tableView, setTableView] = useState(false);

// Interaction for OffCanvas Elements
const [show, setShow] = useState(false);
const toggleShow = () => setShow(d => !d);
const handleClose = () => setShow(false);


return (

	<>

	<Row>
		<Col xs={12} xl={10} className="p-0">


			{/*Calculator Output Table*/}
			<Calculator
				key={props.variant}
				land={(unit === "Acres") ? parseFloat(land) : parseFloat(land) * 2.47105}
				acres={unit}
				method={props.variant}
				crops={crops}
				length={length}
				rate={rate}
				tableView={tableView}
				opts={opts} 
				irrTech={irrTech}
				/>

		</Col>
		<Col xs={12} xl={2} className="pr-0 my-5">



			<Button 
			className="my-3 mx-auto w-100"
			onClick={() => setTableView(!tableView)}>
			View as {tableView ? "Graph": "Table"}</Button>

			<Button
			className="mx-auto w-100"
			onClick={toggleShow}
			>Open Calculator and Input Options</Button>

			<Button
			className="mt-3 mx-auto w-100"
			onClick={() => setDefault()}
			>Reset Options</Button>



			

		</Col>

	</Row>
	<Row>

	<Alert variant="info" className="mt-5 small">
		Our team developed an economic tool to assist farmers and their advisors in understanding what 
		the general costs, revenues and profits may be for a farm that implements different climate 
		adaptation practices.  A farmer or advisor can input farm-specific data using the calculator 
		to generate a general understanding of many of the economic costs associated with implementation 
		of a practice.  Data for the various costs associated with a practice are detailed in a specific 
		practice, as well as the costs considered.  This tool should be considered a guide towards better
		 understanding the range of costs for implementation across these practices, and should be used
		  in conjunction with our other tools and technical advisors to better understand the specific 
		  opportunities and challenges for implementation on any given farm.
	</Alert>

	</Row>


		{/*Calculator Input UI*/}
		<CalcShow
		onChange={() => forceUpdate()}
		land={land}
		setLand={setLand}
		unit={unit}
		setUnit={setUnit}
		crops={crops}
		setCrops={setCrops}
		method={props.variant}

		length={length}
		setLength={setLength}

		rate={rate}
		setRate={setRate}

		opts={opts}
		setOpts={setOpts}
		
		tableView={tableView} 
		setTableView={setTableView}
		show={show}
		setShow={setShow}
		handleClose={handleClose}

		units={units}

		irrTech={irrTech}
		setIrrTech={setIrrTech}

		 />

	</>


)
}
export default FormController;