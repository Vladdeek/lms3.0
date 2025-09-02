import { id } from 'date-fns/locale'
import DirectionOfTraining from '../components/DirectionOfTraining'

const SubjectRow = ({ scores, SubjectId, SubjectName, maxScoresCount }) => {
	const calculateAverage = () => {
		const numericScores = scores
			.map(item => {
				const score = parseFloat(item.score)
				return !isNaN(score) && isFinite(score) ? score : null
			})
			.filter(score => score !== null)
		if (numericScores.length === 0) {
			return '-'
		}
		const sum = numericScores.reduce((total, score) => total + score, 0)
		return (sum / numericScores.length).toFixed(0)
	}

	const averageScore = calculateAverage()
	return (
		<div className='bg-[var(--white)] rounded-lg p-2 flex items-center shadow-[var(--shadow)]'>
			<div className='w-1/5 flex mr-5'>
				<p className='w-1/5 text-center'>{SubjectId}</p>
				<p className='w-4/5 text-center'>{SubjectName}</p>
			</div>
			<div className='w-4/5 flex'>
				{scores.map((item, index) => {
					return (
						<div
							key={index}
							className='flex flex-col items-center'
							style={{ width: `${100 / maxScoresCount}%` }}
						>
							<p className='font-medium text-[var(--black)]'>{item.score}</p>
							<p className='font-light text-[var(--middle)]'>{item.type}</p>
						</div>
					)
				})}
			</div>
			<div className='flex flex-col items-center w-[3%] text-[var(--black)] font-bold text-xl'>
				<p>{averageScore}</p>
			</div>
		</div>
	)
}

const ScorePage = () => {
	const ScoreMass = [
		{
			name: 'Основы программирования',
			scores: [
				{ type: 'п1', score: 3 },
				{ type: 'т1', score: 4 },
				{ type: 'п2', score: 5 },
				{ type: 'п3', score: 4 },
				{ type: 'т2', score: 4 },
				{ type: 'п4', score: 5 },
				{ type: 'т3', score: 3 },
				{ type: 'т4', score: 5 },
				{ type: 'п5', score: 4 },
			],
		},
		{
			name: 'СУБД',
			scores: [
				{ type: 'п1', score: 3 },
				{ type: 'п2', score: 5 },
				{ type: 'п3', score: 4 },
				{ type: 'т2', score: 4 },
				{ type: 'п4', score: 5 },
				{ type: 'т3', score: 3 },
				{ type: 'т4', score: 5 },
			],
		},
		{
			name: 'Математический анализ',
			scores: [
				{ type: 'п1', score: 3 },
				{ type: 'п2', score: 5 },
				{ type: 'п3', score: 4 },
				{ type: 'т2', score: 4 },
				{ type: 'п4', score: 5 },
				{ type: 'т3', score: 3 },
				{ type: 'т4', score: 5 },
				{ type: 'т6', score: 5 },
				{ type: 'п5', score: 4 },
				{ type: 'т7', score: 5 },
			],
		},
		{
			name: 'Обьектно ориентированое программирование ',
			scores: [
				{ type: 'п1', score: 3 },
				{ type: 'п2', score: 5 },
				{ type: 'п3', score: 4 },
				{ type: 'т2', score: 4 },
				{ type: 'п4', score: 5 },
				{ type: 'т3', score: 3 },
				{ type: 'п5', score: 3 },
				{ type: 'т4', score: 4 },
			],
		},
	]

	const maxScoresCount = Math.max(
		...ScoreMass.map(subject => subject.scores.length)
	)

	return (
		<div className='h-screen'>
			<div className='grid grid-cols-6 gap-2 p-4'>
				<div className='col-span-1'>
					<DirectionOfTraining group={'2211-0101.1'} course={3} DofT={'ИБ'} />
				</div>

				<div className='col-span-5 flex flex-col gap-3 bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4'>
					<div className='bg-[var(--white)] rounded-lg p-2 flex'>
						<div className='w-1/5 flex'>
							<p className='w-1/5 text-center'>№</p>
							<p className='w-4/5 text-center'>Название предмета</p>
						</div>
						<div className='w-4/5 flex gap-2'></div>
						<div className='flex flex-col items-center w-[3%]'>
							<p>ср/б</p>
						</div>
					</div>
					{ScoreMass.map((item, index) => {
						return (
							<SubjectRow
								SubjectId={index + 1}
								SubjectName={item.name}
								scores={item.scores}
								maxScoresCount={maxScoresCount}
							/>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default ScorePage
