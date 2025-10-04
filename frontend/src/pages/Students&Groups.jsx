import { act, useState } from 'react'
import { OptionInput } from '../components/Inputs'

import {
	ArrowBigDownDash,
	CalendarDays,
	Filter,
	LaptopMinimalCheck,
	NotebookPen,
} from 'lucide-react'
import { FilterButton } from '../components/Buttons'
import MoreVariantView from '../components/TestView/MoreVariantsView'
import OneVariantView from '../components/TestView/OneVariantView'
import SortVariantView from '../components/TestView/SortVariantsView'
import OpenQuestionView from '../components/TestView/OpenQuestionView'

const StudentCard = ({ img_path, FullName, score, onClick, active }) => {
	return (
		<div
			onClick={onClick}
			className={`bg-[var(--white)]  flex gap-3 rounded-md px-3 py-[10px] ${
				active
					? 'ring-1 ring-[var(--hero-epta)] shadow-[var(--hero-shadow)]'
					: 'shadow-[var(--shadow)] '
			}`}
		>
			<img className='aspect-square rounded-full h-10 ' src={img_path} alt='' />
			<div className='flex flex-col justify-between'>
				<p
					className={`text-[var(--black)] whitespace-nowrap font-medium text-sm ${
						active && 'text-[var(--hero-epta)]'
					}`}
				>
					{`${FullName.split(' ')[0]} 
					${FullName.split(' ')[1]} 
					${FullName.split(' ')[2]?.[0]}.`}
				</p>
				<p className='text-[var(--middle)] whitespace-nowrap text-sm'>
					Оценка: {score}
				</p>
			</div>
		</div>
	)
}

const MaterialCard = ({ title }) => {
	return (
		<>
			<div className='flex gap-2 h-[50px]'>
				<div className='bg-[var(--white)] rounded-lg shadow-[var(--shadow)] w-full flex gap-3 px-3 py-[9px] items-center select-none'>
					<img className='h-8 w-8' src='./assets/icons/file1.svg' alt='' />
					<p className='text-sm text-[var(--black)]'>{title}</p>
				</div>
				<div className='bg-[var(--white)] rounded-lg shadow-[var(--shadow)] w-10 flex justify-center items-center cursor-pointer hover:scale-110 active:scale-95 active:brightness-95 transition-all'>
					<ArrowBigDownDash />
				</div>
			</div>
		</>
	)
}

const StudentTable = () => {
	const type = [
		'ПР1',
		'T1',
		'ПР2',
		'T2',
		'ПР3',
		'T3',
		'ПР4',
		'T4',
		'ПР5',
		'T5',
		'ПР6',
		'T6',
		'ПР7',
		'T7',
	]
	const StudentScore = [
		{
			name: 'Рязанов Владислав Денисович',
			score: [3, 4, '', 5, 4, 3, '', 5, 5, 4, 4, 3, '', ''],
		},
		{
			name: 'Иванов Иван Иванович',
			score: [3, 2, '', '', 4, 3, 5, 5, '', 4, 4, 3, '', ''],
		},
		{
			name: 'Ковалев Евген Алексеевич',
			score: [3, 4, '', '', 4, 2, '', 5, 3, 4, 4, 3, '', ''],
		},
		{
			name: 'Козак Дмитрий Денисович',
			score: [3, 4, '', 2, 4, 3, '', '', 2, 4, 4, '', '', ''],
		},
	]
	return (
		<>
			<div className='flex items-center text-[var(--black)]  rounded-lg'>
				<div className='w-1/4 flex items-center'>
					<div className='w-1/5 flex items-center justify-center'>
						<p className='bg-[var(--light-gray)] h-full w-full text-center py-2 rounded-lg'>
							№
						</p>
					</div>
					<div className='w-4/5 flex items-center justify-center'>
						<p>ФИО</p>
					</div>
				</div>
				<div className='w-3/4 flex items-center justify-between'>
					{type.map((item, index) => {
						return (
							<div
								className={`flex items-center justify-center w-15 h-full py-2 rounded-lg ${
									index % 2 === 0
										? 'bg-[var(--light-gray)]'
										: 'bg-[var(--white)] '
								}`}
							>
								<p className='text-center' key={index}>
									{item}
								</p>
							</div>
						)
					})}
					<p className='w-15 text-center bg-[var(--light-gray)] h-full py-2 rounded-lg'>
						ср/б
					</p>
				</div>
			</div>
			<div className='flex flex-col gap-2 mt-3'>
				{StudentScore.map((item, index) => {
					return (
						<StudentCard4Table
							num={index + 1}
							FullName={item.name}
							scores={item.score}
							average={4}
						/>
					)
				})}
			</div>
		</>
	)
}

