import * as config from './config.json';

export interface Demographics {
	sex: typeof Demographics.sexes[number]['value'];
	race: typeof Demographics.races[number]['value'];
	age: number;
	heightCm: number;
	massKg: number;
	waistCm: number;
	hipCm?: number;
	preferredUnits: 'metric' | 'imperial';
}

export namespace Demographics {
	export const defaultDemographic: Demographics = config.demographics.default;

	export const bounds = config.demographics.bounds;

	export const sexes = config.demographics.sexes as const;

	// From US Dep of Interior
	export const races = config.demographics.races as const;
}