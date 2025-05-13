import { faker } from "@faker-js/faker";

export type Person = {
	objectName: string;
	description: string;
	severity: 'Critical' | 'Warning' | 'Major';
	hierarchy: string;
	lastUpdated: Date;
	startDate: Date;
	status: 'Open' | 'Closed' | 'In Progress' | 'Resolved';
	impact: string;
	origin: string;
	snId: string;
	environment: 'Production' | 'Staging' | 'Development' | 'QA';
	subRows?: Person[];
};

const range = (len: number) => {
    const arr: number[] = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr;
};

const newPerson = (): Person => {
	return {
		objectName: faker.commerce.productName(),
		description: faker.lorem.sentence(),
		severity: faker.helpers.shuffle<Person['severity']>(['Critical', 'Warning', 'Major'])[0]!,
		hierarchy: faker.commerce.department(),
		lastUpdated: faker.date.recent(),
		startDate: faker.date.past(),
		status: faker.helpers.shuffle<Person['status']>(['Open', 'Closed', 'In Progress', 'Resolved'])[0]!,
		impact: faker.company.buzzPhrase(),
		origin: faker.location.city(),
		snId: faker.string.alphanumeric(10),
		environment: faker.helpers.shuffle<Person['environment']>(['Production', 'Staging', 'Development', 'QA'])[0]!,
	};
};

export function makeData(...lens: number[]) {
    const makeDataLevel = (depth = 0): Person[] => {
        const len = lens[depth]!;
        return range(len).map((d): Person => {
            return {
                ...newPerson(),
                subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
            };
        });
    };

    return makeDataLevel();
}