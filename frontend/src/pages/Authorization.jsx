import { NavLink, useNavigate } from 'react-router-dom'
import { InputAuth, InputDefault } from '../components/Inputs'
import { Link } from '../components/Links'
import { Button, SubmitButton } from '../components/Buttons'
import { useContext, useEffect, useState } from 'react'
import { API } from '../API'
import { AuthContext } from '../context/AuthContext'
import DecryptedText from '../components/ReactBits/DecryptedText'
import LiquidEther from '../components/ReactBits/LiquidEther'
import TextType from '../components/ReactBits/TextType'

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

	const [showMessage, setShowMessage] = useState(null)

	const showMessageFunc = message => {
		setShowMessage(message)
		const timer = setTimeout(() => {
			setShowMessage(null)
		}, 5000)

		return () => clearTimeout(timer)
	}

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

			if (result?.detail === 'Пользователь не найден')
				showMessageFunc(result?.detail)
			else login(result)
		} catch (error) {
			console.error('Ошибка:', error)
		}
	}

	return (
		<div className='relative'>
			<p
				className={`absolute transition-all bg-[var(--red-status-bg)] text-[var(--red-status-text)]  px-6 py-2 rounded-lg shadow-[var(--shadow)] left-1/2 -translate-x-1/2 ${
					showMessage ? 'top-5 opacity-100' : '-top-25 opacity-50'
				} `}
			>
				{showMessage}
			</p>
			<div className='mx-40 h-screen flex justify-center items-center'>
				<div className='w-full grid grid-cols-[1fr_auto_2fr] gap-3'>
					<div className='flex flex-col w-150 justify-between'>
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
						<p className='font-base text-[var(--black)] text-[64px] flex flex-col items-start w-full h-50'>
							<TextType
								text={'Твои курсы \nпод рукой'}
								typingSpeed={100}
								pauseDuration={1500}
								showCursor={true}
								cursorCharacter='|'
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
