import { useEffect } from 'react'

const CustomCursor = () => {
	useEffect(() => {
		const cursor = document.getElementById('custom-cursor')

		const moveCursor = e => {
			cursor.style.left = `${e.clientX}px`
			cursor.style.top = `${e.clientY}px`
		}

		const handleMouseOver = e => {
			const target = e.target.closest(
				'button, a, [role="button"], [onclick], [data-clickable]'
			)
			if (target) cursor.classList.add('cursor-hover')
		}

		const handleMouseOut = () => {
			cursor.classList.remove('cursor-hover')
		}

		const handleClick = () => {
			cursor.classList.add('cursor-clicked')

			setTimeout(() => {
				cursor.classList.remove('cursor-clicked')
				cursor.classList.add('cursor-post-clicked')

				// Плавно вернуть курсор обратно через ещё одну задержку
				setTimeout(() => {
					cursor.classList.remove('cursor-post-clicked')
				}, 150) // Должно совпадать с transition в CSS
			}, 150) // Должно совпадать с .cursor-clicked transition
		}

		document.addEventListener('mousemove', moveCursor)
		document.addEventListener('mouseover', handleMouseOver)
		document.addEventListener('mouseout', handleMouseOut)
		document.addEventListener('click', handleClick)

		return () => {
			document.removeEventListener('mousemove', moveCursor)
			document.removeEventListener('mouseover', handleMouseOver)
			document.removeEventListener('mouseout', handleMouseOut)
			document.removeEventListener('click', handleClick)
		}
	}, [])

	return <div id='custom-cursor'></div>
}

export default CustomCursor
