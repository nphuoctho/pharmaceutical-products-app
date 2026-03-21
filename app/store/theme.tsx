import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
	theme: Theme;
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
	theme: 'system',
	resolvedTheme: 'light',
	setTheme: () => {}
});

const resolveTheme = (theme: Theme): ResolvedTheme => {
	if (theme !== 'system') return theme;
	if (typeof window === 'undefined') return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const readStoredTheme = (): Theme => {
	if (typeof window === 'undefined') return 'system';
	return (localStorage.getItem('theme') as Theme) ?? 'system';
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>(readStoredTheme);
	const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(readStoredTheme()));

	useEffect(() => {
		if (theme !== 'system') return;

		const mql = window.matchMedia('(prefers-color-scheme: dark)');
		const handler = (e: MediaQueryListEvent) => {
			const resolved: ResolvedTheme = e.matches ? 'dark' : 'light';
			setResolvedTheme(resolved);
			document.documentElement.classList.toggle('dark', e.matches);
		};
		mql.addEventListener('change', handler);

		return () => mql.removeEventListener('change', handler);
	}, [theme]);

	const setTheme = useCallback((next: Theme) => {
		const resolved = resolveTheme(next);
		localStorage.setItem('theme', next);
		document.documentElement.classList.toggle('dark', resolved === 'dark');
		setThemeState(next);
		setResolvedTheme(resolved);
	}, []);

	const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
