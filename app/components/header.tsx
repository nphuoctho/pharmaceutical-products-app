import { Link } from 'react-router';
import Image from '~/components/image';
import { ThemeToggle } from '~/components/theme-toggle';

const Header = () => {
	return (
		<header className='sticky flex border-b py-3 px-4 sm:px-10 tracking-wide z-50'>
			<div className='flex flex-wrap items-center justify-between gap-4 mx-auto w-full'>
				<Link to='/'>
					<div className='flex items-center space-x-4'>
						<Image src='/favicon.svg' alt='logo' className='size-8 rounded-full' />
						<h2 className='text-md font-semibold text-gray-900 dark:text-gray-100 font-heading'>
							Pharmaceutical Research
						</h2>
					</div>
				</Link>

				<ThemeToggle />
			</div>
		</header>
	);
};

export default Header;
