import React, {useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Form, Row, Col, Image, ListGroup, Button, Card } from 'react-bootstrap'

import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'

import { listMoviesDetails, createMovieReview } from '../actions/movieActions'
import { MOVIE_CREATE_REVIEW_RESET } from '../constants/movieConstants'


function MovieScreen() {
    const { id } = useParams()

    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const dispatch = useDispatch()

    const movieDetails = useSelector(state => state.movieDetails)
    const { loading, error, movie } = movieDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const movieReviewCreate = useSelector(state => state.movieReviewCreate)
    const { loading: loadingMovieReview, error: errorMovieReview, success: successMovieReview } = movieReviewCreate

    useEffect(() => {
        if(successMovieReview) {
            setRating(0)
            setComment('')
            dispatch({
                type: MOVIE_CREATE_REVIEW_RESET
            })
        }

        dispatch(listMoviesDetails(id))
    }, [dispatch, successMovieReview])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createMovieReview(
            id, {
                rating,
                comment
            }
        ))
    }

    return (
        <div>
            <Link to='/' className='btn btn-light my-3'>Go Back</Link>
            {loading ?
                <Loader />
                : error
                    ? <Message variant='danger'>{error}</Message>
                : (
                    <div>
                        <Row>
                            <Col md={6}>
                                <Image src={movie.image} alt={movie.title} fluid/>
                            </Col>

                            <Col md={3}>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <h3>{movie.title}</h3>
                                    </ListGroup.Item>
                                
                                    <ListGroup.Item>
                                        <Rating value={movie.rating} text={`${movie.numReviews} reviews`} color={'#f8e825'}/>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        Desc: {movie.description}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6} className='py-3'>
                                <h4>Reviews</h4>
                                {movie.reviews.length === 0 && <Message variant='info'>No Reviews</Message>}

                                <ListGroup variant='flush'>
                                    {movie.reviews.map((review) => (
                                        <ListGroup.Item key={review._id}>
                                            <strong>{review.name}</strong>
                                            <Rating value={review.rating} color='#f8e825' />
                                            <p>{review.createdAt.substring(0, 10)}</p>
                                            <p>{review.comment}</p>
                                        </ListGroup.Item>
                                    ))}

                                    <ListGroup.Item>
                                        <h4>Write a review</h4>

                                        {loadingMovieReview && <Loader />}
                                        {successMovieReview && <Message variant='success'>Review Submitted</Message>}
                                        {errorMovieReview && <Message variant='danger'>{errorMovieReview}</Message>}
                                        
                                        {userInfo ? (
                                            <Form onSubmit={submitHandler}>
                                                <Form.Group controlId='rating'>
                                                    <Form.Label>
                                                        Rating
                                                    </Form.Label>
                                                    <Form.Control 
                                                        as='select'
                                                        value={rating}
                                                        onChange={(e) => setRating(e.target.value)}>
                                                        <option value=''>Select ...</option>
                                                        <option value='1'>Poor</option>
                                                        <option value='2'>Fair</option>
                                                        <option value='3'>Good</option>
                                                        <option value='4'>Very Good</option>
                                                        <option value='5'>Excellent</option>
                                                    </Form.Control>
                                                </Form.Group>

                                                <Form.Group controlId='comment'>
                                                    <Form.Label>
                                                        Review
                                                    </Form.Label>
                                                    <Form.Control 
                                                        as='textarea'
                                                        row='5'
                                                        value={comment}
                                                        onChange={(e) => setComment(e.target.value)}>

                                                    </Form.Control>
                                                </Form.Group>

                                                <Button 
                                                    disabled={loadingMovieReview}
                                                    type='submit'
                                                    variant='primary'>
                                                        Submit
                                                </Button>
                                            </Form>
                                        ) : (
                                            <Message variant='info'>
                                                <Link to='/login'>login</Link> to write a review
                                            </Message>
                                        )}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>
                    </div>
                )
            }
        </div>
    )
}

export default MovieScreen