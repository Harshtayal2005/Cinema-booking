import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { TrashIcon, ArrowsUpDownIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/solid'
import { useForm } from 'react-hook-form'
import Theater from './Theater'
import { useEffect, useState } from 'react'
import DatePicker from './DatePicker'

const TheaterListsByMovie = ({ movies, selectedMovieIndex, setSelectedMovieIndex, auth }) => {
	const [selectedDate, setSelectedDate] = useState(new Date())
	const [theaters, setTheaters] = useState([])

	const fetchTheaters = async (data) => {
		try {
			console.log(movies[selectedMovieIndex]._id, selectedDate)
			const response = await axios.get(
				`/theater/movie/${movies[selectedMovieIndex]._id}/${selectedDate.toISOString()}`
			)
			console.log(response.data.data)
			setTheaters(
				response.data.data.sort((a, b) => {
					if (a.cinema.name > b.cinema.name) return 1
					if (a.cinema.name === b.cinema.name && a.number > b.number) return 1
					return -1
				})
			)
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		fetchTheaters()
	}, [selectedMovieIndex, selectedDate])

	return (
		<div className="mx-4 h-fit rounded-md bg-gradient-to-br from-indigo-200 to-blue-100 drop-shadow-md sm:mx-8">
			<div className="flex flex-col gap-6 p-4 sm:p-6">
				<div className="rounded-md bg-gradient-to-br from-indigo-800 to-blue-700 p-2">
					<DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
				</div>
				{theaters.map((theater, index) => {
					if (theaters[index - 1]?.cinema.name !== theaters[index].cinema.name) {
						return (
							<>
								<div className="rounded-md bg-gradient-to-br from-gray-900 to-gray-800 py-1.5 px-2 text-center text-2xl font-semibold text-white sm:py-2">
									<h2>{theaters[index].cinema.name}</h2>
								</div>
								<Theater
									key={index}
									theaterId={theater._id}
									movies={movies}
									selectedDate={selectedDate}
									filterMovie={movies[selectedMovieIndex]}
								/>
							</>
						)
					}
					return (
						<Theater
							key={index}
							theaterId={theater._id}
							movies={movies}
							selectedDate={selectedDate}
							filterMovie={movies[selectedMovieIndex]}
						/>
					)
				})}
			</div>
		</div>
	)
}

export default TheaterListsByMovie