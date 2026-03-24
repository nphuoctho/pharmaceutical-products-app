import { Search, X } from 'lucide-react';
import {
	forwardRef,
	type KeyboardEvent,
	memo,
	useCallback,
	useEffect,
	useId,
	useImperativeHandle,
	useRef,
	useTransition
} from 'react';
import { useSearch } from '~/hooks/use-search';
import { cn } from '~/lib/utils';
import { SearchDropdown } from './search-dropdown';
import type { AnySearchResult, SearchGroup } from './types';

const spinnerClassName = 'size-4 shrink-0 animate-spin rounded-full border-2 border-muted border-t-primary';

const ClearSearchButton = memo(function ClearSearchButton({ onClear }: { onClear: () => void }) {
	return (
		<button
			type='button'
			onClick={onClear}
			aria-label='Clear search'
			className='grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30'
		>
			<X className='size-4' />
		</button>
	);
});

interface SearchBarProps {
	placeholder?: string;
	onSearch: (query: string, signal?: AbortSignal) => Promise<SearchGroup[]> | SearchGroup[];
	onSelect?: (result: AnySearchResult) => void;
	debounceMs?: number;
	className?: string;
}

export interface SearchBarHandle {
	setQuery: (value: string) => void;
	focus: () => void;
}

export const SearchBar = forwardRef<SearchBarHandle, SearchBarProps>(function SearchBar(
	{ placeholder = 'Search...', onSearch, onSelect, debounceMs = 300, className }: SearchBarProps,
	ref
) {
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const onPointerDownRef = useRef<(event: PointerEvent) => void>(() => {});
	const inputId = useId();
	const [isPending, startTransition] = useTransition();

	const { query, setQuery, groups, isLoading, isError, hasQuery, isOpen, setIsOpen, clearSearch } = useSearch({
		onSearch,
		debounceMs
	});

	useEffect(() => {
		onPointerDownRef.current = event => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				startTransition(() => {
					setIsOpen(false);
				});
			}
		};
	}, [setIsOpen, startTransition]);

	// Close dropdown on outside click with one listener attachment.
	useEffect(() => {
		const handler = (event: PointerEvent) => onPointerDownRef.current(event);
		document.addEventListener('pointerdown', handler);
		return () => document.removeEventListener('pointerdown', handler);
	}, []);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Escape') {
				startTransition(() => {
					setIsOpen(false);
				});
				inputRef.current?.blur();
			}
		},
		[setIsOpen, startTransition]
	);

	const handleFocus = useCallback(() => {
		if (groups.length > 0) {
			startTransition(() => {
				setIsOpen(true);
			});
		}
	}, [groups.length, setIsOpen, startTransition]);

	const handleSelect = useCallback(
		(result: AnySearchResult) => {
			startTransition(() => {
				setIsOpen(false);
			});
			onSelect?.(result);
		},
		[setIsOpen, onSelect, startTransition]
	);

	const isBusy = isLoading || isPending;
	const isFocused = isOpen || (query.length > 0 && isBusy);
	const showDropdown = hasQuery && (isOpen || isBusy);

	useImperativeHandle(
		ref,
		() => ({
			setQuery: value => {
				setQuery(value);
			},
			focus: () => {
				inputRef.current?.focus();
			}
		}),
		[setQuery]
	);

	return (
		<div ref={containerRef} className={cn('relative w-full', className)}>
			<p className='sr-only' aria-live='polite'>
				{isBusy
					? 'Searching products'
					: isError
						? 'Search failed'
						: hasQuery
							? `${groups.reduce((count, group) => count + group.results.length, 0)} results`
							: 'Type to search'}
			</p>

			{/* Input wrapper */}
			<div
				className={cn(
					'surface-card flex min-h-14 items-center gap-2 rounded-full px-3 py-1.5 sm:px-4',
					'transition-all duration-200',
					isFocused ? 'border-primary/65 ring-4 ring-primary/12' : 'hover:border-primary/45'
				)}
			>
				<label htmlFor={inputId} className='flex min-w-0 flex-1 cursor-text items-center gap-2'>
					<Search
						className={cn(
							'size-5 shrink-0 transition-colors duration-200',
							isFocused ? 'text-primary' : 'text-muted-foreground'
						)}
					/>

					<input
						id={inputId}
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
						className='flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground sm:text-base'
					/>
				</label>

				{/* Clear button */}
				{query && !isBusy ? <ClearSearchButton onClear={clearSearch} /> : null}

				{/* Loading spinner */}
				{isBusy ? <div aria-hidden='true' className={spinnerClassName} /> : null}
			</div>

			{/* Dropdown */}
			{showDropdown ? (
				<SearchDropdown groups={groups} onSelect={handleSelect} loading={isBusy} isError={isError} query={query} />
			) : null}
		</div>
	);
});
