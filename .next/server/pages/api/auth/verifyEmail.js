"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/auth/verifyEmail";
exports.ids = ["pages/api/auth/verifyEmail"];
exports.modules = {

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "next/dist/compiled/next-server/pages-api.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages-api.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages-api.runtime.dev.js");

/***/ }),

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("pg");

/***/ }),

/***/ "(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2FverifyEmail&preferredRegion=&absolutePagePath=.%2Fpages%2Fapi%2Fauth%2FverifyEmail.js&middlewareConfigBase64=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2FverifyEmail&preferredRegion=&absolutePagePath=.%2Fpages%2Fapi%2Fauth%2FverifyEmail.js&middlewareConfigBase64=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   routeModule: () => (/* binding */ routeModule)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/pages-api/module.compiled */ \"(api)/./node_modules/next/dist/server/future/route-modules/pages-api/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(api)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/build/templates/helpers */ \"(api)/./node_modules/next/dist/build/templates/helpers.js\");\n/* harmony import */ var _pages_api_auth_verifyEmail_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/api/auth/verifyEmail.js */ \"(api)/./pages/api/auth/verifyEmail.js\");\n\n\n\n// Import the userland code.\n\n// Re-export the handler (should be the default export).\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_pages_api_auth_verifyEmail_js__WEBPACK_IMPORTED_MODULE_3__, \"default\"));\n// Re-export config.\nconst config = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_pages_api_auth_verifyEmail_js__WEBPACK_IMPORTED_MODULE_3__, \"config\");\n// Create and export the route module that will be consumed.\nconst routeModule = new next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__.PagesAPIRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.PAGES_API,\n        page: \"/api/auth/verifyEmail\",\n        pathname: \"/api/auth/verifyEmail\",\n        // The following aren't used in production.\n        bundlePath: \"\",\n        filename: \"\"\n    },\n    userland: _pages_api_auth_verifyEmail_js__WEBPACK_IMPORTED_MODULE_3__\n});\n\n//# sourceMappingURL=pages-api.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LXJvdXRlLWxvYWRlci9pbmRleC5qcz9raW5kPVBBR0VTX0FQSSZwYWdlPSUyRmFwaSUyRmF1dGglMkZ2ZXJpZnlFbWFpbCZwcmVmZXJyZWRSZWdpb249JmFic29sdXRlUGFnZVBhdGg9LiUyRnBhZ2VzJTJGYXBpJTJGYXV0aCUyRnZlcmlmeUVtYWlsLmpzJm1pZGRsZXdhcmVDb25maWdCYXNlNjQ9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNMO0FBQzFEO0FBQzREO0FBQzVEO0FBQ0EsaUVBQWUsd0VBQUssQ0FBQywyREFBUSxZQUFZLEVBQUM7QUFDMUM7QUFDTyxlQUFlLHdFQUFLLENBQUMsMkRBQVE7QUFDcEM7QUFDTyx3QkFBd0IsZ0hBQW1CO0FBQ2xEO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLFlBQVk7QUFDWixDQUFDOztBQUVEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2VydGlmaWNhY2FvLWJjdC8/NWY3NSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQYWdlc0FQSVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvcGFnZXMtYXBpL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IGhvaXN0IH0gZnJvbSBcIm5leHQvZGlzdC9idWlsZC90ZW1wbGF0ZXMvaGVscGVyc1wiO1xuLy8gSW1wb3J0IHRoZSB1c2VybGFuZCBjb2RlLlxuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi4vcGFnZXMvYXBpL2F1dGgvdmVyaWZ5RW1haWwuanNcIjtcbi8vIFJlLWV4cG9ydCB0aGUgaGFuZGxlciAoc2hvdWxkIGJlIHRoZSBkZWZhdWx0IGV4cG9ydCkuXG5leHBvcnQgZGVmYXVsdCBob2lzdCh1c2VybGFuZCwgXCJkZWZhdWx0XCIpO1xuLy8gUmUtZXhwb3J0IGNvbmZpZy5cbmV4cG9ydCBjb25zdCBjb25maWcgPSBob2lzdCh1c2VybGFuZCwgXCJjb25maWdcIik7XG4vLyBDcmVhdGUgYW5kIGV4cG9ydCB0aGUgcm91dGUgbW9kdWxlIHRoYXQgd2lsbCBiZSBjb25zdW1lZC5cbmV4cG9ydCBjb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBQYWdlc0FQSVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5QQUdFU19BUEksXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hdXRoL3ZlcmlmeUVtYWlsXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC92ZXJpZnlFbWFpbFwiLFxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGFyZW4ndCB1c2VkIGluIHByb2R1Y3Rpb24uXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcIlwiXG4gICAgfSxcbiAgICB1c2VybGFuZFxufSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhZ2VzLWFwaS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2FverifyEmail&preferredRegion=&absolutePagePath=.%2Fpages%2Fapi%2Fauth%2FverifyEmail.js&middlewareConfigBase64=e30%3D!\n");

