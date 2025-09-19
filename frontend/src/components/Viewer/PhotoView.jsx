import { ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'

const FullScreen = ({ url, prevImg, nextImg, close }) => {
	return (
		<div className='flex fixed top-0 left-0 bg-[#00000025] backdrop-blur-[2px] z-1000 h-screen w-screen justify-center items-center'>
			<div className='relative flex justify-center items-center w-full h-full '>
				<div className='relative w-auto h-[75%] flex items-center rounded-3xl overflow-hidden'>
					<button
						onClick={close}
						className=' bg-red-500 text-white absolute right-3 top-3 p-1 rounded-full flex justify-center items-center hover:scale-110  active:scale-90 active:brightness-80 transition-all cursor-pointer'
					>
						<X size={20} strokeWidth={2.5} />
					</button>
					<button
						onClick={prevImg}
						className='bg-[var(--white)] text-[var(--black)] absolute left-3 p-2 pl-1.75 rounded-full flex justify-center items-center shadow-[var(--shadow)] hover:bg-[var(--hero-epta)] hover:text-white active:scale-90 active:brightness-80 transition-all cursor-pointer'
					>
						<ChevronLeft size={32} className='mr-0.25' />
					</button>
					<img className='w-full h-full' src={url} alt='' />
					<button
						onClick={nextImg}
						className='bg-[var(--white)] text-[var(--black)] absolute right-3 p-2 pr-1.75 rounded-full flex justify-center items-center shadow-[var(--shadow)] hover:bg-[var(--hero-epta)] hover:text-white active:scale-90 active:brightness-80 transition-all cursor-pointer'
					>
						<ChevronRight size={32} className='ml-0.25' />
					</button>
				</div>
			</div>
		</div>
	)
}

export const PhotoView = ({ photos }) => {
	const [Photos, setPhotos] = useState(photos)
	const [fullScreenPhoto, setFullScreenPhoto] = useState(null)

	return (
		<>
			{fullScreenPhoto !== null && (
				<FullScreen
					url={Photos[fullScreenPhoto]?.photoUrl}
					close={() => setFullScreenPhoto(null)}
					nextImg={() =>
						fullScreenPhoto >= 3
							? setFullScreenPhoto(0)
							: setFullScreenPhoto(prev => prev + 1)
					}
					prevImg={() =>
						fullScreenPhoto <= 0
							? setFullScreenPhoto(3)
							: setFullScreenPhoto(prev => prev - 1)
					}
				/>
			)}

			<div className='flex w-full justify-center'>
				<div
					className={`grid grid-cols-2 ${
						photos?.length !== 0 ? 'w-2/3' : 'w-full'
					} p-3 gap-2`}
				>
					{Photos.map((item, index) => (
						<div
							key={index}
							onClick={() => setFullScreenPhoto(index)}
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
						  w-full aspect-video cursor-pointer hover:scale-102 hover:shadow-[var(--shadow)] overflow-hidden rounded-lg transition-all`}
						>
							<img
								src={item.photoUrl}
								alt={''}
								className='w-full h-full object-cover '
							/>
						</div>
					))}
				</div>
			</div>
		</>
	)
}
