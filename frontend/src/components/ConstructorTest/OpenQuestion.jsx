import { InputDefault } from '../Inputs'
import { AddMediaButton } from './AddMedia'
import { ScoreInput1, ScoreInput2 } from './ScoreInput'

const OpenQuestion = () => {
	return (
		<>
			<div className='flex'>
				<div className='flex flex-col justify-center items-end p-4 w-3/4'>
					<div className='flex flex-col gap-3 w-2/3 mb-5'>
						<div className='flex gap-3 items-end'>
							<InputDefault title={'Введите вопрос'} required={true} />
							<ScoreInput1 />
						</div>

						<AddMediaButton />
					</div>
				</div>
				<div className=' flex justify-center items-center  w-1/4'></div>
			</div>
		</>
	)
}

export default OpenQuestion
