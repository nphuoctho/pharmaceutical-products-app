import { useCallback } from 'react';
import { SearchBar } from '~/components/search/search-bar';
import type { AnySearchResult, SearchGroup } from '~/components/search/types';

export function meta() {
	return [
		{ title: 'Pharmaceutical Products' },
		{
			name: 'description',
			content: 'Pharmaceutical products app search engine'
		}
	];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_FILES = [
	{ type: 'file' as const, id: 'f1', title: 'Amoxicillin 500mg Capsules', creator: 'PharmaCorp', badge: 'Rx' },
	{ type: 'file' as const, id: 'f2', title: 'Ibuprofen 400mg Tablets', creator: 'MediLab', badge: 'OTC' },
	{ type: 'file' as const, id: 'f3', title: 'Amoxicillin + Clavulanate 875mg', creator: 'BioPharm', badge: 'Rx' },
	{ type: 'file' as const, id: 'f4', title: 'Paracetamol 500mg', creator: 'HealthGen', badge: 'OTC' },
	{ type: 'file' as const, id: 'f5', title: 'Metformin 850mg', creator: 'PharmaCorp', badge: 'Rx' },
	{ type: 'file' as const, id: 'f6', title: 'Atorvastatin 20mg Tablets', creator: 'CardioLab', badge: 'Rx' },
	{ type: 'file' as const, id: 'f7', title: 'Omeprazole 20mg Capsules', creator: 'GastroPharm', badge: 'OTC' },
	{ type: 'file' as const, id: 'f8', title: 'Lisinopril 10mg Tablets', creator: 'HeartMed', badge: 'Rx' }
];

const MOCK_PLUGINS = [
	{
		type: 'plugin' as const,
		id: 'p1',
		title: 'Antibiotics',
		creator: 'ATC Classification',
		iconBgColor: '#4f46e5',
		iconInitial: 'A',
		badge: 'J01'
	},
	{
		type: 'plugin' as const,
		id: 'p2',
		title: 'Anti-inflammatory',
		creator: 'ATC Classification',
		iconBgColor: '#0891b2',
		iconInitial: 'A',
		badge: 'M01'
	},
	{
		type: 'plugin' as const,
		id: 'p3',
		title: 'Antidiabetics',
		creator: 'ATC Classification',
		iconBgColor: '#059669',
		iconInitial: 'A',
		badge: 'A10'
	},
	{
		type: 'plugin' as const,
		id: 'p4',
		title: 'Analgesics',
		creator: 'ATC Classification',
		iconBgColor: '#dc2626',
		iconInitial: 'A',
		badge: 'N02'
	},
	{
		type: 'plugin' as const,
		id: 'p5',
		title: 'Cardiovascular',
		creator: 'ATC Classification',
		iconBgColor: '#e11d48',
		iconInitial: 'C',
		badge: 'C09'
	}
];

const MOCK_CREATORS = [
	{ type: 'creator' as const, id: 'c1', name: 'Pfizer', handle: '@pfizer', avatarBgColor: '#0066cc' },
	{ type: 'creator' as const, id: 'c2', name: 'Novartis', handle: '@novartis', avatarBgColor: '#e4003a' },
	{ type: 'creator' as const, id: 'c3', name: 'AstraZeneca', handle: '@astrazeneca', avatarBgColor: '#830051' },
	{ type: 'creator' as const, id: 'c4', name: 'Roche', handle: '@roche', avatarBgColor: '#0063a5' },
	{ type: 'creator' as const, id: 'c5', name: 'Sanofi', handle: '@sanofi', avatarBgColor: '#7b2d8b' }
];

// ─── Mock search fn ───────────────────────────────────────────────────────────

async function mockSearch(query: string): Promise<SearchGroup[]> {
	// Simulate network latency
	await new Promise(resolve => setTimeout(resolve, 250));

	const q = query.toLowerCase();

	const files = MOCK_FILES.filter(r => r.title.toLowerCase().includes(q) || r.creator.toLowerCase().includes(q));
	const plugins = MOCK_PLUGINS.filter(r => r.title.toLowerCase().includes(q));
	const creators = MOCK_CREATORS.filter(r => r.name.toLowerCase().includes(q) || r.handle.includes(q));

	const groups: SearchGroup[] = [];
	if (files.length > 0) groups.push({ label: 'Products', type: 'file', results: files });
	if (plugins.length > 0) groups.push({ label: 'Categories', type: 'plugin', results: plugins });
	if (creators.length > 0) groups.push({ label: 'Manufacturers', type: 'creator', results: creators });

	return groups;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
	const handleSelect = useCallback((result: AnySearchResult) => {
		// Handle navigation or action on select
		console.info('Selected:', result);
	}, []);

	return (
		<main className='flex flex-col items-center justify-center px-4'>
			<div className='w-full max-w-2xl space-y-8'>
				{/* Hero */}
				<div className='space-y-2 text-center'>
					<h1 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
						Discover pharmaceutical <span className='text-muted-foreground font-normal'>products,</span>
					</h1>
					<p className='text-2xl text-muted-foreground sm:text-3xl'>
						<span className='text-muted-foreground/60'>categories, manufacturers,</span>{' '}
						<span className='font-bold text-foreground'>and more</span>
					</p>
				</div>

				{/* Search */}
				<SearchBar
					placeholder='Search for resources like "amoxicillin"'
					onSearch={mockSearch}
					onSelect={handleSelect}
					debounceMs={250}
				/>
			</div>
		</main>
	);
}