/***/ }),

/***/ "(api)/./lib/db.js":
/*!*******************!*\
  !*** ./lib/db.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pg */ \"pg\");\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pg__WEBPACK_IMPORTED_MODULE_0__);\n\nconst pool = new pg__WEBPACK_IMPORTED_MODULE_0__.Pool({\n    connectionString: process.env.DATABASE_URL,\n    ssl: {\n        rejectUnauthorized: false\n    }\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pool);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9saWIvZGIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTBCO0FBRTFCLE1BQU1DLE9BQU8sSUFBSUQsb0NBQUlBLENBQUM7SUFDcEJFLGtCQUFrQkMsUUFBUUMsR0FBRyxDQUFDQyxZQUFZO0lBQzFDQyxLQUFLO1FBQUVDLG9CQUFvQjtJQUFNO0FBQ25DO0FBRUEsaUVBQWVOLElBQUlBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jZXJ0aWZpY2FjYW8tYmN0Ly4vbGliL2RiLmpzPzNkYzkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUG9vbCB9IGZyb20gXCJwZ1wiO1xuXG5jb25zdCBwb29sID0gbmV3IFBvb2woe1xuICBjb25uZWN0aW9uU3RyaW5nOiBwcm9jZXNzLmVudi5EQVRBQkFTRV9VUkwsXG4gIHNzbDogeyByZWplY3RVbmF1dGhvcml6ZWQ6IGZhbHNlIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBwb29sOyJdLCJuYW1lcyI6WyJQb29sIiwicG9vbCIsImNvbm5lY3Rpb25TdHJpbmciLCJwcm9jZXNzIiwiZW52IiwiREFUQUJBU0VfVVJMIiwic3NsIiwicmVqZWN0VW5hdXRob3JpemVkIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./lib/db.js\n");

/***/ }),

