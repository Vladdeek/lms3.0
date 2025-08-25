import { Minus, Plus, X } from 'lucide-react'
import { useState } from 'react'

export const TableConstructor = ({ DelComponent }) => {
	const [rows, setRows] = useState(2)
	const [cols, setCols] = useState(2)

	const addRow = () => setRows(prev => prev + 1)
	const removeRow = () =>
		rows > 2 && setRows(prev => (prev > 1 ? prev - 1 : prev))

	const addCol = () => setCols(prev => prev + 1)
	const removeCol = () =>
		cols > 2 && setCols(prev => (prev > 1 ? prev - 1 : prev))

	return (
		<>
			<div className='flex gap-2'>
				<button
					className='self-start bg-[var(--white)] shadow-[var(--shadow)] p-1 rounded-lg hover:brightness-95 active:brightness-90 cursor-pointer transition-all'
					onClick={DelComponent}
				>
					<X />
				</button>
				<div className='flex flex-col bg-[var(--white)] shadow-[var(--shadow)] rounded-lg p-4 w-full'>
					<p className='text-[var(--middle)] font-medium mb-2'>Таблица</p>
					<div className='w-full flex justify-between'>
						<div
							className={`grid w-full mb-1 mr-1 rounded-lg overflow-hidden border-1 border-[var(--light-middle)]`}
							style={{
								gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
								gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
							}}
						>
							{Array.from({ length: rows * cols }).map((_, i) => {
								const colIndex = i % cols
								const isDark = colIndex % 2 === 1

								return (
									<input
										key={i}
										type='text'
										className={`outline-0 border border-[var(--light-middle)] p-2 transition-all ${
											isDark ? ' bg-[var(--light-gray)]' : ' bg-[var(--white)]'
										}`}
									/>
								)
							})}
						</div>

						<div className='flex flex-col gap-1'>
							<button
								className='w-10 h-full rounded-lg flex items-center justify-center bg-[var(--light-middle)] hover:brightness-95 active:brightness-90 cursor-pointer transition-all'
								onClick={addCol}
							>
								<Plus color='var(--middle)' />
							</button>
							<button
								className='w-10 h-full rounded-lg flex items-center justify-center bg-[var(--light-middle)] hover:brightness-95 active:brightness-90 cursor-pointer transition-all'
								onClick={removeCol}
							>
								<Minus color='var(--middle)' />
							</button>
						</div>
					</div>

					<div className='flex'>
						<div className='w-full flex gap-1'>
							<button
								className='w-full h-10 rounded-lg flex items-center gap-3 justify-center bg-[var(--light-middle)] text-[var(--middle)] hover:brightness-95 active:brightness-90 cursor-pointer transition-all'
								onClick={addRow}
							>
								<Plus color='var(--middle)' />
								Добавить строку
							</button>
							<button
								className='w-full h-10 rounded-lg flex items-center gap-3 justify-center bg-[var(--light-middle)] text-[var(--middle)] hover:brightness-95 active:brightness-90 cursor-pointer transition-all'
								onClick={removeRow}
							>
								<Minus color='var(--middle)' />
								Удалить строку
							</button>
						</div>
						<div className='h-10 w-10'></div>
					</div>
				</div>
			</div>
		</>
	)
}
