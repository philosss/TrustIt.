import {match} from "react-router";
import {Utility} from "../state/Utility";
import {User} from "../state/User";
import {Notification} from "../state/Notification";
import {Possession} from "../state/Possession";
import {AppAction, ActionType} from "./Helpers";
import axios from "axios";
import {Transaction} from "../state/Transaction";

export interface ApplicationProps {
    openDrawer: () => AppAction;
    closeDrawer: () => AppAction;
    login: (data: any) => any;
    logout: () => AppAction;
    match: match<any>,
    location: any,
    history: any,
    utility: Utility;
    authentication: User;
    notifications: Notification[];
    possessions: Possession[];
    transactions: Transaction[];
}

export const openDrawer = (): AppAction => {
    return {
        type: ActionType.OPEN_DRAWER
    };
};

export const closeDrawer = (): AppAction => {
    return {
        type: ActionType.CLOSE_DRAWER
    };
};

export const login = (data: any): any => {
    return (dispatch: any) => {
        return axios.get("http://localhost:3000/api/Person")
            .then((response) => {
                for (const person of response.data) {
                    if (person.email === data.email) {
                        dispatch({type: ActionType.LOGIN_SUCCESS, payload: person});
                        return;
                    }
                }
                dispatch({type: ActionType.LOGIN_FAIL});
            })
    };
};

export const logout = (): AppAction => {
    return {type: ActionType.LOGOUT_REQUEST};
};

export const fetchPossessions = (traderId: string): any => {
    return (dispatch: any) => {
        return axios.get("http://localhost:3000/api/Good?filter=%7B%22where%22%3A%7B%22owner%22%3A%22resource%3Aorg.upm.trustit.network.Person%23" + traderId + "%22%7D%7D")
            .then((response) => {
                dispatch({type: ActionType.FETCH_POSSESSIONS, payload: response.data});
            });
    };
};

export const addPossession = (name: string, desc: string, imageUrl: string, ownerId: string): any => {
    return (dispatch: any) => {
        return axios.post('http://localhost:3000/api/Good', {
            goodId: name,
            description: desc,
            photos: [imageUrl],
            owner: "resource:org.upm.trustit.network.Person#" + ownerId
        })
            .then((response) => {
                dispatch(fetchPossessions(ownerId));
            });
    };
};

export const transferPossession = (goodId: string, ownerId: string, newOwnerId: string, transactionPrice: number): any => {
    return (dispatch: any) => {
        return axios.post('http://localhost:3000/api/Trade', {
            date: Date(),
            good: "resource:org.upm.trustit.network.Good#" + goodId,
            newOwner: "resource:org.upm.trustit.network.Person#" + newOwnerId,
            price: transactionPrice
        })
            .then((response) => {
                dispatch(fetchPossessions(ownerId));
            });
    };
};

export const fetchTransactions = (goodId: string): any => {
    return (dispatch: any) => {
        return axios.get("http://localhost:3000/api/Trade?filter=%7B%22where%22%3A%20%7B%22good%22%3A%20%22resource%3Aorg.upm.trustit.network.Good%23" + goodId + "%22%7D%7D")
            .then((response) => {
                dispatch({type: ActionType.FETCH_TRANSACTIONS, payload: response.data});
            });
    };
};