import type { FileResult, SearchGroup } from '~/components/search/types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000/api/v1';
const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

interface SearchApiProduct {
	id: number;
	sku: string;
	name: string;
	web_name?: string;
	slug: string;
	price: string;
	thumbnail_url?: string;
	country_of_manufacture?: string;
	brand_id?: number;
	category_id?: number;
}

interface SearchApiItem {
	score: number;
	product: SearchApiProduct;
}

interface SearchApiResponse {
	query: string;
	total: number;
	took_ms: number;
	items: SearchApiItem[];
}

function mapProductToFileResult(item: SearchApiItem): FileResult {
	const product = item.product;
	return {
		type: 'file',
		id: String(product.id),
		title: product.web_name || product.name,
		creator: product.sku,
		thumbnailUrl: product.thumbnail_url,
		badge: product.country_of_manufacture || undefined
	};
}

export async function searchProducts(query: string, signal?: AbortSignal): Promise<SearchGroup[]> {
	const keyword = query.trim();
	if (!keyword) return [];

	const params = new URLSearchParams({
		q: keyword,
		limit: String(DEFAULT_LIMIT),
		offset: String(DEFAULT_OFFSET)
	});
	const response = await fetch(`${API_BASE_URL}/search?${params.toString()}`, {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		},
		signal
	});

	if (!response.ok) {
		throw new Error(`Search request failed: ${response.status}`);
	}

	const data = (await response.json()) as SearchApiResponse;
	const fileResults = Array.isArray(data.items) ? data.items.map(mapProductToFileResult) : [];

	return [
		{
			label: 'Products',
			type: 'file',
			results: fileResults
		}
	];
}
