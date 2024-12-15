import * as React from "react";
import { Markers } from "./Markers.ts";

export const ShapeDisplay: React.FC<{markers: Markers}> = ({markers}) => {
	if (markers.ellipse === undefined) return (
		<p>No Ellipse</p>
	)

	return (
		<svg viewBox="-1 -1 2 2" className="body-shape">
			<ellipse cx="0" cy="0" rx={Math.sqrt(markers.ellipse.body.a)} ry={Math.sqrt(markers.ellipse.body.b)}
					 fill="none" strokeWidth={0.01} stroke="#78399D"/>
			<ellipse cx="0" cy="0" rx={Math.sqrt(markers.ellipse.lower.a)} ry={Math.sqrt(markers.ellipse.lower.b)}
					 fill="none" strokeWidth={0.01} stroke="#00C65A" strokeDasharray="0.05"/>
			<ellipse cx="0" cy="0" rx={Math.sqrt(markers.ellipse.upper.a)} ry={Math.sqrt(markers.ellipse.upper.b)}
					 fill="none" strokeWidth={0.01} stroke="#00C65A" strokeDasharray="0.05"/>
			<rect x="0.3" y="-0.76" width="0.07" height="0.07" fill="#00C65A"/>
			<text x="0.4" y="-0.7" style={{ fontSize: 0.08 }}>Healthy Range</text>
			<rect x="0.3" y="-0.66" width="0.07" height="0.07" fill="#78399D"/>
			<text x="0.4" y="-0.6" style={{ fontSize: 0.08 }}>Your Roundness</text>
		</svg>
	)
}
