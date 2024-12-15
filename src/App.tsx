import { useState } from 'react'
import { Demographics } from "./Demographics.ts";
import { DemographicInput } from "./DemographicInput.tsx";
import { MarkersDisplay } from "./MarkersDisplay.tsx";
import { calculateMarkers } from "./CalculateMarkers.ts";
import { ShapeDisplay } from "./ShapeDisplay.tsx";
import "./App.css";
import pbrc_logo from "../pbrc.svg";

function App() {
    const [demographics, setDemographics] = useState<Demographics>(Demographics.defaultDemographic);

	const markers = calculateMarkers(demographics);

    return (
        <div className="app">
            <header>
                <img src={pbrc_logo} alt="Pennington Logo"/>
                <h1>Body Roundness Calculator</h1>
            </header>
            <p>This calculator calculates the shape of your body roundness from values.</p>
            <h2>Demographics</h2>
            <DemographicInput demographics={demographics} setDemographics={setDemographics} />
            <h2>Results</h2>
            <div className="results">
                <MarkersDisplay markers={markers} demographics={demographics} />
                <ShapeDisplay markers={markers} />
            </div>
        </div>
    )
}

export default App