const StudentCard4Table = ({ num, FullName, scores }) => {
	const calculateAverage = scores => {
		const validScores = scores.filter(score => score !== '' && !isNaN(score))
		if (validScores.length === 0) return 0
		const sum = validScores.reduce((total, score) => total + Number(score), 0)
		return (sum / validScores.length).toFixed(0)
	}
	const average = calculateAverage(scores)
	return (
		<>
			<div className='flex items-center text-[var(--black)] shadow-[var(--shadow)] rounded-lg overflow-hidden'>
				<div className='w-1/4 flex items-center'>
					<div className='w-1/5 flex items-center justify-center'>
						<p className='bg-[var(--light-gray)] h-full w-full text-center py-2'>
							{num}
						</p>
					</div>
					<div className='w-4/5 flex items-center justify-center'>
						<p className='bg-[var(--white)] h-full w-full text-center py-2'>{`${
							FullName.split(' ')[0]
						} ${FullName.split(' ')[1]} ${FullName.split(' ')[2][0]}.`}</p>
					</div>
				</div>
				<div className='w-3/4 flex items-center justify-between'>
					{scores.map((item, index) => {
						return (
							<div
								key={index}
								className={`flex items-center justify-center w-15 h-full ${
									item.length !== 0 ? 'py-2' : 'py-5'
								} ${
									index % 2 === 0
										? 'bg-[var(--light-gray)]'
										: 'bg-[var(--white)] '
								}`}
							>
								<p className='text-center'>{item}</p>
							</div>
						)
					})}
					<p className='w-15 text-center bg-[var(--light-gray)] py-2' h-full>
						{average}
					</p>
				</div>
			</div>
		</>
	)
}

const TaskCard = ({ title, type, isActive, onClick }) => {
	return (
		<div
			onClick={onClick}
			className={`bg-[var(--white)]  rounded-lg p-4 items-center flex gap-5 ${
				isActive
					? 'ring-1 ring-[var(--hero-epta)] shadow-[var(--hero-shadow)]'
					: 'shadow-[var(--shadow)]'
			} transition-all cursor-pointer`}
		>
			<div className='flex gap-3 text-[var(--black)]'>
				{(() => {
					switch (type) {
						case 'Практика':
							return (
								<>
									<NotebookPen size={24} />
								</>
							)
						case 'Тест':
							return (
								<>
									<LaptopMinimalCheck size={24} />
								</>
							)
						default:
							return null
					}
				})()}
				<p className='font-medium '>{type}</p>
			</div>
			<p className='font-medium text-[var(--middle)]'>/</p>
			<p className='text-[var(--middle)]'>{title}</p>
		</div>
	)
}

const PracticeView = ({ content }) => {
	return (
		<div className='flex flex-col w-full gap-3'>
			<TaskCard title={content.title} type={content.type} isActive={false} />
			<p className='font-medium'>Предоставлены материалы для оценки</p>
			{content.material.map(item => {
				return <MaterialCard title={item} />
			})}
			<div className='flex flex-col gap-3 w-1/4'>
				<p className='text-[var(--middle)]'>Введите балл</p>
				<OptionInput Options={[1, 2, 3, 4, 5]} />
			</div>
		</div>
	)
}

