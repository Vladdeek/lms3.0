import api, { API } from '../../API'

const QuestionDeleteModal = ({ questionId, setDeleteModalActive }) => {
	const [isLoading, setIsLoading] = useState(false)
	const deleteQuestion = () => {
		if (questionId === undefined) {
			setDeleteModalActive(false)
		} else {
			setIsLoading(true)
			try {
				const { data } = api.delete(`${API}`, {})

				setDeleteModalActive(false)
				setIsLoading(false)
			} catch (error) {
				setIsLoading(false)
			}
		}
	}
	return (
		<div className='fixed inset-0 z-[1000] flex items-center justify-center backdrop-blur-xs'>
			<div className='p-4 h-30 rounded-xl flex flex-col gap-5 items-center justify-center bg-[var(--white)] shadow-[var(--shadow)]'>
				{isLoading ? (
					<div className='w-91 flex justify-center items-center'>
						<AltLoader />
					</div>
				) : (
					<>
						<p className='text-[var(--black)]'>
							Вы уверены что хотите удалить этот вопрос?
						</p>
						<div className='flex gap-3'>
							<button
								onClick={() => deleteQuestion(questionId)}
								className='bg-[var(--black)] text-[var(--white)] rounded-xl px-4 py-2 hover:text-white hover:bg-red-500 transition-all cursor-pointer'
							>
								Удалить
							</button>
							<button
								onClick={() => {
									setDeleteModalActive(false)
								}}
								className='bg-[var(--black)] text-[var(--white)] rounded-xl px-4 py-2 hover:text-[var(--black)] hover:bg-[var(--white)] border-1 border-transparent hover:border-[var(--middle)] shadow-[var(--shadow)] transition-all cursor-pointer'
							>
								Отмена
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	)
}
export default QuestionDeleteModal
