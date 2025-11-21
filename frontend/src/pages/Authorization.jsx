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
import { getCookie, token } from '../TOKEN'
import axios from 'axios'

const Authorization = ({ isRegister = false }) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isEmailValid, setIsEmailValid] = useState(false)
	const [isPasswordValid, setIsPasswordValid] = useState(false)

	const navigate = useNavigate()

	const emailValidate = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
	const passwordValidate = value =>
		/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)

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
			const response = await axios.post(`${API}/auth/jwt/login`, data, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': getCookie('csrftoken'),
				},
			})

			const result = response.data
			if (result?.detail === 'Пользователь не найден')
				showMessageFunc(result?.detail)
		} catch (error) {
			console.error('Ошибка:', error)
			setError(error.response ? String(error.response.status) : '500')
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
			<div className='mx-4 sm:mx-10 md:mx-20 lg:mx-40 h-screen flex justify-center items-center'>
				<div className='w-full xl:grid grid-cols-[1fr_auto_2fr] gap-3'>
					<div className='flex flex-col w-150 max-2xl:w-120 xl:justify-between'>
						<p className='text-8xl max-2xl:text-7xl max-sm:text-6xl mb-15 text-[var(--hero-epta)] flex gap-3 font-bold w-full'>
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
						<p className='font-base text-[var(--black)] text-[64px] max-2xl:text-6xl max-md:text-4xl flex flex-col items-start w-full h-50'>
							<TextType
								text={'Твои курсы \nпод рукой'}
								typingSpeed={100}
								pauseDuration={1500}
								showCursor={true}
								cursorCharacter='|'
							/>
						</p>
					</div>

					<div className='max-xl:hidden flex items-center'>
						<div className='border-[1px] border-[var(--hero-epta)] h-full'></div>
					</div>

					<div className='xl:grid grid-cols-[1fr_7fr] gap-3'>
						<div></div>
						<div className=' flex flex-col '>
							<form
								onSubmit={handleSubmit}
								className='flex flex-col gap-10 xl:mt-20'
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
								<div className=' gap-5 hidden'>
									<Link to={'#'} title={'Забыли логин или пароль?'} />
								</div>
								<input
									type='submit'
									disabled={!isFormValid}
									className={`${
										isFormValid
											? 'active:scale-99 active:brightness-90 hover:bg-[var(--hero-epta)] hover:text-white  cursor-pointer'
											: 'opacity-25 cursor-not-allowed'
									} bg-[var(--black)] text-[var(--white)] rounded-xl h-full flex gap-4 items-center justify-center transition-all py-4`}
									value={isRegister ? 'Зарегистрироваться' : 'Войти'}
								/>
							</form>
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
