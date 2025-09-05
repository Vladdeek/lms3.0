import React, { useMemo, useCallback, useState } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import {
	Bold,
	Italic,
	Underline,
	Strikethrough,
	List,
	ListOrdered,
	AlignLeft,
	AlignCenter,
	AlignRight,
	X,
} from 'lucide-react'
import { Editor, Transforms, Element as SlateElement, Text } from 'slate'

const isMarkActive = (editor, format) => {
	const marks = Editor.marks(editor)
	return marks ? marks[format] === true : false
}

const toggleMark = (editor, format) => {
	const isActive = isMarkActive(editor, format)
	if (isActive) {
		Editor.removeMark(editor, format)
	} else {
		Editor.addMark(editor, format, true)
	}
}

const isBlockActive = (editor, format) => {
	const [match] = Editor.nodes(editor, {
		match: n =>
			!Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
	})
	return !!match
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const toggleBlock = (editor, format) => {
	const isActive = isBlockActive(editor, format)
	const isList = LIST_TYPES.includes(format)

	Transforms.unwrapNodes(editor, {
		match: n => LIST_TYPES.includes(n.type),
		split: true,
	})

	let newProperties
	if (isActive) {
		newProperties = { type: 'paragraph' }
	} else if (isList) {
		newProperties = { type: 'list-item' }
		Transforms.wrapNodes(editor, { type: format, children: [] })
	} else {
		newProperties = { type: format }
	}

	Transforms.setNodes(editor, newProperties)
}

export const ConstructorEditor = ({ DelComponent }) => {
	const editor = useMemo(() => withHistory(withReact(createEditor())), [])

	const initialValue = useMemo(
		() => [
			{
				type: 'paragraph',
				children: [{ text: '' }],
			},
		],
		[]
	)

	const [value, setValue] = useState(initialValue)

	const ToolbarButton = ({ format, icon: Icon, isBlock = false }) => {
		const isActive = isBlock
			? isBlockActive(editor, format)
			: isMarkActive(editor, format)

		const toggleFormat = e => {
			e.preventDefault()
			if (isBlock) {
				toggleBlock(editor, format)
			} else {
				toggleMark(editor, format)
			}
		}

		return (
			<button
				onMouseDown={toggleFormat}
				className={`p-2 rounded transition ${
					isActive
						? 'bg-[var(--hero-epta)] text-white'
						: 'hover:bg-[var(--hero-epta)] hover:text-white'
				}`}
			>
				<Icon size={18} />
			</button>
		)
	}

	const renderLeaf = useCallback(props => {
		let { attributes, children, leaf } = props
		if (leaf.bold) children = <strong>{children}</strong>
		if (leaf.italic) children = <em>{children}</em>
		if (leaf.underline) children = <u>{children}</u>
		if (leaf.strikethrough) children = <s>{children}</s>
		return <span {...attributes}>{children}</span>
	}, [])

	const renderElement = useCallback(props => {
		const { attributes, children, element } = props

		switch (element.type) {
			case 'bulleted-list':
				return (
					<ul className='list-disc pl-6' {...attributes}>
						{children}
					</ul>
				)
			case 'numbered-list':
				return (
					<ol className='list-decimal pl-6' {...attributes}>
						{children}
					</ol>
				)
			case 'list-item':
				return <li {...attributes}>{children}</li>
			case 'align-left':
				return (
					<div style={{ textAlign: 'left' }} {...attributes}>
						{children}
					</div>
				)
			case 'align-center':
				return (
					<div style={{ textAlign: 'center' }} {...attributes}>
						{children}
					</div>
				)
			case 'align-right':
				return (
					<div style={{ textAlign: 'right' }} {...attributes}>
						{children}
					</div>
				)
			case 'align-justify':
				return (
					<div style={{ textAlign: 'justify' }} {...attributes}>
						{children}
					</div>
				)
			default:
				return <p {...attributes}>{children}</p>
		}
	}, [])

	console.log(value)

	return (
		<div className='flex gap-2'>
			<button
				className='self-start bg-[var(--white)] shadow-[var(--shadow)] p-1 rounded-lg hover:brightness-95 active:brightness-90 cursor-pointer transition-all'
				onClick={DelComponent}
			>
				<X />
			</button>

			<div className='w-full flex flex-col'>
				<div className='flex flex-wrap gap-1 mb-2 bg-[var(--white)] shadow-[var(--shadow)] p-2 rounded-lg w-fit'>
					<ToolbarButton format='bold' icon={Bold} />
					<ToolbarButton format='italic' icon={Italic} />
					<ToolbarButton format='underline' icon={Underline} />
					<ToolbarButton format='strikethrough' icon={Strikethrough} />
					<ToolbarButton format='bulleted-list' icon={List} isBlock />
					<ToolbarButton format='numbered-list' icon={ListOrdered} isBlock />
					<ToolbarButton format='align-left' icon={AlignLeft} isBlock />
					<ToolbarButton format='align-center' icon={AlignCenter} isBlock />
					<ToolbarButton format='align-right' icon={AlignRight} isBlock />
				</div>

				<div className='w-full'>
					<Slate
						editor={editor}
						value={value}
						onChange={newValue => setValue(newValue)}
						initialValue={initialValue}
					>
						<Editable
							renderLeaf={renderLeaf}
							renderElement={renderElement}
							className='px-4 py-3 rounded-lg bg-[var(--light-gray)] focus:outline-none min-h-[120px]'
						/>
					</Slate>
				</div>
			</div>
		</div>
	)
}
