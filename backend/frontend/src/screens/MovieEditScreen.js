import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { listMoviesDetails, updateMovie } from '../actions/movieActions'
import { MOVIE_UPDATE_RESET } from '../constants/movieConstants'


function MovieEditScreen() {

    const { id } = useParams()

    const location = useLocation()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [image, setImage] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('') 
    const [upload, setUploading] = useState(false)
    
    const dispatch = useDispatch()

    const movieDetails = useSelector(state => state.movieDetails)
    const { error, loading, movie }  = movieDetails

    const movieUpdate = useSelector(state => state.movieUpdate)
    const { error: errorUpdate, loading: loadingUpdate, success: successUpdate }  = movieUpdate
    
    useEffect(() => {

        if(successUpdate) {
            dispatch({ type: MOVIE_UPDATE_RESET })
            navigate('/admin/movielist')
        } else {
            if(!movie.title || movie._id !== Number(id)) {
                dispatch(listMoviesDetails(id))
            } else {
                setTitle(movie.title)
                setImage(movie.image)
                setCategory(movie.category)
                setDescription(movie.description)
            }
        }
        
    }, [movie, id, navigate, successUpdate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateMovie({
            _id: id,
            title,
            image,
            category,
            description,
        }))
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()

        formData.append('image', file)
        formData.append('movieId', id)

        setUploading(true)

        try{
            const  config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }

            const { data } = await axios.post('/api/movies/upload/', formData, config)

            setImage(data)

            setUploading(false)

        }catch(error){
            setUploading(false)
        }
    } 

    return (
        <div>
            <Link to='/admin/movielist/'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Edit Movie</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <Form onSubmit={ submitHandler }>
                        <Form.Group controlId='title'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter Title'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='image'>
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter Image'
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            >
                            </Form.Control>

                            <Form.Control
                                type='file'
                                // id='image-file'
                                label='Choose File'
                                // custom
                                onChange={uploadFileHandler}>
                            </Form.Control>
                            {upload && <Loader />}
                        </Form.Group>

                        <Form.Group controlId='category'>
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter Category'
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='description'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter Description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        {/* <Form.Group controlId='rating'>
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                                type='number'
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='numReviews'>
                            <Form.Label>Reviews</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter Review'
                                value={numReviews}
                                onChange={(e) => setNumReviews(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group> */}


                        <Button type='submit' variant='primary'>
                            Update
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </div>
        
    )
}

export default MovieEditScreen