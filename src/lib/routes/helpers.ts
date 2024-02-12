import { RouteParams, State } from './types';

type ExistingState = {
  name: string;
  params?: RouteParams;
};

export function buildStateObject(
  stack: string,
  route: string,
  params: RouteParams,
  state: ExistingState[] = []
) {
  if (stack === 'Flat') {
    return {
      routes: [{ name: route, params }],
    };
  }

  return {
    routes: [
      {
        name: stack,
        state: {
          routes: [...state, { name: route, params }],
        },
      },
    ],
  };
}

export function getCurrentRoute(state: State) {
  // The navigation state is the state where React Navigation
  // stores the navigation structure and history of the app.
  let node = state.routes[state.index || 0];
  while (
    node.state?.routes &&
    typeof node.state?.index === 'number'
  ) {
    node = node.state?.routes[node.state?.index];
  }

  return node;
}

export function isTab(current: string, route: string) {
  // NOTE
  // our tab routes can be variously referenced by 3 different names
  // this helper deals with that weirdness
  // -prf
  return (
    current === route ||
    current === `${route}Tab` ||
    current === `${route}Inner`
  );
}
