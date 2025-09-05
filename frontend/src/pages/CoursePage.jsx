import { useEffect, useMemo, useState } from 'react'
import React from 'react'
import {
	ArrowRightFromLine,
	BookMarked,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsDown,
	ChevronsUp,
	ChevronUp,
	Copy,
	Frown,
	Gem,
	LaptopMinimalCheck,
	ListRestart,
	NotebookPen,
	Package,
	Plus,
	Trash,
} from 'lucide-react'
import { Button, EllipsisButton } from '../components/Buttons'
import { InputDefault, SearchInput } from '../components/Inputs'
import CustomCodeBlock from '../components/CustomCodeBlock'
import CustomAudioPlayer from '../components/AudioPlayer'
import FormulaView from '../components/Viewer/FormulaView'
import { FileView } from '../components/Viewer/FileView'
import { CalloutView } from '../components/Viewer/CalloutView'
import { ButtonView } from '../components/Viewer/ButtonView'
import { PhotoView } from '../components/Viewer/PhotoView'
import VideoPlayer from '../components/VideoPlayer'
import TableView from '../components/Viewer/TableView'
import MoreVariantView from '../components/TestView/MoreVariantsView'
import OneVariantView from '../components/TestView/OneVariantView'
import SortVariantView from '../components/TestView/SortVariantsView'

const ModuleTitle = ({ title, index, isExpanded, onToggle }) => {
	const options = [
		{
			title: 'Переместить вверх',
			icon: <ChevronsUp size={20} />,
			action: 'up',
		},
		{
			title: 'Переместить вниз',
			icon: <ChevronsDown size={20} />,
			action: 'down',
		},
		{ title: 'Дублировать', icon: <Copy size={20} />, action: 'copy' },
		{ title: 'Удалить', icon: <Trash size={20} />, action: 'del' },
	]
	return (
		<div className='flex justify-between items-center'>
			<div className='flex gap-3 text-[var(--middle)] items-center'>
				<div className='flex items-center gap-4 bg-[var(--white)] shadow-[var(--shadow)] rounded-xl px-3 py-2 text-[var(--black)]'>
					<Package size={20} />
					<p className='font-medium text-base whitespace-nowrap'>
						Модуль {index}
					</p>
				</div>
				<p className='font-bold text-base'>/</p>
				<p className='font-normal text-base'>{title}</p>
			</div>
			<div className='flex gap-3'>
				<Button
					icon={isExpanded ? ChevronUp : ChevronDown}
					style='white'
					size={32}
					onClick={onToggle}
				/>
			</div>
		</div>
	)
}

const ModuleContent = ({ type, index, title, bg, onClick }) => {
	const options = [
		{
			title: 'Переместить вверх',
			icon: <ChevronsUp size={20} />,
			action: 'up',
		},
		{
			title: 'Переместить вниз',
			icon: <ChevronsDown size={20} />,
			action: 'down',
		},
		{ title: 'Дублировать', icon: <Copy size={20} />, action: 'copy' },
		{ title: 'Удалить', icon: <Trash size={20} />, action: 'del' },
	]
	return (
		<div
			onClick={onClick}
			className={`flex justify-between items-center ${
				!bg && 'hover:bg-[var(--light-middle)] cursor-pointer px-3'
			} rounded-lg cursor-default  transition-all  `}
		>
			<div className='flex gap-3 text-[var(--middle)] items-center'>
				<div
					className={`flex items-center gap-4 text-[var(--black)] px-3 py-2 rounded-lg ${
						bg && 'bg-[var(--white)] shadow-[var(--shadow)]'
					}`}
				>
					{type === 'Лекция' ? (
						<BookMarked size={20} />
					) : type === 'Практика' ? (
						<NotebookPen size={20} />
					) : (
						type === 'Тест' && <LaptopMinimalCheck size={20} />
					)}
					<p className='font-medium text-base whitespace-nowrap'>
						{type} {index}
					</p>
				</div>
				<p className='font-bold text-base'>/</p>
				<p className={`font-normal  ${bg ? 'text-base' : 'text-sm w-3/5'}`}>
					{title}
				</p>
			</div>
		</div>
	)
}

