import { useEffect } from 'react'
import { Input } from '../components/Inputs'
import { Link } from '../components/Links'
import { RoundButton } from '../components/Buttons'
import { NavLink } from 'react-router-dom'

const Authorization = () => {
	useEffect(() => {
		const previousColor = document.body.style.backgroundColor
		document.body.style.backgroundColor = '#FFFAF3'

		return () => {
			document.body.style.backgroundColor = previousColor
		}
	}, [])
	return (
		<>
			<div className='mx-40 h-screen'>
				<div className='h-25 w-25 rounded-[20px] bg-[var(--black)] mt-10 mb-25'></div>
				<div className='w-full grid grid-cols-[1fr_auto_2fr] gap-3'>
					<div className=''>
						<NavLink
							to={'/main'}
							className='flex items-center select-none  hover:scale-101 active:scale-99 transition-all gap-6 mb-10 w-fit'
						>
							<img
								className='h-[30px] w-auto'
								src='./assets/icons/arrow.svg'
								alt=''
							/>
							<p className='text-black font-medium text-4xl'>Главная</p>
						</NavLink>
						<p className='font-bold text-[#363909] text-[64px] leading-20 w-full'>
							Твои курсы <br />
							под рукой
						</p>
					</div>

					<div className='flex items-center'>
						<div className='border-[1px] border-[#363909] h-full'></div>
					</div>

					<div className='grid grid-cols-[1fr_7fr] gap-3'>
						<div></div>
						<div className=' flex flex-col '>
							<div className='w-full h-fit py-4 px-8 bg-white rounded-[20px] flex flex-col font-medium text-2xl text-[#101010] mb-[53px]'>
								<p>
									Hi there! <br /> Use demo account to check how this theme
									works. <br />
									Login: student, password: Demo123#
								</p>
							</div>
							<div className='flex flex-col gap-10'>
								<Input type={'text'} placeholder={'Логин'} />
								<Input type={'password'} placeholder={'Пароль'} />
								<Link to={''} title={'Забыли логин или пароль?'} />
							</div>
							<div className='flex justify-between items-center mt-25'>
								<p className='text-[#9e9385] text-2xl font-medium'>
									* Некоторые курсы
									<br /> доступны в режиме гостя
								</p>
								<div className='flex gap-3'>
									<RoundButton color={'#101010'} text={'white'} size={136}>
										Войти
									</RoundButton>
									<RoundButton
										color={'#101010'}
										text={'white'}
										size={136}
										outline={true}
									>
										Гость
									</RoundButton>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
export default Authorization
