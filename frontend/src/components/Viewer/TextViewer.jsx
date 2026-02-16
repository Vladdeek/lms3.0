import React, { useMemo } from 'react'

const renderLeaf = (leaf, children) => {
	if (leaf.bold) children = <strong>{children}</strong>
	if (leaf.italic) children = <em>{children}</em>
	if (leaf.underline) children = <u>{children}</u>
	if (leaf.strikethrough) children = <s>{children}</s>
	return children
}

const renderElement = (element, key) => {
	// 🔥 защита от кривых нод
	if (!element) return null
	if (!element.children) return null

	const children = element.children.map((child, index) => {
		if (!child) return null

		// text leaf
		if (child.text !== undefined) {
			return renderLeaf(child, child.text)
		}

		// nested element
		return renderElement(child, index)
	})

	switch (element.type) {
		case 'paragraph':
			return <p key={key}>{children}</p>

		case 'bulleted-list':
			return (
				<ul key={key} className='list-disc pl-6'>
					{children}
				</ul>
			)

		case 'numbered-list':
			return (
				<ol key={key} className='list-decimal pl-6'>
					{children}
				</ol>
			)

		case 'list-item':
			return (
				<li key={key} className='mb-1'>
					{children}
				</li>
			)

		case 'align-left':
			return (
				<div key={key} style={{ textAlign: 'left' }}>
					{children}
				</div>
			)

		case 'align-center':
			return (
				<div key={key} style={{ textAlign: 'center' }}>
					{children}
				</div>
			)

		case 'align-right':
			return (
				<div key={key} style={{ textAlign: 'right' }}>
					{children}
				</div>
			)

		case 'align-justify':
			return (
				<div key={key} style={{ textAlign: 'justify' }}>
					{children}
				</div>
			)

		default:
			return <p key={key}>{children}</p>
	}
}

export const TextViewer = ({ content }) => {
	const parsed = useMemo(() => {
		try {
			return JSON.parse(content)
		} catch (e) {
			console.error('Invalid JSON content', e)
			return []
		}
	}, [content])

	return (
		<div className='text-[var(--black)] w-full'>
			{parsed.map((el, idx) => renderElement(el, idx))}
		</div>
	)
}
