import { Minus, Plus, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export const TableConstructor = ({ DelComponent, onChange, takeValues }) => {
	const [rows, setRows] = useState(takeValues?.rows || 2)
	const [cols, setCols] = useState(takeValues?.cols || 2)

	const limits = { maxCols: 5, maxRows: 25 }

	const reshapeTo2D = (flat, rows, cols) => {
		return Array.from({ length: rows }, (_, rowIndex) =>
			flat.slice(rowIndex * cols, rowIndex * cols + cols)
		)
	}

	const [tableData, setTableData] = useState(
		reshapeTo2D(takeValues?.data, takeValues?.rows, takeValues?.cols) ||
			Array.from({ length: rows }, () => Array(cols).fill(''))
	)

	useEffect(() => {
		setTableData(prev => {
			const newData = [...prev]

			while (newData.length < rows) newData.push(Array(cols).fill(''))
			while (newData.length > rows) newData.pop()

			return newData.map(row => {
				const newRow = [...row]
				while (newRow.length < cols) newRow.push('')
				while (newRow.length > cols) newRow.pop()
				return newRow
			})
		})
	}, [rows, cols])

	useEffect(() => {
		onChange?.({
			rows,
			cols,
			data: tableData.flat(),
		})
	}, [tableData, rows, cols])

	const updateCell = (r, c, value) => {
		setTableData(prev => {
			const newData = prev.map(row => [...row])
			newData[r][c] = value
			return newData
		})
	}

	const addRow = () => setRows(prev => prev + 1)
	const removeRow = () => rows > 2 && setRows(prev => prev - 1)
	const addCol = () => setCols(prev => prev + 1)
	const removeCol = () => cols > 2 && setCols(prev => prev - 1)

	return (
		<div className='flex gap-2'>
			<button
				className='self-start bg-[var(--white)] shadow-[var(--shadow)] p-1 rounded-lg hover:brightness-95 active:brightness-90 cursor-pointer transition-all text-[var(--black)]'
				onClick={DelComponent}
			>
				<X />
			</button>
			<div className='flex flex-col bg-[var(--white)] shadow-[var(--shadow)] rounded-lg p-4 w-full'>
				<p className='text-[var(--middle)] font-medium mb-2'>Таблица</p>

				<div className='w-full flex justify-between'>
					<div
						className='grid w-full mb-1 mr-1 rounded-lg overflow-hidden border-1 border-[var(--light-middle)]'
						style={{
							gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
							gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
						}}
					>
						{tableData.flatMap((row, r) =>
							row.map((cell, c) => {
								const isDark = c % 2 === 1
								return (
									<input
										key={`${r}-${c}`}
										type='text'
										value={cell}
										onChange={e => updateCell(r, c, e.target.value)}
										className={`outline-0 border border-[var(--light-middle)] p-2 transition-all text-[var(--black)] ${
											isDark ? ' bg-[var(--light-gray)]' : ' bg-[var(--white)]'
										}`}
									/>
								)
							})
						)}
					</div>

					<div className='flex flex-col gap-1'>
						<button
							disabled={cols >= limits?.maxCols}
							className={`w-10 h-full rounded-lg flex items-center justify-center bg-[var(--light-middle)] transition-all ${
								cols >= limits?.maxCols
									? 'opacity-50 cursor-not-allowed'
									: 'hover:brightness-95 active:brightness-90 cursor-pointer'
							}`}
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

				<div className='flex mt-2'>
					<div className='w-full flex gap-1'>
						<button
							className={`w-full h-10 rounded-lg flex items-center gap-3 justify-center bg-[var(--light-middle)] text-[var(--middle)]  transition-all ${
								rows >= limits?.maxRows
									? 'opacity-50 cursor-not-allowed'
									: 'hover:brightness-95 active:brightness-90 cursor-pointer'
							}`}
							onClick={addRow}
							disabled={rows >= limits?.maxRows}
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
	)
}
