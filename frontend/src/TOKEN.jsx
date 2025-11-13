export const token = localStorage.getItem('access_token')

export const getCookie = name => {
	const cookies = document.cookie ? document.cookie.split('; ') : []
	for (let c of cookies) {
		const [k, ...v] = c.split('=')
		if (k === name) return decodeURIComponent(v.join('='))
	}
	return null
}
