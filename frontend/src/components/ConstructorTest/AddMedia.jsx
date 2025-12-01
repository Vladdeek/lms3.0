import { Headphones, Image, Plus, SquareFunction, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ConstructorPhotoInput } from '../ConstructorComponents/PhotoImport'
import { AudioInput } from './AudioImport'
import FormulaConstructor from './FormulaInput'
import { PhotoInput } from './PhotoImport'

export const AddMediaButton = ({ type, onChange, info }) => {
	const [modalOpen, setModalOpen] = useState(false)
	const [selectedType, setSelectedType] = useState(type || null)

	useEffect(() => {
		setSelectedType(type)
	}, [type])

	const handle = mediaType => {
		setSelectedType(mediaType)
		setModalOpen(false)
	}

	const resetSelection = () => {
		setSelectedType(null)
	}

	if (selectedType) {
		return (
			<div className='inline-flex justify-center w-full'>
				{
					{
						photo: (
							<PhotoInput
								DelComponent={resetSelection}
								onChange={onChange}
								url={info}
							/>
						),
						audio: (
							<AudioInput
								DelComponent={resetSelection}
								onChange={onChange}
								info={info}
							/>
						),
						formula: (
							<FormulaConstructor
								DelComponent={resetSelection}
								onChange={onChange}
								info={info}
							/>
						),
					}[selectedType]
				}
			</div>
		)
	}

	return (
		<>
			<AddMediaModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				onCreate={handle}
			/>
			<button
				onClick={() => setModalOpen(true)}
				className='bg-[var(--light-middle)] text-[var(--middle)] w-full justify-center px-4 py-2 rounded-lg flex gap-3 hover:bg-[var(--black)] hover:text-[var(--white)] transition-all cursor-pointer'
			>
				<Plus strokeWidth={1.5} />
				Добавить медиа
			</button>
		</>
	)
}

export const AddMediaModal = ({ isOpen, onClose, onCreate }) => {
	if (!isOpen) return null

	const [answerType, setAnswerType] = useState('photo')

	const answerTypes = [
		{ id: 'photo', label: 'Фото', icon: Image },
		{ id: 'audio', label: 'Аудио', icon: Headphones },
		{ id: 'formula', label: 'Формула', icon: SquareFunction },
	]

	const handleAnswerTypeChange = type => {
		setAnswerType(type)
	}

	const handleCreate = () => {
		if (onCreate && typeof onCreate === 'function') {
			onCreate(answerType)
		}
		onClose()
	}

	return (
		<div className='fixed inset-0 flex items-center justify-center backdrop-blur-xs z-1000'>
			<div className='bg-[var(--white)] relative p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.125)] z-1001 min-w-[400px]'>
				<X
					onClick={onClose}
					className='absolute top-1 right-1 text-[var(--middle)] hover:text-red-500 cursor-pointer transition-all'
				/>
				<h2 className='text-2xl font-medium text-[var(--black)] mb-5 text-center'>
					Выберите тип медиа
				</h2>

				<div className='mb-4 flex justify-between'>
					{answerTypes.map(type => {
						const IconComponent = type.icon
						const isSelected = answerType === type.id
						return (
							<div
								key={type.id}
								className={`rounded-lg w-25 h-25 flex-col shadow-[var(--shadow)] flex items-center justify-center select-none ${
									isSelected
										? 'bg-[var(--hero-epta)] text-white'
										: 'text-[var(--black)] bg-[var(--white)] hover:bg-[var(--hero-epta)] hover:text-white'
								} transition-all cursor-pointer active:scale-95 font-medium mb-2 last:mb-0`}
								onClick={() => handleAnswerTypeChange(type.id)}
							>
								<IconComponent size={36} strokeWidth={1.5} />
								<p>{type.label}</p>
							</div>
						)
					})}
				</div>

				<button
					className='w-full mt-4 bg-[var(--black)] text-[var(--white)] rounded-lg py-2 font-medium hover:scale-105 active:scale-95 transition-all cursor-pointer'
					onClick={handleCreate}
				>
					Выбрать
				</button>
			</div>
		</div>
	)
}
