# anasium-router

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/owner/my-element)


A simple client-side router built with polymer2.  
`anasium-router` uses `Polymer app-location` to track path changes.  
`anasium-route` is used to declare routes:
* `name` : the name of the route. Usefull when the route dispatch the route-changed event. You can rely on it to change view (`iron-pages`)
* `path`: pattern of the route to match to. It can be an exact `path`likes `/link/to/path`or a parametarized path likes `/path/:id`.  

When a path matches a route, the `route-changed` event is fired with a `route` object containing:
* `name`: the name of the matched route, or `null`instead
* `params`: params matched from the path
* `queryParams` : queryParams from the route object

`anasium-router` has `generateUrl` method which can be used to generate url based on the declared routes.

## Installation

`bower install --save anasium/anasium-router`

## Example
```
<app-location route="{{route}}"></app-location>
<anasium-router route="{{route}}" on-route-changed="_onRouteChanged" id="router">
  <anasium-route name="home" path="/"></anasium-route>
  <anasium-route name="post" path="/posts/:id"></anasium-route>
</anasium-router>

var url = this.$.router.generateUrl('post', { id: '1' });
```

## License

Apache-2.0
