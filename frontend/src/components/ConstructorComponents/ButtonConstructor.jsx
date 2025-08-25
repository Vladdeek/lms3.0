import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { InputDefault } from '../Inputs'

export const CustomConstructButton = ({ title }) => {
	return (
		<button className='text-[var(--white)] px-4 py-3 rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all bg-[var(--hero-epta)] font-medium'>
			{title || 'Кнопка'}
		</button>
	)
}

// Создаем управляемую версию InputDefault специально для ButtonConstructor
const ControlledInputDefault = ({ value, onChange, ...props }) => {
	const [internalValue, setInternalValue] = useState(value || '')

	useEffect(() => {
		setInternalValue(value || '')
	}, [value])

	const handleChange = e => {
		setInternalValue(e.target.value)
		if (onChange) {
			onChange(e)
		}
	}

	return (
		<InputDefault {...props} value={internalValue} onChange={handleChange} />
	)
}

export const ButtonConstructor = ({ DelComponent }) => {
	const [buttonTitle, setButtonTitle] = useState('')
	const [buttonUrl, setButtonUrl] = useState('')
	const [isValidUrl, setIsValidUrl] = useState(false)

	useEffect(() => {
		if (buttonUrl) {
			try {
				new URL(buttonUrl)
				setIsValidUrl(true)
			} catch (e) {
				setIsValidUrl(false)
			}
		} else {
			setIsValidUrl(false)
		}
	}, [buttonUrl])

	return (
		<div className='flex gap-2'>
			<button
				className='self-start bg-[var(--white)] shadow-[var(--shadow)] p-1 rounded-lg hover:brightness-95 active:brightness-90 cursor-pointer transition-all'
				onClick={DelComponent}
			>
				<X />
			</button>
			<div className='flex flex-col gap-3 bg-[var(--white)] w-full shadow-[var(--shadow)] rounded-xl p-4'>
				<p className='font-medium text-base text-[var(--middle)] select-none cursor-default'>
					Конструктор кнопки
				</p>
				<div className='flex justify-center items-center bg-[var(--light-gray)] rounded-lg w-full py-10'>
					<CustomConstructButton title={buttonTitle} />
				</div>
				<ControlledInputDefault
					title={'Название кнопки'}
					placeholder={'Введите название кнопки'}
					required={true}
					type={'text'}
					value={buttonTitle}
					onChange={e => setButtonTitle(e.target.value)}
				/>
				<ControlledInputDefault
					title={'URL (Ссылка)'}
					placeholder={'https://example.com'}
					required={true}
					type={'url'}
					value={buttonUrl}
					onChange={e => setButtonUrl(e.target.value)}
				/>
				{buttonUrl && !isValidUrl && (
					<p className='text-[var(--error)] text-sm mt-2'>
						Введите корректный URL
					</p>
				)}
			</div>
		</div>
	)
}