/***/ "(api)/./pages/api/auth/verifyEmail.js":
/*!***************************************!*\
  !*** ./pages/api/auth/verifyEmail.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../lib/db */ \"(api)/./lib/db.js\");\n\n\nasync function handler(req, res) {\n    if (req.method !== \"POST\") {\n        return res.status(405).json({\n            ok: false,\n            error: \"M\\xe9todo n\\xe3o permitido\"\n        });\n    }\n    try {\n        const { token } = req.body;\n        if (!token) {\n            return res.json({\n                ok: false,\n                error: \"Token ausente.\"\n            });\n        }\n        // 1️⃣ Validar token JWT\n        let decoded;\n        try {\n            decoded = jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default().verify(token, process.env.JWT_SECRET);\n        } catch (err) {\n            return res.json({\n                ok: false,\n                error: \"Token inv\\xe1lido ou expirado.\"\n            });\n        }\n        const userId = decoded.userId;\n        // 2️⃣ Atualizar no banco\n        await _lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"].query(`UPDATE users \n       SET is_email_verified = true \n       WHERE id = $1`, [\n            userId\n        ]);\n        return res.json({\n            ok: true\n        });\n    } catch (err) {\n        console.error(\"Erro ao verificar email:\", err);\n        return res.json({\n            ok: false,\n            error: \"Erro interno.\"\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvYXV0aC92ZXJpZnlFbWFpbC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQStCO0FBQ0k7QUFFcEIsZUFBZUUsUUFBUUMsR0FBRyxFQUFFQyxHQUFHO0lBQzVDLElBQUlELElBQUlFLE1BQU0sS0FBSyxRQUFRO1FBQ3pCLE9BQU9ELElBQUlFLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7WUFBRUMsSUFBSTtZQUFPQyxPQUFPO1FBQXVCO0lBQ3pFO0lBRUEsSUFBSTtRQUNGLE1BQU0sRUFBRUMsS0FBSyxFQUFFLEdBQUdQLElBQUlRLElBQUk7UUFDMUIsSUFBSSxDQUFDRCxPQUFPO1lBQ1YsT0FBT04sSUFBSUcsSUFBSSxDQUFDO2dCQUFFQyxJQUFJO2dCQUFPQyxPQUFPO1lBQWlCO1FBQ3ZEO1FBRUEsd0JBQXdCO1FBQ3hCLElBQUlHO1FBQ0osSUFBSTtZQUNGQSxVQUFVWiwwREFBVSxDQUFDVSxPQUFPSSxRQUFRQyxHQUFHLENBQUNDLFVBQVU7UUFDcEQsRUFBRSxPQUFPQyxLQUFLO1lBQ1osT0FBT2IsSUFBSUcsSUFBSSxDQUFDO2dCQUFFQyxJQUFJO2dCQUFPQyxPQUFPO1lBQThCO1FBQ3BFO1FBRUEsTUFBTVMsU0FBU04sUUFBUU0sTUFBTTtRQUU3Qix5QkFBeUI7UUFDekIsTUFBTWpCLHFEQUFVLENBQ2QsQ0FBQzs7b0JBRWEsQ0FBQyxFQUNmO1lBQUNpQjtTQUFPO1FBR1YsT0FBT2QsSUFBSUcsSUFBSSxDQUFDO1lBQUVDLElBQUk7UUFBSztJQUU3QixFQUFFLE9BQU9TLEtBQUs7UUFDWkcsUUFBUVgsS0FBSyxDQUFDLDRCQUE0QlE7UUFDMUMsT0FBT2IsSUFBSUcsSUFBSSxDQUFDO1lBQUVDLElBQUk7WUFBT0MsT0FBTztRQUFnQjtJQUN0RDtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2VydGlmaWNhY2FvLWJjdC8uL3BhZ2VzL2FwaS9hdXRoL3ZlcmlmeUVtYWlsLmpzP2ZjYWMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGp3dCBmcm9tIFwianNvbndlYnRva2VuXCI7XG5pbXBvcnQgcG9vbCBmcm9tIFwiLi4vLi4vLi4vbGliL2RiXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgaWYgKHJlcS5tZXRob2QgIT09IFwiUE9TVFwiKSB7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA1KS5qc29uKHsgb2s6IGZhbHNlLCBlcnJvcjogXCJNw6l0b2RvIG7Do28gcGVybWl0aWRvXCIgfSk7XG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IHsgdG9rZW4gfSA9IHJlcS5ib2R5O1xuICAgIGlmICghdG9rZW4pIHtcbiAgICAgIHJldHVybiByZXMuanNvbih7IG9rOiBmYWxzZSwgZXJyb3I6IFwiVG9rZW4gYXVzZW50ZS5cIiB9KTtcbiAgICB9XG5cbiAgICAvLyAx77iP4oOjIFZhbGlkYXIgdG9rZW4gSldUXG4gICAgbGV0IGRlY29kZWQ7XG4gICAgdHJ5IHtcbiAgICAgIGRlY29kZWQgPSBqd3QudmVyaWZ5KHRva2VuLCBwcm9jZXNzLmVudi5KV1RfU0VDUkVUKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiByZXMuanNvbih7IG9rOiBmYWxzZSwgZXJyb3I6IFwiVG9rZW4gaW52w6FsaWRvIG91IGV4cGlyYWRvLlwiIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHVzZXJJZCA9IGRlY29kZWQudXNlcklkO1xuXG4gICAgLy8gMu+4j+KDoyBBdHVhbGl6YXIgbm8gYmFuY29cbiAgICBhd2FpdCBwb29sLnF1ZXJ5KFxuICAgICAgYFVQREFURSB1c2VycyBcbiAgICAgICBTRVQgaXNfZW1haWxfdmVyaWZpZWQgPSB0cnVlIFxuICAgICAgIFdIRVJFIGlkID0gJDFgLFxuICAgICAgW3VzZXJJZF1cbiAgICApO1xuXG4gICAgcmV0dXJuIHJlcy5qc29uKHsgb2s6IHRydWUgfSk7XG5cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkVycm8gYW8gdmVyaWZpY2FyIGVtYWlsOlwiLCBlcnIpO1xuICAgIHJldHVybiByZXMuanNvbih7IG9rOiBmYWxzZSwgZXJyb3I6IFwiRXJybyBpbnRlcm5vLlwiIH0pO1xuICB9XG59Il0sIm5hbWVzIjpbImp3dCIsInBvb2wiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwibWV0aG9kIiwic3RhdHVzIiwianNvbiIsIm9rIiwiZXJyb3IiLCJ0b2tlbiIsImJvZHkiLCJkZWNvZGVkIiwidmVyaWZ5IiwicHJvY2VzcyIsImVudiIsIkpXVF9TRUNSRVQiLCJlcnIiLCJ1c2VySWQiLCJxdWVyeSIsImNvbnNvbGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./pages/api/auth/verifyEmail.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2FverifyEmail&preferredRegion=&absolutePagePath=.%2Fpages%2Fapi%2Fauth%2FverifyEmail.js&middlewareConfigBase64=e30%3D!")));
module.exports = __webpack_exports__;

})();