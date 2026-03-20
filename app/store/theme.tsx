import { createContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	resolvedTheme: 'light' | 'dark';
}

const getResolvedTheme = (theme: Theme): 'light' | 'dark' => {
	if (theme === 'system') {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	return theme;
};

export const ThemeContext = createContext<ThemeContextValue>({
	theme: 'system',
	setTheme: () => {},
	resolvedTheme: 'light'
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>('system');
	const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

	useEffect(() => {
		const stored = (localStorage.getItem('theme') as Theme) ?? 'system';
		setThemeState(stored);
		setResolvedTheme(getResolvedTheme(stored));
	}, []);

	useEffect(() => {
		if (theme !== 'system') return;

		const mql = window.matchMedia('(prefers-color-scheme: dark)');
		const handler = (e: MediaQueryListEvent) => {
			const resolved = e.matches ? 'dark' : 'light';
			setResolvedTheme(resolved);
			document.documentElement.classList.toggle('dark', e.matches);
		};

		mql.addEventListener('change', handler);
		return () => mql.removeEventListener('change', handler);
	}, [theme]);

	const setTheme = (newTheme: Theme) => {
		const resolved = getResolvedTheme(newTheme);

		localStorage.setItem('theme', newTheme);
		document.documentElement.classList.toggle('dark', resolved === 'dark');

		setThemeState(newTheme);
		setResolvedTheme(resolved);
	};

	return <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>{children}</ThemeContext.Provider>;
}
