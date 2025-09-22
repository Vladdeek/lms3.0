import { useState } from 'react'

const ToggleRole = ({ onChange }) => {
	const [isActive, setIsActive] = useState(0)

	const handleToggle = value => {
		setIsActive(value)
		if (onChange && typeof onChange === 'function') {
			onChange(value)
		}
	}

	return (
		<>
			<div className='bg-white rounded-xl flex flex-col gap-3 p-4 shadow-lg'>
				<button
					onClick={() => handleToggle(0)}
					className={`w-35 bg-transparent  border-1 py-3  rounded-lg cursor-pointer ${
						isActive === 0
							? 'border-pink-500 text-pink-500'
							: 'border-black hover:border-pink-500 text-black hover:text-pink-500'
					}`}
				>
					Студент
				</button>
				<button
					onClick={() => handleToggle(1)}
					className={`w-35 bg-transparent  border-1 py-3  rounded-lg cursor-pointer  ${
						isActive === 1
							? 'border-pink-500 text-pink-500'
							: 'border-black hover:border-pink-500 text-black hover:text-pink-500'
					}`}
				>
					Преподаватель
				</button>
			</div>
		</>
	)
}
export default ToggleRole
