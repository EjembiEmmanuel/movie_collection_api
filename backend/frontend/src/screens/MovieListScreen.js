import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'

import { listMovies, deleteMovie, createMovie } from '../actions/movieActions'
import { MOVIE_CREATE_RESET } from '../constants/movieConstants'


function MovieListScreen() {
    const navigate = useNavigate()
    const location = useLocation()

    const dispatch = useDispatch()

    const movieList = useSelector(state => state.movieList)
    const { loading, error, movies, pages, page } = movieList

    const movieDelete = useSelector(state => state.movieDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = movieDelete

    const movieCreate = useSelector(state => state.movieCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, movie: createdMovie } = movieCreate

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    let keyword = location.search

    useEffect(() => {
        dispatch({ type: MOVIE_CREATE_RESET })

        if(!userInfo.isAdmin) {
            navigate('/login')
        }

        if(successCreate) {
            navigate(`/admin/movie/${createdMovie._id}/edit`)
        } else {
            dispatch(listMovies(keyword))
        }
    }, [dispatch, navigate, userInfo, successDelete, successCreate, createdMovie, keyword])

    const deleteHandler = (id) => {
        if(window.confirm('Are you sure you want to delete this movie?')) {
            dispatch(deleteMovie(id))
        }
    }

    const addMovieHandler = (movies) => {
        dispatch(createMovie())
    }

    return (
        <div>
            <Row className='align-items-center'>
                <Col>
                    <h1>Movies</h1>
                </Col>

                <Col className='text-right'>
                    <Button className='my-3' onClick={addMovieHandler}>
                        <i className='fas fa-plus'></i> Add Movie
                    </Button>
                </Col>
            </Row>

            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
            
            {loading
            ? (<Loader />)
            : error
                ? (<Message variant='danger'>{error}</Message>)
                : (
                    <div>
                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>TTILE</th>
                                    <th>CATEGORY</th>
                                    <th>DESCRIPTION</th>
                                    <th>RATING</th>
                                    <th>REVIEWS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {movies.map(movie => (
                                    <tr key={movie._id}>
                                        <td>{movie._id}</td>
                                        <td>{movie.title}</td>
                                        <td>{movie.category}</td>
                                        <td>{movie.description}</td>
                                        <td>{movie.rating}</td>
                                        <td>{movie.numReviews}</td>

                                        <td>
                                            <LinkContainer to={`/admin/movie/${movie._id}/edit`}>
                                                <Button variant='light' className='btn-sm'>
                                                    <i className='fas fa-edit' style={{ color: 'red'}}></i>
                                                </Button>
                                            </LinkContainer>

                                            <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(movie._id)}>
                                                    <i className='fas fa-trash'></i>
                                            </Button>

                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <Paginate page={page} pages={pages} isAdmin={true} />
                    </div>
                )
            }
        </div>
    )
}

export default MovieListScreen