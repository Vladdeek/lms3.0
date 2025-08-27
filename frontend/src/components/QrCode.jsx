import { useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'

/**
 * Компонент QrCode
 * @param {string} url - ссылка, которую нужно закодировать в QR-коде
 */
const QRCode = ({ url, size }) => {
	const ref = useRef(null)
	const qrCode = useRef(null)

	useEffect(() => {
		// Создание экземпляра QRCodeStyling с кастомными стилями
		qrCode.current = new QRCodeStyling({
			width: size, // ширина QR-кода
			height: size, // высота QR-кода
			data: url, // данные для кодирования (ссылка)
			image: '', // можно вставить логотип в центр QR-кода (например, "/logo.png")
			margin: 10, // отступы вокруг QR-кода
			dotsOptions: {
				color: '#222222', // цвет точек
				type: 'rounded', // форма точек: "rounded", "dots", "classy", "classy-rounded", "square", "extra-rounded"
			},
			backgroundOptions: {
				color: '#ffffff', // цвет фона
				// можно добавить градиент:
				// gradient: {
				//   type: "linear", // "linear" или "radial"
				//   rotation: 0, // угол поворота (для linear)
				//   colorStops: [
				//     { offset: 0, color: "#ffffff" },
				//     { offset: 1, color: "#cccccc" }
				//   ]
				// }
			},
			imageOptions: {
				crossOrigin: 'anonymous', // для загрузки логотипа с другого домена
				margin: 10, // отступ логотипа от краёв QR-кода
				imageSize: 0.3, // размер логотипа (от 0 до 1, где 1 — весь QR-код)
				hideBackgroundDots: true, // скрывать точки под логотипом
			},
			cornersSquareOptions: {
				color: 'var(--black)', // цвет внешних квадратов углов
				type: 'extra-rounded', // форма: "dot", "square", "extra-rounded"
			},
			cornersDotOptions: {
				color: 'var(--black)', // цвет внутренних точек углов
				type: 'dot', // форма: "dot", "square"
			},
		})

		// Рендер QR-кода
		if (ref.current) {
			ref.current.innerHTML = ''
			qrCode.current.append(ref.current)
		}

		// Обновление данных при изменении url
		qrCode.current.update({ data: url })

		// Очистка при размонтировании
		return () => {
			if (ref.current) ref.current.innerHTML = ''
		}
	}, [url])

	return <div ref={ref} />
}

export default QRCode
