import { useState } from 'react'
import { MathJax, MathJaxContext } from 'better-react-mathjax'

export default function FormulaView({ Formula }) {
	const [formula, setFormula] = useState(Formula)

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

	return (
		<div className='flex gap-2 justify-center'>
			<MathJaxContext version={3} config={config}>
				<div className='p-4 rounded-md bg-[var(--light-middle)] text-[var(--black)] text-center min-h-[80px] flex items-center justify-center'>
					<MathJax dynamic>{`$$${formula}$$`}</MathJax>
				</div>
			</MathJaxContext>
		</div>
	)
}