const ModuleBlock = ({
	ModuleInfo,
	onContentSelect,
	selectedContent,
	onAddLesson,
}) => {
	const [expandedModules, setExpandedModules] = useState({})

	const toggleModule = index => {
		setExpandedModules(prev => ({
			...prev,
			[index]: !prev[index],
		}))
	}

	return (
		<>
			{ModuleInfo.map((item, index) => {
				const isExpanded = expandedModules[index] === true

				return (
					<div key={index} className='flex flex-col gap-3'>
						<ModuleTitle
							title={item.title}
							index={index + 1}
							isExpanded={isExpanded}
							onToggle={() => toggleModule(index)}
						/>
						{isExpanded && (
							<>
								<div className=''>
									{item.content.map((lesson, lessonIndex) => {
										return (
											<ModuleContent
												key={lesson.id}
												title={lesson.title}
												type={lesson.type}
												onClick={() => onContentSelect(lesson)}
												isSelected={selectedContent?.id === lesson.id}
											/>
										)
									})}
								</div>
							</>
						)}
					</div>
				)
			})}
		</>
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
				{questions.map((q, idx) => (
					<div
						key={q.id}
						onClick={() => setActiveIndex(idx)}
						className={`w-10 h-10 flex justify-center items-center rounded-md shadow-[var(--shadow)] cursor-pointer transition-all
                            ${
															activeIndex === idx
																? 'bg-[var(--hero-epta)] text-[var(--white)]'
																: 'bg-[var(--white)] text-[var(--black)] hover:bg-[var(--hero-epta)] hover:text-[var(--white)]'
														}
                            active:scale-90`}
					>
						{idx + 1}
					</div>
				))}
			</div>
		</>
	)
}

