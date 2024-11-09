import axios from 'axios';

interface Workplace {
    id: string;
    name: string;
    shifts: number;
}

const API_BASE_URL = 'http://localhost:3000';

async function fetchWorkplaces(): Promise<Workplace[]> {
    try {
        const response = await axios.get(`${API_BASE_URL}/workplaces`);
        return response.data.data.map((workplace: any) => ({
            id: workplace.id,
            name: workplace.name,
            shifts: 0,
        }));
    } catch (error) {
        console.error("Error fetching workplaces:", error);
        return [];
    }
}

async function fetchShifts(): Promise<any[]> {
    try {
        const response = await axios.get(`${API_BASE_URL}/shifts`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching shifts:", error);
        return [];
    }
}

async function getTopWorkplaces() {
    const workplaces = await fetchWorkplaces();
    const shifts = await fetchShifts();

    const shiftCountByWorkplace: { [key: string]: number } = {};

    shifts.forEach(shift => {
        const workplaceId = shift.workplaceId;
        if (workplaceId) {
            if (!shiftCountByWorkplace[workplaceId]) {
                shiftCountByWorkplace[workplaceId] = 0;
            }
            shiftCountByWorkplace[workplaceId]++;
        }
    });

    workplaces.forEach(workplace => {
        workplace.shifts = shiftCountByWorkplace[workplace.id] || 0;
    });

    const topWorkplaces = workplaces
        .sort((a, b) => b.shifts - a.shifts)
        .map(workplace => ({
            name: workplace.name,
            shifts: workplace.shifts,
        }));

    const formattedOutput = topWorkplaces
        .map(workplace =>
            `  { "name": "${workplace.name}", "shifts": ${workplace.shifts} }`
        )
        .join(",\n");

    console.log(`[\n${formattedOutput}\n]`);

}
getTopWorkplaces();