// app/components/image.tsx
import type { FC } from 'react';
import { cn } from '~/lib/utils';

interface ImageProps {
	src: string;
	alt: string;
	aspectRatio?: string;
	priority?: boolean;
	className?: string;
}

const Image: FC<ImageProps> = ({ src, alt, aspectRatio = '1/1', priority = false, className }) => {
	return (
		<div style={{ aspectRatio }} className='overflow-hidden'>
			<img
				src={src}
				alt={alt}
				loading={priority ? 'eager' : 'lazy'}
				decoding={priority ? 'sync' : 'async'}
				fetchPriority={priority ? 'high' : 'auto'}
				onError={e => {
					e.currentTarget.src = '/placeholder.svg';
				}}
				className={cn('w-full h-full object-cover', className)}
			/>
		</div>
	);
};

export default Image;
