import { NavLink, useNavigate } from 'react-router-dom'
import { InputAuth, InputDefault } from '../components/Inputs'
import { Link } from '../components/Links'
import { Button, SubmitButton } from '../components/Buttons'
import { useContext, useEffect, useState } from 'react'
import { API } from '../API'
import { AuthContext } from '../context/AuthContext'
import DecryptedText from '../components/ReactBits/DecryptedText'
import LiquidEther from '../components/ReactBits/LiquidEther'

const Authorization = ({ isRegister = false }) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isEmailValid, setIsEmailValid] = useState(false)
	const [isPasswordValid, setIsPasswordValid] = useState(false)

	const storedAccess = localStorage.getItem('access_token')
	const storedRefresh = localStorage.getItem('refresh_token')

	const navigate = useNavigate()

	const { login } = useContext(AuthContext)

	const emailValidate = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
	const passwordValidate = value =>
		/^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)

	const isFormValid = isEmailValid && isPasswordValid

	const handleSubmit = async e => {
		e.preventDefault()

		const data = { email: email, password: password }

		try {
			const response = await fetch(`${API}/auth/jwt/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})
			const result = await response.json()

			login(result)
		} catch (error) {
			console.error('Ошибка:', error)
		}
	}

	return (
		<div className=''>
			<div className='mx-40 h-screen flex justify-center items-center'>
				<div className='w-full grid grid-cols-[1fr_auto_2fr] gap-3'>
					<div className='flex flex-col w-full justify-between'>
						<p className='text-8xl mb-15 text-[var(--hero-epta)] flex gap-3 font-bold w-full'>
							<DecryptedText
								text='МелГУ'
								animateOn='view'
								revealDirection='center'
							/>
							<DecryptedText
								text='СУО'
								animateOn='view'
								revealDirection='center'
							/>
						</p>
						<p className='font-base text-[var(--black)] text-[64px] flex flex-col items-start w-full'>
							<DecryptedText
								text='Твои курсы'
								animateOn='view'
								revealDirection='center'
							/>
							<DecryptedText
								text='под рукой'
								animateOn='view'
								revealDirection='center'
							/>
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
									<Link to={'#'} title={'Забыли логин или пароль?'} />
								</div>
								<SubmitButton
									disabled={!isFormValid}
									title={isRegister ? 'Зарегистрироваться' : 'Войти'}
									style={'black'}
									onClick={handleSubmit}
								/>
							</div>
							<div className='flex justify-between items-center mt-25'>
								<div className='flex gap-3'></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
export default Authorization
