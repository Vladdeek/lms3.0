import { WS_API } from './API'
import { useEffect, useState } from 'react'

class WSService {
	constructor(url = WS_API) {
		this.url = url
		this.socket = null
		this.listeners = []
	}

	connect() {
		this.socket = new WebSocket(this.url)

		this.socket.onopen = () => console.log('WS открыт')
		this.socket.onmessage = e => {
			const data = JSON.parse(e.data)
			this.listeners.forEach(fn => fn(data))
		}
		this.socket.onclose = () => {
			console.log('WS закрыт, переподключение через 1 сек')
			setTimeout(() => this.connect(), 1000)
		}
		this.socket.onerror = err => console.error('WS ошибка', err)
	}

	send(data) {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify(data))
		} else {
			console.warn('WS не готов, сообщение не отправлено')
		}
	}

	subscribe(fn) {
		this.listeners.push(fn)
		return () => {
			this.listeners = this.listeners.filter(listener => listener !== fn)
		}
	}
}

export default function useWebSocket(url) {
	const [messages, setMessages] = useState([])
	const ws = new WSService(url)

	useEffect(() => {
		ws.connect()

		const unsubscribe = ws.subscribe(msg => setMessages(prev => [...prev, msg]))

		return () => {
			unsubscribe()
		}
	}, [url])

	return {
		messages,
		send: data => ws.send(data),
	}
}
