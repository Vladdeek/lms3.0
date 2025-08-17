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
