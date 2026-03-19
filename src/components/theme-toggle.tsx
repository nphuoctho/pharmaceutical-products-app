import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';

function getModeFromDocument(): ThemeMode | null {
	if (typeof document === 'undefined') {
		return null;
	}

	const attr = document.documentElement.getAttribute('data-theme');
	if (attr === 'light' || attr === 'dark') {
		return attr;
	}

	if (document.documentElement.classList.contains('dark')) {
		return 'dark';
	}

	if (document.documentElement.classList.contains('light')) {
		return 'light';
	}

	return null;
}

function getInitialMode(): ThemeMode {
	if (typeof window === 'undefined') {
		return 'light';
	}

	const domMode = getModeFromDocument();
	if (domMode) {
		return domMode;
	}

	const stored = window.localStorage.getItem('theme');
	if (stored === 'light' || stored === 'dark') {
		return stored;
	}

	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
}

function applyThemeMode(mode: ThemeMode) {
	document.documentElement.classList.remove('light', 'dark');
	document.documentElement.classList.add(mode);
	document.documentElement.setAttribute('data-theme', mode);

	document.documentElement.style.colorScheme = mode;
}

export default function ThemeToggle() {
	const [mode, setMode] = useState<ThemeMode>('light');
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const initialMode = getInitialMode();
		setMode(initialMode);
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) {
			return;
		}

		applyThemeMode(mode);
	}, [mode, mounted]);

	function toggleMode() {
		const nextMode: ThemeMode = mode === 'light' ? 'dark' : 'light';
		setMode(nextMode);
		window.localStorage.setItem('theme', nextMode);
	}

	const label = `Theme mode: ${mode}. Click to switch to ${mode === 'light' ? 'dark' : 'light'} mode.`;

	return (
		<button
			type="button"
			onClick={toggleMode}
			aria-label={label}
			title={label}
			className="group relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[--chip-line] bg-[--chip-bg] text-[--sea-ink] shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition-all duration-300 ease-out hover:scale-[1.03] hover:border-[rgba(79,184,178,0.55)] hover:shadow-[0_14px_30px_rgba(30,90,72,0.16)] active:translate-y-0 active:scale-100"
		>
			<span
				className={`relative h-4 w-4 transition-all duration-200 group-hover:scale-110 ${mounted ? 'opacity-100' : 'opacity-0'}`}
			>
				<Sun
					aria-hidden="true"
					size={16}
					className={`absolute inset-0 transition-all duration-300 ease-out ${
						mode === 'light'
							? 'rotate-0 scale-100 opacity-100'
							: 'rotate-90 scale-0 opacity-0'
					}`}
				/>
				<Moon
					aria-hidden="true"
					size={16}
					className={`absolute inset-0 transition-all duration-300 ease-out ${
						mode === 'dark'
							? 'rotate-0 scale-100 opacity-100'
							: '-rotate-90 scale-0 opacity-0'
					}`}
				/>
			</span>
		</button>
	);
}
