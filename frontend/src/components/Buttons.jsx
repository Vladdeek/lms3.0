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
			className={`flex items-center shadow-[var(--shadow)] bg-[var(--white)] gap-2 px-4 py-3 h-fit w-fit rounded-xl cursor-pointer transition-all ${
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

export const Button = ({ onClick, icon: Icon, title, style = 'white' }) => {
	return (
		<button
			onClick={onClick}
			className='rounded-lg p-3 h-fit w-fit'
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
			}}
		>
			{Icon && <Icon className='h-full w-full' />}
			{title && <span className='text-[20px] font-medium'>{title}</span>}
		</button>
	)
}
