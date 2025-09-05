import { useState, useEffect, useRef, forwardRef } from 'react'
import { ChevronsUp, ChevronsDown, GripHorizontal } from 'lucide-react'

const PairItem = forwardRef(
	(
		{ pair, index, side, moveUp, moveDown, onDragStart, onDrop, height },
		ref
	) => {
		const isRight = side === 'right'

		return (
			<div
				ref={ref}
				draggable={isRight}
				onDragStart={e => isRight && onDragStart(e, index)}
				onDragOver={e => isRight && e.preventDefault()}
				onDrop={e => isRight && onDrop(e, index)}
				style={{ height: height ? `${height}px` : undefined }}
				className={`grid grid-cols-7 w-150 px-3 py-2 shadow-[var(--shadow)] 
          rounded-lg bg-white cursor-${
						isRight ? 'grab' : 'default'
					} select-none`}
			>
				<span className='col-span-4 flex items-center w-full'>
					{side === 'left' ? pair.left : pair.right}
				</span>

				{isRight && (
					<div className='col-span-2 flex items-center justify-center w-full'>
						<GripHorizontal size={24} />
					</div>
				)}

				{isRight && (
					<div className='col-span-1 flex items-center justify-center w-full'>
						<button
							onClick={() => moveUp(index)}
							className='p-1 hover:bg-gray-200 rounded cursor-pointer'
							aria-label='Переместить вверх'
						>
							<ChevronsUp size={24} />
						</button>
						<button
							onClick={() => moveDown(index)}
							className='p-1 hover:bg-gray-200 rounded cursor-pointer'
							aria-label='Переместить вниз'
						>
							<ChevronsDown size={24} />
						</button>
					</div>
				)}
			</div>
		)
	}
)

const SortVariantView = ({ initialPairs = [], onChange, question }) => {
	const [pairs, setPairs] = useState(initialPairs)
	const [heights, setHeights] = useState([])
	const rightRefs = useRef([])

	useEffect(() => {
		const shuffled = [...initialPairs].sort(() => Math.random() - 0.5)
		setPairs(shuffled)
	}, [initialPairs])

	useEffect(() => {
		if (onChange) {
			const answers = initialPairs.map((pair, idx) => [
				pair.left,
				pairs[idx]?.right || '',
			])
			onChange(answers)
		}
	}, [pairs, initialPairs, onChange])

	useEffect(() => {
		const newHeights = rightRefs.current.map(ref =>
			ref ? ref.getBoundingClientRect().height : 0
		)
		setHeights(newHeights)
	}, [pairs])

	const moveUp = index => {
		if (index === 0) return
		setPairs(prev => {
			const newPairs = [...prev]
			;[newPairs[index - 1], newPairs[index]] = [
				newPairs[index],
				newPairs[index - 1],
			]
			return newPairs
		})
	}

	const moveDown = index => {
		if (index === pairs.length - 1) return
		setPairs(prev => {
			const newPairs = [...prev]
			;[newPairs[index + 1], newPairs[index]] = [
				newPairs[index],
				newPairs[index + 1],
			]
			return newPairs
		})
	}

	const handleDragStart = (e, index) => {
		e.dataTransfer.setData('dragIndex', index)
	}

	const handleDrop = (e, dropIndex) => {
		const dragIndex = parseInt(e.dataTransfer.getData('dragIndex'))
		if (isNaN(dragIndex)) return

		setPairs(prev => {
			const newPairs = [...prev]
			const [dragged] = newPairs.splice(dragIndex, 1)
			newPairs.splice(dropIndex, 0, dragged)
			return newPairs
		})
	}

	return (
		<div className='flex flex-col items-center gap-5'>
			<p className='font-medium text-lg'>{question}</p>

			<p className='font-light text-[var(--middle)] text-sm'>
				Это вопрос на установление соответствия, где нужно правильно сопоставить
				элементы
			</p>

			<div className='flex justify-between gap-3'>
				<div className=' h-full flex flex-col gap-3'>
					{initialPairs.map((pair, idx) => (
						<div className='flex '>
							<PairItem
								key={pair.id}
								pair={pair}
								side='left'
								height={heights[idx]}
							/>
						</div>
					))}
				</div>
				<div className=' h-full  flex flex-col gap-3'>
					{initialPairs.map(() => (
						<div className='w-full h-full flex items-center'>
							<div className='h-0 w-5 border-b-2 border-[var(--black)]'></div>
						</div>
					))}
				</div>

				<div className=' h-full  flex flex-col gap-3'>
					{pairs.map((pair, index) => (
						<PairItem
							key={pair.id}
							pair={pair}
							index={index}
							side='right'
							moveUp={moveUp}
							moveDown={moveDown}
							onDragStart={handleDragStart}
							onDrop={handleDrop}
							ref={el => (rightRefs.current[index] = el)}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default SortVariantView