const LevelsBar = ({
	questions,
	setQuestions,
	activeIndex,
	setActiveIndex,
}) => {
	return (
		<>
			<div className='flex gap-3'>
				{questions.map((q, idx) => {
					// Определяем статус ответа
					let answerStatus = 'incorrect' // по умолчанию

					if (Array.isArray(q.selectedId) && Array.isArray(q.correct)) {
						// Для массива ответов
						const correctCount = q.selectedId.filter(id =>
							q.correct.includes(id)
						).length
						const totalCorrect = q.correct.length

						if (
							correctCount === totalCorrect &&
							q.selectedId.length === totalCorrect
						) {
							answerStatus = 'correct'
						} else if (correctCount > 0) {
							answerStatus = 'partial'
						}
					} else {
						answerStatus = q.selectedId === q.correct ? 'correct' : 'incorrect'
					}

					return (
						<div
							key={q.id}
							onClick={() => setActiveIndex(idx)}
							className={`w-10 h-10 flex flex-wrap justify-center items-center rounded-md cursor-pointer transition-all 
                ${
									answerStatus === 'correct'
										? 'border-b-[3px] border-[var(--correct-lvl)] shadow-[var(--correct-glow)]'
										: answerStatus === 'partial'
										? 'border-b-[3px] border-[var(--middle-correct-lvl)] shadow-[var(--middle-correct-glow)]'
										: 'border-b-[3px] border-[var(--not-correct-lvl)] shadow-[var(--not-correct-glow)]'
								}
                ${
									activeIndex === idx
										? answerStatus === 'correct'
											? 'bg-[var(--correct-lvl)] text-white'
											: answerStatus === 'partial'
											? 'bg-[var(--middle-correct-lvl)] text-white'
											: 'bg-[var(--not-correct-lvl)] text-white'
										: answerStatus === 'correct'
										? 'bg-[var(--white)] text-[var(--black)] hover:bg-[var(--correct-lvl)] hover:text-[var(--white)]'
										: answerStatus === 'partial'
										? 'bg-[var(--white)] text-[var(--black)] hover:bg-[var(--middle-correct-lvl)] hover:text-[var(--white)]'
										: 'bg-[var(--white)] text-[var(--black)] hover:bg-[var(--not-correct-lvl)] hover:text-[var(--white)]'
								}
                active:scale-90`}
						>
							{idx + 1}
						</div>
					)
				})}
			</div>
		</>
	)
}

const TestView = ({ content }) => {
	const [activeIndex, setActiveIndex] = useState(0)

	return (
		<div className='w-full flex flex-col  gap-3'>
			<TaskCard title={content.title} type={content.type} isActive={false} />
			<LevelsBar
				questions={content.material}
				activeIndex={activeIndex}
				setActiveIndex={setActiveIndex}
			/>
			<div className='flex justify-center'>
				{(() => {
					const q = content.material[activeIndex]

					if (q.type === 'more') {
						return (
							<MoreVariantView
								question={q.question}
								Answers={q.answers}
								selected={q.selectedId}
								shuffle={false}
								correctAnswers={q.correct}
								showCorrect={true}
							/>
						)
					} else if (q.type === 'single') {
						return (
							<OneVariantView
								question={q.question}
								Answers={q.answers}
								selectedId={q.selectedId}
								shuffle={false}
								CorrectAnswer={q.correct}
							/>
						)
					} else if (q.type === 'sort') {
						return (
							<SortVariantView
								question={q.question}
								initialPairs={q.answers}
								shuffle={false}
							/>
						)
					} else if (q.type === 'open') {
						return <OpenQuestionView question={q.question} value={q.answer} />
					}

					return null
				})()}
			</div>
		</div>
	)
}

