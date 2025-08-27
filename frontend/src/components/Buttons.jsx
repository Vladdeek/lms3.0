import {
	EllipsisVertical,
	EllipsisVerticalIcon,
	FunnelPlus,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

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
	htmlFor,
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

export const EllipsisButton = ({ options, onOptionClick, bg }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [isVisible, setIsVisible] = useState(false)
	const buttonRef = useRef(null)
	const menuRef = useRef(null)

	const toggleMenu = () => {
		if (!isOpen) {
			setIsOpen(true)
			setTimeout(() => setIsVisible(true), 10)
		} else {
			closeMenu()
		}
	}

	const closeMenu = () => {
		setIsVisible(false)
		setTimeout(() => setIsOpen(false), 200)
	}

	const handleOptionClick = option => {
		closeMenu()
		onOptionClick?.(option)
	}

	// Обработчик клика вне области
	useEffect(() => {
		const handleClickOutside = event => {
			if (
				isOpen &&
				!buttonRef.current?.contains(event.target) &&
				!menuRef.current?.contains(event.target)
			) {
				closeMenu()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isOpen])

	// Позиционирование меню
	useEffect(() => {
		if (isOpen && buttonRef.current && menuRef.current) {
			const buttonRect = buttonRef.current.getBoundingClientRect()
			// Позиционируем меню относительно кнопки, но в пределах viewport
			menuRef.current.style.top = `${buttonRect.bottom + window.scrollY}px`
			menuRef.current.style.left = `${
				buttonRect.right + window.scrollX - menuRef.current.offsetWidth
			}px`
		}
	}, [isOpen])

	// Обработчик скрола - закрываем меню при скроле
	useEffect(() => {
		if (!isOpen) return
		let scrollTimeout
		const handleScroll = () => {
			clearTimeout(scrollTimeout)
			scrollTimeout = setTimeout(() => {
				closeMenu()
			}, 50)
		}

		window.addEventListener('scroll', handleScroll, true)
		window.addEventListener('resize', handleScroll, true)

		return () => {
			clearTimeout(scrollTimeout)
			window.removeEventListener('scroll', handleScroll, true)
			window.removeEventListener('resize', handleScroll, true)
		}
	}, [isOpen])

	return (
		<div className='relative' ref={buttonRef}>
			<button
				onClick={toggleMenu}
				className={`rounded-lg h-full flex gap-4 items-center hover:scale-102 transition-all cursor-pointer text-[var(--black)] p-[6px] ${
					bg && 'bg-[var(--white)] shadow-[var(--shadow)]'
				} `}
				aria-label='Дополнительные опции'
			>
				<EllipsisVertical size={20} />
			</button>

			{isOpen && (
				<div
					ref={menuRef}
					className='fixed bg-[var(--white)] rounded-lg z-[9999] shadow-[var(--shadow)] min-w-[150px] transition-opacity duration-200'
					style={{
						opacity: isVisible ? 1 : 0,
						pointerEvents: isVisible ? 'auto' : 'none',
					}}
				>
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

export const FilterButton = () => {
	const [isOpen, setIsOpen] = useState(false)
	return (
		<div className='relative'>
			<button
				onClick={() => setIsOpen(prev => !prev)}
				className='rounded-lg h-full flex gap-4 aspect-square justify-center items-center hover:scale-102 transition-all cursor-pointer text-[var(--black)] p-[6px] bg-[var(--white)] shadow-[var(--shadow)]'
			>
				<FunnelPlus size={20} />
			</button>
			{isOpen && (
				<div className='absolute bg-[var(--white)] shadow-[var(--shadow)] rounded-lg flex flex-col top-14 -right-3 overflow-hidden'>
					<p className='px-3 py-2 hover:bg-[var(--light-middle)] text-[var(--black)] whitespace-nowrap cursor-pointer'>
						вариант 1
					</p>
					<p className='px-3 py-2 hover:bg-[var(--light-middle)] text-[var(--black)] whitespace-nowrap cursor-pointer'>
						вариант 2
					</p>
					<p className='px-3 py-2 hover:bg-[var(--light-middle)] text-[var(--black)] whitespace-nowrap cursor-pointer'>
						вариант 3
					</p>
				</div>
			)}
		</div>
	)
}
