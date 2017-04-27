# anasium-router

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/owner/my-element)


A simple client-side router built with polymer2.

## Installation

`bower install --save anasium/anasium-router`

## Example
```
<app-location route="{{route}}"></app-location>
<anasium-router route="{{route}}" on-route-changed="_onRouteChanged">
  <anasium-route name="home" path="/"></anasium-route>
  <anasium-route name="post" path="/posts/:id"></anasium-route>
</anasium-router>
```

## License

Apache-2.0
