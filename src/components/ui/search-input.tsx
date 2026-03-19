import { X } from 'lucide-react';
import { useRef, useState } from 'react';

const SearchInput = () => {
	const [query, setQuery] = useState('');
	const searchRef = useRef<HTMLDivElement>(null);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
	};

	const handleClear = () => {
		setQuery('');
	};

	return (
		<div ref={searchRef} className="group relative z-0 mx-auto w-full md:w-170">
			<div className="rounded-full border border-(--chip-line) bg-(--chip-bg) px-4 py-3 transition-all duration-300 group-hover:border-[color-mix(in_oklab,var(--lagoon-deep)_30%,var(--chip-line))] group-focus-within:border-[color-mix(in_oklab,var(--lagoon-deep)_52%,var(--chip-line))]">
				<form
					className="relative flex w-full items-center gap-1"
					onSubmit={(e) => e.preventDefault()}
				>
					<input
						type="text"
						name="search"
						value={query}
						autoComplete="off"
						onChange={handleSearch}
						className="w-full bg-transparent text-sm font-medium text-(--sea-ink) caret-(--lagoon-deep) truncate outline-none placeholder:text-(--sea-ink-soft) md:text-base"
						placeholder="Tìm tên thuốc, bệnh lý, TPCN..."
						aria-label="Tìm kiếm sản phẩm dược"
					/>

					<button
						type="button"
						onClick={handleClear}
						className={`grid size-5 place-items-center rounded-full text-white transition-all duration-200 bg-neutral-500  ${
							query
								? 'pointer-events-auto scale-100 opacity-100 hover:bg-(--link-bg-hover) hover:text-(--sea-ink) border border-(--chip-line)'
								: 'pointer-events-none scale-90 opacity-0'
						}`}
						aria-label="Xóa nội dung tìm kiếm"
					>
						<X size={12} />
					</button>
				</form>
			</div>
		</div>
	);
};

export default SearchInput;
