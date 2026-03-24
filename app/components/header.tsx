import { Link } from 'react-router';
import Image from '~/components/image';
import { ThemeToggle } from '~/components/theme-toggle';

const Header = () => {
	return (
		<header className='sticky top-0 z-50 border-b border-border/70 bg-background/82 px-4 py-3 backdrop-blur-xl sm:px-10'>
			<div className='mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4'>
				<Link to='/'>
					<div className='group flex items-center gap-3'>
						<div className='flex size-10 items-center justify-center rounded-2xl border border-border/70 bg-card shadow-sm'>
							<Image src='/favicon.svg' alt='logo' className='size-6 rounded-full' />
						</div>
						<div className='leading-tight'>
							<p className='text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground'>Catalog</p>
							<h2 className='font-heading text-base font-semibold text-foreground transition-colors group-hover:text-primary sm:text-lg'>
								Pharmaceutical Research
							</h2>
						</div>
					</div>
				</Link>

				<ThemeToggle />
			</div>
		</header>
	);
};

export default Header;
