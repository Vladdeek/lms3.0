import { MessageCircleQuestionMark } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { Link } from './Links'

const FooterLink = ({ to, title, index }) => {
	return (
		<NavLink
			to={to}
			className={`group text-base max-lg:text-sm max-[913px]:text-xs w-fit ${
				index === 0
					? 'font-medium text-[var(--black)]'
					: index > 0 && index < 10
					? 'font-normal text-[var(--middle)]'
					: index === 10 && 'font-normal text-[var(--black)]'
			}`}
		>
			<p className='text-end'>
				{title.split('\n').map((line, i) => (
					<React.Fragment key={i}>
						{line}
						<br />
					</React.Fragment>
				))}
			</p>
			<div
				className={`${
					index === 0
						? 'bg-[var(--black)]'
						: index > 0 && index < 10
						? 'bg-[var(--middle)]'
						: index === 10 && 'bg-[var(--black)]'
				} h-[1px] w-0 group-hover:w-full transition-all`}
			></div>
		</NavLink>
	)
}

const Footer = () => {
	const FooterLinks = [
		[
			{ title: 'Каталог', to: '/' },
			{ title: 'Добавление курса', to: '/' },
			{ title: 'Вебинары', to: '/' },
		],
		[
			{ title: 'Проверка заданий', to: '/' },
			{ title: 'Журнал оценок', to: '/' },
			{ title: 'Успеваемость студентов', to: '/' },
		],
		[
			{ title: 'Университет', to: '/' },
			{ title: 'Студенту', to: '/' },
			{ title: 'Сотруднику', to: '/' },
		],
		[
			{ title: 'Контакты', to: '/' },
			{ title: '+7 (990) 052 06-70', to: '/' },
			{ title: 'vladryazanov2709@gmail.com', to: '/' },
		],
	]
	return (
		<footer className='flex flex-col bottom-0 bg-[var(--white)] -mx-10 pt-7 pb-5 px-10 mt-10'>
			<div className=' grid grid-cols-[1fr_3fr]  gap-5  w-full border-b-1 border-[var(--middle)] mb-3 pb-3'>
				<div className='flex flex-col gap-5'>
					<p className='uppercase text-4xl max-xl:text-2xl font-bold text-[var(--black)]'>
						МелГУ СУО
					</p>
					<p className='text-sm max-xl:text-xs font-normal text-[var(--middle)]'>
						Учись, общайся и достигай целей без границ. Доступ к лекциям,
						расписанию и заданиям — всегда под рукой.
					</p>
				</div>
				<div className='flex justify-between'>
					{FooterLinks.map((column, colIndex) => (
						<div key={colIndex} className='flex flex-col gap-4'>
							{column.map((link, linkIndex) => (
								<FooterLink key={linkIndex} {...link} index={linkIndex} />
							))}
						</div>
					))}

					<div className='flex flex-col gap-4 items-end max-xl:hidden'>
						<div className='p-3 w-fit rounded-lg bg-[var(--hero-epta)] text-white'>
							<MessageCircleQuestionMark size={24} />
						</div>
						<FooterLink title={`Техническая \n поддержка`} index={1} />
						<p className='text-end text-base font-normal text-[var(--middle)]'></p>
					</div>
				</div>
			</div>
			<div className='flex justify-between items-center'>
				<div className='flex gap-5'>
					<p className='font-medium text-[var(--black)]'>МелГУ СУО</p>
					<FooterLink title={`Все права защищены`} index={10} />
				</div>
				<div className='flex gap-5 max-xl:flex-row-reverse items-center'>
					<FooterLink title={`Техническая поддержка`} index={10} />
					<FooterLink title={`Политика конфиденциальности`} index={10} />
				</div>
			</div>
		</footer>
	)
}
export default Footer
