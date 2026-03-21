import { Button } from '~/components/ui/button';

export function meta() {
	return [
		{ title: 'Pharmaceutical Products' },
		{
			name: 'description',
			content: 'Pharmaceutical products app search engine'
		}
	];
}

export default function Home() {
	return (
		<>
			<h1>Nguyễn Phước Thọ</h1>

			<Button>Click Me</Button>
		</>
	);
}
