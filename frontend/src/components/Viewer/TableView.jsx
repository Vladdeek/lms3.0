import React from 'react'

const TableView = ({ rows = 2, cols = 2, values = [] }) => {
	return (
		<div className='flex gap-2'>
			<div className='flex flex-col bg-[var(--white)] shadow-[var(--shadow)] rounded-lg p-4 w-full'>
				<p className='text-[var(--middle)] font-medium mb-2'>Таблица</p>
				<div className='w-full flex justify-between'>
					<div
						className='grid w-full mb-1 mr-1 rounded-lg overflow-hidden border border-[var(--light-middle)]'
						style={{
							gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
							gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
						}}
					>
						{Array.from({ length: rows * cols }).map((_, i) => {
							const colIndex = i % cols
							const isDark = colIndex % 2 === 1
							const value = values[i] || '' // если массива не хватает

							return (
								<input
									key={i}
									type='text'
									value={value}
									readOnly
									className={`outline-0 border border-[var(--light-middle)] p-2 text-[var(--black)] transition-all ${
										isDark ? 'bg-[var(--light-gray)]' : 'bg-[var(--white)]'
									}`}
								/>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}

export default TableView
