import axios from "axios"
import { 
    MOVIE_LIST_REQUEST,
    MOVIE_LIST_SUCCESS,
    MOVIE_LIST_FAIL,

    MOVIE_DETAILS_REQUEST,
    MOVIE_DETAILS_SUCCESS,
    MOVIE_DETAILS_FAIL,

    MOVIE_DELETE_REQUEST,
    MOVIE_DELETE_SUCCESS,
    MOVIE_DELETE_FAIL,

    MOVIE_CREATE_REQUEST,
    MOVIE_CREATE_SUCCESS,
    MOVIE_CREATE_FAIL,

    MOVIE_UPDATE_REQUEST,
    MOVIE_UPDATE_SUCCESS,
    MOVIE_UPDATE_FAIL,

    MOVIE_CREATE_REVIEW_REQUEST,
    MOVIE_CREATE_REVIEW_SUCCESS,
    MOVIE_CREATE_REVIEW_FAIL,
    } from "../constants/movieConstants"


export const listMovies = (keyword = '') => async (dispatch) => {
    try{
        dispatch({ type: MOVIE_LIST_REQUEST })

        const { data } = await axios.get(`/api/movies${keyword}`) 

        dispatch({ 
            type: MOVIE_LIST_SUCCESS,
            payload: data 
        })

    } catch(error) {
        dispatch({ 
            type: MOVIE_LIST_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
         })
    }
}


export const listMoviesDetails = (id) => async (dispatch) => {
    try{
        dispatch({ type: MOVIE_DETAILS_REQUEST })

        const { data } = await axios.get(`/api/movies/${id}`) 

        dispatch({ 
            type: MOVIE_DETAILS_SUCCESS,
            payload: data 
        })

    } catch(error) {
        dispatch({ 
            type: MOVIE_DETAILS_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
         })
    }
}


export const deleteMovie = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: MOVIE_DELETE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        const { data } = await axios.delete(
            `/api/movies/delete/${id}/`,
            config
        )

        dispatch({
            type: MOVIE_DELETE_SUCCESS,
        })


    } catch (error) {
        dispatch({ 
            type: MOVIE_DELETE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
         })
    }
}


export const createMovie = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: MOVIE_CREATE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        const { data } = await axios.post(
            '/api/movies/create/',
            {},
            config
        )

        dispatch({
            type: MOVIE_CREATE_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({ 
            type: MOVIE_CREATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
         })
    }
}


export const updateMovie = (movie) => async (dispatch, getState) => {
    try {
        dispatch({
            type: MOVIE_UPDATE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        const { data } = await axios.put(
            `/api/movies/update/${movie._id}/`,
            movie,
            config
        )

        dispatch({
            type: MOVIE_UPDATE_SUCCESS,
            payload: data,
        })

        dispatch({ 
            type: MOVIE_DETAILS_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({ 
            type: MOVIE_UPDATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
         })
    }
}


export const createMovieReview = (id, review) => async (dispatch, getState) => {
    try {
        dispatch({
            type: MOVIE_CREATE_REVIEW_REQUEST,
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        const { data } = await axios.post(
            `/api/movies/${id}/reviews/`,
            review,
            config
        )

        dispatch({
            type: MOVIE_CREATE_REVIEW_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({ 
            type: MOVIE_CREATE_REVIEW_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
         })
    }
}