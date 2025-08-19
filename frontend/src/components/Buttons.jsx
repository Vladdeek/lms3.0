import { EllipsisVertical, EllipsisVerticalIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export const RadioButton = ({
	name,
	value,
	checked,
	onChange,
	icon: Icon,
	title,
}) => {
	return (
		<label
			className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all ${
				checked
					? 'bg-[var(--white)] border-[var(--hero-epta)] text-[var(--hero-epta)]'
					: 'bg-transparent border-[var(--middle)] text-[var(--middle)] hover:border-[var(--hero-epta)] hover:text-[var(--hero-epta)]'
			}`}
		>
			<input
				type='radio'
				name={name}
				value={value}
				checked={checked}
				onChange={onChange}
				className='hidden'
			/>
			{Icon && <Icon className='w-5 h-5' />}
			<span className='text-sm font-medium'>{title}</span>
		</label>
	)
}

export const AltRadioButton = ({
	name,
	value,
	checked,
	onChange,
	icon: Icon,
	title,
}) => {
	return (
		<label
			className={`flex items-center shadow-[var(--shadow)] bg-[var(--white)] gap-2 px-4 py-[9px] h-fit w-fit rounded-xl cursor-pointer transition-all ${
				checked
					? 'text-[var(--hero-epta)]'
					: 'text-[var(--black)] hover:text-[var(--hero-epta)]'
			}`}
		>
			<input
				type='radio'
				name={name}
				value={value}
				checked={checked}
				onChange={onChange}
				className='hidden'
			/>
			{Icon && <Icon size={24} />}
			<span className='text-[20px] font-medium'>{title}</span>
		</label>
	)
}

export const Button = ({
	onClick,
	icon: Icon,
	title,
	style = 'white',
	size,
	IconColor,
	textSize = 20,
	className = '',
}) => {
	return (
		<button
			onClick={onClick}
			className={`rounded-lg h-full flex gap-4 items-center hover:scale-102 transition-all cursor-pointer ${className} ${
				title ? !size && 'py-2 px-4' : !size && 'p-3'
			}`}
			style={{
				backgroundColor:
					style === 'black'
						? 'var(--black)'
						: style === 'white'
						? 'var(--white)'
						: 'transparent',
				color:
					style === 'black'
						? 'var(--white)'
						: style === 'white'
						? 'var(--black)'
						: 'var(--black)',
				border: style === 'outline' ? '1px solid var(--black)' : 'none',
				boxShadow: style !== 'outline' ? 'var(--shadow)' : 'none',
				width: size,
				height: size,
				padding: size && 6,
			}}
		>
			{Icon && <Icon size={!size && 24} color={IconColor} />}
			{title && (
				<span className='font-medium' style={{ fontSize: textSize }}>
					{title}
				</span>
			)}
		</button>
	)
}

export const EllipsisButton = ({ options, onOptionClick }) => {
	const [isOpen, setIsOpen] = useState(false)

	const toggleMenu = () => {
		setIsOpen(!isOpen)
	}

	const handleOptionClick = option => {
		setIsOpen(false)
		if (onOptionClick) {
			onOptionClick(option)
		}
	}

	useEffect(() => {
		const handleClickOutside = event => {
			if (isOpen && !event.target.closest('.relative')) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isOpen])

	return (
		<div className='relative isolate'>
			<button
				onClick={toggleMenu}
				className={`rounded-lg h-full flex gap-4 items-center hover:scale-102 transition-all cursor-pointer p-[6px] bg-[var(--white)] shadow-[var(--shadow)]`}
				aria-label='Дополнительные опции'
			>
				<EllipsisVertical size={20} />
			</button>

			{isOpen && (
				<div className='absolute top-full right-0 mt-2 w-fit bg-[var(--white)] rounded-lg z-101 shadow-[var(--shadow)]'>
					{options.map((item, index) => (
						<button
							key={index}
							className='w-full px-4 py-3 text-left hover:bg-[var(--light-middle)] flex gap-3 items-center transition-colors first:rounded-t-lg last:rounded-b-lg'
							onClick={() => handleOptionClick(item)}
						>
							{item.icon && (
								<span className='text-[var(--black)]'>{item.icon}</span>
							)}
							<span className='text-base text-[var(--black)] whitespace-nowrap'>
								{item.title}
							</span>
						</button>
					))}
				</div>
			)}
		</div>
	)
}
