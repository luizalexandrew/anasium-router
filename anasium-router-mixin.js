AnasiumRouterMixin = function(superClass) {
  return class extends superClass {
    constructor() {
      super()
    }

    static get properties() {
      return {
        route: {
          type: Object,
          notify: true
        },

        routesLoaded: {
          type: Boolean,
          value: false,
          notify: true
        },

        routes: {
          type: Object,
          value: function() { return {} }
        },

        matchedRoute: {
          type: Object,
          notify: true
        },

        _compiledRoutes: {
          type: Object,
          value: function() { return {} }
        }
      }
    }

    static get observers() {
      return [
        '_routePathChanged(routesLoaded, route, route.path)'
      ]
    }

    _routePathChanged(routesLoaded, route, path) {
      // If routes are not yet loaded or path is not defined
      if (!routesLoaded || path === undefined || path === null || path === "undefined") return;

      // get matched routes
      var transformedPath = path.replace(/^\//, "").replace(/\/$/, "");
      var matchedRoutes = this._matchRoute(transformedPath);

      var sortedMatchedRoutes = matchedRoutes.sort(function(mr1, mr2) {
        return Object.keys(mr1.params).length - Object.keys(mr2.params).length;
      });

      if (sortedMatchedRoutes.length > 0) {
        this.matchedRoute = sortedMatchedRoutes[0];
      } else {
        this.matchedRoute = null;
      }
    }

    _matchRoute(path) {
      var splittedPath = path.split("/");
      var results = [];

      Object.keys(this._compiledRoutes).forEach(function(routeName) {
        var route = this._compiledRoutes[routeName]; // Get the route
        var splittedRoutePath = route.splittedPath;

        if (splittedPath.length === splittedRoutePath.length) {
          var matched = true;
          var params = {};

          for (var i = 0; i < splittedPath.length; i++) {
            var splittedPathFragment = splittedPath[i];
            var splittedRoutePathFragment = splittedRoutePath[i];

            if (splittedPathFragment === splittedRoutePathFragment) {
              continue;
            } else if (splittedRoutePathFragment.startsWith(":")) {
              var param = splittedRoutePathFragment.replace(/^:/, "");
              params[param] = splittedPathFragment;
            } else {
              matched = false;
              break;
            }
          }

          if (matched) {
            results.push({ name: routeName, params });
          }
        }
      }, this);

      return results;
    }

    addRoute(name, route) {
      this.routes[name] = route;
      this._addCompiledRoute(name, route);
    }

    _addCompiledRoute(name, route) {
      this._compiledRoutes[name] = Object.assign({}, route, {
        transformedPath: route.path.replace(/^\//, "").replace(/\/$/, ""),
        splittedPath: route.path.replace(/^\//, "").replace(/\/$/, "").split("/")
      });
    }
  }
}
