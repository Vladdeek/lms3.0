import { WS_API } from './API'
import { useEffect, useState } from 'react'

/*
  Singleton — один экземпляр на всё приложение.
  Это важно! Нельзя создавать новый сокет в каждом компоненте.
*/
class WSService {
	socket = null
	listeners = []
	reconnectTimer = null
	isConnecting = false

	// запуск соединения
	connect(url = WS_API) {
		// если уже подключены или подключаемся — ничего не делаем
		if (this.socket || this.isConnecting) return

		this.isConnecting = true
		this.socket = new WebSocket(url)

		// соединение установлено
		this.socket.onopen = () => {
			console.log('WS подключен')
			this.isConnecting = false
		}

		// получили сообщение от сервера
		this.socket.onmessage = event => {
			try {
				const data = JSON.parse(event.data)

				// рассылаем сообщение всем подписчикам
				this.listeners.forEach(listener => listener(data))
			} catch (err) {
				console.error('Ошибка парсинга WS сообщения', err)
			}
		}

		// соединение закрылось (интернет умер, сервер рестартнулся и тд)
		this.socket.onclose = () => {
			console.log('WS отключен → пробуем переподключиться через 1 сек')

			this.socket = null
			this.isConnecting = false

			// авто-переподключение
			this.reconnectTimer = setTimeout(() => {
				this.connect(url)
			}, 1000)
		}

		this.socket.onerror = err => {
			console.error('WS ошибка', err)
			this.socket?.close()
		}
	}

	/*
    Подписка на события от сервера
    Каждый компонент может слушать сообщения
  */
	subscribe(callback) {
		this.listeners.push(callback)

		// возвращаем функцию отписки (React будет вызывать при unmount)
		return () => {
			this.listeners = this.listeners.filter(l => l !== callback)
		}
	}
}

/*
  Экспортируем ГОТОВЫЙ экземпляр (singleton)
  Это ключевой момент.
*/

const wsService = new WSService()

export default function useWebSocket() {
	const [messages, setMessages] = useState([])

	useEffect(() => {
		// запускаем соединение (если уже запущено — ничего не произойдет)
		wsService.connect()

		/*
      Подписываемся на входящие сообщения.
      Каждый раз когда сервер что-то прислал —
      добавляем сообщение в state.
    */
		const unsubscribe = wsService.subscribe(message => {
			setMessages(prev => [...prev, message])
		})

		// отписка при размонтировании компонента
		return unsubscribe
	}, [])

	return {
		messages, // весь поток сообщений от сервера
	}
}
