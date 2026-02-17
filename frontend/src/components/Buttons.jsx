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
	fill = false,
	wfull = false,
	disabled = false,
	className,
}) => {
	return (
		<label
			className={`${className} ${
				disabled && 'opacity-50'
			} flex items-center gap-2 px-4 py-2 ${
				wfull && 'w-full justify-center'
			} max-md:w-full max-md:justify-center rounded-xl border cursor-pointer transition-all ${
				checked
					? `${
							fill ? 'bg-[var(--hero-epta)]' : 'bg-[var(--white)]'
						} border-[var(--hero-epta)] ${
							fill ? 'text-white' : 'text-[var(--hero-epta)]'
						} `
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
				disabled={disabled}
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
	width,
}) => {
	return (
		<label
			title={title}
			className={`flex items-center shadow-[var(--shadow)] bg-[var(--white)] gap-2 px-4 py-[9px] h-fit w-fit rounded-xl truncate text-ellipsis cursor-pointer transition-all ${
				checked
					? 'text-[var(--hero-epta)]'
					: 'text-[var(--black)] hover:text-[var(--hero-epta)]'
			}`}
			style={{ width: width }}
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
			<span className='text-[20px] font-medium truncate text-ellipsis'>
				{title}
			</span>
		</label>
	)
}
import styled from 'styled-components'
export const StartButton = ({ title, onClick }) => {
	return (
		<StyledWrapper>
			<button onClick={onClick} className='button'>
				<span>{title}</span>
			</button>
		</StyledWrapper>
	)
}

const StyledWrapper = styled.div`
	.button {
		--main-size: 2em;
		--color-text: #ffffff;
		--color-background: #f32b6a;
		--color-background-hover: #f43c7b;
		--color-outline: #f32b6a40;
		--color-shadow: #00000040;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		text-decoration: none;
		border: none;
		border-radius: 0.5em;
		padding: 0.33em 0.66em;
		font-family: 'Poppins', sans-serif;
		font-weight: 600;
		font-size: var(--main-size);
		color: var(--color-text);
		background: var(--color-background);

		transition: 1s;
	}

	.button:active {
		transform: scale(0.95);
	}

	.button:hover {
		outline: 0.1em solid transparent;
		outline-offset: 0.2em;
		box-shadow: 0 0 1em 0 var(--color-background);
		animation:
			ripple 1s linear infinite,
			colorize 1s infinite;
		transition: 0.5s;
	}

	.button span {
		transition: 0.5s;
	}

	.button:hover span {
		text-shadow: 5px 5px 5px var(--color-shadow);
	}

	.button:active span {
		text-shadow: none;
	}

	.button svg {
		height: 0.8em;
		fill: var(--color-text);
		margin-right: -0.16em;
		position: relative;
		transition: 0.5s;
	}

	.button:hover svg {
		margin-right: 0.66em;
		transition: 0.5s;
		filter: drop-shadow(5px 5px 2.5px var(--color-shadow));
	}

	.button:active svg {
		filter: none;
	}

	.button svg polygon:nth-child(1) {
		transition: 0.4s;
		transform: translateX(-60%);
	}

	.button svg polygon:nth-child(2) {
		transition: 0.5s;
		transform: translateX(-30%);
	}

	.button:hover svg polygon:nth-child(1) {
		transform: translateX(0%);
		animation: opacity 1s infinite 0.6s;
	}

	.button:hover svg polygon:nth-child(2) {
		transform: translateX(0%);
		animation: opacity 1s infinite 0.4s;
	}

	.button:hover svg polygon:nth-child(3) {
		animation: opacity 1s infinite 0.2s;
	}

	@keyframes opacity {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@keyframes colorize {
		0% {
			background: var(--color-background);
		}
		50% {
			background: var(--color-background-hover);
		}
		100% {
			background: var(--color-background);
		}
	}

	@keyframes ripple {
		0% {
			outline: 0em solid transparent;
			outline-offset: -0.1em;
		}
		50% {
			outline: 0.2em solid var(--color-outline);
			outline-offset: 0.2em;
		}
		100% {
			outline: 0.4em solid transparent;
			outline-offset: 0.4em;
		}
	}
`

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
	width,
	disabled = false,
	type = 'submit',
}) => {
	return (
		<button
			disabled={disabled}
			type={type}
			onClick={onClick}
			className={`rounded-lg h-full flex gap-4 items-center justify-center hover:scale-102 active:scale-98 transition-all cursor-pointer ${className} ${
				title ? !size && 'py-2 px-4' : !size && 'p-3'
			}`}
			style={{
				backgroundColor:
					style === 'black'
						? 'var(--black)'
						: style === 'white'
							? 'var(--white)'
							: style === 'hero'
								? 'var(--hero-epta)'
								: 'transparent',
				color:
					style === 'black'
						? 'var(--white)'
						: style === 'white'
							? 'var(--black)'
							: style === 'hero'
								? 'white'
								: 'var(--black)',
				border: style === 'outline' ? '1px solid var(--black)' : 'none',
				boxShadow: style !== 'outline' ? 'var(--shadow)' : 'none',
				width: size || width,
				height: size,
				padding: size && 6,
			}}
		>
			{Icon && <Icon size={size / 1.75 || 24} color={IconColor} />}
			{title && (
				<span
					className='font-medium truncate text-ellipsis'
					style={{ fontSize: textSize }}
				>
					{title}
				</span>
			)}
		</button>
	)
}

export const SubmitButton = ({
	onClick,
	icon: Icon,
	title,
	IconColor,
	disabled = false,
}) => {
	return (
		<button
			disabled={disabled}
			onClick={onClick}
			className={`${
				!disabled
					? 'active:scale-99 active:brightness-90 hover:bg-[var(--hero-epta)] hover:text-white  cursor-pointer'
					: 'opacity-25 cursor-not-allowed'
			} bg-[var(--black)] text-[var(--white)] rounded-xl h-full flex gap-4 items-center justify-center transition-all py-4`}
		>
			{Icon && <Icon size={size / 1.75 || 24} color={IconColor} />}
			{title && (
				<span className='font-medium truncate text-ellipsis'>{title}</span>
			)}
		</button>
	)
}

export const EllipsisButton = ({ options, onOptionClick, bg, active }) => {
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

		// Если action - это функция, вызываем её
		if (typeof option.action === 'function') {
			option.action()
		}
		// Иначе передаем опцию через пропс onOptionClick
		else {
			onOptionClick?.(option)
		}
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
		<div className={`relative `} ref={buttonRef}>
			<button
				onClick={e => {
					e.stopPropagation()
					toggleMenu()
				}}
				className={`rounded-lg h-full flex gap-4 items-center hover:scale-102 transition-all cursor-pointer $  p-[6px] ${
					bg
						? `bg-[var(--white)] shadow-[var(--shadow)] ${active ? 'text-white' : 'text-[var(--black)]'}`
						: `bg-transparent  text-[var(--black)] hover:text-[var(--black)] ${active ? 'hover:text-[var(--black)] hover:bg-[var(--light-middle)]' : 'text-[var(--black)] hover:bg-[var(--white)]'}`
				} `}
				aria-label='Дополнительные опции'
			>
				<EllipsisVertical size={20} />
			</button>

			{isOpen && (
				<div
					className='absolute top-9 right-0 bg-[var(--white)] rounded-lg z-[10] shadow-[var(--shadow)] min-w-[150px] transition-opacity duration-200'
					style={{
						opacity: isVisible ? 1 : 0,
					}}
				>
					{options.map((item, index) => (
						<button
							key={index}
							className={`w-full px-4 py-3 text-left ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--light-gray)]'}  flex gap-3 items-center transition-colors first:rounded-t-lg last:rounded-b-lg`}
							onClick={e => {
								e.stopPropagation()
								handleOptionClick(item)
							}}
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

export const FilterButton = ({ option }) => {
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
					{option.map((item, index) => {
						return (
							<p
								key={index}
								className='px-3 py-2 hover:bg-[var(--light-middle)] text-[var(--black)] whitespace-nowrap cursor-pointer transition-all'
							>
								{item}
							</p>
						)
					})}
				</div>
			)}
		</div>
	)
}
