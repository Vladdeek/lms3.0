import CustomCodeBlock from '../components/CustomCodeBlock'

const Students = () => {
	const codeInfo = [
		{
			code: `const Tasks = () => {
	return (
		<div className='w-screen h-screen flex justify-AlignCenter items-AlignCenter'>
			<p className='text-7xl font-bold'>Проверка заданий</p>
		</div>
	)
}
export default Tasks
`,
			language: 'javascript',
		},
		{
			code: `class Student:
    def __init__(self, name, group):
        self.name = name
        self.group = group
    
    def display_info(self):
        print(f"Студент: {self.name}, Группа: {self.group}")

def create_students():
    students = [
        Student("Иван Иванов", "ГР-101"),
        Student("Петр Петров", "ГР-102"),
        Student("Мария Сидорова", "ГР-101")
    ]
    return students

if __name__ == "__main__":
    students_list = create_students()
    for student in students_list:
        student.display_info()`,
			language: 'python',
		},
	]

	return (
		<>
			<div className='flex'>
				<p className='text-7xl font-bold'>Студенты и группы</p>
			</div>
			<div className='flex flex-col gap-5 code-block'>
				<CustomCodeBlock codeInfo={codeInfo[0]} />
				<CustomCodeBlock codeInfo={codeInfo[1]} />
			</div>
		</>
	)
}

export default Students
