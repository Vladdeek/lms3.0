import { useState } from 'react'

export const PhotoView = ({ photos }) => {
	const [Photos, setPhotos] = useState(photos)

	return (
		<div className='flex w-full justify-center'>
			<div className='grid grid-cols-2 w-4/5 p-3 gap-1'>
				{Photos.map((item, index) => (
					<div
						key={index}
						className={`flex justify-center  w-full aspect-video`}
					>
						<img
							src={item}
							alt={`preview-${index}`}
							className='w-full h-full object-cover rounded-lg'
						/>
					</div>
				))}
			</div>
		</div>
	)
}
