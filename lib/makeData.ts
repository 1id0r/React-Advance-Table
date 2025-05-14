import { faker } from "@faker-js/faker";

export type Alert = {
	id?: string;
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
	subRows?: Alert[];
};

const range = (len: number) => {
    const arr: number[] = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr;
};

const newAlert = (): Alert => {
	return {
		objectName: faker.commerce.productName(),
		description: faker.lorem.sentence(),
		severity: faker.helpers.shuffle<Alert['severity']>(['Critical', 'Warning', 'Major'])[0]!,
		hierarchy: faker.commerce.department(),
		lastUpdated: faker.date.recent(),
		startDate: faker.date.past(),
		status: faker.helpers.shuffle<Alert['status']>(['Open', 'Closed', 'In Progress', 'Resolved'])[0]!,
		impact: faker.company.buzzPhrase(),
		origin: faker.location.city(),
		snId: faker.string.alphanumeric(10),
		environment: faker.helpers.shuffle<Alert['environment']>(['Production', 'Staging', 'Development', 'QA'])[0]!,
	};
};

export function makeData(...lens: number[]) {
    const makeDataLevel = (depth = 0): Alert[] => {
        const len = lens[depth]!;
        return range(len).map((d): Alert => {
            return {
                ...newAlert(),
                subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
            };
        });
    };

    return makeDataLevel();
}