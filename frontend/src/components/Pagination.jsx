import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

const BasicPagination = ({ count }) => {
	return (
		<div className='flex justify-center w-full'>
			<Stack spacing={1}>
				<Pagination
					count={count}
					shape='rounded'
					sx={{
						'& .MuiPaginationItem-root': {
							color: 'var(--black)',
						},
						'& .Mui-selected': {
							backgroundColor: 'var(--hero-epta)',
							color: '#fff',
						},
						'& .MuiPaginationItem-root:hover': {
							backgroundColor: 'var(--hero-pale)',
							border: '1px solid var(--hero-epta)',
							color: 'var(--hero-epta)',
							transition: 'all 0.3s ease',
						},
					}}
					size='medium'
				/>
			</Stack>
		</div>
	)
}
export default BasicPagination
