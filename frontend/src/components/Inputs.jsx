import { CircleCheck } from 'lucide-react'
import { useState } from 'react'

export const InputDefault = ({
	type,
	placeholder,
	title,
	required,
	validate,
}) => {
	const [inputStatus, setInputStatus] = useState(false)
	const [inputValue, setInputValue] = useState('')

	const handleInputChange = e => {
		const value = e.target.value
		setInputValue(value)
		setInputStatus(validate ? validate(value) : value.trim() !== '')
	}

	return (
		<div className='w-full inline-flex flex-col group'>
			{title && (
				<div className='inline-flex items-center gap-[10px]'>
					<p className='text-[18px] text-[var(--middle)] focus-within:text-[var(--hero-epta)]'>
						{title}
					</p>
					{required && (
						<CircleCheck
							className='pb-[2px]'
							color={!inputStatus ? 'var(--middle)' : 'var(--hero-epta)'}
							size={16}
						/>
					)}
				</div>
			)}

			<input
				type={type}
				value={inputValue}
				onChange={handleInputChange}
				className='rounded-xl p-[12px] shadow-[1px_2px_8px_rgba(0,0,0,0.125)] outline-0 focus:ring-1 focus:ring-[var(--hero-epta)] transition'
				placeholder={placeholder}
			/>
		</div>
	)
}
