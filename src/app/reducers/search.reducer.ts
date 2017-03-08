import * as app from '../app.actions';

export interface State {
  searchQuery: string;
  loading: boolean;
};

const initialState: State = {
  searchQuery: "",
  loading: false
};

export function reducer(state = initialState, action: app.Actions): State {
  switch (action.type) {
    case app.ActionTypes.SEARCH: {
      const searchQuery = action.payload;

      if (searchQuery === '') {
        return {
          searchQuery,
          loading: false,
        };
      }

      return Object.assign({}, state, {
        searchQuery,
        loading: true
      });
    }

    default: {
      return state;
    }
  }
}