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
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_layout_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/layout.css */ \"./styles/layout.css\");\n/* harmony import */ var _styles_layout_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_layout_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\nfunction App({ Component, pageProps }) {\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{\n        async function syncAndLogin(decoded) {\n            try {\n                // Cria o usuário automaticamente, caso tenha vindo do Consultor-BCT\n                await fetch(\"/api/auth/sync-consultor\", {\n                    method: \"POST\",\n                    headers: {\n                        \"Content-Type\": \"application/json\"\n                    },\n                    body: JSON.stringify(decoded)\n                });\n                // Salva dados no localStorage\n                localStorage.setItem(\"token\", router.query.token);\n                localStorage.setItem(\"userId\", decoded.userId);\n                localStorage.setItem(\"cpf\", decoded.cpf);\n                localStorage.setItem(\"consultorId\", decoded.consultorId || \"\");\n                // Redireciona para o painel após sincronizar\n                router.replace(\"/painel\");\n            } catch (error) {\n                console.log(\"Erro ao sincronizar consultor:\", error);\n            }\n        }\n        // Se o consultor veio do Consultor-BCT com ?token=\n        if (router.query.token) {\n            try {\n                const decoded = jsonwebtoken__WEBPACK_IMPORTED_MODULE_4___default().decode(router.query.token);\n                if (decoded && decoded.userId) {\n                    syncAndLogin(decoded);\n                }\n            } catch (e) {\n                console.log(\"Token inv\\xe1lido\");\n            }\n        }\n    }, [\n        router.query.token\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n        ...pageProps\n    }, void 0, false, {\n        fileName: \"/Users/eltonramaldes/Downloads/CERTIFICACAO-BCT/pages/_app.js\",\n        lineNumber: 46,\n        columnNumber: 10\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUE4QjtBQUNVO0FBQ047QUFDSDtBQUVoQixTQUFTRyxJQUFJLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFFO0lBQ2xELE1BQU1DLFNBQVNOLHNEQUFTQTtJQUV4QkMsZ0RBQVNBLENBQUM7UUFDUixlQUFlTSxhQUFhQyxPQUFPO1lBQ2pDLElBQUk7Z0JBQ0Ysb0VBQW9FO2dCQUNwRSxNQUFNQyxNQUFNLDRCQUE0QjtvQkFDdENDLFFBQVE7b0JBQ1JDLFNBQVM7d0JBQUUsZ0JBQWdCO29CQUFtQjtvQkFDOUNDLE1BQU1DLEtBQUtDLFNBQVMsQ0FBQ047Z0JBQ3ZCO2dCQUVBLDhCQUE4QjtnQkFDOUJPLGFBQWFDLE9BQU8sQ0FBQyxTQUFTVixPQUFPVyxLQUFLLENBQUNDLEtBQUs7Z0JBQ2hESCxhQUFhQyxPQUFPLENBQUMsVUFBVVIsUUFBUVcsTUFBTTtnQkFDN0NKLGFBQWFDLE9BQU8sQ0FBQyxPQUFPUixRQUFRWSxHQUFHO2dCQUN2Q0wsYUFBYUMsT0FBTyxDQUFDLGVBQWVSLFFBQVFhLFdBQVcsSUFBSTtnQkFFM0QsNkNBQTZDO2dCQUM3Q2YsT0FBT2dCLE9BQU8sQ0FBQztZQUNqQixFQUFFLE9BQU9DLE9BQU87Z0JBQ2RDLFFBQVFDLEdBQUcsQ0FBQyxrQ0FBa0NGO1lBQ2hEO1FBQ0Y7UUFFQSxtREFBbUQ7UUFDbkQsSUFBSWpCLE9BQU9XLEtBQUssQ0FBQ0MsS0FBSyxFQUFFO1lBQ3RCLElBQUk7Z0JBQ0YsTUFBTVYsVUFBVU4sMERBQVUsQ0FBQ0ksT0FBT1csS0FBSyxDQUFDQyxLQUFLO2dCQUU3QyxJQUFJVixXQUFXQSxRQUFRVyxNQUFNLEVBQUU7b0JBQzdCWixhQUFhQztnQkFDZjtZQUNGLEVBQUUsT0FBT21CLEdBQUc7Z0JBQ1ZILFFBQVFDLEdBQUcsQ0FBQztZQUNkO1FBQ0Y7SUFDRixHQUFHO1FBQUNuQixPQUFPVyxLQUFLLENBQUNDLEtBQUs7S0FBQztJQUV2QixxQkFBTyw4REFBQ2Q7UUFBVyxHQUFHQyxTQUFTOzs7Ozs7QUFDakMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jZXJ0aWZpY2FjYW8tYmN0Ly4vcGFnZXMvX2FwcC5qcz9lMGFkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBcIi4uL3N0eWxlcy9sYXlvdXQuY3NzXCI7XG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tIFwibmV4dC9yb3V0ZXJcIjtcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IGp3dCBmcm9tIFwianNvbndlYnRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBhc3luYyBmdW5jdGlvbiBzeW5jQW5kTG9naW4oZGVjb2RlZCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gQ3JpYSBvIHVzdcOhcmlvIGF1dG9tYXRpY2FtZW50ZSwgY2FzbyB0ZW5oYSB2aW5kbyBkbyBDb25zdWx0b3ItQkNUXG4gICAgICAgIGF3YWl0IGZldGNoKFwiL2FwaS9hdXRoL3N5bmMtY29uc3VsdG9yXCIsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkZWNvZGVkKVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBTYWx2YSBkYWRvcyBubyBsb2NhbFN0b3JhZ2VcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0b2tlblwiLCByb3V0ZXIucXVlcnkudG9rZW4pO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInVzZXJJZFwiLCBkZWNvZGVkLnVzZXJJZCk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiY3BmXCIsIGRlY29kZWQuY3BmKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJjb25zdWx0b3JJZFwiLCBkZWNvZGVkLmNvbnN1bHRvcklkIHx8IFwiXCIpO1xuXG4gICAgICAgIC8vIFJlZGlyZWNpb25hIHBhcmEgbyBwYWluZWwgYXDDs3Mgc2luY3Jvbml6YXJcbiAgICAgICAgcm91dGVyLnJlcGxhY2UoXCIvcGFpbmVsXCIpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJFcnJvIGFvIHNpbmNyb25pemFyIGNvbnN1bHRvcjpcIiwgZXJyb3IpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNlIG8gY29uc3VsdG9yIHZlaW8gZG8gQ29uc3VsdG9yLUJDVCBjb20gP3Rva2VuPVxuICAgIGlmIChyb3V0ZXIucXVlcnkudG9rZW4pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRlY29kZWQgPSBqd3QuZGVjb2RlKHJvdXRlci5xdWVyeS50b2tlbik7XG5cbiAgICAgICAgaWYgKGRlY29kZWQgJiYgZGVjb2RlZC51c2VySWQpIHtcbiAgICAgICAgICBzeW5jQW5kTG9naW4oZGVjb2RlZCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJUb2tlbiBpbnbDoWxpZG9cIik7XG4gICAgICB9XG4gICAgfVxuICB9LCBbcm91dGVyLnF1ZXJ5LnRva2VuXSk7XG5cbiAgcmV0dXJuIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz47XG59Il0sIm5hbWVzIjpbInVzZVJvdXRlciIsInVzZUVmZmVjdCIsImp3dCIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsInJvdXRlciIsInN5bmNBbmRMb2dpbiIsImRlY29kZWQiLCJmZXRjaCIsIm1ldGhvZCIsImhlYWRlcnMiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJxdWVyeSIsInRva2VuIiwidXNlcklkIiwiY3BmIiwiY29uc3VsdG9ySWQiLCJyZXBsYWNlIiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwiZGVjb2RlIiwiZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/layout.css":
/*!***************************!*\
  !*** ./styles/layout.css ***!
  \***************************/
/***/ (() => {



/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("jsonwebtoken");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./pages/_app.js")));
module.exports = __webpack_exports__;

})();