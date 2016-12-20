import {createStore, applyMiddleware} from "redux";
import createLogger from "redux-logger";
import rootReducer from "./reducers/index";
import createSagaMiddleware from "redux-saga";

const loggerMiddleware = createLogger();

export default function configureStore(preloadedState) {
    const sagaMiddleware = createSagaMiddleware();

    return {
        ...createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(
            sagaMiddleware,
            loggerMiddleware,
        )),
        runSaga: sagaMiddleware.run,
    }
}

