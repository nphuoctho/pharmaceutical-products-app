export interface FileResult {
	type: 'file';
	id: string;
	title: string;
	creator: string;
	creatorAvatarUrl?: string;
	thumbnailUrl?: string;
	badge?: string;
}

export interface PluginResult {
	type: 'plugin';
	id: string;
	title: string;
	creator: string;
	iconBgColor?: string;
	iconInitial?: string;
	badge?: string;
}

export interface CreatorResult {
	type: 'creator';
	id: string;
	name: string;
	handle: string;
	avatarBgColor?: string;
}

export type AnySearchResult = FileResult | PluginResult | CreatorResult;

export interface SearchGroup {
	label: string;
	type: 'file' | 'plugin' | 'creator';
	results: AnySearchResult[];
}
