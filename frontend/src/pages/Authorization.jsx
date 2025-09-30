import { NavLink } from 'react-router-dom'
import { InputAuth, InputDefault } from '../components/Inputs'
import { Link } from '../components/Links'
import { Button, SubmitButton } from '../components/Buttons'
import { useState } from 'react'
import { API } from '../API'

const Authorization = ({ isRegister = false }) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isEmailValid, setIsEmailValid] = useState(false)
	const [isPasswordValid, setIsPasswordValid] = useState(false)

	const emailValidate = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
	const passwordValidate = value =>
		/^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)

	const isFormValid = isEmailValid && isPasswordValid

	const handleSubmit = async e => {
		e.preventDefault() // чтобы страница не перезагружалась

		const data = { email: email, password: password }

		console.log(data)

		try {
			if (isRegister) {
				const response = await fetch(`${API}/auth/register`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				})
				const result = await response.json()
				console.log('Регистрация:', result)
			} else {
				const response = await fetch(`${API}/auth/jwt/login`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				})
				const result = await response.json()
				console.log('Логин:', result)
			}
		} catch (error) {
			console.error('Ошибка:', error)
		}
	}

	return (
		<>
			<div className='mx-40 h-screen'>
				<div className='h-25 w-25 rounded-[20px] bg-transition mt-10 mb-25'></div>
				<div className='w-full grid grid-cols-[1fr_auto_2fr] gap-3'>
					<div className=''>
						<p className='font-bold text-[var(--hero-epta)]  text-[64px] leading-20 w-full'>
							{isRegister ? 'Регистрация' : 'Авторизация'} <br /> <br />
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
							<form
								className='flex flex-col gap-10 mt-20'
								onSubmit={handleSubmit}
							>
								<InputAuth
									placeholder={'example@mail.ru'}
									title={'Почта'}
									required={true}
									onStatusChange={setIsEmailValid}
									validate={emailValidate}
									value={email}
									onChange={e => setEmail(e.target.value)}
								/>
								<InputAuth
									password={true}
									placeholder={'••••••••'}
									title={'Пароль'}
									required={true}
									onStatusChange={setIsPasswordValid}
									validate={passwordValidate}
									value={password}
									onChange={e => setPassword(e.target.value)}
								/>
								<div className='flex gap-5'>
									<Link
										to={isRegister ? '/auth/login' : '/auth/register'}
										title={isRegister ? 'Есть аккаунт?' : 'Создать аккаунт?'}
									/>
									<Link to={'#'} title={'Забыли логин или пароль?'} />
								</div>
								<SubmitButton
									disabled={!isFormValid}
									title={isRegister ? 'Зарегистрироваться' : 'Войти'}
									style={'black'}
								/>
							</form>
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
