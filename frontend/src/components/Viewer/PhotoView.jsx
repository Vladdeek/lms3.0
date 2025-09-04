import { useState } from 'react'

export const PhotoView = ({ photos }) => {
	const [Photos, setPhotos] = useState(photos)

	return (
		<div className='flex w-full justify-center'>
			<div
				className={`grid grid-cols-2 ${
					Photos.length === 2 ? 'w-full' : 'w-2/3'
				}  p-3 gap-1`}
			>
				{Photos.map((item, index) => (
					<div
						key={index}
						className={`flex justify-center ${
							Photos.length === 1
								? 'col-span-2'
								: Photos.length === 2
								? 'col-span-1'
								: Photos.length === 4
								? 'col-span-1'
								: Photos.length === 3 && index === 2
								? 'col-span-2'
								: 'col-span-1'
						}
						}  w-full aspect-video`}
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
