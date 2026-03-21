import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import Header from '~/components/header';
import { ThemeProvider } from '~/store/theme';
import type { Route } from './+types/root';
import './app.css';

import ibmPlexSansUrl from '@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2?url';

const themeInitScript =
	'!function(){try{const e=localStorage.getItem("theme"),t=window.matchMedia("(prefers-color-scheme: dark)").matches;"dark"===e||!e&&t?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")}catch(e){}}();';

export const links: Route.LinksFunction = () => [
	{
		rel: 'preload',
		href: ibmPlexSansUrl,
		as: 'font',
		type: 'font/woff2',
		crossOrigin: 'anonymous'
	}
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				{/** biome-ignore lint/security/noDangerouslySetInnerHtml: Becuase theme initialization script runs before the browser paints. */}
				<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' type='image/svg+xml' href='/favicon.svg' />
				<Meta />
				<Links />
			</head>
			<body>
				<ThemeProvider>
					<Header />
					<div className='mx-auto px-4 sm:px-5 md:px-6 max-w-7xl py-6 sm:py-8'>{children}</div>
					<ScrollRestoration />
					<Scripts />
				</ThemeProvider>
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = 'Oops!';
	let details = 'An unexpected error occurred.';
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? '404' : 'Error';
		details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className='min-h-screen flex items-center justify-center'>
			<div className='flex flex-col gap-2 items-center'>
				<h1 className='text-404 text-stroke'>{message}</h1>
				<p>{details}</p>
				{stack && (
					<pre className='w-full p-4 overflow-x-auto'>
						<code>{stack}</code>
					</pre>
				)}
			</div>
		</main>
	);
}
