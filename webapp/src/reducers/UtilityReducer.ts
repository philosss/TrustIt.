import {AppAction, ActionType} from "../actions/Helpers";
import {Utility} from "../state/Utility";

export const UtilityReducer = (state: Utility = new Utility(), action: AppAction): Utility => {
    switch (action.type) {
        case ActionType.OPEN_DRAWER:
            return state.set(Utility.DRAWER_OPEN, true) as Utility;
        case ActionType.CLOSE_DRAWER:
            return state.set(Utility.DRAWER_OPEN, false) as Utility;
        default:
            return state;
    }
};
