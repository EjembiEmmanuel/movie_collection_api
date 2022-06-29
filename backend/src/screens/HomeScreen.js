import React, {useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listMovies } from '../actions/movieActions'

import Movie from '../components/Movie'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'


function HomeScreen() {
    const navigate = useNavigate()
    const location = useLocation()

    const dispatch = useDispatch()
    const movieList = useSelector(state => state.movieList)
    const {error, loading, movies, page, pages } = movieList

    let keyword = location.search

    useEffect(() => {
        dispatch(listMovies(keyword))
        
    }, [dispatch, keyword])

    return (
        <div>
            <h1>Movies</h1>
            { loading ? <Loader />
                : error ? <Message variant='danger'>{error}</Message>
                : 
                <div>
                    <Row>
                        {movies.map(movie => (
                            <Col key={movie._id} sm={12} md={6} lg={4} xl={3}>
                                <Movie movie={movie} />
                            </Col>
                        ))}
                    </Row>

                    <Paginate page={page} pages={pages} keyword={keyword} />
                </div>
        }

            
        </div>
    )
}

export default HomeScreen