import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { InputDefault } from '../Inputs'
import { AddMediaButton } from './AddMedia'

// Компонент для пары сопоставления
const MatchPair = ({
	id,
	leftValue = '',
	rightValue = '',
	onLeftChange,
	onRightChange,
	onDelete,
	canDelete = false,
	disabled = false,
}) => {
	return (
		<div className='flex items-center gap-3 w-full mb-3'>
			<input
				type='text'
				value={leftValue}
				onChange={e => onLeftChange(id, e.target.value)}
				disabled={disabled}
				placeholder='Левое значение...'
				className='flex-1 px-3 py-2 shadow-[var(--shadow)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--hero-epta)] transition-all bg-transparent'
			/>

			<div className='text-[var(--middle)]'>—</div>

			<input
				type='text'
				value={rightValue}
				onChange={e => onRightChange(id, e.target.value)}
				disabled={disabled}
				placeholder='Правое значение...'
				className='flex-1 px-3 py-2 shadow-[var(--shadow)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--hero-epta)] transition-all bg-transparent'
			/>

			<button
				onClick={() => onDelete(id)}
				className={`p-2 rounded-lg transition-colors ${
					canDelete
						? 'text-[var(--red-status-text)] bg-[var(--red-status-bg)] hover:bg-red-500 hover:text-white cursor-pointer'
						: 'text-[var(--middle)] bg-[var(--light-middle)] cursor-not-allowed'
				}`}
				aria-label='Удалить пару'
				disabled={!canDelete}
			>
				<X size={18} />
			</button>
		</div>
	)
}

const SortVariants = () => {
	const [pairs, setPairs] = useState([
		{ id: '1', left: '', right: '' },
		{ id: '2', left: '', right: '' },
	])

	const [question, setQuestion] = useState('')

	const handleLeftChange = (id, value) => {
		setPairs(prev =>
			prev.map(pair => (pair.id === id ? { ...pair, left: value } : pair))
		)
	}

	const handleRightChange = (id, value) => {
		setPairs(prev =>
			prev.map(pair => (pair.id === id ? { ...pair, right: value } : pair))
		)
	}

	const handleAddPair = () => {
		const maxId = Math.max(...pairs.map(pair => parseInt(pair.id)))
		const newId = (maxId + 1).toString()
		setPairs(prev => [...prev, { id: newId, left: '', right: '' }])
	}

	const handleDeletePair = id => {
		if (pairs.length <= 2) return
		setPairs(prev => prev.filter(pair => pair.id !== id))
	}

	return (
		<>
			<div className='flex'>
				<div className='flex flex-col justify-center items-end p-4 w-3/4'>
					<div className='flex flex-col gap-3 w-2/3 mb-5'>
						<InputDefault
							title={'Введите вопрос'}
							required={true}
							value={question}
							onChange={e => setQuestion(e.target.value)}
						/>
						<AddMediaButton />
					</div>

					<div className='flex flex-col items-center gap-3 w-2/3'>
						<div className='flex flex-col items-center gap-3 w-full'>
							<h3 className='text-lg font-medium mb-2 text-[var(--middle)]'>
								Пары для сопоставления:
							</h3>

							<div className='w-full'>
								{pairs.map((pair, index) => (
									<MatchPair
										key={pair.id}
										id={pair.id}
										leftValue={pair.left}
										rightValue={pair.right}
										onLeftChange={handleLeftChange}
										onRightChange={handleRightChange}
										onDelete={handleDeletePair}
										canDelete={pairs.length > 2}
										label={`Пара ${index + 1}`}
									/>
								))}
							</div>
						</div>
					</div>

					<button
						onClick={handleAddPair}
						className='flex items-center w-2/3 gap-3 mt-3 justify-center py-2 bg-[var(--light-middle)] text-[var(--middle)] rounded-lg hover:bg-[var(--black)] hover:text-[var(--white)] transition-all active:scale-95'
					>
						<Plus size={18} />
						Добавить пару
					</button>

					<div className='mt-6 p-4 bg-gray-50 rounded-md w-1/3 hidden'>
						<h4 className='font-medium mb-2'>Текущее состояние:</h4>
						<pre className='text-sm'>{JSON.stringify(pairs, null, 2)}</pre>
					</div>
				</div>
				<div className='flex justify-center items-center w-1/4'>
					<p className='border-3 border-dashed p-5 rounded-xl border-[var(--light-middle)] font-light text-[var(--middle)]'>
						<span className='text-center w-full flex justify-center'>
							Как создать вопрос на сопоставление:
						</span>
						<br /> 1. Заголовок: Четко сформулируйте задание. <br />
						2. Пары соответствия: В левом столбце укажите элементы, в правом -
						соответствующие им значения.
						<span className='text-center w-full flex justify-center mt-10'>
							Система автоматически перемешает элементы для тестирования.
						</span>
						<br /> <br /> Например: "процессор" — "центральное процессорное
						устройство"
					</p>
				</div>
			</div>
		</>
	)
}

export default SortVariants
