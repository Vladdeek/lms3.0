import { CodeBlock } from 'react-code-blocks'
import { github, a11yDark } from 'react-code-blocks'
import { useState } from 'react'
import { Copy, Trash } from 'lucide-react'

const CustomCodeBlock = ({
	codeInfo,
	width = 'w-2/3',
	editMode = false,
	onClick,
	view = false,
}) => {
	const [copied, setCopied] = useState(false)
	const htmlElement = document.documentElement
	const themeAttr = htmlElement.getAttribute('data-theme')

	const themes = {
		light: github,
		dark: a11yDark,
	}

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(codeInfo.code)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (error) {
			console.error('Ошибка копирования:', error)
		}
	}

	return (
		<div className='flex justify-center'>
			{/* Основной контейнер */}
			<div
				className={`relative bg-[var(--white)] rounded-xl shadow-[var(--shadow)] overflow-hidden my-4 ${width} max-xl:w-[90vw]`}
			>
				{/* Верхняя панель */}
				<div className='flex justify-between items-center bg-[var(--white)] pr-2 pl-3 py-2 border-b border-[var(--light-middle)]'>
					<div className='flex items-center gap-3'>
						<div className='flex gap-2'>
							<div className='h-3 w-3 rounded-full bg-red-500'></div>
							<div className='h-3 w-3 rounded-full bg-yellow-500'></div>
							<div className='h-3 w-3 rounded-full bg-green-500'></div>
						</div>
						<span className='text-[var(--middle)] text-sm uppercase font-medium'>
							{codeInfo?.language}
						</span>
					</div>

					{/* Кнопка */}
					{!editMode ? (
						<button
							onClick={handleCopy}
							className='flex items-center gap-2 px-3 py-1.5 bg-[var(--light-middle)] text-[var(--middle)] font-medium rounded-md text-sm transition-all hover:brightness-90 active:scale-97 shadow-[var(--shadow)] cursor-pointer'
						>
							<Copy className='w-4 h-4' />
							<span>Копировать</span>
						</button>
					) : (
						<button
							onClick={onClick}
							className='flex items-center gap-2 px-3 py-1.5 bg-[var(--red-status-bg)] text-[var(--red-status-text)] font-medium rounded-md text-sm transition-all hover:text-[var(--white)] hover:bg-red-500 active:scale-97 cursor-pointer'
						>
							<Trash className='w-4 h-4' />
							<span>Удалить</span>
						</button>
					)}
				</div>

				{/* Код с адаптивным скроллом */}
				<div className='p-0 code-font overflow-x-auto max-h-[34rem] xl:overflow-x-hidden'>
					<div className='min-w-[min(100%,700px)] xl:min-w-0'>
						<CodeBlock
							text={!view ? codeInfo[0]?.code : codeInfo.code}
							language={!view ? codeInfo[0]?.language : codeInfo.language}
							showLineNumbers={true}
							theme={themes[themeAttr]}
						/>
					</div>
				</div>

				{/* Попап "Скопировано" */}
				<div
					className={`bg-[var(--green-status-bg)] text-[var(--green-status-text)] font-normal px-4 py-2 rounded-lg absolute ${
						copied ? 'top-5' : '-top-10'
					} right-1/2 translate-x-1/2 transition-all`}
				>
					<p>Скопировано!</p>
				</div>
			</div>
		</div>
	)
}

export default CustomCodeBlock
