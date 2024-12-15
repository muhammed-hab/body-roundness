import { Demographics } from "./Demographics.ts";
import * as React from "react";
import "./DemographicInput.css";
import { ChangeEvent } from "react";
import bounds = Demographics.bounds;
import races = Demographics.races;
import sexes = Demographics.sexes;

interface DemographicInputProps {
	demographics: Demographics;
	setDemographics: (demographics: Demographics) => void;
}

export const DemographicInput: React.FC<DemographicInputProps> = props => {
	const units = props.demographics.preferredUnits;

	function update<T extends keyof Demographics>(key: T, val: Demographics[T]) {
		props.setDemographics({
			...props.demographics,
			[key]: bounds[key] !== undefined && val !== undefined ? Math.min(bounds[key].max, Math.max(bounds[key].min, val)) : val
							  });
	}

	const setVals = <T extends keyof Demographics>(key: T) => ({
		value: typeof props.demographics[key] === 'number' ? +(props.demographics[key] as number).toFixed(2) : props.demographics[key],
		onChange: (ev: ChangeEvent<any>) => update(key, typeof props.demographics[key] === 'number' ? +ev.target.value : ev.target.value),
		...(bounds[key] ?? {})
	});
	const setValsUnit = <T extends keyof Demographics>(key: T, toImperial: number) => ({
		value: +(props.demographics[key] * (units === 'imperial' ? toImperial : 1)).toFixed(2),
		onChange: (ev: ChangeEvent<any>) => update(key, +ev.target.value / (units === 'imperial' ? toImperial : 1)),
		min: bounds[key] && bounds[key].min * (units === 'imperial' ? toImperial : 1),
		max: bounds[key] && bounds[key].max * (units === 'imperial' ? toImperial : 1)
	});

	const heightFt = Math.floor((props.demographics.heightCm / 2.54) / 12);
	const heightIn = Math.round(props.demographics.heightCm / 2.54 % 12);

	function updateHeightFtIn(ft?: number, inches?: number) {
		if (ft !== undefined && inches !== undefined) {
			throw "Function is not meant to be provided feet and inches!";
		} else if (ft !== undefined) {
			update('heightCm', (ft * 12 + heightIn) * 2.54);
		} else if (inches !== undefined) {
			// If e.g. 65 inches in inputted
			if (inches >= 12) {
				update('heightCm', inches * 2.54);
			} else {
				update('heightCm', (heightFt * 12 + inches) * 2.54);
			}
		}
	}

	return (
		<div className="dem-inputs">
			<div className="sra">
				<label className="dem-input" style={{gridArea: 'sex'}}>
					Sex
					<select {...setVals('sex')}>
						{sexes.map(sex => (
							<option key={sex.value} value={sex.value}>{sex.display}</option>
						))}
					</select>
				</label>
				<label className="dem-input" style={{gridArea: 'race'}}>
					Race
					<select {...setVals('race')}>
						{races.map(race => (
							<option key={race.value} value={race.value}>{race.display}</option>
						))}
					</select>
				</label>
				<label className="dem-input" style={{gridArea: 'age'}}>
					Age
					<input type="number" {...setVals('age')} />
				</label>
			</div>
			<div className="measurements">
				<label className="dem-input" style={{gridArea: 'units'}}>
					Units
					<select {...setVals('preferredUnits')}>
						<option value="metric">Metric</option>
						<option value="imperial">Imperial</option>
					</select>
				</label>
				<div className="dem-input" style={{gridArea: 'height'}}>
					<span>Height</span>
					{units === 'imperial' && (
						<div className="imperial-height">
							<label className="labeled-input">
								<input name="height-feet" type="number" value={heightFt}
									   onChange={ev => updateHeightFtIn(+ev.target.value)} />
								ft
							</label>
							<label className="labeled-input">
								<input name="height-inches" type="number" value={heightIn}
									   onChange={ev => updateHeightFtIn(undefined, +ev.target.value)} />
								in
							</label>
						</div>
					)}
					{units === 'metric' && (
						<label className="labeled-input">
							<input name="height-centimeters" type="number" {...setVals('heightCm')} />
							cm
						</label>
					)}
				</div>
				<div className="dem-input" style={{gridArea: 'weight'}}>
					<span>Weight</span>
					<label className="labeled-input">
						<input name={"weight-" + units === 'imperial' ? 'pounds' : 'kilograms'} type="number"
							   {...setValsUnit('massKg', 2.2)} />
						{units === 'imperial' ? 'lbs' : 'kg'}
					</label>
				</div>
				<div className="dem-input" style={{gridArea: 'waist'}}>
					<span>Waist Circumference</span>
					<label className="labeled-input">
						<input name={"waist-circumference-" + units === 'imperial' ? 'inches' : 'centimeters'}
							   type="number" {...setValsUnit('waistCm', 1/2.54)} />
						{units === 'imperial' ? 'in' : 'cm'}
					</label>
				</div>
				<div className="dem-input" style={{gridArea: 'hip'}}>
					<label style={{width: '100%', display: 'flex'}}>
						Hip Circumference
						<input type="checkbox" name="use-hip-circumference" className="toggle"
							   style={{marginLeft: 'auto'}} checked={props.demographics.hipCm !== undefined}
							   onChange={ev => update('hipCm', ev.target.checked ? 70 : undefined)}/>
					</label>
					{props.demographics.hipCm !== undefined &&
						<label className="labeled-input">
							<input name={"hip-circumference-" + units === 'imperial' ? 'inches' : 'centimeters'}
								   type="number" {...setValsUnit('hipCm', 1/2.54)} />
							{units === 'imperial' ? 'in' : 'cm'}
						</label>
					}
				</div>
			</div>
		</div>
	)
}
