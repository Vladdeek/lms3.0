import { CodeBlock } from 'react-code-blocks'
import { github } from 'react-code-blocks'
import { useState } from 'react'
import { Copy, Check, Code, Trash } from 'lucide-react'

const CustomCodeBlock = ({
	codeInfo,
	width = 'w-2/3',
	editMode = false,
	onClick,
}) => {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(codeInfo.code)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			const textArea = document.createElement('textarea')
			textArea.value = codeInfo.code
			textArea.style.position = 'fixed'
			textArea.style.top = '0'
			textArea.style.left = '0'
			textArea.style.opacity = '0'
			document.body.appendChild(textArea)
			textArea.focus()
			textArea.select()
			try {
				const successful = document.execCommand('copy')
				if (successful) {
					setCopied(true)
					setTimeout(() => setCopied(false), 2000)
				}
			} catch (fallbackErr) {
				console.error('Ошибка копирования (fallback):', fallbackErr)
			} finally {
				document.body.removeChild(textArea)
			}
		}
	}

	return (
		<div className='flex justify-center'>
			<div
				className={`relative bg-[var(--white)] rounded-xl shadow-[var(--shadow)] overflow-hidden my-4 ${width}`}
			>
				<div className='flex justify-between items-center bg-[var(--white)] pr-2 pl-3 py-2 border-b border-[var(--light-middle)]'>
					<div className='flex items-center gap-3'>
						<div className='flex gap-2'>
							<div className='h-3 w-3 rounded-full bg-red-500'></div>
							<div className='h-3 w-3 rounded-full bg-yellow-500'></div>
							<div className='h-3 w-3 rounded-full bg-green-500'></div>
						</div>
						<span className='text-gray-700 text-sm uppercase font-medium'>
							{codeInfo[0].language}
						</span>
					</div>
					{!editMode ? (
						<button
							onClick={handleCopy}
							className='flex items-center gap-2 px-3 py-1.5 bg-[var(--light-middle)] text-[var(--middle)] font-medium rounded-md text-sm transition-all hover:brightness-90 active:scale-97 shadow-[var(--shadow)] cursor-pointer'
						>
							<>
								<Copy className='w-4 h-4' />
								<span>Копировать</span>
							</>
						</button>
					) : (
						<button
							onClick={onClick}
							className='flex items-center gap-2 px-3 py-1.5 bg-[var(--red-status-bg)] text-[var(--red-status-text)] font-medium rounded-md text-sm transition-all hover:text-[var(--white)] hover:bg-red-500 active:scale-97 cursor-pointer'
						>
							<>
								<Trash className='w-4 h-4' />
								<span>Удалить</span>
							</>
						</button>
					)}
				</div>

				<div className='p-0 code-font overflow-scroll max-h-136'>
					<CodeBlock
						text={codeInfo[0].code}
						language={codeInfo[0].language}
						showLineNumbers={true}
						theme={github}
					/>
				</div>
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
