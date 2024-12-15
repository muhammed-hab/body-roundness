import { Demographics } from "./Demographics.ts";
import { evaluateEquation, Markers } from "./Markers.ts";

export function calculateMarkers(demographics: Demographics): Markers {
	demographics['WE'] = evaluateEquation(demographics, 'WE');
	demographics['HE'] = evaluateEquation(demographics, 'HE');

	demographics['eccL'] = evaluateEquation(demographics, 'eccL');
	demographics['eccU'] = evaluateEquation(demographics, 'eccU');

	const vatPercent = demographics.hipCm !== undefined ? evaluateEquation(demographics, 'vatPercentWithHip') : evaluateEquation(demographics, 'vatPercentNoHip');

	let ellipse = undefined;

	if (demographics['eccL'] !== undefined && demographics['eccU'] !== undefined) {
		ellipse = {
			body: {
				a: Math.sqrt(0.25 - 0.25 * (demographics['WE'] ** 2)),
				b: 0.5
			},
			lower: {
				a: Math.sqrt(0.25 - 0.25 * (demographics['eccL'] ** 2)),
				b: 0.5
			},
			upper: {
				a: Math.sqrt(0.25 - 0.25 * (demographics['eccU'] ** 2)),
				b: 0.5
			}
		};
	}

	return {
		bmi: evaluateEquation(demographics, 'bmi'),
		ellipse,
		fatPercent: evaluateEquation(demographics, 'fatPercent'),
		roundness: evaluateEquation(demographics, 'roundness'),
		vatKg: vatPercent !== undefined ? demographics.massKg * vatPercent : undefined,
		vatPercent,
		roundnessLower: evaluateEquation(demographics, 'roundnessLower'),
		roundnessUpper: evaluateEquation(demographics, 'roundnessUpper')
	}
}
