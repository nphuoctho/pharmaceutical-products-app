import { cn } from '~/lib/utils';
import type { AnySearchResult, CreatorResult, FileResult, PluginResult, SearchGroup } from './types';

// Deterministic color from string for fallback avatars
function stringToColor(str: string): string {
	const palette = ['#22c55e', '#3b82f6', '#ef4444', '#f97316', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return palette[Math.abs(hash) % palette.length];
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({ label }: { label: string }) {
	return (
		<span className='shrink-0 rounded border border-border px-1.5 py-0.5 text-[11px] leading-none text-muted-foreground'>
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
			className='flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none'
		>
			{/* Thumbnail */}
			<div className='size-[60px] shrink-0 overflow-hidden rounded-md bg-muted'>
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
			className='flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none'
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
						className='flex min-w-[64px] flex-col items-center gap-1 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:opacity-80'
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
	className?: string;
}

export function SearchDropdown({ groups, onSelect, className }: SearchDropdownProps) {
	return (
		<div
			role='listbox'
			className={cn(
				// Position
				'absolute left-0 right-0 top-[calc(100%+4px)] z-50',
				// Appearance
				'overflow-hidden rounded-2xl border border-border bg-background shadow-lg shadow-black/10',
				// Scroll
				'max-h-[420px] overflow-y-auto',
				// Animation
				'animate-in fade-in-0 slide-in-from-top-2 duration-150',
				className
			)}
		>
			{groups.map((group, i) => (
				<div key={group.label}>
					<GroupSection group={group} onSelect={onSelect} />
					{/* Divider between groups */}
					{i < groups.length - 1 && <div className='mx-4 border-t border-border' />}
				</div>
			))}
		</div>
	);
}
