import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import type { SearchGroup } from '~/components/search/types';

interface UseSearchOptions {
	onSearch: (query: string, signal?: AbortSignal) => Promise<SearchGroup[]> | SearchGroup[];
	debounceMs?: number;
}

interface UseSearchReturn {
	query: string;
	setQuery: (q: string) => void;
	groups: SearchGroup[];
	isLoading: boolean;
	isError: boolean;
	hasQuery: boolean;
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	clearSearch: () => void;
}

export function useSearch({ onSearch, debounceMs = 300 }: UseSearchOptions): UseSearchReturn {
	const [searchState, setSearchState] = useState({
		query: '',
		debouncedQuery: '',
		isOpen: false
	});

	const setQuery = useCallback((q: string) => {
		setSearchState(prev => {
			if (prev.query === q) return prev;
			return { ...prev, query: q };
		});
	}, []);

	const setIsOpen = useCallback((open: boolean) => {
		setSearchState(prev => {
			if (prev.isOpen === open) return prev;
			return { ...prev, isOpen: open };
		});
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setSearchState(prev => {
				const nextDebounced = prev.query.trim();
				if (prev.debouncedQuery === nextDebounced) return prev;
				return { ...prev, debouncedQuery: nextDebounced };
			});
		}, debounceMs);

		return () => clearTimeout(timer);
	}, [searchState.query, debounceMs]);

	const {
		data = [],
		isFetching,
		isError
	} = useQuery({
		queryKey: ['search', searchState.debouncedQuery],
		queryFn: ({ signal }) => onSearch(searchState.debouncedQuery, signal),
		enabled: searchState.debouncedQuery.length > 0,
		staleTime: 30_000,
		gcTime: 5 * 60_000
	});

	const groups = data.filter(group => group.results.length > 0);
	const isLoading = isFetching;
	const hasQuery = searchState.debouncedQuery.length > 0;

	useEffect(() => {
		setSearchState(prev => {
			if (!prev.debouncedQuery) {
				if (!prev.isOpen) return prev;
				return { ...prev, isOpen: false };
			}

			const nextIsOpen = isLoading || isError || groups.length > 0;
			if (prev.isOpen === nextIsOpen) return prev;
			return { ...prev, isOpen: nextIsOpen };
		});
	}, [searchState.debouncedQuery, groups.length, isLoading, isError]);

	const clearSearch = useCallback(() => {
		setSearchState({
			query: '',
			debouncedQuery: '',
			isOpen: false
		});
	}, []);

	return {
		query: searchState.query,
		setQuery,
		groups,
		isLoading,
		isError,
		hasQuery,
		isOpen: searchState.isOpen,
		setIsOpen,
		clearSearch
	};
}
