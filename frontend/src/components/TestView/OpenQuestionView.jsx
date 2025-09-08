import { useState, useEffect, useMemo } from 'react'
import { Check } from 'lucide-react'

const OpenQuestionView = ({ question, media }) => {
	return (
		<div className='flex flex-col gap-5 justify-center items-center p-4 w-3/4'>
			<p className='font-medium text-lg'>{question}</p>

			<p className='font-light text-[var(--middle)] text-sm'>
				Это вопрос на который нужно ответить самостоятельно
			</p>

			<div className='w-full'>
				{media &&
					(media.type === 'audio' ? (
						<>
							<CustomAudioPlayer audioUrl={media.info} />
						</>
					) : media.type === 'photo' ? (
						<div className='aspect-video h-100 flex justify-center'>
							<img className='w-auto h-full' src={media.info} alt='' />
						</div>
					) : media.type === 'formula' ? (
						<>
							<FormulaView Formula={media.info} />
						</>
					) : (
						<></>
					))}
			</div>

			<div className='flex flex-col items-center gap-3 w-full'>
				<input
					type='text'
					className='rounded-xl p-[12px] shadow-[var(--shadow)] outline-0 focus:ring-1 focus:ring-[var(--hero-epta)] transition mt-3 w-full'
					placeholder={'Введите свой вариант ответа...'}
				/>
			</div>
		</div>
	)
}

export default OpenQuestionView
