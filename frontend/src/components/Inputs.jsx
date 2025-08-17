import {
	ArrowDownNarrowWide,
	ArrowDownWideNarrow,
	ArrowRight,
	ChevronsUpDown,
	Funnel,
	SearchIcon,
} from 'lucide-react'
import { useState } from 'react'

export const Input = ({ type, placeholder }) => {
	return (
		<>
			<div className='flex flex-col items-center group'>
				<input
					type={type}
					placeholder={placeholder}
					className='w-full outline-0 pb-4 pt-1 px-8 text-2xl placeholder:text-[var(--ghost-orange)]'
				/>
				<div className='bg-[var(--deepdark-yellow)] group-focus-within:w-full w-0 h-[2px] transition-all'></div>
				<div className='bg-[var(--deepdark-yellow)] w-full h-[1px]'></div>
			</div>
		</>
	)
}

export const SearchDefault = ({ width = 'fit-content' }) => {
	return (
		<div
			className={` bg-[var(--ghost-black)] text-[var(--light-ghost-black)] focus-within:outline-3 outline-[var(--primary)] rounded-lg pr-2 flex items-center gap-6 transition-all py-4 px-6`}
			style={{ width: width }}
		>
			<SearchIcon size={36} />

			<input
				type='text'
				placeholder='Поиск'
				className='outline-0 text-xl bg-transparent'
			/>
		</div>
	)
}

export const Option = ({ options, selectedValue, onSelect }) => {
	const [isOpen, setIsOpen] = useState(false)

	// Находим выбранный элемент для отображения
	const selectedOption = options.find(opt => opt.value === selectedValue)

	return (
		<div className='relative inline-block w-75 select-none'>
			<div
				className={`flex items-center gap-3 justify-between p-4 border rounded-lg  transition-colors ${
					isOpen
						? 'border-[var(--white)] ring-3 ring-[var(--color1)]'
						: 'border-[var(--gray)] hover:border-[var(--secondary-text)]'
				}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<span
					className={`text-lg ${
						selectedOption
							? 'text-[var(--primary-text)]'
							: 'text-[var(--secondary-text)]'
					}`}
				>
					{selectedOption?.label || 'Выберите вариант'}
				</span>
				<ChevronsUpDown
					className={`w-5 h-5 transition-transform ${
						isOpen ? 'text-[var(--primary)]' : 'text-gray-400'
					}`}
				/>
			</div>
			{isOpen && (
				<div className='absolute z-10 w-full mt-1 bg-[var(--gray)] text-[var(--primary-text)] border border-[var(--gray)] rounded-lg shadow-lg overflow-hidden'>
					{options.map(option => (
						<div
							key={option.value}
							className={`p-3  transition-colors ${
								option.value === selectedValue
									? 'bg-[var(--secondary)] text-[var(--primary)]'
									: 'hover:bg-[var(--secondary)] hover:text-[var(--primary)]'
							}`}
							onClick={() => {
								onSelect(option.value)
								setIsOpen(false)
							}}
						>
							{option.label}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export const Filter = ({ options, selectedValue, onSelect }) => {
	const [isOpen, setIsOpen] = useState(false)

	// Находим выбранный элемент для отображения
	const selectedOption = options.find(opt => opt.value === selectedValue)

	return (
		<div className='relative inline-block w-fit select-none'>
			<div
				className={`flex items-center gap-4 px-6 py-4 rounded-lg transition-all bg-[var(--ghost-black)] text-[var(--light-ghost-black)]`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<Funnel size={36} />
				<p className='leading-4'>{selectedOption?.label || 'Все'}</p>
			</div>
			{isOpen && (
				<div className='absolute z-10 w-fit mt-1 bg-[var(--ghost-black)] text-[var(--text)] rounded-lg  overflow-hidden'>
					{options.map(option => (
						<div
							key={option.value}
							className={`px-4 py-2  transition-colors flex flex-col gap-4 ${
								option.value === selectedValue
									? 'bg-[var(--light-ghost-black)] text-[var(--text)] w-full'
									: 'text-[var(--light-ghost-black)] hover:text-[var(--text)]'
							}`}
							onClick={() => {
								onSelect(option.value)
								setIsOpen(false)
							}}
						>
							{option.label}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export const Sort = ({ options, selectedValue, onSelect }) => {
	const [isOpen, setIsOpen] = useState(false)

	// Находим выбранный элемент для отображения
	const selectedOption = options.find(opt => opt.value === selectedValue)

	return (
		<div className='relative w-fit select-none'>
			<div
				className={`flex items-center gap-3 px-6 py-4 rounded-lg transition-colors bg-[var(--ghost-black)] text-[var(--light-ghost-black)]`}
				onClick={() => setIsOpen(!isOpen)}
				data-clickable
			>
				{selectedOption?.icon}
				<span
					className={`text-lg leading-4 w-full ${
						selectedOption
							? 'text-[var(--primary-text)]'
							: 'text-[var(--secondary-text)]'
					}`}
				>
					{selectedOption?.label}
				</span>
			</div>
			{isOpen && (
				<div className='absolute z-10 mt-1 bg-[var(--ghost-black)] text-[var(--text)] rounded-lg overflow-hidden'>
					{options.map(option => (
						<div
							data-clickable
							key={option.value}
							className={`px-4 py-2 inline-flex transition-colors items-center gap-4 ${
								option.value === selectedValue
									? 'bg-[var(--light-ghost-black)] text-[var(--text)] w-full'
									: 'text-[var(--light-ghost-black)] hover:text-[var(--text)]'
							}`}
							onClick={() => {
								onSelect(option.value)
								setIsOpen(false)
							}}
						>
							{option.icon}
							<p className='w-60'>{option.label}</p>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
