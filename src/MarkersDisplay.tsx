import * as React from "react";
import { getRangeForDemographic, MarkerRange, Markers, MarkersRanges } from "./Markers.ts";
import "./MarkersDisplay.css";
import { Demographics } from "./Demographics.ts";

const MarkerWithRange: React.FC<{ranges: MarkerRange[] | undefined, value: number | undefined, displayTop?: string, displayBottom?: string}> = props => {
	if (props.ranges === undefined || props.value === undefined || isNaN(props.value)) {
		return (
			<p style={{margin: 0}}>The calculator cannot provide information for your demographic.</p>
		)
	}

	const sortedRanges = props.ranges.sort((a, b) => a.from - b.from);
	const rangeAll = (sortedRanges[sortedRanges.length - 1].to - sortedRanges[0].from);
	const valuePos = Math.min(1, Math.max( 0, (props.value - sortedRanges[0].from) / rangeAll));
	const valRange = sortedRanges.find(w => w.from <= props.value && props.value < w.to);

	if (valRange === undefined) {
		return (
			<p style={{margin: 0}}>The calculator cannot provide information for your demographic. Value too {sortedRanges[0].from > props.value ? "low" : "high"}.</p>
		)
	}

	return (
		<div className="marker-ranges" style={{gridTemplateColumns: sortedRanges.map(range => `${(range.to - range.from) / rangeAll}fr`).join(' ')}}>
			{sortedRanges.map(range => (
				<div key={range.from} className={"marker-range " + range.type} />
			))}
			<div className="marker-point" style={{left: `${valuePos * 100}%`}}>
				<div>
					<div className="marker-point-bg" style={{ top: 0 }}/>
					<div className="marker-point-bg" style={{ bottom: 0 }}/>
					<span className="display-cat">{valRange?.display || valRange.type}</span>
					<span className="display-top">{props.displayTop || ''}</span>
					<span className="display-bottom">{props.displayBottom || ''}</span>
				</div>
			</div>
		</div>
	)
}

export const MarkersDisplay: React.FC<{markers: Markers, demographics: Demographics}> = ({markers, demographics}) => {

	const getRange = (key: string) => getRangeForDemographic(demographics, key);

	return (
		<div className="markers">
			<div className="marker-with-range">
				<h3>BMI</h3>
				<MarkerWithRange ranges={getRange('bmi')} value={markers.bmi}
								 displayBottom={markers.bmi?.toFixed(0)}/>
			</div>
			<div className="marker-with-range">
				<h3>VAT</h3>
				<MarkerWithRange ranges={getRange('vatPercent')} value={markers.vatPercent}
								 displayTop={(markers.vatPercent * 100).toFixed(1) + "%"}
								 displayBottom={(markers.vatKg * (demographics.preferredUnits === 'metric' ? 1 : 2.2)).toFixed(0) + ((demographics.preferredUnits === 'metric' ? ' kg' : ' lbs'))}/>
			</div>
			<div className="marker-with-range">
				<h3>Fat Percent</h3>
				<MarkerWithRange ranges={getRange('fatPercent')} value={markers.fatPercent}
								 displayBottom={(markers.fatPercent * 100).toFixed(1) + '%'}/>
			</div>
			<div className="marker-with-range">
				<h3>Roundness</h3>
				<MarkerWithRange ranges={(markers.roundnessUpper !== undefined && markers.roundnessLower !== undefined) ? [
					{from: 2 * markers.roundnessLower - markers.roundnessUpper, to: markers.roundnessLower, type: 'bad', display: 'Elevated Risk'},
					{from: markers.roundnessLower, to: markers.roundnessUpper, type: 'good', display: 'Normal'},
					{from: markers.roundnessUpper, to: 2 * markers.roundnessUpper - markers.roundnessLower, type: 'bad', display: 'Elevated Risk'},
				] : []} value={markers.roundness}
								 displayBottom={markers.roundness?.toFixed(1)}/>
			</div>
		</div>
	)
}
