import { ImageOff, TrendingUp } from 'lucide-react'
import { BlackButton, Button } from './Buttons'
import { NavLink } from 'react-router-dom'

export const ProductCard = ({ color, children, title, subtitle, namebtn }) => {
	return (
		<>
			<div
				className={`${
					color === 1
						? 'bg-[#f4d1e8] text-black'
						: color === 2
						? 'bg-[#f8ebeb] text-black'
						: 'bg-[#820000] text-white'
				} rounded-xl p-10 inline-flex flex-col gap-3 hover:-translate-y-1 transition-all`}
			>
				{children}
				<p className='text-xl font-medium mt-5'>{title}</p>
				<p className='text-xl font-normal mb-5'>{subtitle}</p>
				<div className='w-fit'>
					<BlackButton title={namebtn} />
				</div>
			</div>
		</>
	)
}

export const CourseCard = ({ title, img_path, to, follow }) => {
	return (
		<div className=' rounded-lg h-fit flex flex-col overflow-hidden w-full group cursor-none border-1 border-transparent transition-all hover:border-[#afafaf15]'>
			{img_path.length !== 0 ? (
				<img
					className='w-full h-50 rounded-lg object-cover'
					src={img_path}
					alt=''
				/>
			) : (
				<div className='w-full h-50 flex items-center justify-center bg-[var(--ghost-black)] text-[var(--light-ghost-black)] rounded-lg object-cover'>
					<ImageOff size={128} />
				</div>
			)}

			<div className='flex flex-col h-50 justify-between px-3 py-5 '>
				<NavLink
					to={to}
					className='font-bold text-2xl text-[var(--text)] hover:text-[var(--primary)] transition-all cursor-none'
				>
					{title}
				</NavLink>
				{!follow ? (
					<BlackButton title={'Записаться на курс'} />
				) : (
					<p className='bg-[var(--ghost-black)] text-[var(--light-ghost-black)] px-6 py-4 rounded-lg w-fit flex justify-center items-center text-[20px] unbounded font-normal'>
						Подписан
					</p>
				)}
			</div>
		</div>
	)
}
