import { useEffect } from 'react'
import { UNSAFE_NavigationContext } from 'react-router-dom'
import { useContext } from 'react'

export function useUnsavedChangesGuard(isEdit) {
	const navigator = useContext(UNSAFE_NavigationContext).navigator

	// 1) Блокируем refresh / закрытие вкладки
	useEffect(() => {
		const handler = e => {
			if (!isEdit) return
			e.preventDefault()
			e.returnValue = ''
		}

		window.addEventListener('beforeunload', handler)
		return () => window.removeEventListener('beforeunload', handler)
	}, [isEdit])

	// 2) Блокируем навигацию внутри React Router
	useEffect(() => {
		if (!isEdit) return

		const push = navigator.push

		navigator.push = (...args) => {
			const confirmLeave = window.confirm(
				'Есть несохранённые изменения. Уйти со страницы?',
			)

			if (confirmLeave) {
				push(...args)
			}
		}

		return () => {
			navigator.push = push
		}
	}, [navigator, isEdit])

	// 3) Блокируем кнопку "назад"
	useEffect(() => {
		if (!isEdit) return

		const onPopState = e => {
			const confirmLeave = window.confirm(
				'Есть несохранённые изменения. Уйти со страницы?',
			)

			if (!confirmLeave) {
				window.history.pushState(null, '', window.location.href)
			}
		}

		window.addEventListener('popstate', onPopState)
		window.history.pushState(null, '', window.location.href)

		return () => window.removeEventListener('popstate', onPopState)
	}, [isEdit])
}
