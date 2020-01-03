import {
  SET_USER,
  SET_AUTENTICATED,
  SET_UNAUTENTICATED,
  LOADING_USER,
} from '../types'

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  likes: [],
  notifications: [],
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_AUTENTICATED:
      return {
        ...state,
        authenticated: true,
      }
    case SET_UNAUTENTICATED:
      return initialState
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload,
      }
      case LOADING_USER:
        return {
          ...state,
          loading: true,
        }
    default:
      return state
  }
}
