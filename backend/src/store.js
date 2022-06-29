import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { movieListReducer, movieDetailsReducer, movieDeleteReducer, movieCreateReducer, movieUpdateReducer, movieReviewCreateReducer } from './reducers/movieReducers'
import { 
    userLoginReducer, userRegisterReducer, userDetailsReducer, userUpdateProfileReducer, userListReducer, userDeleteReducer, userUpdateReducer } from './reducers/userReducers'


const reducer = combineReducers({
    movieList: movieListReducer,
    movieDetails: movieDetailsReducer,
    movieDelete: movieDeleteReducer,
    movieCreate: movieCreateReducer,
    movieUpdate: movieUpdateReducer,
    movieReviewCreate: movieReviewCreateReducer,

    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,

})

const userInfoFromStroage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null

const initialState = {
    userLogin: { userInfo: userInfoFromStroage }
}


const middleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store