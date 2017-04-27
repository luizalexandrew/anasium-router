AnasiumRouterMixin = function(superClass) {
  return class extends superClass {
    constructor() {
      super()

      this.compiledRoutes = []
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
          type: Array,
          value: function() {
            return []
          }
        },

        matchedRoute: {
          type: Object,
          notify: true
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
      path = path.replace(/^\//, "").replace(/\/$/, "");
      var matchedRoutes = this.matchRoute(path);

      matchedRoutes = matchedRoutes.sort(function(mr1, mr2) {
        return Object.keys(mr1.params).length - Object.keys(mr2.params).length;
      });

      matchedRoutes.forEach(function(r) {
        r.queryParams = route.__queryParams;
      })

      this.matchedRoute = (matchedRoutes.length > 0) ? matchedRoutes[0] : null;

      this.dispatchEvent(new CustomEvent('route-changed', {
        detail: {
          route: Object.assign({}, this.matchedRoute)
        }
      }));
    }

    getRoute(name) {
      return this.routes.find(function(route) {
        return route.name === name;
      });
    }

    _getCompiledRoute(name) {
      return this.compiledRoutes.find(function(route) {
        return route.name === name;
      });
    }

    generateUrl(name, params) {
      var route = this._getCompiledRoute(name);
      var routeString = undefined;

      if (route) {
        var splittedPath = route.splittedPath;
        routeString = "";

        for (var i = 0; i < splittedPath.length; i++) {
          var pathPart = splittedPath[i];

          if (pathPart.startsWith(":")) {
            pathPart = params[pathPart.replace(/^:/, "")];
          }

          routeString = [routeString, pathPart].join("/");
        }
      }

      return routeString;
    }

    addRoute(name, route) {
      this.routes.push(Object.assign({}, route, {
        name
      }));
      this._addCompiledRoute(name, route);
    }

    _addCompiledRoute(name, route) {
      var _route = Object.assign({}, route, {
        name,
        transformedPath: route.path.replace(/^\//, "").replace(/\/$/, ""),
        splittedPath: route.path.replace(/^\//, "").replace(/\/$/, "").split("/")
      });

      this.compiledRoutes.push(_route);
    }

    matchRoute(path) {
      var splittedPath = path.split("/"); // Split the path
      var results = []; // Array of matched routes

      // Loop over routes
      this.compiledRoutes.forEach(function(r) {
        if (r.splittedPath.length === splittedPath.length) {
          var matched = true;
          var params = {};

          for (var i = 0; i < splittedPath.length; i++) {
            var pathPart = splittedPath[i];
            var routePathPart = r.splittedPath[i];

            if (pathPart === routePathPart) {
              continue;
            } else if (routePathPart.startsWith(":")) {
              var param = routePathPart.replace(/^:/, "");
              params[param] = pathPart;
            } else {
              matched = false;
              break;
            }
          }

          if (matched) {
            results.push({
              name: r.name,
              params
            });
          }
        }
      }, this);

      return results;
    }
  }
}
