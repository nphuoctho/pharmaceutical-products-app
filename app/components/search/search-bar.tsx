import { RiCloseLine, RiSearchLine } from '@remixicon/react';
import { useCallback, useEffect, useRef } from 'react';
import { useSearch } from '~/hooks/use-search';
import { cn } from '~/lib/utils';
import { SearchDropdown } from './search-dropdown';
import type { AnySearchResult, SearchGroup } from './types';

interface SearchBarProps {
	placeholder?: string;
	onSearch: (query: string) => Promise<SearchGroup[]> | SearchGroup[];
	onSelect?: (result: AnySearchResult) => void;
	debounceMs?: number;
	className?: string;
}

export function SearchBar({
	placeholder = 'Search...',
	onSearch,
	onSelect,
	debounceMs = 300,
	className
}: SearchBarProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const { query, setQuery, groups, isLoading, isOpen, setIsOpen, clearSearch } = useSearch({
		onSearch,
		debounceMs
	});

	// Close dropdown on outside click
	useEffect(() => {
		const handlePointerDown = (e: PointerEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('pointerdown', handlePointerDown);
		return () => document.removeEventListener('pointerdown', handlePointerDown);
	}, [setIsOpen]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Escape') {
				setIsOpen(false);
				inputRef.current?.blur();
			}
		},
		[setIsOpen]
	);

	const handleFocus = useCallback(() => {
		if (groups.length > 0) setIsOpen(true);
	}, [groups.length, setIsOpen]);

	const handleSelect = useCallback(
		(result: AnySearchResult) => {
			setIsOpen(false);
			onSelect?.(result);
		},
		[setIsOpen, onSelect]
	);

	const isFocused = isOpen || (query.length > 0 && isLoading);

	return (
		<div ref={containerRef} className={cn('relative w-full', className)}>
			{/* Input wrapper */}
			<div
				className={cn(
					'flex items-center gap-2.5 rounded-full border bg-background px-4 py-2.5',
					'transition-all duration-200',
					// Default
					'border-border',
					// Focused / active state
					isFocused ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'
				)}
			>
				<RiSearchLine
					className={cn(
						'size-4 shrink-0 transition-colors duration-200',
						isFocused ? 'text-primary' : 'text-muted-foreground'
					)}
				/>

				<input
					ref={inputRef}
					type='text'
					role='combobox'
					aria-expanded={isOpen}
					aria-autocomplete='list'
					autoComplete='off'
					value={query}
					onChange={e => setQuery(e.target.value)}
					onKeyDown={handleKeyDown}
					onFocus={handleFocus}
					placeholder={placeholder}
					className='flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground'
				/>

				{/* Clear button */}
				{query && !isLoading && (
					<button
						type='button'
						onClick={clearSearch}
						aria-label='Clear search'
						className='shrink-0 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
					>
						<RiCloseLine className='size-4' />
					</button>
				)}

				{/* Loading spinner */}
				{isLoading && (
					<div
						aria-hidden='true'
						className='size-4 shrink-0 animate-spin rounded-full border-2 border-muted border-t-primary'
					/>
				)}
			</div>

			{/* Dropdown */}
			{isOpen && groups.length > 0 && <SearchDropdown groups={groups} onSelect={handleSelect} />}
		</div>
	);
}
