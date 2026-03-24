import { cn } from '~/lib/utils';
import type { AnySearchResult, CreatorResult, FileResult, PluginResult, SearchGroup } from './types';

// Deterministic color from string for fallback avatars
const colorCache = new Map<string, string>();

function stringToColor(str: string): string {
	if (colorCache.has(str)) {
		return colorCache.get(str) as string;
	}

	const palette = ['#22c55e', '#3b82f6', '#ef4444', '#f97316', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	const color = palette[Math.abs(hash) % palette.length];
	colorCache.set(str, color);
	return color;
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({ label }: { label: string }) {
	return (
		<span className='shrink-0 rounded-full border border-border/80 bg-muted/50 px-2 py-1 text-[11px] leading-none text-muted-foreground'>
			{label}
		</span>
	);
}

// ─── File result item ─────────────────────────────────────────────────────────

function FileItem({ result, onSelect }: { result: FileResult; onSelect: (r: AnySearchResult) => void }) {
	return (
		<button
			type='button'
			onClick={() => onSelect(result)}
			className='flex min-h-12 w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/70 focus-visible:bg-muted/70 focus-visible:outline-none'
		>
			{/* Thumbnail */}
			<div className='size-15 shrink-0 overflow-hidden rounded-md bg-muted'>
				{result.thumbnailUrl ? (
					<img src={result.thumbnailUrl} alt={result.title} className='size-full object-cover' />
				) : (
					<div className='size-full bg-muted' />
				)}
			</div>

			{/* Text */}
			<div className='min-w-0 flex-1'>
				<p className='truncate text-sm font-medium text-foreground'>{result.title}</p>
				<div className='mt-0.5 flex items-center gap-1.5'>
					{result.creatorAvatarUrl ? (
						<img src={result.creatorAvatarUrl} alt={result.creator} className='size-4 rounded-full object-cover' />
					) : (
						<div
							className='flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white'
							style={{ backgroundColor: stringToColor(result.creator) }}
						>
							{result.creator[0]}
						</div>
					)}
					<p className='truncate text-xs text-muted-foreground'>{result.creator}</p>
				</div>
			</div>

			{result.badge && <Badge label={result.badge} />}
		</button>
	);
}

// ─── Plugin result item ───────────────────────────────────────────────────────

function PluginItem({ result, onSelect }: { result: PluginResult; onSelect: (r: AnySearchResult) => void }) {
	const bg = result.iconBgColor ?? stringToColor(result.title);

	return (
		<button
			type='button'
			onClick={() => onSelect(result)}
			className='flex min-h-12 w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/70 focus-visible:bg-muted/70 focus-visible:outline-none'
		>
			{/* Icon circle */}
			<div
				className='flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white'
				style={{ backgroundColor: bg }}
			>
				{result.iconInitial ?? result.title[0]}
			</div>

			{/* Text */}
			<div className='min-w-0 flex-1'>
				<p className='truncate text-sm font-medium text-foreground'>{result.title}</p>
				<p className='truncate text-xs text-muted-foreground'>{result.creator}</p>
			</div>

			{result.badge && <Badge label={result.badge} />}
		</button>
	);
}

// ─── Creator result row (horizontal) ─────────────────────────────────────────

function CreatorRow({ results, onSelect }: { results: CreatorResult[]; onSelect: (r: AnySearchResult) => void }) {
	return (
		<div className='flex gap-4 overflow-x-auto px-4 py-2 pb-3'>
			{results.map(creator => {
				const bg = creator.avatarBgColor ?? stringToColor(creator.name);
				return (
					<button
						key={creator.id}
						type='button'
						onClick={() => onSelect(creator)}
						className='flex min-w-16 flex-col items-center gap-1 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:opacity-80'
					>
						<div
							className='flex size-12 items-center justify-center rounded-full text-base font-bold text-white'
							style={{ backgroundColor: bg }}
						>
							{creator.name[0]}
						</div>
						<p className='w-full truncate text-center text-xs font-medium text-foreground'>{creator.name}</p>
						<p className='w-full truncate text-center text-[11px] text-muted-foreground'>{creator.handle}</p>
					</button>
				);
			})}
		</div>
	);
}

// ─── Group section ────────────────────────────────────────────────────────────

function GroupSection({ group, onSelect }: { group: SearchGroup; onSelect: (r: AnySearchResult) => void }) {
	return (
		<div>
			<p className='px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground'>
				{group.label}
			</p>

			{group.type === 'creator' ? (
				<CreatorRow results={group.results as CreatorResult[]} onSelect={onSelect} />
			) : (
				<div>
					{group.results.map(result =>
						group.type === 'file' ? (
							<FileItem key={result.id} result={result as FileResult} onSelect={onSelect} />
						) : (
							<PluginItem key={result.id} result={result as PluginResult} onSelect={onSelect} />
						)
					)}
				</div>
			)}
		</div>
	);
}

// ─── Dropdown root ────────────────────────────────────────────────────────────

interface SearchDropdownProps {
	groups: SearchGroup[];
	onSelect: (result: AnySearchResult) => void;
	loading?: boolean;
	isError?: boolean;
	query?: string;
	className?: string;
}

function DropdownStatus({ title, description }: { title: string; description: string }) {
	return (
		<div className='px-5 py-8 text-center'>
			<p className='text-sm font-medium text-foreground'>{title}</p>
			<p className='mt-1 text-xs text-muted-foreground'>{description}</p>
		</div>
	);
}

function DropdownLoadingState() {
	const loadingKeys = ['loading-a', 'loading-b', 'loading-c'];

	return (
		<div className='space-y-2 p-3'>
			{loadingKeys.map(key => (
				<div key={key} className='h-14 animate-pulse rounded-2xl bg-muted/60' />
			))}
		</div>
	);
}

export function SearchDropdown({
	groups,
	onSelect,
	loading = false,
	isError = false,
	query = '',
	className
}: SearchDropdownProps) {
	const totalResults = groups.reduce((count, group) => count + group.results.length, 0);
	const trimmedQuery = query.trim();

	return (
		<div
			role='listbox'
			className={cn(
				// Position
				'absolute left-0 right-0 top-[calc(100%+8px)] z-50',
				// Appearance
				'surface-card overflow-hidden rounded-3xl',
				// Scroll
				'max-h-105 overflow-y-auto',
				// Animation
				'animate-in fade-in-0 slide-in-from-top-2 duration-150',
				className
			)}
		>
			{loading ? <DropdownLoadingState /> : null}

			{!loading && isError ? (
				<DropdownStatus title='Unable to fetch results' description='Please check your connection and try again.' />
			) : null}

			{!loading && !isError && totalResults === 0 ? (
				<DropdownStatus
					title='No matching results'
					description={trimmedQuery ? `No products found for "${trimmedQuery}".` : 'Try another keyword.'}
				/>
			) : null}

			{!loading && !isError && totalResults > 0
				? groups.map((group, i) => (
						<div key={group.label}>
							<GroupSection group={group} onSelect={onSelect} />
							{/* Divider between groups */}
							{i < groups.length - 1 && <div className='mx-4 border-t border-border' />}
						</div>
					))
				: null}
		</div>
	);
}
