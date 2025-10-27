import { ImageOff } from 'lucide-react'
import { useState } from 'react'

const ModerationCourseCard = ({
	img,
	user_img,
	title,
	fullname,
	onClick,
	active,
}) => {
	return (
		<>
			<div
				onClick={onClick}
				className={`w-full h-fit rounded-xl  flex items-center gap-3 p-4 text-[var(--black)] border-1 cursor-pointer transition-all active:scale-99 select-none ${
					active
						? 'border-[var(--hero-epta)] shadow-[var(--shadow-hero)]'
						: 'border-transparent shadow-[var(--shadow)]'
				}`}
			>
				<div
					className={`h-15 w-15 rounded-md ${
						!img && 'border-1 border-[var(--middle)] opacity-50 p-3'
					}`}
				>
					{img ? (
						<img src='' alt='' />
					) : (
						<ImageOff strokeWidth={1.125} className='w-full h-full' />
					)}
				</div>

				<div className='flex flex-col gap-1'>
					<p className='font-medium text-xl'>{title || 'Название курса'}</p>
					<div className='flex gap-3 items-center '>
						<div
							className={`h-6 w-6 rounded-full ${
								!user_img && 'border-1 border-[var(--middle)] opacity-50 p-1'
							}`}
						>
							{user_img ? (
								<img src='' alt='' />
							) : (
								<ImageOff strokeWidth={1.125} className='w-full h-full' />
							)}
						</div>
						<p className='font-light text-sm'>
							{`${fullname?.last_name} ${fullname?.first_name} ${fullname?.middle_name}` ||
								'ФИО автора курса'}
						</p>
					</div>
				</div>
			</div>
		</>
	)
}
const Moderation = ({ role }) => {
	const course = [
		{
			title: 'Курс номер 1',
			fullname: {
				first_name: 'Имя',
				last_name: 'Фамилия',
				middle_name: 'Отчество',
			},
		},
		{
			title: 'Курс номер 2',
			fullname: {
				first_name: 'Имя',
				last_name: 'Фамилия',
				middle_name: 'Отчество',
			},
		},
		{
			title: 'Курс номер 3',
			fullname: {
				first_name: 'Имя',
				last_name: 'Фамилия',
				middle_name: 'Отчество',
			},
		},
	]

	const [active, setActive] = useState(null)

	return (
		<>
			<div className='w-full h-[80vh] grid grid-cols-6 gap-5 mt-10'>
				<div className='col-span-1 bg-[var(--white)] rounded-2xl flex flex-col items-center gap-3 overflow-y-scroll hide-scrollbar p-4'>
					<p className='font-medium text-xl text-[var(--black)]'>Новые курсы</p>
					{course?.map((item, index) => (
						<ModerationCourseCard
							title={item?.title}
							fullname={item?.fullname}
							onClick={() => setActive(index)}
							active={active === index}
						/>
					))}
				</div>
				<div className='col-span-5 bg-[var(--white)] rounded-2xl'></div>
			</div>
		</>
	)
}
export default Moderation
