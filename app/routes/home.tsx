import { Suspense, useCallback, useRef } from 'react';
import { SearchBar, type SearchBarHandle } from '~/components/search/search-bar';
import type { AnySearchResult } from '~/components/search/types';
import { searchProducts } from '~/lib/search-api';

const searchFallback = (
	<div className='h-12 w-full animate-pulse rounded-full border border-border bg-muted/50' aria-hidden='true' />
);

export function meta() {
	return [
		{ title: 'Pharmaceutical Products' },
		{
			name: 'description',
			content: 'Pharmaceutical products app search engine'
		}
	];
}

export default function Home() {
	const searchBarRef = useRef<SearchBarHandle>(null);

	const handleSelect = useCallback((result: AnySearchResult) => {
		// Handle navigation or action on select
		console.info('Selected:', result);
	}, []);

	const handleSuggestionClick = useCallback((value: string) => {
		searchBarRef.current?.setQuery(value);
		searchBarRef.current?.focus();
	}, []);

	return (
		<main className='relative flex min-h-[100svh] items-center px-3 py-10 sm:px-4'>
			<div
				aria-hidden='true'
				className='soft-grid pointer-events-none absolute inset-x-0 top-8 mx-auto h-[32rem] w-full max-w-6xl'
			/>

			<section className='motion-enter relative mx-auto w-full max-w-4xl'>
				<div className='surface-card relative overflow-visible rounded-[2rem] p-5 sm:p-8'>
					<div
						aria-hidden='true'
						className='pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full bg-primary/15 blur-3xl'
					/>

					<div className='relative space-y-7'>
						<div className='space-y-4 text-center'>
							<span className='chip'>AI-Assisted Product Discovery</span>
							<h1 className='text-balance font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-5xl'>
								Find the right pharmaceutical product in seconds
							</h1>
							<p className='mx-auto max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base'>
								Search across medicines, categories, and manufacturers with fast suggestions and precise results.
							</p>
						</div>

						<div className='mx-auto w-full max-w-2xl space-y-3'>
							<Suspense fallback={searchFallback}>
								<SearchBar
									ref={searchBarRef}
									placeholder='Try: amoxicillin 500mg, metformin, paracetamol...'
									onSearch={searchProducts}
									onSelect={handleSelect}
									debounceMs={250}
								/>
							</Suspense>

							<div className='flex flex-wrap gap-2'>
								<button type='button' className='chip' onClick={() => handleSuggestionClick('amoxicillin')}>
									amoxicillin
								</button>
								<button type='button' className='chip' onClick={() => handleSuggestionClick('ibuprofen')}>
									ibuprofen
								</button>
								<button type='button' className='chip' onClick={() => handleSuggestionClick('metformin')}>
									metformin
								</button>
								<button type='button' className='chip' onClick={() => handleSuggestionClick('atorvastatin')}>
									atorvastatin
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
