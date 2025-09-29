import { NavLink } from 'react-router-dom'
import { InputAuth, InputDefault } from '../components/Inputs'
import { Link } from '../components/Links'
import { Button, SubmitButton } from '../components/Buttons'

const Authorization = () => {
	return (
		<>
			<div className='mx-40 h-screen'>
				<div className='h-25 w-25 rounded-[20px] bg-transition mt-10 mb-25'></div>
				<div className='w-full grid grid-cols-[1fr_auto_2fr] gap-3'>
					<div className=''>
						<p className='font-bold text-[var(--hero-epta)]  text-[64px] leading-20 w-full'>
							Твои курсы <br />
							под рукой
						</p>
					</div>

					<div className='flex items-center'>
						<div className='border-[1px] border-[var(--hero-epta)] h-full'></div>
					</div>

					<div className='grid grid-cols-[1fr_7fr] gap-3'>
						<div></div>
						<div className=' flex flex-col '>
							<div className='flex flex-col gap-10 mt-20'>
								<InputAuth
									placeholder={'Введите логин...'}
									title={'Логин'}
									required={true}
								/>
								<InputAuth
									password={true}
									placeholder={'••••••••'}
									title={'Пароль'}
									required={true}
								/>
								<Link to={'#'} title={'Забыли логин или пароль?'} />
								<SubmitButton title={'Войти'} style={'black'} />
							</div>
							<div className='flex justify-between items-center mt-25'>
								<div className='flex gap-3'></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
export default Authorization
