import * as config from './config.json';
import { Demographics } from "./Demographics.ts";

export interface Ellipse {
	a: number,
	b: number
}

export type Markers = Partial<{
	fatPercent: number,
	vatPercent: number,
	vatKg: number,
	roundness: number,
	bmi: number,
	roundnessLower: number,
	roundnessUpper: number,
	ellipse: {
		lower: Ellipse,
		upper: Ellipse,
		body: Ellipse
	};
}>;

export interface MarkerRange {from: number, to: number, type: 'bad' | 'okay' | 'good', display?: string}
export const MarkersRanges: {[key: string]: {for: any[], ranges: MarkerRange[]}[]} = config.markers.ranges as any;

export const doesForMatch = (demographics: Demographics, forList: any[]): boolean => {
	if (forList.length === 0) return true;
	else {
		forListIter:
		for (let reqs of forList) {
			for (let key in reqs) {
				if (!Object.hasOwn(reqs, key)) continue;
				// @ts-ignore
				const item = demographics[key];
				if (Array.isArray(reqs[key])) {
					if (reqs[key].indexOf(item) === -1) continue forListIter;
				} else if (Object.hasOwn(reqs[key], 'min') && Object.hasOwn(reqs[key], 'max')) {
					if (!(reqs[key].min <= item && item < reqs[key].max)) continue forListIter;
				} else if (typeof reqs[key] === 'string') {
					if (reqs[key] !== item) continue forListIter;
				} else {
					throw `Invalid requirement ${key}`;
				}
			}
			return true;
		}
		return false;
	}
}

export const getRangeForDemographic = (demographics: Demographics, key: string) =>
	MarkersRanges[key].find(range => doesForMatch(demographics, range.for))?.ranges;

function evalEq(eq: string, demographics: Demographics, trace?: boolean): number {
	let depth = 0;
	let opIndices = [];
	for (let i = 0; i < eq.length; i++) {
		if (eq[i] === '(') depth++;
		else if (eq[i] === ')') depth--;

		if (depth === 0 && '+*^'.indexOf(eq[i]) !== -1) opIndices.push(i);
	}

	let parts = [];
	for (let i = 0; i < opIndices.length; i++) {
		parts.push({ type: 'part', part: eq.substring(i === 0 ? 0 : opIndices[i - 1] + 1, opIndices[i]) });
		parts.push({ type: 'op', op: eq[opIndices[i]] });
	}
	parts.push({ type: 'part', part: eq.substring(opIndices.length > 0 ? (opIndices[opIndices.length - 1] + 1) : 0) });

	if (trace) console.log('starting');
	while (parts.length > 1) {
		opIter:
		for (let op of '^*+'.split('')) {
			for (let i = 0; i < parts.length; i++) {
				if (parts[i].type === 'op' && parts[i].op === op) {
					if (i === 0 || parts[i - 1].type !== 'part' || i === parts.length - 1
						|| parts[i + 1].type !== 'part') throw `Unable to eval ${eq} malformed!`;
					let evaled;
					let part1 = evalEq(parts[i - 1].part!, demographics);
					let part2 = evalEq(parts[i + 1].part!, demographics);
					switch (op) {
						case '+': evaled = part1 + part2; break;
						case '*': evaled = part1 * part2; break;
						case '^': evaled = Math.pow(part1, part2); break;
					}
					parts = [...parts.slice(0, i - 1), { type: 'part', part: evaled!.toString() }, ...parts.slice(i + 2)];
					break opIter;
				}
			}
		}
	}

	// Evaluate part if it is the only one
	let part = parts[0].part!;
	if (part[0] === '(' && part[part.length - 1] === ')')
		return evalEq(part.substring(1, part.length - 1), demographics);
	else if (!isNaN(+part)) return +part;
	else if (part === 'NaN') return +part;
	else {
		if (part.indexOf('[') !== -1 && part[part.length - 1] === ']') {
			return part.substring(part.indexOf('[') + 1, part.length - 1)
					   .split(',')
					   // @ts-ignore
					   .indexOf(demographics[part.substring(0, part.indexOf('['))]) === -1 ? 0 : 1;
		} else {
			return demographics[part as keyof Demographics] as number;
		}
	}
}

export function evaluateEquation(demographics: Demographics, key: string): number | undefined {
	// @ts-ignore
	const eq = config.equations[key]?.find(eq => doesForMatch(demographics, eq.for));
	if (eq === undefined) return undefined;

	return evalEq((eq.equation as string).replaceAll(' ', ''), demographics);
}