const StudentsAndGroups = () => {
	const [ActiveStudent, setActiveStudent] = useState(0)
	const [ActiveTask, setActiveTask] = useState(0)
	const [ActiveType, setActiveType] = useState(0)
	const GroupMass = [
		'2211-0101.1',
		'2324-0121.2',
		'2232-0101.5',
		'2211-0131.7',
		'2321-0101.3',
		'2211-0211.1',
		'4211-0101.2',
		'2211-0101.1',
		'2211-0141.1',
		'2421-0101.1',
		'2211-4201.1',
		'2211-0101.2',
	]
	const Type = ['Оценка', 'Комментарий']
	const Score = [1, 2, 3, 4, 5]
	const Tasks = [
		{ title: 'Практика1', type: 'Практика', material: ['1', '2', '3'] },
		{
			title: 'Тест1',
			type: 'Тест',
			material: [
				{
					type: 'more',
					question: '2',
					answers: ['1', '2', '3', '4'],
					selectedId: [1, 3],
					correct: [1, 2],
				},

				{
					type: 'single',
					question: '4',
					answers: ['1', '2', '3', '4'],
					selectedId: 2,
					correct: 1,
				},
				{
					type: 'sort',
					question: 'Расположи шаги написания программы в правильном порядке',
					answers: [
						{ id: '1', left: '1', right: 'Написать код' },
						{ id: '2', left: '2', right: 'Запустить программу' },
						{ id: '3', left: '3', right: 'Увидеть результат' },
					],
				},
				{
					type: 'open',
					question: 'Почему?',
					answer: 'Потому что',
				},
			],
		},
	]
	return (
		<>
			<div className='grid grid-cols-12 gap-5 mt-20 select-none h-screen'>
				<div className='col-span-2 flex flex-col gap-5 h-5/6'>
					<div className='bg-[var(--white)] flex flex-col gap-3 rounded-lg shadow-[var(--shadow)] p-5'>
						<p className='text-[var(--middle)] text-sm'>Выберите курс</p>
						<OptionInput Options={GroupMass} />
					</div>
					<div className='bg-[var(--white)] flex flex-col gap-3 rounded-lg shadow-[var(--shadow)] p-5'>
						<p className='text-[var(--middle)] text-sm'>
							Выберите группу студентов
						</p>
						<OptionInput Options={GroupMass} />
					</div>
					<div className='bg-[var(--white)] rounded-lg shadow-[var(--shadow)] overflow-y-auto hide-scrollbar max-h-200'>
						<div className='flex flex-col gap-3 p-5'>
							{students.map((item, index) => (
								<StudentCard
									key={item.id || index}
									onClick={() => setActiveStudent(index)}
									active={ActiveStudent === index}
									img_path={item.img}
									FullName={item.name}
									score={item.score}
								/>
							))}
						</div>
					</div>
				</div>
				<div className='col-span-3 bg-[var(--white)] rounded-lg shadow-[var(--shadow)] flex flex-col justify-between p-5 h-5/6'>
					<div className='flex flex-col gap-4'>
						<p className='font-medium text-[var(--black)] text-xl'>
							Выберите занятие для просмотра
						</p>
						{Tasks.map((item, index) => {
							return (
								<TaskCard
									title={item.title}
									type={item.type}
									onClick={() => setActiveTask(index)}
									isActive={ActiveTask === index}
								/>
							)
						})}
					</div>
				</div>
				<div className='col-span-7 bg-[var(--white)] rounded-lg shadow-[var(--shadow)] flex p-4 h-5/6'>
					{(() => {
						switch (Tasks[ActiveTask].type) {
							case 'Практика':
								return <PracticeView content={Tasks[ActiveTask]} />
							case 'Тест':
								return <TestView content={Tasks[ActiveTask]} />
							default:
								return <p>Выберите занятие</p>
						}
					})()}
				</div>
			</div>
		</>
	)
}
export default StudentsAndGroups
