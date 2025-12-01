import {
	Divide,
	FolderMinus,
	FunctionSquare,
	Sigma,
	SquareRadical,
	Superscript,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { MathJax, MathJaxContext } from 'better-react-mathjax'

export default function FormulaConstructor({ DelComponent, onChange, info }) {
	const [formula, setFormula] = useState(info || 'E = mc^2')

	const config = {
		loader: { load: ['input/tex', 'output/chtml'] },
		tex: {
			inlineMath: [
				['$', '$'],
				['\\(', '\\)'],
			],
			displayMath: [
				['$$', '$$'],
				['\\[', '\\]'],
			],
		},
	}

	const insertTemplate = tpl => {
		setFormula(prev => prev + tpl)
	}

	useEffect(() => {
		const data = { info: formula, type: 'formula' }

		onChange?.(data)
	}, [formula])

	const buttons = [
		{
			icon: <Superscript size={16} />,
			title: 'Степень',
			onClick: () => insertTemplate('^{x}'),
		},
		{
			icon: <Divide size={16} />,
			title: 'Дробь',
			onClick: () => insertTemplate('\\frac{a}{b}'),
		},
		{
			icon: <Sigma size={16} />,
			title: 'Сумма',
			onClick: () => insertTemplate('\\sum_{i=1}^{n}'),
		},
		{
			icon: <SquareRadical size={16} />,
			title: 'Корень',
			onClick: () => insertTemplate('\\sqrt{x}'),
		},
		{
			icon: <FunctionSquare size={16} />,
			title: 'Интеграл',
			onClick: () => insertTemplate('\\int f(x) dx'),
		},
	]

	return (
		<div className='flex gap-2'>
			<MathJaxContext version={3} config={config}>
				<div className='max-w-xl p-6 bg-[var(--white)] shadow-[var(--shadow)] rounded-lg space-y-4 relative'>
					<button
						className='absolute top-1 right-1 self-start bg-[var(--white)] text-[var(--black)] shadow-[var(--shadow)] p-1 rounded-lg hover:bg-red-500 hover:text-white active:brightness-90 cursor-pointer transition-all'
						onClick={DelComponent}
					>
						<X />
					</button>
					<div className='flex items-center gap-2 text-lg font-semibold text-[var(--black)]'>
						<Sigma className='w-6 h-6 text-[var(--black)]' />
						<span>Конструктор формул</span>
					</div>

					{/* Панель кнопок */}
					<div className='flex flex-wrap gap-2'>
						{buttons.map((item, index) => {
							return (
								<button
									onClick={item.onClick}
									className='flex items-center gap-1 px-3 py-1 bg-[var(--hero-pale)] text-[var(--hero-epta)] rounded hover:scale-105 transition-all cursor-pointer'
								>
									{item.icon} {item.title}
								</button>
							)
						})}
					</div>

					{/* Поле ввода */}
					<input
						type='text'
						value={formula}
						onChange={e => setFormula(e.target.value)}
						placeholder='Введи формулу в TeX-нотации...'
						className='w-full px-4 py-2 border-2 border-[var(--light-middle)] rounded-md focus:outline-none focus:ring-2 focus:shadow-[var(--hero-shadow)] focus:ring-[var(--hero-epta)] text-[var(--black)] transition-all'
					/>

					{/* Превью */}
					<div className='p-4 rounded-md bg-[var(--light-middle)] text-[var(--black)] text-center min-h-[80px] flex items-center justify-center'>
						<MathJax dynamic>{`$$${formula}$$`}</MathJax>
					</div>
				</div>
			</MathJaxContext>
		</div>
	)
}
