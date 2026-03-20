import { Link } from 'react-router';
import { ThemeToggle } from '~/components/theme-toggle';

const Header = () => {
	return (
		<header className='flex border-b border-gray-300 dark:border-gray-700 py-3 px-4 sm:px-10 bg-white dark:bg-gray-900 min-h-16.25 tracking-wide relative z-50'>
			<div className='flex flex-wrap items-center justify-between gap-4 mx-auto w-full'>
				<Link to='/'>
					<div className='flex items-center space-x-4'>
						<img src='/favicon.svg' alt='logo' className='size-10 rounded-full' />
						<h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Pharmaceutical Research</h2>
					</div>
				</Link>

				<ThemeToggle />
			</div>
		</header>
	);
};

export default Header;
