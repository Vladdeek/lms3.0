import { OptionInput } from './Inputs'

const DirectionOfTraining = ({ group, course, DofT }) => {
	const Direction = ['ИБ', 'ИТ']
	return (
		<div className='flex flex-col gap-2 bg-[var(--white)] shadow-[var(--shadow)] rounded-xl p-3 w-full'>
			<p className='text-center text-[var(--black)]'>Группа: {group}</p>
			<p className='text-center  text-[var(--black)]'>Курс: {course}</p>
			<p className='text-center  text-[var(--black)]'>
				Направление подготовки: {DofT}
			</p>
			<OptionInput
				Options={Direction}
				color='black'
				placeholder={'Направление подготовки'}
			/>
		</div>
	)
}
export default DirectionOfTraining
