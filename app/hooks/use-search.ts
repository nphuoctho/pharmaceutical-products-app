import { useCallback, useEffect, useRef, useState } from 'react';
import type { SearchGroup } from '~/components/search/types';

interface UseSearchOptions {
	onSearch: (query: string) => Promise<SearchGroup[]> | SearchGroup[];
	debounceMs?: number;
}

interface UseSearchReturn {
	query: string;
	setQuery: (q: string) => void;
	groups: SearchGroup[];
	isLoading: boolean;
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	clearSearch: () => void;
}

export function useSearch({ onSearch, debounceMs = 300 }: UseSearchOptions): UseSearchReturn {
	const [query, setQuery] = useState('');
	const [groups, setGroups] = useState<SearchGroup[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	// Stable ref so the debounce effect doesn't need onSearch as dep
	const onSearchRef = useRef(onSearch);
	useEffect(() => {
		onSearchRef.current = onSearch;
	});

	useEffect(() => {
		if (!query.trim()) {
			setGroups([]);
			setIsOpen(false);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		const timer = setTimeout(async () => {
			try {
				const data = await onSearchRef.current(query);
				const nonEmpty = data.filter(g => g.results.length > 0);
				setGroups(nonEmpty);
				setIsOpen(nonEmpty.length > 0);
			} catch {
				setGroups([]);
				setIsOpen(false);
			} finally {
				setIsLoading(false);
			}
		}, debounceMs);

		return () => clearTimeout(timer);
	}, [query, debounceMs]);

	const clearSearch = useCallback(() => {
		setQuery('');
		setGroups([]);
		setIsOpen(false);
		setIsLoading(false);
	}, []);

	return { query, setQuery, groups, isLoading, isOpen, setIsOpen, clearSearch };
}
