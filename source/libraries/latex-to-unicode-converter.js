!(function (e, r) {
    "object" == typeof exports && "object" == typeof module
        ? (module.exports = r())
        : "function" == typeof define && define.amd
        ? define([], r)
        : "object" == typeof exports
        ? (exports["latex-to-unicode-converter"] = r())
        : (e["latex-to-unicode-converter"] = r());
})(this, function () {
    return (function (e) {
        function r(n) {
            if (t[n]) return t[n].exports;
            var a = (t[n] = { i: n, l: !1, exports: {} });
            return e[n].call(a.exports, a, a.exports, r), (a.l = !0), a.exports;
        }
        var t = {};
        return (
            (r.m = e),
            (r.c = t),
            (r.d = function (e, t, n) {
                r.o(e, t) ||
                    Object.defineProperty(e, t, {
                        configurable: !1,
                        enumerable: !0,
                        get: n,
                    });
            }),
            (r.n = function (e) {
                var t =
                    e && e.__esModule
                        ? function () {
                              return e.default;
                          }
                        : function () {
                              return e;
                          };
                return r.d(t, "a", t), t;
            }),
            (r.o = function (e, r) {
                return Object.prototype.hasOwnProperty.call(e, r);
            }),
            (r.p = ""),
            r((r.s = 13))
        );
    })([
        function (e, r, t) {
            "use strict";
            function n(e, r) {
                return function (t) {
                    if (e.hasOwnProperty(t)) return e[t];
                    if (!r)
                        throw new Error(
                            "I do not know how to modify the following string: " +
                                t +
                                ". Change your TeX file or submit a feature request at https://github.com/digitalheir/tex-to-unicode/issues."
                        );
                    return t + r;
                };
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.lookupOrAppend = n);
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return "(" + e + ")";
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.simpleSuffix = function (e) {
                    return function (r) {
                        return r + e;
                    };
                }),
                (r.isSingleTerm = /^.$|^[0-9]+$/),
                (r.addParenthesis = n);
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                for (var t in e) r.hasOwnProperty(t) || (r[t] = e[t]);
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                n(t(3)),
                n(t(4)),
                n(t(16));
        },
        function (e, r, t) {
            "use strict";
            function n(e, r, t, n) {
                if (
                    (void 0 === n &&
                        (n = {
                            writable: !0,
                            enumerable: !0,
                            configurable: !0,
                        }),
                    !(e instanceof Object))
                )
                    throw new TypeError('"target" isn\'t an Object instance');
                if (void 0 !== r) {
                    if (!(r instanceof Object))
                        throw new TypeError(
                            '"properties" isn\'t an Object instance'
                        );
                    if (void 0 === n)
                        n = { writable: !0, enumerable: !0, configurable: !0 };
                    else if (!(n instanceof Object))
                        throw new TypeError(
                            '"attributes" isn\'t an Object instance'
                        );
                    if (void 0 === t)
                        for (var a in r)
                            void 0 !== r[a] &&
                                Object.defineProperty(
                                    e,
                                    a,
                                    Object.create(n, { value: { value: r[a] } })
                                );
                    else if (t instanceof Array)
                        t.forEach(function (t) {
                            void 0 !== r[t] &&
                                Object.defineProperty(
                                    e,
                                    t,
                                    Object.create(n, { value: { value: r[t] } })
                                );
                        });
                    else {
                        if (!(t instanceof Object))
                            throw new TypeError(
                                '"keys" isn\'t an Object instance'
                            );
                        for (var o in t) {
                            var a = t[o];
                            void 0 !== r[a] &&
                                Object.defineProperty(
                                    e,
                                    o,
                                    Object.create(n, { value: { value: r[a] } })
                                );
                        }
                    }
                }
            }
            function a(e, r, t, n) {
                if ((void 0 === n && (n = !0), !(e instanceof Object)))
                    throw new TypeError('"target" isn\'t an Object instance');
                if (void 0 === r) return !0;
                if (!(r instanceof Object))
                    throw new TypeError(
                        '"properties" isn\'t an Object instance'
                    );
                if ((void 0 === n && (n = !0), void 0 === t)) {
                    for (var a in r)
                        if (e[a] !== r[a] && (void 0 !== r[a] || !n)) return !1;
                } else {
                    if (t instanceof Array)
                        return t.every(function (t) {
                            return e[t] === r[t] || (void 0 === r[t] && n);
                        });
                    if (!(t instanceof Object))
                        throw new TypeError('"keys" isn\'t an Object instance');
                    for (var o in t) {
                        var a = t[o];
                        if (e[o] !== r[a] && (void 0 !== r[a] || !n)) return !1;
                    }
                }
                return !0;
            }
            function o(e) {
                return "number" == typeof e;
            }
            function i(e) {
                return "string" == typeof e;
            }
            function u(e, r) {
                if (!e) throw new Error(r);
                return e;
            }
            function s(e, r) {
                if (!(e instanceof Object))
                    throw new TypeError(r || "Expected Object");
                return e;
            }
            function c(e, r) {
                if ("string" != typeof e)
                    throw new TypeError(r || "Expected string");
                return e;
            }
            function l(e, r) {
                if (!f(e)) throw new TypeError(r || "Expected Array");
                return e;
            }
            function f(e) {
                return !!e && e.constructor === Array;
            }
            function p(e, r) {
                return [].concat.apply([], e.map(r));
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.updateProperties = n),
                (r.testProperties = a),
                (r.mustBeNumber = function (e, r) {
                    if (!o(e)) throw new TypeError(r || "Expected number");
                    return e;
                }),
                (r.isNumber = o),
                (r.isString = i),
                (r.mustNotBeUndefined = u),
                (r.mustBeObject = s),
                (r.mustBeString = c),
                (r.mustBeArray = l),
                (r.isArray = f),
                (r.mconcat = function (e) {
                    for (var r = [], t = 1; t < arguments.length; t++)
                        r[t - 1] = arguments[t];
                    return r.reduceRight(e);
                }),
                (r.snd = function (e) {
                    return e[1];
                }),
                (r.concatMap = p);
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return o(e) || i(e);
            }
            function a(e) {
                return r.measureTypes.hasOwnProperty(e);
            }
            function o(e) {
                return a(e.type) && K.isNumber(e.value);
            }
            function i(e) {
                return m(e.expression);
            }
            function u(e) {
                if (void 0 === e) return !1;
                switch (e) {
                    case "Parentheses":
                    case "Square":
                    case "Dollar":
                        return !0;
                    default:
                        return !1;
                }
            }
            function s(e, r) {
                return (
                    void 0 !== e &&
                    (void 0 === r ? "string" == typeof e.name : r === e.name)
                );
            }
            function c(e) {
                return void 0 !== e && "string" == typeof e.text;
            }
            function l(e) {
                return void 0 !== e && K.isArray(e.latex);
            }
            function f(e) {
                return e.arguments instanceof Array;
            }
            function p(e) {
                return e === Z.SUP || e === Z.SUB;
            }
            function d(e) {
                switch (e) {
                    case "#":
                        return "\\#";
                    case "$":
                        return "\\$";
                    case "%":
                        return "\\%";
                    case "^":
                        return "\\^{}";
                    case "&":
                        return "\\&";
                    case "{":
                        return "\\{";
                    case "}":
                        return "\\}";
                    case "~":
                        return "\\~{}";
                    case "\\":
                        return "\\textbackslash{}";
                    case "_":
                        return "\\_{}";
                    default:
                        return e;
                }
            }
            function h(e) {
                for (var r = [], t = 1; t < arguments.length; t++)
                    r[t - 1] = arguments[t];
                return 0 === r.length
                    ? "string" == typeof e.type
                    : r.some(function (r) {
                          return e.type === r;
                      });
            }
            function m(e) {
                return v(e) || g(e);
            }
            function g(e) {
                return (
                    R(e) || b(e) || C(e) || x(e) || E(e) || O(e) || k(e) || P(e)
                );
            }
            function v(e) {
                return (
                    R(e) || y(e) || C(e) || x(e) || E(e) || O(e) || k(e) || P(e)
                );
            }
            function y(e) {
                return (
                    void 0 !== e &&
                    void 0 !== e.type &&
                    c(e) &&
                    h(e, r.typeTeXRaw)
                );
            }
            function b(e) {
                return (
                    void 0 !== e &&
                    "string" == typeof e.string &&
                    "number" == typeof e.category
                );
            }
            function C(e) {
                return s(e) && f(e) && h(e, r.typeTeXComm, r.typeTeXCommS);
            }
            function w(e) {
                return C(e) && 0 === e.arguments.length;
            }
            function x(e, t) {
                return h(e, r.typeTeXEnv);
            }
            function E(e) {
                return l(e) && h(e) && u(e.type);
            }
            function O(e) {
                return (
                    void 0 !== e &&
                    "boolean" == typeof e.noNewPage &&
                    (void 0 === e.measure || n(e.measure))
                );
            }
            function T(e) {
                return p(e.type);
            }
            function k(e) {
                return l(e) && h(e, r.typeTeXBraces);
            }
            function S(e) {
                return h(e, "FixArg");
            }
            function _(e) {
                return h(e, "OptArg");
            }
            function P(e) {
                return c(e) && h(e, r.typeTeXComment);
            }
            function R(e) {
                return void 0 !== e && 0 === Object.keys(e).length;
            }
            function M(e) {
                return { type: "FixArg", latex: e };
            }
            function q(e) {
                return 1 === e.length
                    ? { type: "OptArg", latex: e }
                    : { type: "MOptArg", latex: e };
            }
            function A(e) {
                return { type: "SymArg", latex: [e] };
            }
            function j(e) {
                return { type: "ParArg", latex: [e] };
            }
            function Y(e) {
                return { type: "MOptArg", latex: e };
            }
            function z(e) {
                return { type: "MSymArg", latex: e };
            }
            function U(e) {
                return { type: "MParArg", latex: e };
            }
            function B(e) {
                return { name: e, arguments: [], type: r.typeTeXCommS };
            }
            function L(e) {
                return {
                    text: e,
                    type: r.typeTeXRaw,
                    characterCategories: $.convertToTeXCharsDefault(e),
                };
            }
            function X(e, r, t, n) {
                return { latex: n, type: e, startSymbol: r, endSymbol: t };
            }
            function D(e) {
                return { latex: [e], type: r.typeTeXBraces };
            }
            function N(e) {
                return { text: e, type: r.typeTeXComment };
            }
            function H(e) {
                for (var t = [], n = 1; n < arguments.length; n++)
                    t[n - 1] = arguments[n];
                return { name: e, arguments: t, type: r.typeTeXComm };
            }
            function I(e, r, t) {
                return { type: e, symbol: r, arguments: t };
            }
            function V(e, t) {
                for (var n = [], a = 2; a < arguments.length; a++)
                    n[a - 2] = arguments[a];
                return { name: e, latex: t, arguments: n, type: r.typeTeXEnv };
            }
            function F(e) {
                var r = [];
                return G(e, r), r.join("");
            }
            function G(e, r) {
                if (C(e))
                    r.push("\\", e.name),
                        e.arguments.forEach(function (e) {
                            return G(e, r);
                        });
                else {
                    if (x(e)) throw new Error("not supported yet");
                    if (E(e))
                        r.push(e.startSymbol),
                            e.latex.forEach(function (e) {
                                return G(e, r);
                            }),
                            r.push(e.endSymbol);
                    else if (O(e)) r.push("\n");
                    else if (T(e))
                        r.push(e.symbol),
                            e.arguments &&
                                e.arguments.forEach(function (e) {
                                    return G(e, r);
                                });
                    else if (k(e))
                        r.push("{"),
                            e.latex.forEach(function (e) {
                                return G(e, r);
                            }),
                            r.push("}");
                    else if (P(e)) r.push("%" + e.text + "\n");
                    else if (y(e)) r.push(e.text);
                    else {
                        if (b(e)) throw new Error("not supported yet");
                        if (S(e))
                            r.push("{"),
                                e.latex.forEach(function (e) {
                                    return G(e, r);
                                }),
                                r.push("}");
                        else {
                            if (!_(e))
                                throw new Error(
                                    "Did not recognize " + JSON.stringify(e)
                                );
                            r.push("["),
                                e.latex.forEach(function (e) {
                                    return G(e, r);
                                }),
                                r.push("]");
                        }
                    }
                }
            }
            Object.defineProperty(r, "__esModule", { value: !0 });
            var K = t(3),
                $ = t(6);
            (r.isMeasure = n),
                (r.measureTypes = {
                    pt: !0,
                    mm: !0,
                    cm: !0,
                    in: !0,
                    ex: !0,
                    em: !0,
                }),
                (r.isMeasureType = a),
                (r.isBuiltInMeasure = o),
                (r.isCustomMeasure = i),
                (r.mathTypes = {
                    Parentheses: "Parentheses",
                    Square: "Square",
                    Dollar: "Dollar",
                }),
                (r.isMathType = u),
                (r.isNameHaving = s),
                (r.isTextHaving = c),
                (r.isLaTeXHaving = l),
                (r.isArgumentHaving = f),
                (r.typeTeXSeq = "TeXSeq"),
                (r.typeTeXEnv = "TeXEnv"),
                (r.typeTeXBraces = "TeXBraces"),
                (r.typeTeXComment = "TeXComment"),
                (r.typeTeXRaw = "TeXRaw"),
                (r.typeTeXComm = "TeXComm"),
                (r.typeTeXCommS = "TeXCommS");
            var Z;
            !(function (e) {
                (e[(e.SUP = 0)] = "SUP"), (e[(e.SUB = 1)] = "SUB");
            })((Z = r.SubOrSuperSymbol || (r.SubOrSuperSymbol = {}))),
                (r.isSubOrSuperSymbol = p),
                (r.fromStringLaTeX = function (e) {
                    return L(r.protectString(e));
                }),
                (r.protectString = function (e) {
                    for (var r = [], t = 0; t < e.length; t++)
                        r.push(d(e.charAt(t)));
                    return r.join();
                }),
                (r.protectChar = d),
                (r.isTypeHaving = h),
                (r.isLaTeXBlock = m),
                (r.isLaTeXNoRaw = g),
                (r.isLaTeXRaw = v),
                (r.isTeXRaw = y),
                (r.isTeXChar = b),
                (r.isTeXComm = C),
                (r.isTeXCommS = w),
                (r.isTeXEnv = x),
                (r.isTeXMath = E),
                (r.isTeXLineBreak = O),
                (r.isSubOrSuperScript = T),
                (r.isTeXBraces = k),
                (r.isFixArg = S),
                (r.isOptArg = _),
                (r.isTeXComment = P),
                (r.isTeXEmpty = R),
                (r.newFixArg = M),
                (r.newOptArg = q),
                (r.newSymArg = A),
                (r.newParArg = j),
                (r.newMOptArg = Y),
                (r.newMSymArg = z),
                (r.newMParArg = U),
                (r.newCommandS = B),
                (r.newTeXRaw = L),
                (r.newTeXMath = X),
                (r.newTeXBraces = D),
                (r.newTeXMathDol = function (e) {
                    return X("Dollar", "$", "$", e);
                }),
                (r.newTeXComment = N),
                (r.newTeXComm = H),
                (r.newSubOrSuperScript = I),
                (r.newTeXEnv = V),
                (r.stringifyLaTeX = F);
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.supportedMarkups = { ascii: !0, unicode: !0, html: !0 });
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return a(r.defaultCategories, e);
            }
            function a(e, r) {
                for (var t = [], n = 0; n < r.length; n++) {
                    var a = r.charAt(n);
                    t.push({ string: a, category: e(a) });
                }
                return t;
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.defaultCategories = function (e) {
                    switch (e) {
                        case "\\":
                            return 0;
                        case "{":
                            return 1;
                        case "}":
                            return 2;
                        case "$":
                            return 3;
                        case "&":
                            return 4;
                        case "\r":
                            return 5;
                        case "#":
                            return 6;
                        case "^":
                            return 7;
                        case "_":
                            return 8;
                        case "\0":
                            return 9;
                        case " ":
                            return 10;
                        case "~":
                            return 13;
                        case "%":
                            return 14;
                        case "d":
                            return 15;
                        default:
                            return 11;
                    }
                }),
                (r.convertToTeXCharsDefault = n),
                (r.convertToTeXChars = a);
        },
        function (e, r, t) {
            !(function (r, t) {
                e.exports = t();
            })(0, function () {
                return (function (e) {
                    function r(n) {
                        if (t[n]) return t[n].exports;
                        var a = (t[n] = { i: n, l: !1, exports: {} });
                        return (
                            e[n].call(a.exports, a, a.exports, r),
                            (a.l = !0),
                            a.exports
                        );
                    }
                    var t = {};
                    return (
                        (r.m = e),
                        (r.c = t),
                        (r.i = function (e) {
                            return e;
                        }),
                        (r.d = function (e, t, n) {
                            r.o(e, t) ||
                                Object.defineProperty(e, t, {
                                    configurable: !1,
                                    enumerable: !0,
                                    get: n,
                                });
                        }),
                        (r.n = function (e) {
                            var t =
                                e && e.__esModule
                                    ? function () {
                                          return e.default;
                                      }
                                    : function () {
                                          return e;
                                      };
                            return r.d(t, "a", t), t;
                        }),
                        (r.o = function (e, r) {
                            return Object.prototype.hasOwnProperty.call(e, r);
                        }),
                        (r.p = ""),
                        r((r.s = 0))
                    );
                })([
                    function (e, r, t) {
                        "use strict";
                        function n(e) {
                            if (!(this instanceof n)) return new n(e);
                            this._ = e;
                        }
                        function a(e) {
                            return e instanceof n;
                        }
                        function o(e) {
                            return "[object Array]" === {}.toString.call(e);
                        }
                        function i(e, r) {
                            return {
                                status: !0,
                                index: e,
                                value: r,
                                furthest: -1,
                                expected: [],
                            };
                        }
                        function u(e, r) {
                            return {
                                status: !1,
                                index: -1,
                                value: null,
                                furthest: e,
                                expected: [r],
                            };
                        }
                        function s(e, r) {
                            if (!r) return e;
                            if (e.furthest > r.furthest) return e;
                            var t =
                                e.furthest === r.furthest
                                    ? l(e.expected, r.expected)
                                    : r.expected;
                            return {
                                status: e.status,
                                index: e.index,
                                value: e.value,
                                furthest: r.furthest,
                                expected: t,
                            };
                        }
                        function c(e, r) {
                            var t = e.slice(0, r).split("\n");
                            return {
                                offset: r,
                                line: t.length,
                                column: t[t.length - 1].length + 1,
                            };
                        }
                        function l(e, r) {
                            var t = e.length,
                                n = r.length;
                            if (0 === t) return r;
                            if (0 === n) return e;
                            for (var a = {}, o = 0; o < t; o++) a[e[o]] = !0;
                            for (var i = 0; i < n; i++) a[r[i]] = !0;
                            var u = [];
                            for (var s in a) a.hasOwnProperty(s) && u.push(s);
                            return u.sort(), u;
                        }
                        function f(e) {
                            if (!a(e)) throw new Error("not a parser: " + e);
                        }
                        function p(e) {
                            if (!o(e)) throw new Error("not an array: " + e);
                        }
                        function d(e) {
                            if ("number" != typeof e)
                                throw new Error("not a number: " + e);
                        }
                        function h(e) {
                            if (!(e instanceof RegExp))
                                throw new Error("not a regexp: " + e);
                            for (var r = C(e), t = 0; t < r.length; t++) {
                                var n = r.charAt(t);
                                if ("i" !== n && "m" !== n && "u" !== n)
                                    throw new Error(
                                        'unsupported regexp flag "' +
                                            n +
                                            '": ' +
                                            e
                                    );
                            }
                        }
                        function m(e) {
                            if ("function" != typeof e)
                                throw new Error("not a function: " + e);
                        }
                        function g(e) {
                            if ("string" != typeof e)
                                throw new Error("not a string: " + e);
                        }
                        function v(e) {
                            return 1 === e.length
                                ? e[0]
                                : "one of " + e.join(", ");
                        }
                        function y(e, r) {
                            var t = r.index,
                                n = t.offset;
                            if (n === e.length)
                                return ", got the end of the input";
                            var a = n > 0 ? "'..." : "'",
                                o = e.length - n > 12 ? "...'" : "'";
                            return (
                                " at line " +
                                t.line +
                                " column " +
                                t.column +
                                ", got " +
                                a +
                                e.slice(n, n + 12) +
                                o
                            );
                        }
                        function b(e, r) {
                            return "expected " + v(r.expected) + y(e, r);
                        }
                        function C(e) {
                            var r = "" + e;
                            return r.slice(r.lastIndexOf("/") + 1);
                        }
                        function w(e) {
                            return RegExp("^(?:" + e.source + ")", C(e));
                        }
                        function x() {
                            for (
                                var e = [].slice.call(arguments),
                                    r = e.length,
                                    t = 0;
                                t < r;
                                t += 1
                            )
                                f(e[t]);
                            return n(function (t, n) {
                                for (
                                    var a, o = new Array(r), u = 0;
                                    u < r;
                                    u += 1
                                ) {
                                    if (((a = s(e[u]._(t, n), a)), !a.status))
                                        return a;
                                    (o[u] = a.value), (n = a.index);
                                }
                                return s(i(n, o), a);
                            });
                        }
                        function E() {
                            for (
                                var e = {},
                                    r = 0,
                                    t = [].slice.call(arguments),
                                    u = t.length,
                                    c = 0;
                                c < u;
                                c += 1
                            ) {
                                var l = t[c];
                                if (!a(l)) {
                                    if (
                                        o(l) &&
                                        2 === l.length &&
                                        "string" == typeof l[0] &&
                                        a(l[1])
                                    ) {
                                        var f = l[0];
                                        if (e[f])
                                            throw new Error(
                                                "seqObj: duplicate key " + f
                                            );
                                        (e[f] = !0), r++;
                                        continue;
                                    }
                                    throw new Error(
                                        "seqObj arguments must be parsers or [string, parser] array pairs."
                                    );
                                }
                            }
                            if (0 === r)
                                throw new Error(
                                    "seqObj expects at least one named parser, found zero"
                                );
                            return n(function (e, r) {
                                for (var n, a = {}, c = 0; c < u; c += 1) {
                                    var l, f;
                                    if (
                                        (o(t[c])
                                            ? ((l = t[c][0]), (f = t[c][1]))
                                            : ((l = null), (f = t[c])),
                                        (n = s(f._(e, r), n)),
                                        !n.status)
                                    )
                                        return n;
                                    l && (a[l] = n.value), (r = n.index);
                                }
                                return s(i(r, a), n);
                            });
                        }
                        function O() {
                            var e = [].slice.call(arguments);
                            if (0 === e.length)
                                throw new Error(
                                    "seqMap needs at least one argument"
                                );
                            var r = e.pop();
                            return (
                                m(r),
                                x.apply(null, e).map(function (e) {
                                    return r.apply(null, e);
                                })
                            );
                        }
                        function T(e) {
                            var r = {};
                            for (var t in e)
                                ({}.hasOwnProperty.call(e, t) &&
                                    (function (t) {
                                        var n = function () {
                                            return e[t](r);
                                        };
                                        r[t] = D(n);
                                    })(t));
                            return r;
                        }
                        function k() {
                            var e = [].slice.call(arguments),
                                r = e.length;
                            if (0 === r) return q("zero alternates");
                            for (var t = 0; t < r; t += 1) f(e[t]);
                            return n(function (r, t) {
                                for (var n, a = 0; a < e.length; a += 1)
                                    if (((n = s(e[a]._(r, t), n)), n.status))
                                        return n;
                                return n;
                            });
                        }
                        function S(e, r) {
                            return _(e, r).or(M([]));
                        }
                        function _(e, r) {
                            f(e), f(r);
                            var t = r.then(e).many();
                            return e.chain(function (e) {
                                return t.map(function (r) {
                                    return [e].concat(r);
                                });
                            });
                        }
                        function P(e) {
                            g(e);
                            var r = "'" + e + "'";
                            return n(function (t, n) {
                                var a = n + e.length,
                                    o = t.slice(n, a);
                                return o === e ? i(a, o) : u(n, r);
                            });
                        }
                        function R(e, r) {
                            h(e), arguments.length >= 2 ? d(r) : (r = 0);
                            var t = w(e),
                                a = "" + e;
                            return n(function (e, n) {
                                var o = t.exec(e.slice(n));
                                if (o) {
                                    if (0 <= r && r <= o.length) {
                                        var s = o[0],
                                            c = o[r];
                                        return i(n + s.length, c);
                                    }
                                    return u(
                                        n,
                                        "valid match group (0 to " +
                                            o.length +
                                            ") in " +
                                            a
                                    );
                                }
                                return u(n, a);
                            });
                        }
                        function M(e) {
                            return n(function (r, t) {
                                return i(t, e);
                            });
                        }
                        function q(e) {
                            return n(function (r, t) {
                                return u(t, e);
                            });
                        }
                        function A(e) {
                            if (a(e))
                                return n(function (r, t) {
                                    var n = e._(r, t);
                                    return (n.index = t), (n.value = ""), n;
                                });
                            if ("string" == typeof e) return A(P(e));
                            if (e instanceof RegExp) return A(R(e));
                            throw new Error(
                                "not a string, regexp, or parser: " + e
                            );
                        }
                        function j(e) {
                            return (
                                f(e),
                                n(function (r, t) {
                                    var n = e._(r, t),
                                        a = r.slice(t, n.index);
                                    return n.status
                                        ? u(t, 'not "' + a + '"')
                                        : i(t, null);
                                })
                            );
                        }
                        function Y(e) {
                            return (
                                m(e),
                                n(function (r, t) {
                                    var n = r.charAt(t);
                                    return t < r.length && e(n)
                                        ? i(t + 1, n)
                                        : u(t, "a character matching " + e);
                                })
                            );
                        }
                        function z(e) {
                            return Y(function (r) {
                                return e.indexOf(r) >= 0;
                            });
                        }
                        function U(e) {
                            return Y(function (r) {
                                return e.indexOf(r) < 0;
                            });
                        }
                        function B(e) {
                            return n(e(i, u));
                        }
                        function L(e, r) {
                            return Y(function (t) {
                                return e <= t && t <= r;
                            }).desc(e + "-" + r);
                        }
                        function X(e) {
                            return (
                                m(e),
                                n(function (r, t) {
                                    for (
                                        var n = t;
                                        n < r.length && e(r.charAt(n));

                                    )
                                        n++;
                                    return i(n, r.slice(t, n));
                                })
                            );
                        }
                        function D(e, r) {
                            arguments.length < 2 && ((r = e), (e = void 0));
                            var t = n(function (e, n) {
                                return (t._ = r()._), t._(e, n);
                            });
                            return e ? t.desc(e) : t;
                        }
                        function N() {
                            return q("fantasy-land/empty");
                        }
                        var H = n.prototype;
                        (H.parse = function (e) {
                            if ("string" != typeof e)
                                throw new Error(
                                    ".parse must be called with a string as its argument"
                                );
                            var r = this.skip(G)._(e, 0);
                            return r.status
                                ? { status: !0, value: r.value }
                                : {
                                      status: !1,
                                      index: c(e, r.furthest),
                                      expected: r.expected,
                                  };
                        }),
                            (H.tryParse = function (e) {
                                var r = this.parse(e);
                                if (r.status) return r.value;
                                var t = b(e, r),
                                    n = new Error(t);
                                throw (
                                    ((n.type = "ParsimmonError"),
                                    (n.result = r),
                                    n)
                                );
                            }),
                            (H.or = function (e) {
                                return k(this, e);
                            }),
                            (H.trim = function (e) {
                                return this.wrap(e, e);
                            }),
                            (H.wrap = function (e, r) {
                                return O(e, this, r, function (e, r) {
                                    return r;
                                });
                            }),
                            (H.thru = function (e) {
                                return e(this);
                            }),
                            (H.then = function (e) {
                                return (
                                    f(e),
                                    x(this, e).map(function (e) {
                                        return e[1];
                                    })
                                );
                            }),
                            (H.many = function () {
                                var e = this;
                                return n(function (r, t) {
                                    for (var n = [], a = void 0; ; ) {
                                        if (((a = s(e._(r, t), a)), !a.status))
                                            return s(i(t, n), a);
                                        (t = a.index), n.push(a.value);
                                    }
                                });
                            }),
                            (H.tie = function () {
                                return this.map(function (e) {
                                    p(e);
                                    for (var r = "", t = 0; t < e.length; t++)
                                        g(e[t]), (r += e[t]);
                                    return r;
                                });
                            }),
                            (H.times = function (e, r) {
                                var t = this;
                                return (
                                    arguments.length < 2 && (r = e),
                                    d(e),
                                    d(r),
                                    n(function (n, a) {
                                        for (
                                            var o = [],
                                                u = void 0,
                                                c = void 0,
                                                l = 0;
                                            l < e;
                                            l += 1
                                        ) {
                                            if (
                                                ((u = t._(n, a)),
                                                (c = s(u, c)),
                                                !u.status)
                                            )
                                                return c;
                                            (a = u.index), o.push(u.value);
                                        }
                                        for (
                                            ;
                                            l < r &&
                                            ((u = t._(n, a)),
                                            (c = s(u, c)),
                                            u.status);
                                            l += 1
                                        )
                                            (a = u.index), o.push(u.value);
                                        return s(i(a, o), c);
                                    })
                                );
                            }),
                            (H.result = function (e) {
                                return this.map(function () {
                                    return e;
                                });
                            }),
                            (H.atMost = function (e) {
                                return this.times(0, e);
                            }),
                            (H.atLeast = function (e) {
                                return O(
                                    this.times(e),
                                    this.many(),
                                    function (e, r) {
                                        return e.concat(r);
                                    }
                                );
                            }),
                            (H.map = function (e) {
                                m(e);
                                var r = this;
                                return n(function (t, n) {
                                    var a = r._(t, n);
                                    return a.status
                                        ? s(i(a.index, e(a.value)), a)
                                        : a;
                                });
                            }),
                            (H.skip = function (e) {
                                return x(this, e).map(function (e) {
                                    return e[0];
                                });
                            }),
                            (H.mark = function () {
                                return O(I, this, I, function (e, r, t) {
                                    return { start: e, value: r, end: t };
                                });
                            }),
                            (H.node = function (e) {
                                return O(I, this, I, function (r, t, n) {
                                    return {
                                        name: e,
                                        value: t,
                                        start: r,
                                        end: n,
                                    };
                                });
                            }),
                            (H.sepBy = function (e) {
                                return S(this, e);
                            }),
                            (H.sepBy1 = function (e) {
                                return _(this, e);
                            }),
                            (H.lookahead = function (e) {
                                return this.skip(A(e));
                            }),
                            (H.notFollowedBy = function (e) {
                                return this.skip(j(e));
                            }),
                            (H.desc = function (e) {
                                var r = this;
                                return n(function (t, n) {
                                    var a = r._(t, n);
                                    return a.status || (a.expected = [e]), a;
                                });
                            }),
                            (H.fallback = function (e) {
                                return this.or(M(e));
                            }),
                            (H.ap = function (e) {
                                return O(e, this, function (e, r) {
                                    return e(r);
                                });
                            }),
                            (H.chain = function (e) {
                                var r = this;
                                return n(function (t, n) {
                                    var a = r._(t, n);
                                    return a.status
                                        ? s(e(a.value)._(t, a.index), a)
                                        : a;
                                });
                            }),
                            (H.concat = H.or),
                            (H.empty = N),
                            (H.of = M),
                            (H["fantasy-land/ap"] = H.ap),
                            (H["fantasy-land/chain"] = H.chain),
                            (H["fantasy-land/concat"] = H.concat),
                            (H["fantasy-land/empty"] = H.empty),
                            (H["fantasy-land/of"] = H.of),
                            (H["fantasy-land/map"] = H.map);
                        var I = n(function (e, r) {
                                return i(r, c(e, r));
                            }),
                            V = n(function (e, r) {
                                return r >= e.length
                                    ? u(r, "any character")
                                    : i(r + 1, e.charAt(r));
                            }),
                            F = n(function (e, r) {
                                return i(e.length, e.slice(r));
                            }),
                            G = n(function (e, r) {
                                return r < e.length ? u(r, "EOF") : i(r, null);
                            }),
                            K = R(/[0-9]/).desc("a digit"),
                            $ = R(/[0-9]*/).desc("optional digits"),
                            Z = R(/[a-z]/i).desc("a letter"),
                            J = R(/[a-z]*/i).desc("optional letters"),
                            W = R(/\s*/).desc("optional whitespace"),
                            Q = R(/\s+/).desc("whitespace");
                        (n.all = F),
                            (n.alt = k),
                            (n.any = V),
                            (n.createLanguage = T),
                            (n.custom = B),
                            (n.digit = K),
                            (n.digits = $),
                            (n.empty = N),
                            (n.eof = G),
                            (n.fail = q),
                            (n.formatError = b),
                            (n.index = I),
                            (n.isParser = a),
                            (n.lazy = D),
                            (n.letter = Z),
                            (n.letters = J),
                            (n.lookahead = A),
                            (n.makeFailure = u),
                            (n.makeSuccess = i),
                            (n.noneOf = U),
                            (n.notFollowedBy = j),
                            (n.of = M),
                            (n.oneOf = z),
                            (n.optWhitespace = W),
                            (n.Parser = n),
                            (n.range = L),
                            (n.regex = R),
                            (n.regexp = R),
                            (n.sepBy = S),
                            (n.sepBy1 = _),
                            (n.seq = x),
                            (n.seqMap = O),
                            (n.seqObj = E),
                            (n.string = P),
                            (n.succeed = M),
                            (n.takeWhile = X),
                            (n.test = Y),
                            (n.whitespace = Q),
                            (n["fantasy-land/empty"] = N),
                            (n["fantasy-land/of"] = M),
                            (e.exports = n);
                    },
                ]);
            });
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return new Error("I do not know command " + e);
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.unknownCommandError = n);
        },
        function (e, r, t) {
            "use strict";
            function n(e, r, t, n) {
                return {
                    name: e,
                    optionalArguments: r,
                    argumentCount: t,
                    apply: n,
                };
            }
            function a(e, r, t) {
                return { name: e, optionalArguments: r, argumentCount: t };
            }
            function o(e, r) {
                return { name: e, optionalArguments: 0, argumentCount: r };
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.createCommandHandler = n),
                (r.createKnownCommandWithOptArgs = a),
                (r.createKnownCommandWithArgs = o);
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return "bb" === e || "mathbb" === e || "textbb" === e;
            }
            function a(e) {
                return "bf" === e || "mathbf" === e || "textbf" === e;
            }
            function o(e) {
                return "mono" === e;
            }
            function i(e) {
                return "frak" === e || "mathfrak" === e || "textfrak" === e;
            }
            function u(e) {
                return "it" === e || "mathit" === e || "textit" === e;
            }
            function s(e) {
                return "tt" === e || "mathtt" === e || "texttt" === e;
            }
            function c(e) {
                return "cal" === e || "mathcal" === e || "textcal" === e;
            }
            function l(e) {
                return (
                    "sup" === e ||
                    "mathsup" === e ||
                    "textsup" === e ||
                    "superscript" === e ||
                    "mathsuperscript" === e ||
                    "textsuperscript" === e
                );
            }
            function f(e) {
                return (
                    "sub" === e ||
                    "mathsub" === e ||
                    "textsub" === e ||
                    "subscript" === e ||
                    "mathsubscript" === e ||
                    "textsubscript" === e
                );
            }
            function p(e) {
                return (
                    r.formattingText.hasOwnProperty(e) ||
                    r.formattingMath.hasOwnProperty(e) ||
                    r.formattingNoMode.hasOwnProperty(e)
                );
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.formattingText = {
                    textbb: !0,
                    textbf: !0,
                    textfrak: !0,
                    textit: !0,
                    texttt: !0,
                    textcal: !0,
                    textsup: !0,
                    textsub: !0,
                    textsuperscript: !0,
                    textsubscript: !0,
                }),
                (r.formattingNoMode = {
                    bb: !0,
                    bf: !0,
                    frak: !0,
                    it: !0,
                    tt: !0,
                    cal: !0,
                    mono: !0,
                    sup: !0,
                    sub: !0,
                    superscript: !0,
                    subscript: !0,
                }),
                (r.formattingMath = {
                    mathbb: !0,
                    mathbf: !0,
                    mathfrak: !0,
                    mathit: !0,
                    mathtt: !0,
                    mathcal: !0,
                    mathsup: !0,
                    mathsub: !0,
                    mathsuperscript: !0,
                    mathsubscript: !0,
                }),
                (r.isBbCmd = n),
                (r.isBfCmd = a),
                (r.isMonoCmd = o),
                (r.isFrakCmd = i),
                (r.isItCmd = u),
                (r.isTtCmd = s),
                (r.isCalCmd = c),
                (r.isSupCmd = l),
                (r.isSubCmd = f),
                (r.isFormattingCmd = p);
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return r.superscriptCharacters.hasOwnProperty(e);
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.superscriptCharacters = {
                    0: "⁰",
                    1: "¹",
                    2: "²",
                    3: "³",
                    4: "⁴",
                    5: "⁵",
                    6: "⁶",
                    7: "⁷",
                    8: "⁸",
                    9: "⁹",
                    "+": "⁺",
                    "-": "⁻",
                    "=": "⁼",
                    "(": "⁽",
                    ")": "⁾",
                    a: "ᵃ",
                    b: "ᵇ",
                    c: "ᶜ",
                    d: "ᵈ",
                    e: "ᵉ",
                    f: "ᶠ",
                    g: "ᵍ",
                    h: "ʰ",
                    i: "ⁱ",
                    j: "ʲ",
                    k: "ᵏ",
                    l: "ˡ",
                    m: "ᵐ",
                    n: "ⁿ",
                    o: "ᵒ",
                    p: "ᵖ",
                    r: "ʳ",
                    s: "ˢ",
                    t: "ᵗ",
                    u: "ᵘ",
                    v: "ᵛ",
                    w: "ʷ",
                    x: "ˣ",
                    y: "ʸ",
                    z: "ᶻ",
                    A: "ᴬ",
                    B: "ᴮ",
                    D: "ᴰ",
                    E: "ᴱ",
                    G: "ᴳ",
                    H: "ᴴ",
                    I: "ᴵ",
                    J: "ᴶ",
                    K: "ᴷ",
                    L: "ᴸ",
                    M: "ᴹ",
                    N: "ᴺ",
                    O: "ᴼ",
                    P: "ᴾ",
                    R: "ᴿ",
                    T: "ᵀ",
                    U: "ᵁ",
                    V: "ⱽ",
                    W: "ᵂ",
                    α: "ᵅ",
                    β: "ᵝ",
                    γ: "ᵞ",
                    δ: "ᵟ",
                    "∊": "ᵋ",
                    θ: "ᶿ",
                    ι: "ᶥ",
                    Φ: "ᶲ",
                    φ: "ᵠ",
                    χ: "ᵡ",
                }),
                (r.isSuperscriptCharacter = n),
                (r.translateCharToSuperscript = function (e) {
                    return n(e) ? r.superscriptCharacters[e] : void 0;
                });
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return r.oneArgsCommands.hasOwnProperty(e);
            }
            Object.defineProperty(r, "__esModule", { value: !0 });
            var a = t(51),
                o = t(52),
                i = t(10);
            (r.oneArgsCommands = Object.assign(
                {},
                a.spaceCmds1arg,
                i.formattingText,
                i.formattingMath,
                i.formattingNoMode,
                o.diacriticsTextMode,
                o.diacriticsMathMode,
                {
                    cyrchar: !0,
                    vec: !0,
                    mono: !0,
                    ding: !0,
                    dingbat: !0,
                    ElsevierGlyph: !0,
                    elsevierglyph: !0,
                    elsevier: !0,
                    Elsevier: !0,
                }
            )),
                (r.is1argsCommand = n);
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                for (var t in e) r.hasOwnProperty(t) || (r[t] = e[t]);
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                n(t(14)),
                n(t(15)),
                n(t(5)),
                n(t(8)),
                n(t(1)),
                n(t(9)),
                n(t(59)),
                n(t(60)),
                n(t(12)),
                n(t(61));
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.aliases = {
                    mathfrak: "frak",
                    mathcal: "cal",
                    mathbb: "bb",
                    mathbf: "bf",
                    dfrac: "frac",
                    ldots: "dots",
                });
        },
        function (e, r, t) {
            "use strict";
            function n(e, r) {
                return o(
                    e,
                    u.mustNotBeUndefined(
                        u.mustBeOk(u.latexParser.parse(r)).value
                    )
                );
            }
            function a(e) {
                return o(
                    { translateTo: "unicode", mode: "Any" },
                    u.mustNotBeUndefined(
                        u.mustBeOk(u.latexParser.parse(e)).value
                    )
                );
            }
            function o(e, r) {
                var t = e.translateTo;
                switch (t) {
                    case "html":
                        throw new Error(
                            "Unsupported format: '" +
                                t +
                                "'. Use one of: " +
                                Object.keys(i.supportedMarkups)
                        );
                    case "unicode":
                    default:
                        return s.convertLaTeXBlocksToUnicode(e, r).result;
                }
            }
            Object.defineProperty(r, "__esModule", { value: !0 });
            var i = t(5),
                u = t(2),
                s = t(17);
            (r.convertLaTeX = n),
                (r.convertLaTeXToUnicode = a),
                (r.convertLaTeXBlocks = o);
        },
        function (e, r, t) {
            "use strict";
            function n(e, r) {
                var t = e.length,
                    n = r.length;
                if (0 === t) return r;
                if (0 === n) return e;
                for (var a = {}, o = 0; o < t; o++) a[e[o]] = !0;
                for (var i = 0; i < n; i++) a[r[i]] = !0;
                var u = [];
                for (var s in a) a.hasOwnProperty(s) && u.push(s);
                return u.sort(), u;
            }
            function a(e, r) {
                if (!r) return e;
                if (e.furthest > r.furthest) return e;
                var t =
                    e.furthest === r.furthest
                        ? n(e.expected, r.expected)
                        : r.expected;
                return {
                    status: e.status,
                    index: e.index,
                    value: e.value,
                    furthest: r.furthest,
                    expected: t,
                };
            }
            function o(e, r, t, n) {
                return E.Parser(function (o, i) {
                    for (var u = n, s = 0, c = void 0; i < o.length; ) {
                        var l = r._(o, i);
                        if (l.status) {
                            i = k.mustBeNumber(l.index);
                            break;
                        }
                        var f = e._(o, i);
                        if (w(f)) return f;
                        if (((c = k.mustNotBeUndefined(a(f, c))), w(c)))
                            return c;
                        s++;
                        var p = k.mustNotBeUndefined(c.value);
                        (u = t(u, p)), (i = k.mustBeNumber(c.index));
                    }
                    return x(a(E.makeSuccess(i, u), c));
                });
            }
            function i(e, r) {
                return o(
                    e,
                    r,
                    function (e, r) {
                        return e.concat([r]);
                    },
                    []
                );
            }
            function u(e) {
                return E.Parser(function (r, t) {
                    var n = r.charAt(t);
                    if (t >= r.length || e(n))
                        return S.makeFailure(t, "text character");
                    var a = [n];
                    t++;
                    for (var o = r.charAt(t); !e(o) && t < r.length; )
                        a.push(o), t++, (o = r.charAt(t));
                    return E.makeSuccess(t, a.join(""));
                });
            }
            function s(e) {
                return u(l(e)).map(function (e) {
                    return T.newTeXRaw(e);
                });
            }
            function c(e, t) {
                return (
                    void 0 === t ? r.specialCharsDefault : t
                ).hasOwnProperty(e);
            }
            function l(e) {
                return function (r) {
                    return e.hasOwnProperty(r);
                };
            }
            function f(e, t, n) {
                switch (
                    (void 0 === t && (t = "_"), void 0 === n && (n = "^"), e)
                ) {
                    case "Math":
                        return r.latexBlockParserMathMode(t, n);
                    default:
                        return r.latexBlockParserTextMode;
                }
            }
            function p(e) {
                return e >= "A" && e <= "Z";
            }
            function d(e) {
                return e >= "a" && e <= "z";
            }
            function h(e) {
                return Y.then(i(f(e, "_"), z)).map(O.newFixArg);
            }
            function m(e) {
                return M.then(i(f(e), q)).map(O.newOptArg);
            }
            function g(e) {
                return E.alt(h(e), m(e));
            }
            function v(e) {
                return E.alt(
                    E.string("{}").map(function () {
                        return [];
                    }),
                    g(e)
                        .map(function (e) {
                            return e;
                        })
                        .atLeast(0)
                ).map(function (e) {
                    return e;
                });
            }
            function y(e) {
                return E.seqMap(
                    r.commandSymbol,
                    E.alt(r.specialChar, r.takeTill(r.endCmd)),
                    v(e),
                    function (e, r, t) {
                        return void 0 !== t
                            ? O.newTeXComm.apply(void 0, [r].concat(t))
                            : O.newTeXComm(r);
                    }
                ).map(function (e) {
                    return e;
                });
            }
            function b(e, t, n) {
                return E.seqMap(
                    r.subOrSuperscriptSymbolParser(t, n),
                    v(e),
                    function (e, r) {
                        return O.newSubOrSuperScript(
                            e,
                            e === O.SubOrSuperSymbol.SUB ? t : n,
                            r
                        );
                    }
                ).map(function (e) {
                    return e;
                });
            }
            function C(e) {
                return void 0 !== e && !0 === e.status;
            }
            function w(e) {
                return void 0 !== e && !1 === e.status;
            }
            function x(e) {
                if (!C(e))
                    throw new Error(
                        "Expected parse to be success: " + JSON.stringify(e)
                    );
                return e;
            }
            Object.defineProperty(r, "__esModule", { value: !0 });
            var E = t(7),
                O = t(4),
                T = t(4),
                k = t(3),
                S = t(7);
            (r.defaultParserConf = { verbatimEnvironments: ["verbatim"] }),
                (r.takeTill = function (e) {
                    return E.takeWhile(function (r) {
                        return !e(r);
                    });
                });
            var _ = E.regexp(/[^\n]*/),
                P = E.regexp(/\n?/),
                R = (E.regexp(/\s*/m), E.string("%")),
                M = E.string("["),
                q = E.string("]");
            (r.notTextDefault = {
                $: !0,
                "%": !0,
                "\\": !0,
                "{": !0,
                "]": !0,
                "}": !0,
            }),
                (r.notTextMathMode = {
                    "^": !0,
                    _: !0,
                    $: !0,
                    "%": !0,
                    "\\": !0,
                    "{": !0,
                    "]": !0,
                    "}": !0,
                }),
                (r.notTextMathModeAndNotClosingBracket = {
                    "^": !0,
                    _: !0,
                    $: !0,
                    "%": !0,
                    "\\": !0,
                    "{": !0,
                    "}": !0,
                }),
                (r.notTextDefaultAndNotClosingBracket = {
                    $: !0,
                    "%": !0,
                    "\\": !0,
                    "{": !0,
                    "}": !0,
                }),
                (r.textParser = s);
            var A =
                (s(r.notTextDefault),
                s(r.notTextDefaultAndNotClosingBracket),
                E.regexp(/ */).map(T.newTeXRaw));
            (r.comment = R.then(_).skip(P).map(O.newTeXComment)),
                (r.specialCharsDefault = {
                    "'": !0,
                    "(": !0,
                    ")": !0,
                    ",": !0,
                    ".": !0,
                    "-": !0,
                    '"': !0,
                    "!": !0,
                    "^": !0,
                    $: !0,
                    "&": !0,
                    "#": !0,
                    "{": !0,
                    "}": !0,
                    "%": !0,
                    "~": !0,
                    "|": !0,
                    "/": !0,
                    ":": !0,
                    ";": !0,
                    "=": !0,
                    "[": !0,
                    "]": !0,
                    "\\": !0,
                    "`": !0,
                    " ": !0,
                }),
                (r.isSpecialCharacter = c),
                (r.isNotText = l),
                (r.mathSymbol = E.string("$")),
                (r.commandSymbol = E.string("\\")),
                (r.latexBlockParser = f),
                (r.latexBlockParserTextMode = E.lazy(function () {
                    return E.alt(
                        E.alt(
                            s(r.notTextDefault),
                            r.dolMath,
                            r.comment,
                            s(r.notTextDefaultAndNotClosingBracket),
                            r.environment,
                            y("Paragraph")
                        )
                    );
                })),
                (r.latexBlockParserMathMode = function (e, t) {
                    return E.lazy(function () {
                        return E.alt(
                            E.alt(
                                b("Math", e, t),
                                s(r.notTextMathMode),
                                r.dolMath,
                                r.comment,
                                s(r.notTextMathModeAndNotClosingBracket),
                                r.environment,
                                y("Math")
                            )
                        );
                    });
                }),
                (r.latexParser = r.latexBlockParserTextMode.many());
            var j = E.string("{")
                .then(r.latexBlockParserTextMode.many())
                .skip(E.string("}"));
            (r.env = E.Parser(function (e, t) {
                var n = E.string("\\begin")
                    .then(E.string("{"))
                    .then(A)
                    .then(E.regexp(/[a-zA-Z]+/))
                    .skip(A)
                    .skip(E.string("}"))
                    ._(e, t);
                if (w(n)) return n;
                t = k.mustBeNumber(n.index);
                var a = n.value;
                return i(
                    r.latexBlockParserTextMode,
                    E.string("\\end")
                        .then(E.string("{"))
                        .then(A)
                        .then(E.string(a))
                        .then(A)
                        .then(E.string("}"))
                )
                    .map(function (e) {
                        return O.newTeXEnv(a, e);
                    })
                    ._(e, t);
            })),
                (r.environment = E.alt(j, r.env)),
                (r.specialChar = E.test(c)),
                (r.endCmd = function (e) {
                    return !d(e) && !p(e);
                });
            var Y = E.string("{"),
                z = E.string("}");
            (r.fixArg = h),
                (r.optArg = m),
                (r.cmdArg = g),
                (r.cmdArgs = v),
                (r.command = y),
                (r.subOrSuperscriptSymbolParser = function (e, r) {
                    return E.alt(E.string(e), E.string(r)).map(function (r) {
                        return r === e
                            ? O.SubOrSuperSymbol.SUB
                            : O.SubOrSuperSymbol.SUP;
                    });
                }),
                (r.shiftedScript = b),
                (r.dolMath = (function (e, r, t) {
                    return (
                        void 0 === e && (e = "Dollar"),
                        void 0 === r && (r = "$"),
                        void 0 === t && (t = "$"),
                        E.string(r)
                            .then(
                                f("Math", "_")
                                    .many()
                                    .map(function (n) {
                                        return O.newTeXMath(e, r, t, n);
                                    })
                            )
                            .skip(E.string(t))
                    );
                })()),
                (r.isOk = C),
                (r.isNotOk = w),
                (r.mustBeOk = x);
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return "string" == typeof e;
            }
            function a(e, r) {
                var t = e;
                do {
                    e++;
                } while (p.isTeXChar(r[e]));
                return {
                    result: r
                        .slice(t, e)
                        .map(function (e) {
                            return e.string;
                        })
                        .join(""),
                    blockIndex: e,
                };
            }
            function o(e, r, t, a) {
                var o = f(e, a);
                if (n(o)) return { result: o, blockIndex: r + 1 };
                for (
                    var i = [], s = [];
                    i.length < o.argumentCount && r < t.length - 1;

                ) {
                    r++;
                    var c = r;
                    if (t.length < c - 1)
                        throw new Error(
                            "Could not gobble " +
                                o.argumentCount +
                                " arguments for " +
                                a.name
                        );
                    var l = t[c];
                    if (p.isTeXRaw(l)) {
                        for (
                            var d = /\s+/g,
                                h = l.text.replace(x, ""),
                                m = -1,
                                g = 0;
                            i.length < o.argumentCount;

                        ) {
                            var v = d.exec(h);
                            if (!v) {
                                i.push.apply(i, w.convertToTeXCharsDefault(h));
                                break;
                            }
                            var y = h.substring(g, v.index);
                            (m = v.index),
                                (g = v.index + y.length),
                                i.push.apply(i, w.convertToTeXCharsDefault(y));
                        }
                        m >= 0 && s.push(h.substring(m));
                    } else i.push(l);
                }
                r++;
                var b = i
                    .map(function (r) {
                        return u(e, [r]).result;
                    })
                    .map(p.newTeXRaw)
                    .map(function (e) {
                        return p.newFixArg([e]);
                    });
                if (b.length < o.argumentCount)
                    throw new Error(
                        "Could not find enough arguments for command \\" +
                            o.name +
                            ". Expected " +
                            o.argumentCount +
                            ", but found " +
                            b.length
                    );
                var C = [o.apply(function () {}, b)];
                return (
                    s.length > 0 && C.push(s.join("")),
                    { result: C.join(""), blockIndex: r }
                );
            }
            function i(e) {
                return (
                    void 0 !== e &&
                    "string" == typeof e.string &&
                    "number" == typeof e.category
                );
            }
            function u(e, r) {
                var t = 0;
                if (r.length <= 0) return { result: "", blockIndex: t };
                for (var n = []; t < r.length; ) {
                    var s = r[t];
                    try {
                        if (i(s)) {
                            var c = a(t, r);
                            (t = c.blockIndex), n.push(c.result);
                        } else if (p.isTeXComm(s)) {
                            var l = o(e, t, r, s);
                            (t = l.blockIndex), n.push(l.result);
                        } else if (p.isFixArg(s) || p.isOptArg(s)) {
                            var l = u(e, s.latex);
                            n.push(l.result), t++;
                        } else if (p.isTextHaving(s)) n.push(s.text), t++;
                        else {
                            if (p.isTeXMath(s)) return u(e, s.latex);
                            if (p.isTeXRaw(s)) n.push(s.text), t++;
                            else if (p.isSubOrSuperScript(s)) {
                                var f = s.arguments ? s.arguments : [],
                                    l = o(
                                        e,
                                        t,
                                        r,
                                        p.newTeXComm.apply(
                                            void 0,
                                            [
                                                s.type ===
                                                p.SubOrSuperSymbol.SUB
                                                    ? "mathsubscript"
                                                    : "mathsuperscript",
                                            ].concat(f)
                                        )
                                    );
                                (t = l.blockIndex), n.push(l.result);
                            } else {
                                if (!p.isArray(s))
                                    throw new Error(
                                        "Can't handle LaTeX block yet: " +
                                            JSON.stringify(s) +
                                            ". Leave an issue at https://github.com/digitalheir/tex-to-unicode/issues"
                                    );
                                var l = u(e, s);
                                n.push(l.result), t++;
                            }
                        }
                    } catch (r) {
                        if (void 0 === e.onError) throw r;
                        var d = e.onError(r, s);
                        if (void 0 === d) throw r;
                        n.push(d), t++;
                    }
                }
                return { result: n.join(""), blockIndex: t };
            }
            function s(e, r) {
                if (r.arguments.length > 0) {
                    var t = g.expand1argsCommand(
                        r.name,
                        u(e, [r.arguments[0]]).result || ""
                    );
                    return r.arguments.length > 1
                        ? t + u(e, r.arguments.slice(1)).result
                        : t;
                }
                return m.createCommandHandler(r.name, 0, 1, function (t, n) {
                    var a = n[0],
                        o = n.slice(1);
                    return (
                        g.expand1argsCommand(r.name, u(e, [a]).result) +
                        u(e, o).result
                    );
                });
            }
            function c(e, r) {
                if (r.arguments.length > 1) {
                    var t = b.expand2argsCommand(
                        r.name,
                        u(e, [r.arguments[0]]).result || "",
                        u(e, [r.arguments[1]]).result || ""
                    );
                    return r.arguments.length > 2
                        ? t + u(e, r.arguments.slice(1)).result
                        : t;
                }
                return m.createCommandHandler(r.name, 0, 2, function (t, n) {
                    var a = n[0],
                        o = n[1],
                        i = n.slice(2);
                    return (
                        b.expand2argsCommand(
                            r.name,
                            u(e, [a]).result,
                            u(e, [o]).result
                        ) + u(e, i).result
                    );
                });
            }
            function l(e, r) {
                for (
                    var t = void 0, n = void 0, a = 0;
                    void 0 === n && a < r.arguments.length;

                ) {
                    var o = r.arguments[a],
                        i = u(e, [o]).result;
                    p.isOptArg(o) && !t ? (t = i) : (n = i), a++;
                }
                return n
                    ? y.convertSqrtToUnicode(n, t)
                    : m.createCommandHandler(r.name, 1, 1, function (r, t) {
                          var n = t[0],
                              a = y.convertSqrtToUnicode(u(e, [n]).result);
                          if (t.length > 1) {
                              var o = t.slice(1);
                              return a + u(e, o).result;
                          }
                          return a;
                      });
            }
            function f(e, r) {
                var t = r.name,
                    n = h.expand0argsCommand(t);
                if (n)
                    return r.arguments && r.arguments.length > 0
                        ? n + u(e, r.arguments).result
                        : n;
                if (v.is1argsCommand(t)) return s(e, r);
                if (C.is2argsCommand(t)) return c(e, r);
                if ("sqrt" === t) return l(e, r);
                throw d.unknownCommandError(t);
            }
            Object.defineProperty(r, "__esModule", { value: !0 });
            var p = t(2),
                d = t(8),
                h = t(18),
                m = t(9),
                g = t(25),
                v = t(12),
                y = t(53),
                b = t(54),
                C = t(57),
                w = t(6),
                x = /^\s*/;
            (r.isTeXChar2 = i),
                (r.convertLaTeXBlocksToUnicode = u),
                (r.convertCommand = f);
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 });
            var n = t(19),
                a = t(20),
                o = t(21),
                i = t(22),
                u = t(23),
                s = t(24);
            r.expand0argsCommand = function (e) {
                for (
                    var r = 0,
                        t = [
                            o.barredLUnicode,
                            n.spaceUnicode,
                            i.slashedOUnicode,
                            a.characterUnicode,
                            s.specialCharacter,
                            u.cyrillicUnicode,
                        ];
                    r < t.length;
                    r++
                ) {
                    var c = t[r],
                        l = c(e);
                    if (l) return l;
                }
            };
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return r.spaceCharactersUnicode.hasOwnProperty(e);
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.mathSpace = "芇"),
                (r.spaceCharactersUnicode = {
                    ",": " ",
                    quad: " ",
                    qquad: "  ",
                    " ": " ",
                    space: " ",
                    ";": "　",
                    ":": "　",
                    hfill: "\t",
                }),
                (r.isSpaceCharactersUnicode = n),
                (r.spaceUnicode = function (e) {
                    return n(e) ? r.spaceCharactersUnicode[e] : void 0;
                });
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return r.characterUnicodeChart.hasOwnProperty(e);
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.characterUnicodeChart = {
                    leftrightsquigarrow: "↭",
                    Longleftrightarrow: "⟺",
                    blacktriangleright: "▶",
                    longleftrightarrow: "⟷",
                    blacktriangledown: "▼",
                    blacktriangleleft: "◀",
                    leftrightharpoons: "⇋",
                    rightleftharpoons: "⇌",
                    twoheadrightarrow: "↠",
                    circlearrowright: "↻",
                    downharpoonright: "⇂",
                    rightharpoondown: "⇁",
                    rightrightarrows: "⇉",
                    twoheadleftarrow: "↞",
                    vartriangleright: "⊳",
                    bigtriangledown: "▽",
                    circlearrowleft: "↺",
                    curvearrowright: "↷",
                    downharpoonleft: "⇃",
                    leftharpoondown: "↽",
                    leftrightarrows: "⇆",
                    rightleftarrows: "⇄",
                    rightsquigarrow: "⇝",
                    rightthreetimes: "⋌",
                    trianglerighteq: "⊵",
                    vartriangleleft: "⊲",
                    Leftrightarrow: "⇔",
                    Longrightarrow: "⟹",
                    curvearrowleft: "↶",
                    dashrightarrow: "⇢",
                    doublebarwedge: "⩞",
                    downdownarrows: "⇊",
                    hookrightarrow: "↪",
                    leftleftarrows: "⇇",
                    leftrightarrow: "↔",
                    leftthreetimes: "⋋",
                    longrightarrow: "⟶",
                    looparrowright: "↬",
                    rightarrowtail: "↣",
                    rightharpoonup: "⇀",
                    sphericalangle: "∢",
                    textregistered: "®",
                    trianglelefteq: "⊴",
                    upharpoonright: "↾",
                    Longleftarrow: "⟸",
                    bigtriangleup: "△",
                    blacktriangle: "▲",
                    dashleftarrow: "⇠",
                    divideontimes: "⋇",
                    fallingdotseq: "≒",
                    hookleftarrow: "↩",
                    leftarrowtail: "↢",
                    leftharpoonup: "↼",
                    longleftarrow: "⟵",
                    looparrowleft: "↫",
                    measuredangle: "∡",
                    shortparallel: "∥",
                    smallsetminus: "∖",
                    texttrademark: "™",
                    triangleright: "▷",
                    upharpoonleft: "↿",
                    blacklozenge: "◆",
                    risingdotseq: "≓",
                    triangledown: "▽",
                    triangleleft: "◁",
                    Rrightarrow: "⇛",
                    Updownarrow: "⇕",
                    backepsilon: "∍",
                    blacksquare: "■",
                    circledcirc: "⊚",
                    circleddash: "⊝",
                    curlyeqprec: "⋞",
                    curlyeqsucc: "⋟",
                    diamondsuit: "♢",
                    preccurlyeq: "≼",
                    succcurlyeq: "≽",
                    textgreater: ">",
                    thickapprox: "≈",
                    updownarrow: "↕",
                    vartriangle: "△",
                    Lleftarrow: "⇚",
                    Rightarrow: "⇒",
                    circledast: "⊛",
                    complement: "∁",
                    curlywedge: "⋏",
                    longmapsto: "⟼",
                    registered: "®",
                    rightarrow: "→",
                    smallfrown: "⌢",
                    smallsmile: "⌣",
                    sqsubseteq: "⊑",
                    sqsupseteq: "⊒",
                    textlangle: "〈",
                    textrangle: "〉",
                    upuparrows: "⇈",
                    varepsilon: "ε",
                    varnothing: "∅",
                    Downarrow: "⇓",
                    Leftarrow: "⇐",
                    backprime: "‵",
                    bigotimes: "⨂",
                    centerdot: "⋅",
                    copyright: "©",
                    downarrow: "↓",
                    gtreqless: "⋛",
                    heartsuit: "♡",
                    leftarrow: "←",
                    lesseqgtr: "⋚",
                    pitchfork: "⋔",
                    spadesuit: "♠",
                    therefore: "∴",
                    trademark: "™",
                    triangleq: "≜",
                    varpropto: "∝",
                    approxeq: "≊",
                    barwedge: "⊼",
                    bigoplus: "⨁",
                    bigsqcup: "⨆",
                    biguplus: "⨄",
                    bigwedge: "⋀",
                    boxminus: "⊟",
                    boxtimes: "⊠",
                    circledS: "Ⓢ",
                    clubsuit: "♣",
                    curlyvee: "⋎",
                    doteqdot: "≑",
                    emptyset: "∅",
                    intercal: "⊺",
                    leqslant: "⩽",
                    multimap: "⊸",
                    parallel: "∥",
                    setminus: "∖",
                    sqsubset: "⊏",
                    sqsupset: "⊐",
                    subseteq: "⊆",
                    supseteq: "⊇",
                    textless: "<",
                    thicksim: "∼",
                    triangle: "△",
                    varkappa: "ϰ",
                    varsigma: "ς",
                    vartheta: "ϑ",
                    Diamond: "◇",
                    Uparrow: "⇑",
                    Upsilon: "Υ",
                    backsim: "∽",
                    because: "∵",
                    between: "≬",
                    bigodot: "⨀",
                    bigstar: "★",
                    boxplus: "⊞",
                    ddagger: "‡",
                    diamond: "⋄",
                    digamma: "Ϝ",
                    dotplus: "∔",
                    epsilon: "∊",
                    gtrless: "≷",
                    implies: "⇒",
                    leadsto: "↝",
                    lessdot: "⋖",
                    lessgtr: "≶",
                    lesssim: "≲",
                    lozenge: "◊",
                    natural: "♮",
                    nearrow: "↗",
                    nexists: "∄",
                    nwarrow: "↖",
                    partial: "∂",
                    pilcrow: "¶",
                    precsim: "≾",
                    searrow: "↘",
                    section: "§",
                    succsim: "≿",
                    swarrow: "↙",
                    textbar: "|",
                    uparrow: "↑",
                    upsilon: "υ",
                    Bumpeq: "≎",
                    Lambda: "Λ",
                    Subset: "⋐",
                    Supset: "⋑",
                    Vvdash: "⊪",
                    approx: "≈",
                    bigcap: "⋂",
                    bigcup: "⋃",
                    bigvee: "⋁",
                    bowtie: "⋈",
                    boxdot: "⊡",
                    bullet: "∙",
                    bumpeq: "≏",
                    circeq: "≗",
                    coprod: "∐",
                    dagger: "†",
                    daleth: "ד",
                    degree: "°",
                    eqcirc: "≖",
                    exists: "∃",
                    forall: "∀",
                    gtrdot: "⋗",
                    gtrsim: "≳",
                    hslash: "ℏ",
                    lambda: "λ",
                    lfloor: "⌊",
                    ltimes: "⋉",
                    mapsto: "↦",
                    models: "⊨",
                    ominus: "⊖",
                    oslash: "⊘",
                    otimes: "⊗",
                    preceq: "⪯",
                    propto: "∝",
                    rfloor: "⌋",
                    rtimes: "⋊",
                    square: "□",
                    subset: "⊂",
                    succeq: "⪰",
                    supset: "⊃",
                    varphi: "φ",
                    varrho: "ϱ",
                    veebar: "⊻",
                    Delta: "Δ",
                    Gamma: "Γ",
                    Omega: "Ω",
                    Theta: "Θ",
                    Vdash: "⊩",
                    aleph: "ℵ",
                    Alpha: "Α",
                    alpha: "α",
                    angle: "∠",
                    asymp: "≍",
                    cdots: "⋯",
                    cents: "¢",
                    dashv: "⊣",
                    ddots: "⋱",
                    delta: "δ",
                    doteq: "≐",
                    equiv: "≡",
                    frown: "⌢",
                    gamma: "γ",
                    gimel: "ℷ",
                    infty: "∞",
                    kappa: "κ",
                    Kappa: "Κ",
                    lceil: "⌈",
                    nabla: "∇",
                    notin: "∉",
                    omega: "ω",
                    oplus: "⊕",
                    pound: "£",
                    prime: "′",
                    qquad: "  ",
                    rceil: "⌉",
                    sharp: "♯",
                    sigma: "σ",
                    simeq: "≃",
                    smile: "⌣",
                    space: "␣",
                    sqcap: "⊓",
                    sqcup: "⊔",
                    theta: "θ",
                    times: "×",
                    unlhd: "⊴",
                    unrhd: "⊵",
                    uplus: "⊎",
                    vDash: "⊨",
                    varpi: "ϖ",
                    vdash: "⊢",
                    vdots: "⋮",
                    wedge: "∧",
                    Finv: "Ⅎ",
                    Join: "⋈",
                    atop: "¦",
                    beta: "β",
                    Beta: "Β",
                    beth: "ב",
                    cdot: "⋅",
                    circ: "∘",
                    cong: "≅",
                    dots: "…",
                    euro: "€",
                    flat: "♭",
                    geqq: "≧",
                    hbar: "ℏ",
                    iota: "ι",
                    leqq: "≦",
                    odot: "⊙",
                    oint: "∮",
                    perp: "⊥",
                    prec: "≺",
                    prod: "∏",
                    quad: " ",
                    star: "⋆",
                    succ: "≻",
                    surd: "√",
                    zeta: "ζ",
                    Box: "□",
                    Cap: "⋒",
                    Cup: "⋓",
                    Lsh: "↰",
                    Phi: "Φ",
                    Psi: "Ψ",
                    Rsh: "↱",
                    ast: "∗",
                    bot: "⊥",
                    cap: "∩",
                    chi: "χ",
                    Chi: "Χ",
                    cup: "∪",
                    div: "÷",
                    ell: "ℓ",
                    eta: "η",
                    eth: "ð",
                    geq: "≥",
                    ggg: "⋙",
                    int: "∫",
                    leq: "≤",
                    lhd: "⊲",
                    lll: "⋘",
                    mho: "℧",
                    mid: "∣",
                    neg: "¬",
                    neq: "≠",
                    phi: "ϕ",
                    psi: "ψ",
                    rhd: "⊳",
                    rho: "ρ",
                    Rho: "Ρ",
                    sim: "∼",
                    sum: "∑",
                    tau: "τ",
                    Tau: "Τ",
                    top: "⊤",
                    vee: "∨",
                    Im: "ℑ",
                    Pi: "Π",
                    Re: "ℜ",
                    Xi: "Ξ",
                    ge: "≥",
                    gg: "≫",
                    in: "∈",
                    le: "≤",
                    ll: "≪",
                    mp: "∓",
                    mu: "μ",
                    Mu: "Μ",
                    ni: "∋",
                    nu: "ν",
                    Nu: "Ν",
                    pi: "π",
                    pm: "±",
                    wp: "℘",
                    wr: "≀",
                    xi: "ξ",
                    Omicron: "Ο",
                    omicron: "ο",
                    textdollar: "$",
                    textquotesingle: "'",
                    textbackslash: "\\",
                    textasciigrave: "`",
                    lbrace: "{",
                    vert: "|",
                    rbrace: "}",
                    textasciitilde: "~",
                    textexclamdown: "¡",
                    textcent: "¢",
                    textsterling: "£",
                    textcurrency: "¤",
                    textyen: "¥",
                    textbrokenbar: "¦",
                    textsection: "§",
                    textasciidieresis: "¨",
                    textcopyright: "©",
                    textordfeminine: "ª",
                    guillemotleft: "«",
                    lnot: "¬",
                    textasciimacron: "¯",
                    textdegree: "°",
                    textasciiacute: "´",
                    textparagraph: "¶",
                    textordmasculine: "º",
                    guillemotright: "»",
                    textonequarter: "¼",
                    textonehalf: "½",
                    textthreequarters: "¾",
                    textquestiondown: "¿",
                    AA: "Å",
                    AE: "Æ",
                    DH: "Ð",
                    texttimes: "×",
                    TH: "Þ",
                    ss: "ß",
                    aa: "å",
                    ae: "æ",
                    dh: "ð",
                    th: "þ",
                    DJ: "Đ",
                    dj: "đ",
                    Elzxh: "ħ",
                    i: "ı",
                    NG: "Ŋ",
                    ng: "ŋ",
                    OE: "Œ",
                    oe: "œ",
                    texthvlig: "ƕ",
                    textnrleg: "ƞ",
                    textdoublepipe: "ǂ",
                    Elztrna: "ɐ",
                    Elztrnsa: "ɒ",
                    Elzopeno: "ɔ",
                    Elzrtld: "ɖ",
                    Elzschwa: "ə",
                    Elzpgamma: "ɣ",
                    Elzpbgam: "ɤ",
                    Elztrnh: "ɥ",
                    Elzbtdl: "ɬ",
                    Elzrtll: "ɭ",
                    Elztrnm: "ɯ",
                    Elztrnmlr: "ɰ",
                    Elzltlmr: "ɱ",
                    Elzltln: "ɲ",
                    Elzrtln: "ɳ",
                    Elzclomeg: "ɷ",
                    textphi: "ɸ",
                    Elztrnr: "ɹ",
                    Elztrnrl: "ɺ",
                    Elzrttrnr: "ɻ",
                    Elzrl: "ɼ",
                    Elzrtlr: "ɽ",
                    Elzfhr: "ɾ",
                    Elzrtls: "ʂ",
                    Elzesh: "ʃ",
                    Elztrnt: "ʇ",
                    Elzrtlt: "ʈ",
                    Elzpupsil: "ʊ",
                    Elzpscrv: "ʋ",
                    Elzinvv: "ʌ",
                    Elzinvw: "ʍ",
                    Elztrny: "ʎ",
                    Elzrtlz: "ʐ",
                    Elzyogh: "ʒ",
                    Elzglst: "ʔ",
                    Elzreglst: "ʕ",
                    Elzinglst: "ʖ",
                    textturnk: "ʞ",
                    Elzdyogh: "ʤ",
                    Elztesh: "ʧ",
                    textasciicaron: "ˇ",
                    Elzverts: "ˈ",
                    Elzverti: "ˌ",
                    Elzlmrk: "ː",
                    Elzhlmrk: "ˑ",
                    Elzsbrhr: "˒",
                    Elzsblhr: "˓",
                    Elzrais: "˔",
                    Elzlow: "˕",
                    textasciibreve: "˘",
                    textperiodcentered: "˙",
                    texttildelow: "˜",
                    Epsilon: "Ε",
                    Zeta: "Ζ",
                    Eta: "Η",
                    Iota: "Ι",
                    Sigma: "Σ",
                    texttheta: "θ",
                    textvartheta: "ϑ",
                    Stigma: "Ϛ",
                    Digamma: "Ϝ",
                    Koppa: "Ϟ",
                    Sampi: "Ϡ",
                    textTheta: "ϴ",
                    textendash: "–",
                    textemdash: "—",
                    Vert: "‖",
                    Elzreapos: "‛",
                    textquotedblleft: "“",
                    textquotedblright: "”",
                    textdagger: "†",
                    textdaggerdbl: "‡",
                    textbullet: "•",
                    ldots: "…",
                    textperthousand: "‰",
                    textpertenthousand: "‱",
                    guilsinglleft: "‹",
                    guilsinglright: "›",
                    nolinebreak: "⁠",
                    Elzxrat: "℞",
                    nleftarrow: "↚",
                    nrightarrow: "↛",
                    arrowwaveleft: "↜",
                    arrowwaveright: "↝",
                    nleftrightarrow: "↮",
                    dblarrowupdown: "⇅",
                    nLeftarrow: "⇍",
                    nLeftrightarrow: "⇎",
                    nRightarrow: "⇏",
                    DownArrowUpArrow: "⇵",
                    rightangle: "∟",
                    nmid: "∤",
                    nparallel: "∦",
                    surfintegral: "∯",
                    volintegral: "∰",
                    clwintegral: "∱",
                    Colon: "∷",
                    homothetic: "∻",
                    lazysinv: "∾",
                    NotEqualTilde: "≂",
                    approxnotequal: "≆",
                    tildetrpl: "≋",
                    allequal: "≌",
                    NotHumpDownHump: "≎",
                    NotHumpEqual: "≏",
                    estimates: "≙",
                    starequal: "≛",
                    lneqq: "≨",
                    lvertneqq: "≨",
                    gneqq: "≩",
                    gvertneqq: "≩",
                    NotLessLess: "≪",
                    NotGreaterGreater: "≫",
                    lessequivlnt: "≲",
                    greaterequivlnt: "≳",
                    notlessgreater: "≸",
                    notgreaterless: "≹",
                    precapprox: "≾",
                    NotPrecedesTilde: "≾",
                    succapprox: "≿",
                    NotSucceedsTilde: "≿",
                    subsetneq: "⊊",
                    varsubsetneqq: "⊊",
                    supsetneq: "⊋",
                    varsupsetneq: "⊋",
                    NotSquareSubset: "⊏",
                    NotSquareSuperset: "⊐",
                    truestate: "⊧",
                    forcesextra: "⊨",
                    VDash: "⊫",
                    nvdash: "⊬",
                    nvDash: "⊭",
                    nVdash: "⊮",
                    nVDash: "⊯",
                    original: "⊶",
                    image: "⊷",
                    hermitconjmatrix: "⊹",
                    rightanglearc: "⊾",
                    backsimeq: "⋍",
                    verymuchless: "⋘",
                    verymuchgreater: "⋙",
                    Elzsqspne: "⋥",
                    lnsim: "⋦",
                    gnsim: "⋧",
                    precedesnotsimilar: "⋨",
                    succnsim: "⋩",
                    ntriangleleft: "⋪",
                    ntriangleright: "⋫",
                    ntrianglelefteq: "⋬",
                    ntrianglerighteq: "⋭",
                    upslopeellipsis: "⋰",
                    downslopeellipsis: "⋱",
                    perspcorrespond: "⌆",
                    recorder: "⌕",
                    ulcorner: "⌜",
                    urcorner: "⌝",
                    llcorner: "⌞",
                    lrcorner: "⌟",
                    langle: "〈",
                    rangle: "〉",
                    Elzdlcorn: "⎣",
                    lmoustache: "⎰",
                    rmoustache: "⎱",
                    textvisiblespace: "␣",
                    Elzdshfnc: "┆",
                    Elzsqfnw: "┙",
                    diagup: "╱",
                    Elzvrecto: "▯",
                    Elzcirfl: "◐",
                    Elzcirfr: "◑",
                    Elzcirfb: "◒",
                    Elzrvbull: "◘",
                    Elzsqfl: "◧",
                    Elzsqfr: "◨",
                    Elzsqfse: "◪",
                    bigcirc: "◯",
                    rightmoon: "☾",
                    mercury: "☿",
                    venus: "♀",
                    male: "♂",
                    jupiter: "♃",
                    saturn: "♄",
                    uranus: "♅",
                    neptune: "♆",
                    pluto: "♇",
                    aries: "♈",
                    taurus: "♉",
                    gemini: "♊",
                    cancer: "♋",
                    leo: "♌",
                    virgo: "♍",
                    libra: "♎",
                    scorpio: "♏",
                    sagittarius: "♐",
                    capricornus: "♑",
                    aquarius: "♒",
                    pisces: "♓",
                    quarternote: "♩",
                    eighthnote: "♪",
                    UpArrowBar: "⤒",
                    DownArrowBar: "⤓",
                    Elolarr: "⥀",
                    Elorarr: "⥁",
                    ElzRlarr: "⥂",
                    ElzrLarr: "⥄",
                    Elzrarrx: "⥇",
                    LeftRightVector: "⥎",
                    RightUpDownVector: "⥏",
                    DownLeftRightVector: "⥐",
                    LeftUpDownVector: "⥑",
                    LeftVectorBar: "⥒",
                    RightVectorBar: "⥓",
                    RightUpVectorBar: "⥔",
                    RightDownVectorBar: "⥕",
                    DownLeftVectorBar: "⥖",
                    DownRightVectorBar: "⥗",
                    LeftUpVectorBar: "⥘",
                    LeftDownVectorBar: "⥙",
                    LeftTeeVector: "⥚",
                    RightTeeVector: "⥛",
                    RightUpTeeVector: "⥜",
                    RightDownTeeVector: "⥝",
                    DownLeftTeeVector: "⥞",
                    DownRightTeeVector: "⥟",
                    LeftUpTeeVector: "⥠",
                    LeftDownTeeVector: "⥡",
                    UpEquilibrium: "⥮",
                    ReverseUpEquilibrium: "⥯",
                    RoundImplies: "⥰",
                    Elztfnc: "⦀",
                    Elroang: "⦆",
                    Elzddfnc: "⦙",
                    Angle: "⦜",
                    Elzlpargt: "⦠",
                    ElzLap: "⧊",
                    Elzdefas: "⧋",
                    LeftTriangleBar: "⧏",
                    NotLeftTriangleBar: "⧏",
                    RightTriangleBar: "⧐",
                    NotRightTriangleBar: "⧐",
                    RuleDelayed: "⧴",
                    Elxuplus: "⨄",
                    ElzThr: "⨅",
                    Elxsqcup: "⨆",
                    ElzInf: "⨇",
                    ElzSup: "⨈",
                    ElzCint: "⨍",
                    clockoint: "⨏",
                    sqrint: "⨖",
                    ElzTimes: "⨯",
                    amalg: "⨿",
                    ElzAnd: "⩓",
                    ElzOr: "⩔",
                    ElOr: "⩖",
                    Elzminhat: "⩟",
                    Equal: "⩵",
                    nleqslant: "⩽",
                    geqslant: "⩾",
                    ngeqslant: "⩾",
                    lessapprox: "⪅",
                    gtrapprox: "⪆",
                    lneq: "⪇",
                    gneq: "⪈",
                    lnapprox: "⪉",
                    gnapprox: "⪊",
                    lesseqqgtr: "⪋",
                    gtreqqless: "⪌",
                    eqslantless: "⪕",
                    eqslantgtr: "⪖",
                    NestedLessLess: "⪡",
                    NotNestedLessLess: "⪡",
                    NestedGreaterGreater: "⪢",
                    NotNestedGreaterGreater: "⪢",
                    precneqq: "⪵",
                    succneqq: "⪶",
                    precnapprox: "⪹",
                    succnapprox: "⪺",
                    subseteqq: "⫅",
                    nsubseteqq: "⫅",
                    supseteqq: "⫆",
                    subsetneqq: "⫋",
                    supsetneqq: "⫌",
                    Elztdcol: "⫶",
                    openbracketleft: "〚",
                    openbracketright: "〛",
                    checkmark: "✓",
                    maltese: "✠",
                }),
                (r.isCharacterUnicode = n),
                (r.characterUnicode = function (e) {
                    return n(e) ? r.characterUnicodeChart[e] : void 0;
                });
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.barredLUnicodeChart = { l: "ł", L: "Ł" }),
                (r.barredLUnicode = function (e) {
                    return r.barredLUnicodeChart[e];
                });
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.slashed_o = "ø"),
                (r.slashed_O = "Ø"),
                (r.slashedOUnicodeChart = { o: r.slashed_o, O: r.slashed_O }),
                (r.slashedOUnicode = function (e) {
                    return r.slashedOUnicodeChart[e];
                });
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.cyrillicUnicodeChart = {
                    CYRF: "Ф",
                    CYRII: "І",
                    CYROMEGA: "Ѡ",
                    CYRG: "Г",
                    cyrkvcrs: "ҝ",
                    cyryo: "ё",
                    CYRH: "Х",
                    CYRZHDSC: "Җ",
                    cyrphk: "ҧ",
                    CYRTDSC: "Ҭ",
                    CYRI: "И",
                    cyryi: "ї",
                    CYRDZHE: "Џ",
                    cyriote: "ѥ",
                    CYRK: "К",
                    CYRSHHA: "Һ",
                    CYRL: "Л",
                    CYRM: "М",
                    CYRCHLDSC: "Ӌ",
                    CYRNJE: "Њ",
                    CYRYAT: "Ѣ",
                    CYRA: "А",
                    CYRB: "Б",
                    cyrchrdsc: "ҷ",
                    cyrschwa: "ә",
                    CYRDZE: "Ѕ",
                    CYRIE: "Є",
                    CYRC: "Ц",
                    CYRZH: "Ж",
                    CYRD: "Д",
                    CYRABHCHDSC: "Ҿ",
                    CYRFITA: "Ѳ",
                    CYRE: "Е",
                    CYRABHHA: "Ҩ",
                    cyrya: "я",
                    cyrdzhe: "џ",
                    CYRIOTLYUS: "Ѩ",
                    cyrsemisftsn: "ҍ",
                    CYRV: "В",
                    cyrishrt: "й",
                    cyrdje: "ђ",
                    cyrchldsc: "ӌ",
                    CYRY: "Ү",
                    cyrndsc: "ң",
                    CYRZ: "З",
                    CYRKHCRS: "Ҟ",
                    CYRNG: "Ҥ",
                    CYRCHRDSC: "Ҷ",
                    CYRYHCRS: "Ұ",
                    CYRSHCH: "Щ",
                    CYRUSHRT: "Ў",
                    cyryu: "ю",
                    cyrksi: "ѯ",
                    CYRN: "Н",
                    CYRO: "О",
                    CYRBYUS: "Ѫ",
                    CYRP: "П",
                    CYRZDSC: "Ҙ",
                    CYRAE: "Ӕ",
                    CYRR: "Р",
                    CYRS: "С",
                    CYRT: "Т",
                    CYRABHCH: "Ҽ",
                    cyruk: "ѹ",
                    CYRU: "У",
                    cyrii: "і",
                    CYRSEMISFTSN: "Ҍ",
                    cyrghcrs: "ғ",
                    CYRISHRT: "Й",
                    cyromegatitlo: "ѽ",
                    cyrkbeak: "ҡ",
                    cyrie: "є",
                    cyrzdsc: "ҙ",
                    CYRNDSC: "Ң",
                    CYRGUP: "Ґ",
                    cyrshch: "щ",
                    CYRKHK: "Ӄ",
                    cyrzh: "ж",
                    CYRJE: "Ј",
                    cyrthousands: "҂",
                    cyrabhch: "ҽ",
                    textnumero: "№",
                    cyrng: "ҥ",
                    CYRPSI: "Ѱ",
                    CYRTETSE: "Ҵ",
                    CYRIOTBYUS: "Ѭ",
                    cyrnje: "њ",
                    CYRIOTE: "Ѥ",
                    cyrdze: "ѕ",
                    cyrae: "ӕ",
                    CYRHRDSN: "Ъ",
                    CYRKOPPA: "Ҁ",
                    CYRRTICK: "Ҏ",
                    CYRSCHWA: "Ә",
                    cyrtdsc: "ҭ",
                    CYRGHK: "Ҕ",
                    cyrabhha: "ҩ",
                    cyrshha: "һ",
                    CYRSH: "Ш",
                    cyru: "у",
                    cyrkhcrs: "ҟ",
                    cyrt: "т",
                    CYRERY: "Ы",
                    cyrs: "с",
                    cyrr: "р",
                    CYROT: "Ѿ",
                    cyrlyus: "ѧ",
                    CYRNHK: "Ӈ",
                    CYRSFTSN: "Ь",
                    cyrghk: "ҕ",
                    cyrp: "п",
                    cyrabhdze: "ӡ",
                    cyro: "о",
                    CYRTSHE: "Ћ",
                    cyrn: "н",
                    CYRSDSC: "Ҫ",
                    cyryhcrs: "ұ",
                    cyrpsi: "ѱ",
                    cyrz: "з",
                    cyry: "ү",
                    cyrje: "ј",
                    cyrv: "в",
                    cyrchvcrs: "ҹ",
                    cyrkhk: "ӄ",
                    cyre: "е",
                    cyromega: "ѡ",
                    cyrd: "д",
                    cyrc: "ц",
                    cyrb: "б",
                    CYROTLD: "Ө",
                    cyrgup: "ґ",
                    CYRLJE: "Љ",
                    cyra: "а",
                    CYROMEGATITLO: "Ѽ",
                    CYRGHCRS: "Ғ",
                    CYRCHVCRS: "Ҹ",
                    cyrm: "м",
                    cyrl: "л",
                    cyrsh: "ш",
                    cyrk: "к",
                    cyri: "и",
                    cyrh: "х",
                    CYRHDSC: "Ҳ",
                    CYRIZH: "Ѵ",
                    CYRABHDZE: "Ӡ",
                    cyrkdsc: "қ",
                    cyrg: "г",
                    CYRCH: "Ч",
                    cyrf: "ф",
                    CYRYI: "Ї",
                    cyrmillions: "҉",
                    CYRKSI: "Ѯ",
                    CYROMEGARND: "Ѻ",
                    cyrot: "ѿ",
                    cyrtetse: "ҵ",
                    cyrhdsc: "ҳ",
                    cyrushrt: "ў",
                    cyriotlyus: "ѩ",
                    CYRYA: "Я",
                    cyrlje: "љ",
                    cyrotld: "ө",
                    CYRKDSC: "Қ",
                    cyrhrdsn: "ъ",
                    cyrrtick: "ҏ",
                    cyrkoppa: "ҁ",
                    CYRDJE: "Ђ",
                    cyriotbyus: "ѭ",
                    cyrhundredthousands: "҈",
                    CYRpalochka: "Ӏ",
                    CYRKVCRS: "Ҝ",
                    cyromegarnd: "ѻ",
                    cyrsftsn: "ь",
                    cyrabhchdsc: "ҿ",
                    cyrzhdsc: "җ",
                    cyrerev: "э",
                    CYRLYUS: "Ѧ",
                    CYRKBEAK: "Ҡ",
                    cyrery: "ы",
                    CYREREV: "Э",
                    cyrnhk: "ӈ",
                    cyrsdsc: "ҫ",
                    cyrch: "ч",
                    cyrtshe: "ћ",
                    CYRPHK: "Ҧ",
                    CYRYO: "Ё",
                    CYRYU: "Ю",
                    CYRUK: "Ѹ",
                }),
                (r.cyrillicUnicode = function (e) {
                    return r.cyrillicUnicodeChart[e];
                });
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return r.specialCharacters.hasOwnProperty(e);
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.specialCharacters = {
                    i: "ı",
                    j: "ȷ",
                    oe: "œ",
                    OE: "Œ",
                    ae: "æ",
                    AE: "Æ",
                    aa: "å",
                    AA: "Å",
                    o: "ø",
                    O: "Ø",
                    ss: "ß",
                    l: "ł",
                    L: "Ł",
                }),
                (r.isSpecialCharacter = n),
                (r.specialCharacter = function (e) {
                    return n(e) ? r.specialCharacters[e] : void 0;
                });
        },
        function (e, r, t) {
            "use strict";
            function n(e, r) {
                switch (e) {
                    case "cyrchar":
                        var t = i.translateCharToCyrillic(r);
                        if (t) return t;
                        break;
                    case "ding":
                    case "dingbat":
                        var n = u.translateCharToDingbat(r);
                        if (n) return n;
                        break;
                    case "ElsevierGlyph":
                    case "elsevierglyph":
                    case "elsevier":
                    case "Elsevier":
                        var c = s.translateCharToElsevier(r);
                        if (c) return c;
                        break;
                    default:
                        for (
                            var l = 0,
                                f = [a.diacriticUnicode, o.formattingUnicode];
                            l < f.length;
                            l++
                        ) {
                            var p = f[l],
                                d = p(e, r);
                            if (d) return d;
                        }
                }
                throw new Error(
                    "No implementation found to expand \\" +
                        e +
                        " with argument {" +
                        r +
                        "}"
                );
            }
            Object.defineProperty(r, "__esModule", { value: !0 });
            var a = t(26),
                o = t(39),
                i = t(48),
                u = t(49),
                s = t(50);
            r.expand1argsCommand = n;
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 });
            var n = t(27),
                a = t(28),
                o = t(29),
                i = t(30),
                u = t(31),
                s = t(32),
                c = t(33),
                l = t(34),
                f = t(1),
                p = t(35),
                d = t(36),
                h = t(37),
                m = t(38);
            (r.barUnderLetter = f.simpleSuffix("̱")),
                (r.dotUnderLetter = f.simpleSuffix("̣")),
                (r.breve = f.simpleSuffix("̆")),
                (r.macrron = f.simpleSuffix("̄")),
                (r.dotOverLetter = f.simpleSuffix("̇")),
                (r.modifiersTextModeUnicodeChart = {
                    "`": o.graveAccent,
                    "'": a.acuteAccent,
                    "^": i.circumflex,
                    "~": u.tilde,
                    "=": r.macrron,
                    ".": r.dotOverLetter,
                    '"': s.dieresis,
                    H: m.longHungarianUmlaut,
                    c: c.cedilla,
                    k: p.ogonek,
                    b: r.barUnderLetter,
                    d: r.dotUnderLetter,
                    r: n.ringOverLetter,
                    u: r.breve,
                    v: l.caron,
                    t: d.tieLetters,
                }),
                (r.modifiersMathModeUnicodeChart = {
                    check: l.caron,
                    acute: a.acuteAccent,
                    grave: a.acuteAccent,
                    breve: r.breve,
                    vec: h.vectorArrow,
                    mathring: n.ringOverLetter,
                }),
                (r.diacriticUnicode = function (e, t) {
                    var n = r.modifiersTextModeUnicodeChart[e];
                    return (
                        n || (n = r.modifiersMathModeUnicodeChart[e]), n && n(t)
                    );
                });
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 });
            var n = t(0);
            r.ringOverLetter = n.lookupOrAppend({ a: "å", A: "Å", y: "ẙ" }, "̊");
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 });
            var n = t(0);
            r.acuteAccent = n.lookupOrAppend(
                {
                    e: "é",
                    y: "ý",
                    u: "ú",
                    i: "í",
                    o: "ó",
                    a: "á",
                    E: "É",
                    Y: "Ý",
                    U: "Ú",
                    I: "Í",
                    O: "Ó",
                    A: "Á",
                    cyrk: "ќ",
                    cyrg: "ѓ",
                    CYRK: "Ќ",
                    CYRG: "Ѓ",
                },
                "́"
            );
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 });
            var n = t(0);
            r.graveAccent = n.lookupOrAppend(
                {
                    e: "è",
                    u: "ù",
                    i: "ì",
                    o: "ò",
                    a: "à",
                    E: "È",
                    U: "Ù",
                    I: "Ì",
                    O: "Ò",
                    A: "À",
                },
                "̀"
            );
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 });
            var n = t(0);
            r.circumflex = n.lookupOrAppend(
                {
                    e: "ê",
                    u: "û",
                    i: "î",
                    o: "ô",
                    a: "â",
                    E: "Ê",
                    U: "Û",
                    I: "Î",
                    O: "Ô",
                    A: "Â",
                },
                "̂"
            );
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 });
            var n = t(0);
            r.tilde = n.lookupOrAppend(
                { o: "õ", a: "ã", n: "ñ", O: "Õ", A: "Ã", N: "Ñ" },
                "̃"
            );
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 });
            var n = t(0);
            r.dieresis = n.lookupOrAppend(
                {
                    e: "ë",
                    y: "ÿ",
                    u: "ü",
                    i: "ï",
                    o: "ö",
                    a: "ä",
                    E: "Ë",
                    Y: "Ÿ",
                    U: "Ü",
                    I: "Ï",
                    O: "Ö",
                    A: "Ä",
                },
                "̈"
            );
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 });
            var n = t(0);
            r.cedilla = n.lookupOrAppend({ c: "ç" }, "̧");
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 });
            var n = t(0);
            r.caron = n.lookupOrAppend({ s: "š" }, "̌");
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 });
            var n = t(1);
            r.ogonek = n.simpleSuffix("̨");
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return a(e.charAt(0), e.substring(1));
            }
            function a(e, r) {
                return e + "͡" + r;
            }
            function o(e) {
                return "t" === e;
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.tieLetters = n),
                (r.tie2Letters = a),
                (r.isTieLetters = o);
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 });
            var n = t(0);
            r.vectorArrow = n.lookupOrAppend({}, "⃗");
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 });
            var n = t(0);
            r.longHungarianUmlaut = n.lookupOrAppend(
                { o: "ő", u: "ű", O: "Ő", U: "Ű" },
                "̋"
            );
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 });
            var n = t(40),
                a = t(41),
                o = t(42),
                i = t(43),
                u = t(44),
                s = t(45),
                c = t(10),
                l = t(46),
                f = t(11),
                p = t(47);
            r.formattingUnicode = function (e, r) {
                var t = void 0;
                if (
                    (c.isBbCmd(e)
                        ? (t = n.translateCharToBlackboard)
                        : c.isBfCmd(e)
                        ? (t = a.translateCharToBold)
                        : c.isFrakCmd(e)
                        ? (t = o.translateCharToFraktur)
                        : c.isItCmd(e)
                        ? (t = i.translateCharToItalic)
                        : c.isTtCmd(e)
                        ? (t = u.translateCharToMonospace)
                        : c.isCalCmd(e)
                        ? (t = s.translateCharToCalligraphic)
                        : c.isSubCmd(e)
                        ? (t = l.translateCharToSubscript)
                        : c.isSupCmd(e)
                        ? (t = f.translateCharToSuperscript)
                        : c.isMonoCmd(e) && (t = p.translateCharToMono),
                    t)
                ) {
                    var d = t;
                    return r
                        .split("")
                        .map(function (e) {
                            return d(e) || e;
                        })
                        .join("");
                }
            };
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return r.blackboardCharacters.hasOwnProperty(e);
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.blackboardCharacters = {
                    A: "𝔸",
                    B: "𝔹",
                    C: "ℂ",
                    D: "𝔻",
                    E: "𝔼",
                    F: "𝔽",
                    G: "𝔾",
                    H: "ℍ",
                    I: "𝕀",
                    J: "𝕁",
                    K: "𝕂",
                    L: "𝕃",
                    M: "𝕄",
                    N: "ℕ",
                    O: "𝕆",
                    P: "ℙ",
                    Q: "ℚ",
                    R: "ℝ",
                    S: "𝕊",
                    T: "𝕋",
                    U: "𝕌",
                    V: "𝕍",
                    W: "𝕎",
                    X: "𝕏",
                    Y: "𝕐",
                    Z: "ℤ",
                    a: "𝕒",
                    b: "𝕓",
                    c: "𝕔",
                    d: "𝕕",
                    e: "𝕖",
                    f: "𝕗",
                    g: "𝕘",
                    h: "𝕙",
                    i: "𝕚",
                    j: "𝕛",
                    k: "𝕜",
                    l: "𝕝",
                    m: "𝕞",
                    n: "𝕟",
                    o: "𝕠",
                    p: "𝕡",
                    q: "𝕢",
                    r: "𝕣",
                    s: "𝕤",
                    t: "𝕥",
                    u: "𝕦",
                    v: "𝕧",
                    w: "𝕨",
                    x: "𝕩",
                    y: "𝕪",
                    z: "𝕫",
                    0: "𝟘",
                    1: "𝟙",
                    2: "𝟚",
                    3: "𝟛",
                    4: "𝟜",
                    5: "𝟝",
                    6: "𝟞",
                    7: "𝟟",
                    8: "𝟠",
                    9: "𝟡",
                }),
                (r.isBlackboardCharacter = n),
                (r.translateCharToBlackboard = function (e) {
                    return n(e) ? r.blackboardCharacters[e] : void 0;
                });
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return r.boldCharacters.hasOwnProperty(e);
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.boldCharacters = {
                    A: "𝐀",
                    B: "𝐁",
                    C: "𝐂",
                    D: "𝐃",
                    E: "𝐄",
                    F: "𝐅",
                    G: "𝐆",
                    H: "𝐇",
                    I: "𝐈",
                    J: "𝐉",
                    K: "𝐊",
                    L: "𝐋",
                    M: "𝐌",
                    N: "𝐍",
                    O: "𝐎",
                    P: "𝐏",
                    Q: "𝐐",
                    R: "𝐑",
                    S: "𝐒",
                    T: "𝐓",
                    U: "𝐔",
                    V: "𝐕",
                    W: "𝐖",
                    X: "𝐗",
                    Y: "𝐘",
                    Z: "𝐙",
                    a: "𝐚",
                    b: "𝐛",
                    c: "𝐜",
                    d: "𝐝",
                    e: "𝐞",
                    f: "𝐟",
                    g: "𝐠",
                    h: "𝐡",
                    i: "𝐢",
                    j: "𝐣",
                    k: "𝐤",
                    l: "𝐥",
                    m: "𝐦",
                    n: "𝐧",
                    o: "𝐨",
                    p: "𝐩",
                    q: "𝐪",
                    r: "𝐫",
                    s: "𝐬",
                    t: "𝐭",
                    u: "𝐮",
                    v: "𝐯",
                    w: "𝐰",
                    x: "𝐱",
                    y: "𝐲",
                    z: "𝐳",
                    Α: "𝚨",
                    Β: "𝚩",
                    Γ: "𝚪",
                    Δ: "𝚫",
                    Ε: "𝚬",
                    Ζ: "𝚭",
                    Η: "𝚮",
                    Θ: "𝚯",
                    Ι: "𝚰",
                    Κ: "𝚱",
                    Λ: "𝚲",
                    Μ: "𝚳",
                    Ν: "𝚴",
                    Ξ: "𝚵",
                    Ο: "𝚶",
                    Π: "𝚷",
                    Ρ: "𝚸",
                    ϴ: "𝚹",
                    Σ: "𝚺",
                    Τ: "𝚻",
                    Υ: "𝚼",
                    Φ: "𝚽",
                    Χ: "𝚾",
                    Ψ: "𝚿",
                    Ω: "𝛀",
                    "∇": "𝛁",
                    α: "𝛂",
                    β: "𝛃",
                    γ: "𝛄",
                    δ: "𝛅",
                    ε: "𝛆",
                    ζ: "𝛇",
                    η: "𝛈",
                    θ: "𝛉",
                    ι: "𝛊",
                    κ: "𝛋",
                    λ: "𝛌",
                    μ: "𝛍",
                    ν: "𝛎",
                    ξ: "𝛏",
                    ο: "𝛐",
                    π: "𝛑",
                    ρ: "𝛒",
                    ς: "𝛓",
                    σ: "𝛔",
                    τ: "𝛕",
                    υ: "𝛖",
                    φ: "𝛗",
                    χ: "𝛘",
                    ψ: "𝛙",
                    ω: "𝛚",
                    "∂": "𝛛",
                    ϵ: "𝛜",
                    ϑ: "𝛝",
                    ϰ: "𝛞",
                    ϕ: "𝛟",
                    ϱ: "𝛠",
                    ϖ: "𝛡",
                    0: "𝟎",
                    1: "𝟏",
                    2: "𝟐",
                    3: "𝟑",
                    4: "𝟒",
                    5: "𝟓",
                    6: "𝟔",
                    7: "𝟕",
                    8: "𝟖",
                    9: "𝟗",
                }),
                (r.isBlackboardCharacter = n),
                (r.translateCharToBold = function (e) {
                    return n(e) ? r.boldCharacters[e] : void 0;
                });
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return r.frakturCharacters.hasOwnProperty(e);
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.frakturCharacters = {
                    A: "𝔄",
                    B: "𝔅",
                    C: "ℭ",
                    D: "𝔇",
                    E: "𝔈",
                    F: "𝔉",
                    G: "𝔊",
                    H: "ℌ",
                    I: "ℑ",
                    J: "𝔍",
                    K: "𝔎",
                    L: "𝔏",
                    M: "𝔐",
                    N: "𝔑",
                    O: "𝔒",
                    P: "𝔓",
                    Q: "𝔔",
                    R: "ℜ",
                    S: "𝔖",
                    T: "𝔗",
                    U: "𝔘",
                    V: "𝔙",
                    W: "𝔚",
                    X: "𝔛",
                    Y: "𝔜",
                    Z: "ℨ",
                    a: "𝔞",
                    b: "𝔟",
                    c: "𝔠",
                    d: "𝔡",
                    e: "𝔢",
                    f: "𝔣",
                    g: "𝔤",
                    h: "𝔥",
                    i: "𝔦",
                    j: "𝔧",
                    k: "𝔨",
                    l: "𝔩",
                    m: "𝔪",
                    n: "𝔫",
                    o: "𝔬",
                    p: "𝔭",
                    q: "𝔮",
                    r: "𝔯",
                    s: "𝔰",
                    t: "𝔱",
                    u: "𝔲",
                    v: "𝔳",
                    w: "𝔴",
                    x: "𝔵",
                    y: "𝔶",
                    z: "𝔷",
                }),
                (r.isFrakturCharacter = n),
                (r.translateCharToFraktur = function (e) {
                    return n(e) ? r.frakturCharacters[e] : void 0;
                });
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return r.italicCharacters.hasOwnProperty(e);
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.italicCharacters = {
                    A: "𝐴",
                    B: "𝐵",
                    C: "𝐶",
                    D: "𝐷",
                    E: "𝐸",
                    F: "𝐹",
                    G: "𝐺",
                    H: "𝐻",
                    I: "𝐼",
                    J: "𝐽",
                    K: "𝐾",
                    L: "𝐿",
                    M: "𝑀",
                    N: "𝑁",
                    O: "𝑂",
                    P: "𝑃",
                    Q: "𝑄",
                    R: "𝑅",
                    S: "𝑆",
                    T: "𝑇",
                    U: "𝑈",
                    V: "𝑉",
                    W: "𝑊",
                    X: "𝑋",
                    Y: "𝑌",
                    Z: "𝑍",
                    a: "𝑎",
                    b: "𝑏",
                    c: "𝑐",
                    d: "𝑑",
                    e: "𝑒",
                    f: "𝑓",
                    g: "𝑔",
                    h: "ℎ",
                    i: "𝑖",
                    j: "𝑗",
                    k: "𝑘",
                    l: "𝑙",
                    m: "𝑚",
                    n: "𝑛",
                    o: "𝑜",
                    p: "𝑝",
                    q: "𝑞",
                    r: "𝑟",
                    s: "𝑠",
                    t: "𝑡",
                    u: "𝑢",
                    v: "𝑣",
                    w: "𝑤",
                    x: "𝑥",
                    y: "𝑦",
                    z: "𝑧",
                    Α: "𝛢",
                    Β: "𝛣",
                    Γ: "𝛤",
                    Δ: "𝛥",
                    Ε: "𝛦",
                    Ζ: "𝛧",
                    Η: "𝛨",
                    Θ: "𝛩",
                    Ι: "𝛪",
                    Κ: "𝛫",
                    Λ: "𝛬",
                    Μ: "𝛭",
                    Ν: "𝛮",
                    Ξ: "𝛯",
                    Ο: "𝛰",
                    Π: "𝛱",
                    Ρ: "𝛲",
                    ϴ: "𝛳",
                    Σ: "𝛴",
                    Τ: "𝛵",
                    Υ: "𝛶",
                    Φ: "𝛷",
                    Χ: "𝛸",
                    Ψ: "𝛹",
                    Ω: "𝛺",
                    "∇": "𝛻",
                    α: "𝛼",
                    β: "𝛽",
                    γ: "𝛾",
                    δ: "𝛿",
                    ε: "𝜀",
                    ζ: "𝜁",
                    η: "𝜂",
                    θ: "𝜃",
                    ι: "𝜄",
                    κ: "𝜅",
                    λ: "𝜆",
                    μ: "𝜇",
                    ν: "𝜈",
                    ξ: "𝜉",
                    ο: "𝜊",
                    π: "𝜋",
                    ρ: "𝜌",
                    ς: "𝜍",
                    σ: "𝜎",
                    τ: "𝜏",
                    υ: "𝜐",
                    φ: "𝜑",
                    χ: "𝜒",
                    ψ: "𝜓",
                    ω: "𝜔",
                    "∂": "𝜕",
                    ϵ: "𝜖",
                    ϑ: "𝜗",
                    ϰ: "𝜘",
                    ϕ: "𝜙",
                    ϱ: "𝜚",
                    ϖ: "𝜛",
                }),
                (r.isItalicCharacter = n),
                (r.translateCharToItalic = function (e) {
                    return n(e) ? r.italicCharacters[e] : void 0;
                });
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return r.monospaceCharacters.hasOwnProperty(e);
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.monospaceCharacters = {
                    A: "𝙰",
                    B: "𝙱",
                    C: "𝙲",
                    D: "𝙳",
                    E: "𝙴",
                    F: "𝙵",
                    G: "𝙶",
                    H: "𝙷",
                    I: "𝙸",
                    J: "𝙹",
                    K: "𝙺",
                    L: "𝙻",
                    M: "𝙼",
                    N: "𝙽",
                    O: "𝙾",
                    P: "𝙿",
                    Q: "𝚀",
                    R: "𝚁",
                    S: "𝚂",
                    T: "𝚃",
                    U: "𝚄",
                    V: "𝚅",
                    W: "𝚆",
                    X: "𝚇",
                    Y: "𝚈",
                    Z: "𝚉",
                    a: "𝚊",
                    b: "𝚋",
                    c: "𝚌",
                    d: "𝚍",
                    e: "𝚎",
                    f: "𝚏",
                    g: "𝚐",
                    h: "𝚑",
                    i: "𝚒",
                    j: "𝚓",
                    k: "𝚔",
                    l: "𝚕",
                    m: "𝚖",
                    n: "𝚗",
                    o: "𝚘",
                    p: "𝚙",
                    q: "𝚚",
                    r: "𝚛",
                    s: "𝚜",
                    t: "𝚝",
                    u: "𝚞",
                    v: "𝚟",
                    w: "𝚠",
                    x: "𝚡",
                    y: "𝚢",
                    z: "𝚣",
                    0: "𝟶",
                    1: "𝟷",
                    2: "𝟸",
                    3: "𝟹",
                    4: "𝟺",
                    5: "𝟻",
                    6: "𝟼",
                    7: "𝟽",
                    8: "𝟾",
                    9: "𝟿",
                }),
                (r.isMonospaceCharacter = n),
                (r.translateCharToMonospace = function (e) {
                    return n(e) ? r.monospaceCharacters[e] : void 0;
                });
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return r.calligraphicLetters.hasOwnProperty(e);
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.calligraphicLetters = {
                    A: "𝓐",
                    B: "𝓑",
                    C: "𝓒",
                    D: "𝓓",
                    E: "𝓔",
                    F: "𝓕",
                    G: "𝓖",
                    H: "𝓗",
                    I: "𝓘",
                    J: "𝓙",
                    K: "𝓚",
                    L: "𝓛",
                    M: "𝓜",
                    N: "𝓝",
                    O: "𝓞",
                    P: "𝓟",
                    Q: "𝓠",
                    R: "𝓡",
                    S: "𝓢",
                    T: "𝓣",
                    U: "𝓤",
                    V: "𝓥",
                    W: "𝓦",
                    X: "𝓧",
                    Y: "𝓨",
                    Z: "𝓩",
                    a: "𝓪",
                    b: "𝓫",
                    c: "𝓬",
                    d: "𝓭",
                    e: "𝓮",
                    f: "𝓯",
                    g: "𝓰",
                    h: "𝓱",
                    i: "𝓲",
                    j: "𝓳",
                    k: "𝓴",
                    l: "𝓵",
                    m: "𝓶",
                    n: "𝓷",
                    o: "𝓸",
                    p: "𝓹",
                    q: "𝓺",
                    r: "𝓻",
                    s: "𝓼",
                    t: "𝓽",
                    u: "𝓾",
                    v: "𝓿",
                    w: "𝔀",
                    x: "𝔁",
                    y: "𝔂",
                    z: "𝔃",
                }),
                (r.isCalligraphicLetter = n),
                (r.translateCharToCalligraphic = function (e) {
                    return n(e) ? r.calligraphicLetters[e] : void 0;
                });
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return r.subscriptCharacters.hasOwnProperty(e);
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.subscriptCharacters = {
                    0: "₀",
                    1: "₁",
                    2: "₂",
                    3: "₃",
                    4: "₄",
                    5: "₅",
                    6: "₆",
                    7: "₇",
                    8: "₈",
                    9: "₉",
                    "+": "₊",
                    "-": "₋",
                    "=": "₌",
                    "(": "₍",
                    ")": "₎",
                    a: "ₐ",
                    e: "ₑ",
                    h: "ₕ",
                    i: "ᵢ",
                    j: "ⱼ",
                    k: "ₖ",
                    l: "ₗ",
                    m: "ₘ",
                    n: "ₙ",
                    o: "ₒ",
                    p: "ₚ",
                    r: "ᵣ",
                    s: "ₛ",
                    t: "ₜ",
                    u: "ᵤ",
                    v: "ᵥ",
                    x: "ₓ",
                    β: "ᵦ",
                    γ: "ᵧ",
                    ρ: "ᵨ",
                    φ: "ᵩ",
                    χ: "ᵪ",
                }),
                (r.isSubscriptCharacter = n),
                (r.translateCharToSubscript = function (e) {
                    return n(e) ? r.subscriptCharacters[e] : void 0;
                });
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return r.monoCharacters.hasOwnProperty(e);
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.monoCharacters = {
                    A: "𝙰",
                    B: "𝙱",
                    C: "𝙲",
                    D: "𝙳",
                    E: "𝙴",
                    F: "𝙵",
                    G: "𝙶",
                    H: "𝙷",
                    I: "𝙸",
                    J: "𝙹",
                    K: "𝙺",
                    L: "𝙻",
                    M: "𝙼",
                    N: "𝙽",
                    O: "𝙾",
                    P: "𝙿",
                    Q: "𝚀",
                    R: "𝚁",
                    S: "𝚂",
                    T: "𝚃",
                    U: "𝚄",
                    V: "𝚅",
                    W: "𝚆",
                    X: "𝚇",
                    Y: "𝚈",
                    Z: "𝚉",
                    a: "𝚊",
                    b: "𝚋",
                    c: "𝚌",
                    d: "𝚍",
                    e: "𝚎",
                    f: "𝚏",
                    g: "𝚐",
                    h: "𝚑",
                    i: "𝚒",
                    j: "𝚓",
                    k: "𝚔",
                    l: "𝚕",
                    m: "𝚖",
                    n: "𝚗",
                    o: "𝚘",
                    p: "𝚙",
                    q: "𝚚",
                    r: "𝚛",
                    s: "𝚜",
                    t: "𝚝",
                    u: "𝚞",
                    v: "𝚟",
                    w: "𝚠",
                    x: "𝚡",
                    y: "𝚢",
                    z: "𝚣",
                    0: "𝟶",
                    1: "𝟷",
                    2: "𝟸",
                    3: "𝟹",
                    4: "𝟺",
                    5: "𝟻",
                    6: "𝟼",
                    7: "𝟽",
                    8: "𝟾",
                    9: "𝟿",
                }),
                (r.isMonoCharacter = n),
                (r.translateCharToMono = function (e) {
                    return n(e) ? r.monoCharacters[e] : void 0;
                });
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.cyrillicCharacters = {
                    Ф: "Ф",
                    І: "І",
                    Ѡ: "Ѡ",
                    Г: "Г",
                    ҝ: "ҝ",
                    ё: "ё",
                    Х: "Х",
                    Җ: "Җ",
                    ҧ: "ҧ",
                    Ҭ: "Ҭ",
                    И: "И",
                    ї: "ї",
                    Џ: "Џ",
                    ѥ: "ѥ",
                    К: "К",
                    Һ: "Һ",
                    Л: "Л",
                    М: "М",
                    Ӌ: "Ӌ",
                    Њ: "Њ",
                    Ѣ: "Ѣ",
                    А: "А",
                    Б: "Б",
                    ҷ: "ҷ",
                    ә: "ә",
                    Ѕ: "Ѕ",
                    Є: "Є",
                    Ц: "Ц",
                    Ж: "Ж",
                    Д: "Д",
                    Ҿ: "Ҿ",
                    Ѳ: "Ѳ",
                    Е: "Е",
                    Ҩ: "Ҩ",
                    я: "я",
                    џ: "џ",
                    Ѩ: "Ѩ",
                    ҍ: "ҍ",
                    В: "В",
                    й: "й",
                    ђ: "ђ",
                    ӌ: "ӌ",
                    Ү: "Ү",
                    ң: "ң",
                    З: "З",
                    Ҟ: "Ҟ",
                    Ҥ: "Ҥ",
                    Ҷ: "Ҷ",
                    Ұ: "Ұ",
                    Щ: "Щ",
                    Ў: "Ў",
                    ю: "ю",
                    ѯ: "ѯ",
                    Н: "Н",
                    О: "О",
                    Ѫ: "Ѫ",
                    П: "П",
                    Ҙ: "Ҙ",
                    Ӕ: "Ӕ",
                    Р: "Р",
                    С: "С",
                    Т: "Т",
                    Ҽ: "Ҽ",
                    ѹ: "ѹ",
                    У: "У",
                    і: "і",
                    Ҍ: "Ҍ",
                    ғ: "ғ",
                    Й: "Й",
                    ѽ: "ѽ",
                    ҡ: "ҡ",
                    є: "є",
                    ҙ: "ҙ",
                    Ң: "Ң",
                    Ґ: "Ґ",
                    щ: "щ",
                    Ӄ: "Ӄ",
                    ж: "ж",
                    Ј: "Ј",
                    "҂": "҂",
                    ҽ: "ҽ",
                    "№": "№",
                    ҥ: "ҥ",
                    Ѱ: "Ѱ",
                    Ҵ: "Ҵ",
                    Ѭ: "Ѭ",
                    њ: "њ",
                    Ѥ: "Ѥ",
                    ѕ: "ѕ",
                    ӕ: "ӕ",
                    Ъ: "Ъ",
                    Ҁ: "Ҁ",
                    Ҏ: "Ҏ",
                    Ә: "Ә",
                    ҭ: "ҭ",
                    Ҕ: "Ҕ",
                    ҩ: "ҩ",
                    һ: "һ",
                    Ш: "Ш",
                    у: "у",
                    ҟ: "ҟ",
                    т: "т",
                    Ы: "Ы",
                    с: "с",
                    р: "р",
                    Ѿ: "Ѿ",
                    ѧ: "ѧ",
                    Ӈ: "Ӈ",
                    Ь: "Ь",
                    ҕ: "ҕ",
                    п: "п",
                    ӡ: "ӡ",
                    о: "о",
                    Ћ: "Ћ",
                    н: "н",
                    Ҫ: "Ҫ",
                    ұ: "ұ",
                    ѱ: "ѱ",
                    з: "з",
                    ү: "ү",
                    "̏": "̏",
                    ј: "ј",
                    в: "в",
                    ҹ: "ҹ",
                    ӄ: "ӄ",
                    е: "е",
                    ѡ: "ѡ",
                    д: "д",
                    ц: "ц",
                    б: "б",
                    Ө: "Ө",
                    ґ: "ґ",
                    Љ: "Љ",
                    а: "а",
                    Ѽ: "Ѽ",
                    Ғ: "Ғ",
                    Ҹ: "Ҹ",
                    м: "м",
                    л: "л",
                    ш: "ш",
                    к: "к",
                    и: "и",
                    х: "х",
                    Ҳ: "Ҳ",
                    Ѵ: "Ѵ",
                    Ӡ: "Ӡ",
                    қ: "қ",
                    г: "г",
                    Ч: "Ч",
                    ф: "ф",
                    Ї: "Ї",
                    "҉": "҉",
                    Ѯ: "Ѯ",
                    Ѻ: "Ѻ",
                    ѿ: "ѿ",
                    ҵ: "ҵ",
                    ҳ: "ҳ",
                    ў: "ў",
                    ѩ: "ѩ",
                    Я: "Я",
                    љ: "љ",
                    ө: "ө",
                    Қ: "Қ",
                    ъ: "ъ",
                    ҏ: "ҏ",
                    ҁ: "ҁ",
                    Ђ: "Ђ",
                    ѭ: "ѭ",
                    "҈": "҈",
                    Ӏ: "Ӏ",
                    Ҝ: "Ҝ",
                    ѻ: "ѻ",
                    ь: "ь",
                    ҿ: "ҿ",
                    җ: "җ",
                    э: "э",
                    Ѧ: "Ѧ",
                    Ҡ: "Ҡ",
                    ы: "ы",
                    Э: "Э",
                    ӈ: "ӈ",
                    ҫ: "ҫ",
                    ч: "ч",
                    ћ: "ћ",
                    Ҧ: "Ҧ",
                    Ё: "Ё",
                    Ю: "Ю",
                    Ѹ: "Ѹ",
                    ќ: "ќ",
                    ѓ: "ѓ",
                    Ќ: "Ќ",
                    Ѓ: "Ѓ",
                }),
                (r.isCyrillicCharacter = function (e) {
                    return r.cyrillicCharacters.hasOwnProperty(e);
                }),
                (r.translateCharToCyrillic = function (e) {
                    return r.isCyrillicCharacter(e)
                        ? r.cyrillicCharacters[e]
                        : void 0;
                });
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return r.dingbatsUnicodeChart.hasOwnProperty(e);
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.dingbatsUnicodeChart = {
                    33: "✁",
                    34: "✂",
                    35: "✃",
                    36: "✄",
                    37: "☎",
                    38: "✆",
                    39: "✇",
                    40: "✈",
                    41: "✉",
                    42: "☛",
                    43: "☞",
                    44: "✌",
                    45: "✍",
                    46: "✎",
                    47: "✏",
                    48: "✐",
                    49: "✑",
                    50: "✒",
                    51: "✓",
                    52: "✔",
                    53: "✕",
                    54: "✖",
                    55: "✗",
                    56: "✘",
                    57: "✙",
                    58: "✚",
                    59: "✛",
                    60: "✜",
                    61: "✝",
                    62: "✞",
                    63: "✟",
                    64: "✠",
                    65: "✡",
                    66: "✢",
                    67: "✣",
                    68: "✤",
                    69: "✥",
                    70: "✦",
                    71: "✧",
                    72: "★",
                    73: "✩",
                    74: "✪",
                    75: "✫",
                    76: "✬",
                    77: "✭",
                    78: "✮",
                    79: "✯",
                    80: "✰",
                    81: "✱",
                    82: "✲",
                    83: "✳",
                    84: "✴",
                    85: "✵",
                    86: "✶",
                    87: "✷",
                    88: "✸",
                    89: "✹",
                    90: "✺",
                    91: "✻",
                    92: "✼",
                    93: "✽",
                    94: "✾",
                    95: "✿",
                    96: "❀",
                    97: "❁",
                    98: "❂",
                    99: "❃",
                    100: "❄",
                    101: "❅",
                    102: "❆",
                    103: "❇",
                    104: "❈",
                    105: "❉",
                    106: "❊",
                    107: "❋",
                    108: "●",
                    109: "❍",
                    110: "■",
                    111: "❏",
                    112: "❐",
                    113: "❑",
                    114: "❒",
                    115: "▲",
                    116: "▼",
                    117: "◆",
                    118: "❖",
                    119: "◗",
                    120: "❘",
                    121: "❙",
                    122: "❚",
                    123: "❛",
                    124: "❜",
                    125: "❝",
                    126: "❞",
                    161: "❡",
                    162: "❢",
                    163: "❣",
                    164: "❤",
                    165: "❥",
                    166: "❦",
                    167: "❧",
                    168: "♣",
                    169: "♦",
                    170: "♥",
                    171: "♠",
                    172: "①",
                    173: "②",
                    174: "③",
                    175: "④",
                    176: "⑤",
                    177: "⑥",
                    178: "⑦",
                    179: "⑧",
                    180: "⑨",
                    181: "⑩",
                    182: "❶",
                    183: "❷",
                    184: "❸",
                    185: "❹",
                    186: "❺",
                    187: "❻",
                    188: "❼",
                    189: "❽",
                    190: "❾",
                    191: "❿",
                    192: "➀",
                    193: "➁",
                    194: "➂",
                    195: "➃",
                    196: "➄",
                    197: "➅",
                    198: "➆",
                    199: "➇",
                    200: "➈",
                    201: "➉",
                    202: "➊",
                    203: "➋",
                    204: "➌",
                    205: "➍",
                    206: "➎",
                    207: "➏",
                    208: "➐",
                    209: "➑",
                    210: "➒",
                    211: "➓",
                    212: "➔",
                    213: "→",
                    214: "↔",
                    215: "↕",
                    216: "➘",
                    217: "➙",
                    218: "➚",
                    219: "➛",
                    220: "➜",
                    221: "➝",
                    222: "➞",
                    223: "➟",
                    224: "➠",
                    225: "➡",
                    226: "➢",
                    227: "➣",
                    228: "➤",
                    229: "➥",
                    230: "➦",
                    231: "➧",
                    232: "➨",
                    233: "➩",
                    234: "➪",
                    235: "➫",
                    236: "➬",
                    237: "➭",
                    238: "➮",
                    239: "➯",
                    241: "➱",
                    242: "➲",
                    243: "➳",
                    244: "➴",
                    245: "➵",
                    246: "➶",
                    247: "➷",
                    248: "➸",
                    249: "➹",
                    250: "➺",
                    251: "➻",
                    252: "➼",
                    253: "➽",
                    254: "➾",
                }),
                (r.isDingbatCharacter = n),
                (r.translateCharToDingbat = function (e) {
                    return n(e) ? r.dingbatsUnicodeChart[e] : void 0;
                });
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return r.elsevierGlyphsUnicodeChart.hasOwnProperty(e);
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.elsevierGlyphsUnicodeChart = {
                    2129: "℩",
                    "21B3": "↳",
                    2232: "∲",
                    2233: "∳",
                    2238: "∸",
                    2242: "≂",
                    "225A": "≚",
                    "225F": "≟",
                    2274: "≴",
                    2275: "≵",
                    "22C0": "⋀",
                    "22C1": "⋁",
                    E838: "⌽",
                    E381: "▱",
                    E212: "⤅",
                    E20C: "⤣",
                    E20D: "⤤",
                    E20B: "⤥",
                    E20A: "⤦",
                    E211: "⤧",
                    E20E: "⤨",
                    E20F: "⤩",
                    E210: "⤪",
                    E21C: "⤳",
                    E21D: "⤳",
                    E21A: "⤶",
                    E219: "⤷",
                    E214: "⥼",
                    E215: "⥽",
                    E291: "⦔",
                    E260: "⦵",
                    E61B: "⦶",
                    E372: "⧜",
                    E395: "⨐",
                    E25A: "⨥",
                    E25B: "⨪",
                    E25C: "⨭",
                    E25D: "⨮",
                    E25E: "⨴",
                    E25F: "⨵",
                    E259: "⨼",
                    E36E: "⩕",
                    E30D: "⫫",
                    "300A": "《",
                    "300B": "》",
                    3018: "〘",
                    3019: "〙",
                }),
                (r.isElsevierGlyph = n),
                (r.translateCharToElsevier = function (e) {
                    return n(e) ? r.elsevierGlyphsUnicodeChart[e] : void 0;
                });
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.spaceCmds1arg = {
                    kern: !0,
                    hskip: !0,
                    hspace: !0,
                    hphantom: !0,
                });
        },
        function (e, r, t) {
            "use strict";
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.diacriticsTextMode = {
                    "`": !0,
                    "'": !0,
                    "^": !0,
                    "~": !0,
                    "=": !0,
                    ".": !0,
                    '"': !0,
                    H: !0,
                    c: !0,
                    k: !0,
                    b: !0,
                    d: !0,
                    r: !0,
                    u: !0,
                    v: !0,
                }),
                (r.diacriticsMathMode = {
                    hat: !0,
                    widehat: !0,
                    check: !0,
                    tilde: !0,
                    widetilde: !0,
                    acute: !0,
                    grave: !0,
                    dot: !0,
                    ddot: !0,
                    breve: !0,
                    bar: !0,
                    vec: !0,
                    mathring: !0,
                });
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                var r = e ? e.trim() : void 0;
                if (!r) return "√";
                switch (r) {
                    case "2":
                        return "√";
                    case "3":
                        return "∛";
                    case "4":
                        return "∜";
                    default:
                        for (var t = [], n = 0; n < r.length; n++) {
                            var a = o.translateCharToSuperscript(r.charAt(n));
                            if (!a)
                                throw new Error(
                                    'Could not translate "' +
                                        a +
                                        '" to superscript'
                                );
                            t.push(a);
                        }
                        return t.join("") + "√";
                }
            }
            function a(e, r) {
                var t = n(r),
                    a = e.trim();
                return "" === a ? t : t + "(" + a + ")";
            }
            Object.defineProperty(r, "__esModule", { value: !0 });
            var o = t(11);
            r.convertSqrtToUnicode = a;
        },
        function (e, r, t) {
            "use strict";
            function n(e, r, t) {
                switch (e) {
                    case "frac":
                    case "nfrac":
                    case "cfrac":
                    case "xfrac":
                    case "sfrac":
                        return a.convertFracToUnicode(r, t);
                    case "binom":
                        return o.convertBinom(r, t);
                }
                throw new Error(
                    "No implementation found to expand \\" +
                        e +
                        " with arguments {" +
                        r +
                        ", " +
                        t
                );
            }
            Object.defineProperty(r, "__esModule", { value: !0 });
            var a = t(55),
                o = t(56);
            r.expand2argsCommand = n;
        },
        function (e, r, t) {
            "use strict";
            function n(e, r) {
                return "1" === e && "2" === r
                    ? "½"
                    : "1" === e && "3" === r
                    ? "⅓"
                    : "1" === e && "4" === r
                    ? "¼"
                    : "1" === e && "5" === r
                    ? "⅕"
                    : "1" === e && "6" === r
                    ? "⅙"
                    : "1" === e && "8" === r
                    ? "⅛"
                    : "2" === e && "3" === r
                    ? "⅔"
                    : "2" === e && "5" === r
                    ? "⅖"
                    : "3" === e && "4" === r
                    ? "¾"
                    : "3" === e && "5" === r
                    ? "⅗"
                    : "3" === e && "8" === r
                    ? "⅜"
                    : "4" === e && "5" === r
                    ? "⅘"
                    : "5" === e && "6" === r
                    ? "⅚"
                    : "5" === e && "8" === r
                    ? "⅝"
                    : "7" === e && "8" === r
                    ? "⅞"
                    : i.test(e) && i.test(r)
                    ? o + e + "⁄" + r + o
                    : ((e = a.isSingleTerm.test(e) ? e : a.addParenthesis(e)),
                      (r = a.isSingleTerm.test(r) ? r : a.addParenthesis(r)),
                      "(" + e + " / " + r + ")");
            }
            Object.defineProperty(r, "__esModule", { value: !0 });
            var a = t(1),
                o = "‌",
                i = /^[0-9]*$/;
            r.convertFracToUnicode = n;
        },
        function (e, r, t) {
            "use strict";
            function n(e, r) {
                return (
                    (e = o.test(e) ? e : a.addParenthesis(e)),
                    (r = o.test(r) ? r : a.addParenthesis(r)),
                    "(" + e + " ¦ " + r + ")"
                );
            }
            Object.defineProperty(r, "__esModule", { value: !0 });
            var a = t(1),
                o = /^.$|^[0-9]+$/;
            r.convertBinom = n;
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return r.twoArgsCommands.hasOwnProperty(e);
            }
            Object.defineProperty(r, "__esModule", { value: !0 });
            var a = t(58);
            (r.twoArgsCommands = Object.assign({}, a.fracCmds, { binom: !0 })),
                (r.is2argsCommand = n);
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return r.fracCmds.hasOwnProperty(e);
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.fracCmds = {
                    frac: !0,
                    nfrac: !0,
                    cfrac: !0,
                    xfrac: !0,
                    sfrac: !0,
                }),
                (r.isFracCmd = n);
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return { name: e, optionalArguments: 0, argumentCount: 0 };
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.createKnownCommand = n);
        },
        function (e, r, t) {
            "use strict";
            function n(e) {
                return { name: e, optionalArguments: 0, argumentCount: 1 };
            }
            Object.defineProperty(r, "__esModule", { value: !0 }),
                (r.createKnownCommandWith1Arg = n);
        },
        function (e, r, t) {
            "use strict";
            function n() {
                for (var e = [], r = 0; r < arguments.length; r++)
                    e[r] = arguments[r];
                return e
                    .map(function (e) {
                        return a.stringifyLaTeX(e);
                    })
                    .join("");
            }
            Object.defineProperty(r, "__esModule", { value: !0 });
            var a = t(2);
            r.stringifyLaTeX = n;
        },
    ]);
});
//# sourceMappingURL=latex-to-unicode-converter.min.js.map