const ContentView = ({ content }) => {
	const [blocks, setBlocks] = useState([])

	const questions = useMemo(() => {
		if (!content || !content.content) return []
		return [...content.content].sort(() => Math.random() - 0.5)
	}, [content])

	const [activeIndex, setActiveIndex] = useState(0)

	if (!content) {
		return (
			<div className='bg-[var(--white)] shadow-[var(--shadow)] rounded-xl p-6 flex items-center justify-center h-full'>
				<p className='text-[var(--middle)] text-lg'>
					Выберите занятие для просмотра
				</p>
			</div>
		)
	}

	return (
		<div className='bg-[var(--white)] shadow-[var(--shadow)] flex flex-col gap-3 rounded-xl p-5 overflow-scroll max-h-200'>
			<ModuleContent bg={true} type={content.type} title={content.title} />
			<div className='flex flex-col gap-5'>
				{}
				{content.content.length !== 0 ? (
					content.type !== 'Тест' ? (
						content.content.map(item => {
							return <React.Fragment>{item}</React.Fragment>
						})
					) : (
						<>
							<LevelsBar
								questions={questions}
								activeIndex={activeIndex}
								setActiveIndex={setActiveIndex}
							/>
							<div className='w-full flex justify-center'>
								<React.Fragment>{questions?.[activeIndex]}</React.Fragment>
							</div>
							<div className='flex justify-center gap-3'>
								{activeIndex !== 0 ? (
									<button
										onClick={() => setActiveIndex(prev => prev - 1)}
										className={` justify-center items-center pr-4 pl-1 py-2 bg-[var(--black)] text-[var(--white)] rounded-lg font-medium hover:bg-[var(--hero-epta)] hover:text-white transition-all cursor-pointer flex`}
									>
										<ChevronLeft />
										<p>Назад</p>
									</button>
								) : (
									<div></div>
								)}
								{activeIndex + 1 !== questions.length ? (
									<button
										onClick={() => setActiveIndex(prev => prev + 1)}
										className=' justify-center items-center pl-4 pr-1 py-2 bg-[var(--black)] text-[var(--white)] rounded-lg font-medium hover:bg-[var(--hero-epta)] hover:text-white transition-all cursor-pointer flex'
									>
										<p>Далее</p>
										<ChevronRight />
									</button>
								) : (
									<button
										onClick={() => console.log('')}
										className=' justify-center items-center px-4 py-2 bg-[var(--black)] text-[var(--white)] rounded-lg font-medium hover:bg-[var(--hero-epta)] hover:text-white transition-all cursor-pointer flex'
									>
										<p>Завершить тест</p>
									</button>
								)}
							</div>
						</>
					)
				) : (
					<div className='flex w-full h-150 justify-center items-center'>
						<div className='flex gap-3 text-lg items-center font-medium text-[var(--middle)]'>
							<p>Пусто</p>
							<Frown />
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

const CourseOverview = ({ title }) => {
	const [ModuleInfo, setModuleInfo] = useState([
		{
			id: 0,
			title: 'Вступление',
			content: [
				{
					id: 0,
					type: 'Лекция',
					title: 'Hello, World! Или как подружиться с кодом',
					content: [
						<p className='font-bold text-2xl'>
							Hello, World! Или как подружиться с кодом
						</p>,

						<div className='w-full'>
							<p>
								<span className='w-full text-center block'>
									<span className='font-bold '>Тема: </span> Первые шаги в
									программировании <br />
									<span className='font-bold'>Цель: </span> Познакомиться с
									программированием через классический пример "Hello, World!"
								</span>
							</p>
						</div>,

						<p>
							Когда человек только начинает изучать программирование, он
							чувствует себя так, словно открыл дверь в совершенно новый мир.
							Всё выглядит сложно, страшно и непонятно: странные слова, символы,
							скобочки. Но на самом деле это всё обычный язык, только язык не
							для людей, а для компьютеров. И первый шаг к этому языку —
							программа <code>Hello, World!</code>.
						</p>,

						<CalloutView
							IconId={3}
							title='Что такое программа?'
							description='Программа — это набор инструкций, которые компьютер выполняет строго по порядку. 
    Ты как будто пишешь рецепт, только вместо яиц и сковородки — данные и команды.'
						/>,

						<p>
							Представь, что ты объясняешь другу, как приготовить омлет: «Возьми
							яйца, взбей, пожарь». Программа работает так же — шаг за шагом
							выполняет твои указания. Чем понятнее и последовательнее
							инструкции, тем точнее результат.
						</p>,

						<CustomCodeBlock
							codeInfo={[
								{
									code: `// JavaScript
console.log("Hello, World!");`,
									language: 'javascript',
								},
							]}
						/>,

						<CustomCodeBlock
							codeInfo={[
								{
									code: `# Python
print("Hello, World!")`,
									language: 'python',
								},
							]}
						/>,

						<CalloutView
							IconId={2}
							title='Почему именно Hello, World?'
							description='Это традиция. Такой код — минимальная проверка: работает ли твоя среда программирования. 
    Если ты увидел надпись на экране, значит всё настроено правильно, и можно двигаться дальше.'
						/>,

						<p>
							Некоторые новички недооценивают этот шаг и думают: «Ну и что? Это
							же просто вывод текста!». Но именно в этот момент ты доказываешь
							самому себе, что можешь заставить компьютер «заговорить». Это не
							магия, это твой первый инструмент.
						</p>,

						<CalloutView
							IconId={8}
							title='Важно помнить'
							description='Даже самые сложные программы начинаются с простых инструкций. 
    Никто не пишет шедевр кода с первого раза. Всё начинается с маленьких шагов.'
						/>,

						<p>
							Каждый программист, даже тот, кто сегодня пишет огромные системы,
							когда-то радовался одной фразе на экране. Поэтому относись к этому
							коду не как к ерунде, а как к первому кирпичику твоего будущего.
						</p>,

						<CalloutView
							IconId={7}
							title='Заметка'
							description='В разных языках синтаксис отличается, но смысл остаётся одинаковым: вывести сообщение.'
						/>,
					],
				},
				{
					id: 1,
					type: 'Практика',
					title: 'Hello, World! Или как подружиться с кодом',
					content: [
						<p className='font-bold text-2xl'>Практика: твой первый код</p>,

						<p>
							Теперь пришло время немного попрактиковаться. Помни: цель практики
							не в том, чтобы написать сложные алгоритмы, а в том, чтобы
							почувствовать сам процесс. Ты должен привыкнуть к мысли: «Я
							написал строку, и компьютер сделал то, что я хотел».
						</p>,

						<CustomCodeBlock
							codeInfo={[
								{
									code: `// Задание 1
// Напиши программу, которая выводит твоё имя.
console.log("Меня зовут Владос");`,
									language: 'javascript',
								},
							]}
						/>,

						<CalloutView
							IconId={3}
							title='Подсказка'
							description='Функция console.log() в JavaScript — это как твой голос. 
    Всё, что ты ей скажешь, будет выведено в консоль.'
						/>,

						<CustomCodeBlock
							codeInfo={[
								{
									code: `# Задание 2
# Выведи на экран свой любимый фильм.
print("Мой любимый фильм — Интерстеллар")`,
									language: 'python',
								},
							]}
						/>,

						<p>
							Уже чувствуешь магию? Ты пишешь всего пару строк, а компьютер
							покорно выполняет их. Это и есть самое начало «дружбы с кодом». Но
							давай не будем останавливаться.
						</p>,

						<CustomCodeBlock
							codeInfo={[
								{
									code: `// Задание 3
// Выведи результат простой математики
console.log(2 + 2); // 4
console.log(10 - 3); // 7`,
									language: 'javascript',
								},
							]}
						/>,

						<CalloutView
							IconId={5}
							title='Ошибка — это нормально!'
							description='Если код не заработал с первого раза — не пугайся. 
    Ошибки — часть процесса. Даже опытные программисты видят их каждый день.'
						/>,

						<TableView
							rows={3}
							cols={2}
							values={[
								'Команда',
								'Что делает',
								'console.log()',
								'Выводит сообщение в консоль (JavaScript)',
								'print()',
								'Выводит сообщение в терминал (Python)',
								'2 + 2',
								'Вычисляет сумму чисел',
							]}
						/>,

						<CalloutView
							IconId={4}
							title='Совет'
							description='Всегда пробуй менять текст или числа в заданиях. 
    Так ты лучше поймёшь, как код реагирует на разные данные.'
						/>,
					],
				},
				{
					id: 2,
					type: 'Тест',
					title: 'Hello, World! Или как подружиться с кодом',
					content: [
						<OneVariantView
							question={
								'Что обычно первым делом выводит программист на экране?'
							}
							Answers={['Hello, world!', 'Привет, мир!', 'Start program']}
						/>,
						<MoreVariantView
							question={'Что нужно, чтобы написать первую программу?'}
							Answers={[
								'Редактор кода или IDE',
								'Кружка кофе или чая',
								'Минимальное понимание синтаксиса',
								'Знание всех алгоритмов мира',
							]}
						/>,
						<OneVariantView
							question={'Для чего нужен синтаксис в программировании?'}
							Answers={[
								'Чтобы компьютер понимал команды',
								'Чтобы код выглядел красиво',
								'Чтобы быстрее печатать',
							]}
						/>,
						<OneVariantView
							question={'Что обозначает слово «компиляция»?'}
							Answers={[
								'Преобразование кода в понятный компьютеру язык',
								'Сохранение файла с кодом',
								'Скачивание программы из интернета',
							]}
						/>,
						<SortVariantView
							question={'Соотнеси сокращения и их значения'}
							initialPairs={[
								{ id: '1', left: 'CPU', right: 'Центральный процессор' },
								{ id: '2', left: 'RAM', right: 'Оперативная память' },
								{ id: '3', left: 'IDE', right: 'Среда разработки' },
							]}
						/>,
						<OneVariantView
							question={'Что ближе всего по смыслу к слову «код»?'}
							Answers={[
								'Инструкции для компьютера',
								'Секретный пароль',
								'Шифр Цезаря',
							]}
						/>,
						<OneVariantView
							question={'Какая из профессий напрямую связана с кодом?'}
							Answers={['Программист', 'Художник', 'Повар']}
						/>,
						<MoreVariantView
							question={'Что можно сделать с помощью кода?'}
							Answers={[
								'Создать сайт',
								'Написать игру',
								'Приготовить ужин',
								'Автоматизировать задачи',
							]}
						/>,
						<OneVariantView
							question={'Что такое «Hello, world!» в программировании?'}
							Answers={[
								'Первая тестовая программа',
								'Приветствие нового разработчика',
								'Название языка программирования',
							]}
						/>,
						<SortVariantView
							question={
								'Расположи шаги написания программы в правильном порядке'
							}
							initialPairs={[
								{ id: '1', left: '1', right: 'Написать код' },
								{ id: '2', left: '2', right: 'Запустить программу' },
								{ id: '3', left: '3', right: 'Увидеть результат' },
							]}
						/>,
						<OneVariantView
							question={'Что нужно, чтобы компьютер выполнил программу?'}
							Answers={[
								'Правильный синтаксис и команды',
								'Интернет-соединение',
								'Красивый шрифт',
							]}
						/>,
						<OneVariantView
							question={
								'Какой язык программирования был создан одним из первых?'
							}
							Answers={['Fortran', 'Python', 'JavaScript']}
						/>,
						<MoreVariantView
							question={'Что важно для дружбы с кодом?'}
							Answers={[
								'Терпение и практика',
								'Желание учиться',
								'Идеальная память',
								'Фантазия и креатив',
							]}
						/>,
						<OneVariantView
							question={'Как называют ошибки в коде?'}
							Answers={['Баги', 'Глюки', 'Траблы']}
						/>,
						<MoreVariantView
							question={'Что является частью программирования?'}
							Answers={[
								'Логика',
								'Тестирование',
								'Математика',
								'Игры на PlayStation',
							]}
						/>,
					],
				},
			],
		},
		{
			id: 1,
			title: 'Основы программирования',
			content: [
				{
					id: 3,
					type: 'Лекция',
					title: 'Переменные и типы данных',
					content: [],
				},
				{
					id: 4,
					type: 'Практика',
					title: 'Работа с переменными',
					content: [],
				},
			],
		},
		{
			id: 2,
			title: 'Условия и циклы',
			content: [
				{
					id: 5,
					type: 'Лекция',
					title: 'Условные конструкции if/else',
					content: [],
				},
				{
					id: 6,
					type: 'Практика',
					title: 'Решение задач с условиями',
					content: [],
				},
			],
		},
	])

	const [selectedContent, setSelectedContent] = useState(null)
	const handleContentSelect = content => {
		setSelectedContent(content)
	}

	// ...existing code...
	const handleAddLesson = (moduleIndex, lesson) => {
		setModuleInfo(prev =>
			prev.map((module, idx) =>
				idx === moduleIndex
					? {
							...module,
							content: [
								...module.content,
								{
									id: Date.now(),
									type: lesson.type,
									title: lesson.title,
									content: 'Задания для практического занятия...',
								},
							],
					  }
					: module
			)
		)
	}

	// Новый обработчик для добавления модуля
	const handleAddModule = title => {
		setModuleInfo(prev => [
			...prev,
			{
				id: Date.now(),
				title,
				content: [],
			},
		])
	}

	return (
		<>
			<div className='grid grid-cols-[1fr_3fr] gap-5 h-fit min-h-[607px]'>
				<div className='flex flex-col gap-3'>
					<div className='flex bg-[var(--white)] justify-center rounded-xl shadow-[var(--shadow)] px-4 py-3 gap-3'>
						<Gem size={32} color='var(--hero-epta)' strokeWidth={1.5} />
						<p className='font-medium text-2xl text-[var(--black)]'>{title}</p>
					</div>
					<div className='bg-[var(--white)] shadow-[var(--shadow)] rounded-xl pb-5 px-3 pt-5 flex flex-col justify-between'>
						<div className='flex flex-col gap-3'>
							<div className='flex flex-col gap-3 px-2'>
								<div className='flex justify-between w-full'>
									<p className='font-medium text-[20px] text-[var(--black)]'>
										Содержимое
									</p>
									<Button icon={ArrowRightFromLine} style='white' size={32} />
								</div>
								<div className='flex gap-[10px]'>
									<SearchInput width={'100%'} />
									<Button icon={ListRestart} style='white' size={40} />
								</div>
							</div>

							<div className='h-150 flex flex-col gap-3 overflow-scroll w-full py-2 px-2'>
								<ModuleBlock
									ModuleInfo={ModuleInfo}
									onContentSelect={handleContentSelect}
									selectedContent={selectedContent}
									onAddLesson={handleAddLesson} // передаём функцию
								/>
							</div>
						</div>
					</div>
				</div>

				<ContentView content={selectedContent} />
			</div>
		</>
	)
}

const CoursePage = () => {
	const title = 'Основы программирования'

	return (
		<>
			<div className='flex flex-col gap-5'>
				<div className='flex justify-between items-center mt-10'></div>

				<CourseOverview title={title} />
			</div>
		</>
	)
}
export default CoursePage
