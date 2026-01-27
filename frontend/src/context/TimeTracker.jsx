import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api, { API } from '../API'

const SectionTimeTracker = () => {
	const { SectionId } = useParams()

	useEffect(() => {
		if (!SectionId) return

		let intervalId

		const start = async () => {
			try {
				await api.post(`${API}/sections/${SectionId}/time/start`)

				intervalId = setInterval(() => {
					api.post(`${API}/sections/${SectionId}/time/ping`)
				}, 30_000) // пинг раз в 30 сек (можешь менять)
			} catch (e) {
				console.error('Time start error', e)
			}
		}

		const end = async () => {
			try {
				await api.post(`${API}/sections/${SectionId}/time/end`)
			} catch (e) {
				console.error('Time end error', e)
			}
		}

		start()

		return () => {
			if (intervalId) clearInterval(intervalId)
			end()
		}
	}, [SectionId])

	return null
}

export default SectionTimeTracker
