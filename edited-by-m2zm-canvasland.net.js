// ==UserScript==
// @name         PPF dark bot
// @version      2.18
// @author       Darkness
// @description  Have fun
// @icon         https://raw.githubusercontent.com/TouchedByDarkness/PixelPlanet-Bot/master/rounded-avatar-128.png
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        unsafeWindow
// @downloadURL  https://touchedbydarkness.github.io/stuff/ppf_bot_2/initer.user.js
// @updateURL  	https://touchedbydarkness.github.io/stuff/ppf_bot_2/initer.user.js
// @connect		 	black-and-red.space
// @connect		 	githubusercontent.com
// @connect		 	github.com
// @connect		 	fuckyouarkeros.fun
// @connect		 	pixelplanet.fun
// @connect		 	localhost
// @connect		 	pixmap.fun
// @connect		 	chillpixel.xyz
// @connect		 	pixelya.fun
// @connect		 	sca.canvasland.net
// @connect		 	globepixel.fun
// @match      	*://fuckyouarkeros.fun/*
// @match      	*://pixelplanet.fun/*
// @match      	*://localhost/*
// @match      	*://pixmap.fun/*
// @match      	*://chillpixel.xyz/*
// @match      	*://pixelya.fun/*
// @match      	*://sca.canvasland.net/*
// @match      	*://globepixel.fun/*
// ==/UserScript==

function payload() {
  "undefined" == typeof unsafeWindow && (globalThis.unsafeWindow = globalThis.window), (() => {
    function t(t) {
      let {
        hydratePixelUpdate: e,
        hydratePixelReturn: r,
        hydrateCoolDown: n,
        hydrateCaptchaReturn: o,
        dehydrateRegCanvas: s,
        dehydrateRegChunk: i,
        dehydrateDeRegMChunks: a,
        dehydratePixelUpdate: l,
        dehydratePing: c
      } = function({
        REG_CANVAS_OP: t,
        REG_CHUNK_OP: e,
        DEREG_CHUNK_OP: r,
        REG_MCHUNKS_OP: n,
        DEREG_MCHUNKS_OP: o,
        PING_OP: s,
        PIXEL_UPDATE_OP: i
      }) {
        return {
          hydratePixelUpdate(t) {
            let e = t.getUint8(1),
              r = t.getUint8(2),
              n = [],
              o = t.byteLength;
            for (; o > 3;) {
              let e = t.getUint8(o -= 1),
                r = t.getUint16(o -= 2),
                s = t.getUint8(o -= 1) << 16;
              n.push([s | r, e])
            }
            return {
              i: e,
              j: r,
              pixels: n
            }
          },
          hydrateCoolDown: t => t.getUint32(1),
          hydratePixelReturn: t => ({
            retCode: t.getUint8(1),
            wait: t.getUint32(2),
            coolDownSeconds: t.getInt16(6),
            pxlCnt: t.getUint8(8),
            rankedPxlCnt: t.getUint8(9)
          }),
          hydrateCaptchaReturn: t => t.getUint8(1),
          dehydrateRegCanvas(e) {
            let r = new ArrayBuffer(2),
              n = new DataView(r);
            return n.setInt8(0, t), n.setInt8(1, Number(e)), r
          },
          dehydrateRegChunk(t) {
            let r = new ArrayBuffer(3),
              n = new DataView(r);
            return n.setInt8(0, e), n.setInt16(1, t), r
          },
          dehydrateDeRegChunk(t) {
            let e = new ArrayBuffer(3),
              n = new DataView(e);
            return n.setInt8(0, r), n.setInt16(1, t), e
          },
          dehydrateRegMChunks(t) {
            let e = new ArrayBuffer(2 + 2 * t.length),
              r = new Uint16Array(e);
            r[0] = n;
            for (let e = 0; e < t.length; e += 1) r[e + 1] = t[e];
            return e
          },
          dehydrateDeRegMChunks(t) {
            let e = new ArrayBuffer(2 + 2 * t.length),
              r = new Uint16Array(e);
            r[0] = o;
            for (let e = 0; e < t.length; e += 1) r[e + 1] = t[e];
            return e
          },
          dehydratePing: () => new Uint8Array([s]).buffer,
          dehydratePixelUpdate(t, e, r) {
            let n = new ArrayBuffer(3 + 4 * r.length),
              o = new DataView(n);
            o.setUint8(0, i), o.setUint8(1, t), o.setUint8(2, e);
            let s = 2,
              a = r.length;
            for (; a;) {
              a -= 1;
              let [t, e] = r[a];
              o.setUint8(s += 1, t >>> 16), o.setUint16(s += 1, 65535 & t), o.setUint8(s += 2, e)
            }
            return n
          }
        }
      }(t), {
        PIXEL_UPDATE_OP: u,
        PIXEL_RETURN_OP: h,
        COOLDOWN_OP: p,
        CAPTCHA_RETURN_OP: d
      } = t, f = null;
      return class t extends rs {
        constructor(t) {
          super(), this.canvasId = t, this._info = ss, this.loadQueue = [], this.pixelsDelay = 150 + 50 * Math.random(), this.delayedPixels = [], this.chunks = new ns, this.maxLoaders = 2, this.loaders = [], this.chunksProcessing = !1, this.emitter = new $o, this.local = new $o, this.timer = new es, this.ws = new Ho(`${"https:"===window.location.protocol?"wss:":"ws:"}//${Es||window.location.host}/ws`), this.ws.on(0, (async () => {
            for (this.emitter.emit(0), this.selectCanvas(this.canvasId), this.emitter.emit(2); this.ws.connected;) await v(19e3), this.ws.send(c())
          })), this.ws.on(4, (t => {
            let s = new DataView(t);
            switch (s.getUint8(0)) {
              case u:
                this.handleArrivedPixel(e(s));
                break;
              case h:
                let {
                  retCode: t, wait: i
                } = r(s);
                this.timer.update(i), this.local.emit(0, t);
                break;
              case d:
                this.local.emit(1, o(s));
                break;
              case p:
                this.timer.update(n(s))
            }
          })), this.ws.on(1, (() => this.emitter.emit(1)))
        }
        get info() {
          if (this._info === ss) throw Os.errAPIIsntReady;
          return this._info
        }
        set info(t) {
          this._info = t
        }
        static async build(e) {
          let r = new this(e),
            n = f ?? await t.fetchMe();
          return r.info = Ss(n.canvases[e]), await r.ws.connect(), r
        }
        static async fetchMe() {
          return G(`${Ms}/api/me`)
        }
        static async getMe() {
          return f || (f = await t.fetchMe()), f
        }
        static async getCanvasIdByCanvasIdent(e) {
          let r = await t.getMe();
          for (let [t, n] of Object.entries(r.canvases))
            if (n.ident === e) return +t;
          throw new Error("no canvas char in me info")
        }
        get(t, e) {
          for (let r of this.delayedPixels) {
            let n = r.find((r => r.x === t && r.y === e));
            if (n) return n.id
          }
          return this.getHumanlike(t, e)
        }
        getHumanlike(t, e) {
          let r = this.toTiled(t, e);
          return this.chunks.get(r[0], r[1]).get(r[2])
        }
        dropChunks(t) {
          let e = [];
          for (let r of t) {
            let t = Ts(r);
            if (this.chunks.has(r[0], r[1])) {
              e.push(r), this.chunks.delete(r[0], r[1]);
              continue
            }
            if (this.loadQueue.includes(t)) {
              this.loadQueue = this.loadQueue.filter((e => e !== t));
              continue
            }
            let n = this.loaders.filter((e => e.chunk === t));
            n.length && (n.forEach((t => t.aborter.abort())), this.loaders = this.loaders.filter((e => e.chunk !== t)))
          }
          e.length && this.deRegisterChunks(e)
        }
        async prepareChunks(t) {
          this.ws.disconnected && await this.emitter.wait(2), t.forEach((t => this.loadQueue.push(Ts(t)))), this.processMarked(), await this.waitChunks(t)
        }
        async placePixels(t) {
          let e = this.groupPixels(t);
          for (let t in e) {
            let r, n = e[t],
              o = Is(+t);
            this.emitter.emit(4, n.map((({
              offset: t,
              id: e
            }) => {
              let [r, n] = this.toWorld(o[0], o[1], t);
              return {
                x: r,
                y: n,
                id: e
              }
            }))), this.ws.send(l(o[0], o[1], n.map((t => [t.offset, t.id]))));
            try {
              r = await this.local.wait(0, 4e3)
            } catch (t) {
              let e = t;
              throw e === zo ? Os.errNoPlacePixelResult : e
            }
            switch (r) {
              case ps:
                break;
              case ds:
              case fs:
              case gs:
              case ys:
              case ms:
                throw Os.errCanvasAPIInteraction;
              case ws:
                throw Os.errMustAuth;
              case vs:
                throw Os.errTooLowScore;
              case bs:
                throw Os.errPixelProtected;
              case xs:
                throw Os.errFullStack;
              case Cs:
                throw Os.errCaptcha;
              case Ps:
                throw Os.errYouAreProxy;
              case ks:
                throw Os.errTooLowScore;
              case _s:
                throw Os.errParallelPlace;
              case js:
                throw Os.errYouAreBanned;
              default:
                throw new Error(`unknown retcode: ${r}`)
            }
          }
        }
        async getCaptcha() {
          let t = await fetch(Ms + "/captcha.svg", {
            cache: "no-cache"
          });
          if (!t.ok || 200 !== t.status) throw Os.errCanvasAPIInteraction;
          let e = URL.createObjectURL(await t.blob()),
            r = t.headers.get("captcha-id");
          if (null === r) throw Os.errCanvasAPIInteraction;
          return {
            id: r,
            svg: await fetch(e).then((t => t.text()))
          }
        }
        async sendAnswer({
          solution: t,
          id: e
        }) {
          this.ws.send(`cs,${JSON.stringify([t,e])}`);
          let r = await this.local.wait(1),
            n = [!0, As.errCaptchaTimeout, !1, As.errInvalidSolution, Os.errCanvasAPIInteraction];
          return n.length > r ? n[r] : Os.errUnknownError
        }
        predictCooldown(t, e) {
          let r = this.toTiled(t, e);
          return this.chunks.get(r[0], r[1]).get(r[2]) < this.info.palette.offset ? this.info.minCd : this.info.maxCd
        }
        destroy() {
          return this.dropChunks(this.loadQueue.map(Is)), this.ws.disconnect()
        }
        groupPixels(t) {
          let e = (0, hs.group)(t).by((t => Ts(this.toTiled(t.x, t.y).slice(0, 2)))).asArrays(),
            r = {};
          return e.forEach((t => {
            let e = this.toTiled(t[0].x, t[0].y),
              n = Ts(e.slice(0, 2));
            r[n] = t.map((t => ({
              offset: this.toTiled(t.x, t.y)[2],
              id: t.id
            })))
          })), r
        }
        async waitChunks(t) {
          for (t = t.slice().filter((t => !this.chunks.has(t[0], t[1]))); t.length;) {
            let e = await this.emitter.wait(5, 1e4),
              r = Ts(e),
              n = t.findIndex((t => Ts(t) === r)); - 1 !== n && t.splice(n, 1)
          }
        }
        processMarked() {
          if (!this.chunksProcessing) {
            for (this.chunksProcessing = !0; this.loaders.length < this.maxLoaders;) {
              let t = this.loadQueue.pop();
              if (void 0 === t) break;
              let e = Is(t);
              if (this.chunks.has(e[0], e[1]) || this.loaders.some((e => e.chunk === t))) continue;
              let r = {
                chunk: t,
                aborter: new AbortController
              };
              this.loaders.push(r), this.fetchChunk(e, r.aborter).then((t => {
                this.chunks.set(t, e[0], e[1]), this.registerChunk(e), this.loaders.splice(this.loaders.indexOf(r), 1), this.processMarked()
              }))
            }
            this.chunksProcessing = !1
          }
        }
        async fetchChunk(t, e) {
          let r = e ? {
              signal: e.signal
            } : {},
            n = `${Ms}/chunks/${this.canvasId}/${t[0]}/${t[1]}.bmp`,
            o = await fetch(n, r);
          if (!o.ok) throw console.debug(o), Os.errResponseIsntOk;
          if (200 !== o.status) throw console.debug(o), Os.errResponseStatusIsnt200;
          let s = await o.arrayBuffer(),
            i = new Uint8Array(s),
            a = new Uint32Array(this.chunkSize);
          if (s.byteLength)
            for (let t = 0; t !== i.length; t++) a[t] = 63 & i[t];
          return this.emitter.emit(5, t), new os(a)
        }
        registerChunk(t) {
          this.ws.send(i(Ts(t)))
        }
        deRegisterChunks(t) {
          this.ws.send(a(t.map((t => Ts(t)))))
        }
        toTiled(t, e) {
          let r = t + (this.info.worldWidth >> 1),
            n = e + (this.info.worldHeight >> 1);
          return [r >> 8, n >> 8, (255 & n) << 8 | 255 & r]
        }
        toWorld(t, e, r) {
          return [(t << 8) - (this.info.worldWidth >> 1) + (255 & r), (e << 8) - (this.info.worldHeight >> 1) + (r >> 8)]
        }
        selectCanvas(t) {
          this.ws.send(s(t))
        }
        handleArrivedPixel(t) {
          let e = t.pixels.map((e => {
            let [r, n] = this.toWorld(t.i, t.j, e[0]);
            return {
              x: r,
              y: n,
              id: e[1]
            }
          }));
          this.emitter.emit(3, e), this.delayedPixels.push(e), setTimeout((() => {
            let r = this.delayedPixels.indexOf(e);
            if (-1 !== r) {
              this.delayedPixels.splice(r, 1);
              let e = this.chunks.get(t.i, t.j);
              e && t.pixels.forEach((t => e.set(t[0], t[1])))
            }
          }), this.pixelsDelay)
        }
      }
    }

    function e() {
      window.addEventListener("mousemove", (() => {
        let t = g(".coorbox");
        if (!t) return;
        let e = x(t.textContent ?? "");
        e && 2 === e.length && Us.emit(4, [e[0], e[1]])
      }))
    }

    function r(t, e) {
      let r = {};
      return e.forEach((e => {
        let n = t.get(e[0], e[1]),
          o = r[n];
        o || (o = [], r[n] = o), o.push(e)
      })), r
    }

    function n(t) {
      let e = 0,
        r = 0;
      return t.forEach((t => {
        e += t[0], r += t[1]
      })), [Math.trunc(e / t.length), Math.trunc(r / t.length)]
    }

    function o(t) {
      if (t.length <= 5) return C(t);
      let e = new Map;
      for (let r = 1; r !== t.length; r++) e.set(i(t[r]), r);
      for (let r = 0; r !== t.length - 1; r++) {
        let n, o, l = t[r],
          c = 1 / 0,
          u = -1;
        if (1 === e.size) n = a(e.keys().next().value);
        else
          for (; !n;) u++, s(u, ((t, r) => {
            let s = [l[0] + t, l[1] + r],
              a = e.get(i(s));
            if (void 0 !== a) {
              let t = F(l, s);
              (t < c || t == c && a < o) && (c = t, n = s, o = a)
            }
          }));
        e.delete(i(n)), t[r + 1] = n
      }
      return t
    }

    function s(t, e) {
      let r = 0,
        n = t,
        o = 3 - (n << 1);
      for (; r <= n;) e(+r, +n), e(+r, -n), e(-r, +n), e(-r, -n), e(+n, +r), e(+n, -r), e(-n, +r), e(-n, -r), o < 0 ? o += 6 + (r << 2) : (o += 10 + (r - n << 2), n--), r++
    }

    function i(t) {
      return t[0] | t[1] << 16
    }

    function a(t) {
      return [255 & t, t >> 16]
    }

    function l() {
      WebSocket.prototype.send = () => {}
    }

    function c(...t) {
      console.debug("[DB]", ...t.map((t => "object" == typeof t && t.hasOwnProperty("toString") ? t.toString() : t)))
    }
    async function u() {
      if (await Ye.clear(), Ve.ready) {
        let t = await Ye.get(),
          e = Ve.now();
        if (!e || !t) {
          let r = [];
          return e || r.push("bot"), t || r.push("targeter"), void c("cant change targeter because " + r.join(" and ") + " is missing")
        }
        await h(), e.changeTargeter(t)
      } else await h()
    }
    async function h() {
      let [t, e] = await Promise.all([Xe.get(), qe.get()]);
      if (!t || !e) {
        let r = [];
        return t || r.push("api"), e || r.push("template"), void c("cant change workspace because " + r.join(" and ") + " is missing")
      }
      let r = !1,
        n = Ve.now();
      n && 0 !== n.status && (r = !0, await n.stop());
      let o = t.createWorkspace(...e.toArray());
      t.hasWorkspace(o) || await t.changeWorkspace(o), r && (n = Ve.now(), n && p(n.start()))
    }
    async function p(t) {
      Ge.setBotStatus("works");
      try {
        await t, Ge.setBotStatus("idle")
      } catch (t) {
        let e = t;
        c("error returned", e), Be.emit(0, e)
      }
    }
    var d, f, g, y, m, w, v, b, x, C, P, k, _, j, O, A, S, E, M, T, I, L, D, U, z, R, N, W, B, F, $, H, G, V, Y, q, X, K, Z, Q, J, tt, et, rt, nt, ot, st, it, at, lt, ct, ut, ht, pt, dt, ft, gt, yt, mt, wt, vt, bt, xt, Ct, Pt, kt, _t, jt, Ot, At, St, Et, Mt, Tt, It, Lt, Dt, Ut, zt, Rt, Nt, Wt, Bt, Ft, $t, Ht, Gt, Vt, Yt, qt, Xt, Kt, Zt, Qt, Jt, te, ee, re, ne, oe, se, ie, ae, le, ce, ue, he, pe, de, fe, ge, ye, me, we, ve, be, xe, Ce, Pe, ke, _e, je, Oe, Ae, Se, Ee, Me, Te, Ie, Le, De, Ue, ze, Re, Ne, We, Be, Fe, $e, He, Ge, Ve, Ye, qe, Xe, Ke = Object.create,
      Ze = Object.defineProperty,
      Qe = Object.getOwnPropertyDescriptor,
      Je = Object.getOwnPropertyNames,
      tr = Object.getPrototypeOf,
      er = Object.prototype.hasOwnProperty,
      rr = (t, e) => () => (e || t((e = {
        exports: {}
      }).exports, e), e.exports),
      nr = (t, e, r, n) => {
        if (e && "object" == typeof e || "function" == typeof e)
          for (let o of Je(e)) !er.call(t, o) && o !== r && Ze(t, o, {
            get: () => e[o],
            enumerable: !(n = Qe(e, o)) || n.enumerable
          });
        return t
      },
      or = (t, e, r) => (r = null != t ? Ke(tr(t)) : {}, nr(!e && t && t.__esModule ? r : Ze(r, "default", {
        value: t,
        enumerable: !0
      }), t)),
      sr = rr(((t, e) => {
        "use strict";
        var r = /\s/;
        e.exports = function(t) {
          for (var e = t.length; e-- && r.test(t.charAt(e)););
          return e
        }
      })),
      ir = rr(((t, e) => {
        "use strict";
        var r = sr(),
          n = /^\s+/;
        e.exports = function(t) {
          return t && t.slice(0, r(t) + 1).replace(n, "")
        }
      })),
      ar = rr(((t, e) => {
        "use strict";
        e.exports = function(t) {
          var e = typeof t;
          return null != t && ("object" == e || "function" == e)
        }
      })),
      lr = rr(((t, e) => {
        "use strict";
        var r = "object" == typeof global && global && global.Object === Object && global;
        e.exports = r
      })),
      cr = rr(((t, e) => {
        "use strict";
        var r = lr(),
          n = "object" == typeof self && self && self.Object === Object && self,
          o = r || n || Function("return this")();
        e.exports = o
      })),
      ur = rr(((t, e) => {
        "use strict";
        var r = cr().Symbol;
        e.exports = r
      })),
      hr = rr(((t, e) => {
        "use strict";
        var r = ur(),
          n = Object.prototype,
          o = n.hasOwnProperty,
          s = n.toString,
          i = r ? r.toStringTag : void 0;
        e.exports = function(t) {
          var e, r, n = o.call(t, i),
            a = t[i];
          try {
            t[i] = void 0, e = !0
          } catch {}
          return r = s.call(t), e && (n ? t[i] = a : delete t[i]), r
        }
      })),
      pr = rr(((t, e) => {
        "use strict";
        var r = Object.prototype.toString;
        e.exports = function(t) {
          return r.call(t)
        }
      })),
      dr = rr(((t, e) => {
        "use strict";
        var r = ur(),
          n = hr(),
          o = pr(),
          s = r ? r.toStringTag : void 0;
        e.exports = function(t) {
          return null == t ? void 0 === t ? "[object Undefined]" : "[object Null]" : s && s in Object(t) ? n(t) : o(t)
        }
      })),
      fr = rr(((t, e) => {
        "use strict";
        e.exports = function(t) {
          return null != t && "object" == typeof t
        }
      })),
      gr = rr(((t, e) => {
        "use strict";
        var r = dr(),
          n = fr();
        e.exports = function(t) {
          return "symbol" == typeof t || n(t) && "[object Symbol]" == r(t)
        }
      })),
      yr = rr(((t, e) => {
        "use strict";
        var r = ir(),
          n = ar(),
          o = gr(),
          s = NaN,
          i = /^[-+]0x[0-9a-f]+$/i,
          a = /^0b[01]+$/i,
          l = /^0o[0-7]+$/i,
          c = parseInt;
        e.exports = function(t) {
          var e, u;
          return "number" == typeof t ? t : o(t) ? s : (n(t) && (e = "function" == typeof t.valueOf ? t.valueOf() : t, t = n(e) ? e + "" : e), "string" != typeof t ? 0 === t ? t : +t : (t = r(t), (u = a.test(t)) || l.test(t) ? c(t.slice(2), u ? 2 : 8) : i.test(t) ? s : +t))
        }
      })),
      mr = rr(((t, e) => {
        "use strict";
        var r = yr(),
          n = 1 / 0;
        e.exports = function(t) {
          return t ? (t = r(t)) === n || t === -n ? 17976931348623157e292 * (t < 0 ? -1 : 1) : t == t ? t : 0 : 0 === t ? t : 0
        }
      })),
      wr = rr(((t, e) => {
        "use strict";
        var r = mr();
        e.exports = function(t) {
          var e = r(t),
            n = e % 1;
          return e == e ? n ? e - n : e : 0
        }
      })),
      vr = rr(((t, e) => {
        "use strict";
        var r = wr();
        e.exports = function(t, e) {
          var n;
          if ("function" != typeof e) throw new TypeError("Expected a function");
          return t = r(t),
            function() {
              return --t > 0 && (n = e.apply(this, arguments)), t <= 1 && (e = void 0), n
            }
        }
      })),
      br = rr(((t, e) => {
        "use strict";
        var r = vr();
        e.exports = function(t) {
          return r(2, t)
        }
      })),
      xr = rr(((t, e) => {
        "use strict";

        function r() {
          r.init.call(this)
        }

        function n(t) {
          if ("function" != typeof t) throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof t)
        }

        function o(t) {
          return void 0 === t._maxListeners ? r.defaultMaxListeners : t._maxListeners
        }

        function s(t, e, r, s) {
          var i, a, l, c;
          return n(r), void 0 === (a = t._events) ? (a = t._events = Object.create(null), t._eventsCount = 0) : (void 0 !== a.newListener && (t.emit("newListener", e, r.listener ? r.listener : r), a = t._events), l = a[e]), void 0 === l ? (l = a[e] = r, ++t._eventsCount) : ("function" == typeof l ? l = a[e] = s ? [r, l] : [l, r] : s ? l.unshift(r) : l.push(r), (i = o(t)) > 0 && l.length > i && !l.warned && (l.warned = !0, (c = new Error("Possible EventEmitter memory leak detected. " + l.length + " " + String(e) + " listeners added. Use emitter.setMaxListeners() to increase limit")).name = "MaxListenersExceededWarning", c.emitter = t, c.type = e, c.count = l.length, function(t) {
            console && console.warn && console.warn(t)
          }(c))), t
        }

        function i() {
          if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, 0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments)
        }

        function a(t, e, r) {
          var n = {
              fired: !1,
              wrapFn: void 0,
              target: t,
              type: e,
              listener: r
            },
            o = i.bind(n);
          return o.listener = r, n.wrapFn = o, o
        }

        function l(t, e, r) {
          var n, o = t._events;
          return void 0 === o || void 0 === (n = o[e]) ? [] : "function" == typeof n ? r ? [n.listener || n] : [n] : r ? function(t) {
            for (var e = new Array(t.length), r = 0; r < e.length; ++r) e[r] = t[r].listener || t[r];
            return e
          }(n) : u(n, n.length)
        }

        function c(t) {
          var e, r = this._events;
          if (void 0 !== r) {
            if ("function" == typeof(e = r[t])) return 1;
            if (void 0 !== e) return e.length
          }
          return 0
        }

        function u(t, e) {
          for (var r = new Array(e), n = 0; n < e; ++n) r[n] = t[n];
          return r
        }

        function h(t, e, r, n) {
          if ("function" == typeof t.on) n.once ? t.once(e, r) : t.on(e, r);
          else {
            if ("function" != typeof t.addEventListener) throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof t);
            t.addEventListener(e, (function o(s) {
              n.once && t.removeEventListener(e, o), r(s)
            }))
          }
        }
        var p, d, f, g = "object" == typeof Reflect ? Reflect : null,
          y = g && "function" == typeof g.apply ? g.apply : function(t, e, r) {
            return Function.prototype.apply.call(t, e, r)
          };
        p = g && "function" == typeof g.ownKeys ? g.ownKeys : Object.getOwnPropertySymbols ? function(t) {
          return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))
        } : function(t) {
          return Object.getOwnPropertyNames(t)
        }, d = Number.isNaN || function(t) {
          return t != t
        }, e.exports = r, e.exports.once = function(t, e) {
          return new Promise((function(r, n) {
            function o(r) {
              t.removeListener(e, s), n(r)
            }

            function s() {
              "function" == typeof t.removeListener && t.removeListener("error", o), r([].slice.call(arguments))
            }
            h(t, e, s, {
              once: !0
            }), "error" !== e && function(t, e, r) {
              "function" == typeof t.on && h(t, "error", e, r)
            }(t, o, {
              once: !0
            })
          }))
        }, r.EventEmitter = r, r.prototype._events = void 0, r.prototype._eventsCount = 0, r.prototype._maxListeners = void 0, f = 10, Object.defineProperty(r, "defaultMaxListeners", {
          enumerable: !0,
          get: function() {
            return f
          },
          set: function(t) {
            if ("number" != typeof t || t < 0 || d(t)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + t + ".");
            f = t
          }
        }), r.init = function() {
          (void 0 === this._events || this._events === Object.getPrototypeOf(this)._events) && (this._events = Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0
        }, r.prototype.setMaxListeners = function(t) {
          if ("number" != typeof t || t < 0 || d(t)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + t + ".");
          return this._maxListeners = t, this
        }, r.prototype.getMaxListeners = function() {
          return o(this)
        }, r.prototype.emit = function(t) {
          var e, r, n, o, s, i, a, l, c;
          for (e = [], r = 1; r < arguments.length; r++) e.push(arguments[r]);
          if (n = "error" === t, void 0 !== (o = this._events)) n = n && void 0 === o.error;
          else if (!n) return !1;
          if (n) {
            if (e.length > 0 && (s = e[0]), s instanceof Error) throw s;
            throw (i = new Error("Unhandled error." + (s ? " (" + s.message + ")" : ""))).context = s, i
          }
          if (void 0 === (a = o[t])) return !1;
          if ("function" == typeof a) y(a, this, e);
          else
            for (c = u(a, l = a.length), r = 0; r < l; ++r) y(c[r], this, e);
          return !0
        }, r.prototype.addListener = function(t, e) {
          return s(this, t, e, !1)
        }, r.prototype.on = r.prototype.addListener, r.prototype.prependListener = function(t, e) {
          return s(this, t, e, !0)
        }, r.prototype.once = function(t, e) {
          return n(e), this.on(t, a(this, t, e)), this
        }, r.prototype.prependOnceListener = function(t, e) {
          return n(e), this.prependListener(t, a(this, t, e)), this
        }, r.prototype.removeListener = function(t, e) {
          var r, o, s, i, a;
          if (n(e), void 0 === (o = this._events)) return this;
          if (void 0 === (r = o[t])) return this;
          if (r === e || r.listener === e) 0 == --this._eventsCount ? this._events = Object.create(null) : (delete o[t], o.removeListener && this.emit("removeListener", t, r.listener || e));
          else if ("function" != typeof r) {
            for (s = -1, i = r.length - 1; i >= 0; i--)
              if (r[i] === e || r[i].listener === e) {
                a = r[i].listener, s = i;
                break
              } if (s < 0) return this;
            0 === s ? r.shift() : function(t, e) {
              for (; e + 1 < t.length; e++) t[e] = t[e + 1];
              t.pop()
            }(r, s), 1 === r.length && (o[t] = r[0]), void 0 !== o.removeListener && this.emit("removeListener", t, a || e)
          }
          return this
        }, r.prototype.off = r.prototype.removeListener, r.prototype.removeAllListeners = function(t) {
          var e, r, n, o, s;
          if (void 0 === (r = this._events)) return this;
          if (void 0 === r.removeListener) return 0 === arguments.length ? (this._events = Object.create(null), this._eventsCount = 0) : void 0 !== r[t] && (0 == --this._eventsCount ? this._events = Object.create(null) : delete r[t]), this;
          if (0 === arguments.length) {
            for (o = Object.keys(r), n = 0; n < o.length; ++n) "removeListener" !== (s = o[n]) && this.removeAllListeners(s);
            return this.removeAllListeners("removeListener"), this._events = Object.create(null), this._eventsCount = 0, this
          }
          if ("function" == typeof(e = r[t])) this.removeListener(t, e);
          else if (void 0 !== e)
            for (n = e.length - 1; n >= 0; n--) this.removeListener(t, e[n]);
          return this
        }, r.prototype.listeners = function(t) {
          return l(this, t, !0)
        }, r.prototype.rawListeners = function(t) {
          return l(this, t, !1)
        }, r.listenerCount = function(t, e) {
          return "function" == typeof t.listenerCount ? t.listenerCount(e) : c.call(t, e)
        }, r.prototype.listenerCount = c, r.prototype.eventNames = function() {
          return this._eventsCount > 0 ? p(this._events) : []
        }
      })),
      Cr = rr(((t, e) => {
        "use strict";
        e.exports = function(t) {
          return t && t.length ? t[0] : void 0
        }
      })),
      Pr = rr(((t, e) => {
        "use strict";
        var r, n;
        r = t, n = function() {
          var t = "function" == typeof Promise,
            e = function(t) {
              if ("object" == typeof globalThis) return globalThis;
              Object.defineProperty(t, "typeDetectGlobalObject", {
                get: function() {
                  return this
                },
                configurable: !0
              });
              var e = typeDetectGlobalObject;
              return delete t.typeDetectGlobalObject, e
            }(Object.prototype),
            r = typeof Symbol < "u",
            n = typeof Map < "u",
            o = typeof Set < "u",
            s = typeof WeakMap < "u",
            i = typeof WeakSet < "u",
            a = typeof DataView < "u",
            l = r && typeof Symbol.iterator < "u",
            c = r && typeof Symbol.toStringTag < "u",
            u = o && "function" == typeof Set.prototype.entries,
            h = n && "function" == typeof Map.prototype.entries,
            p = u && Object.getPrototypeOf((new Set).entries()),
            d = h && Object.getPrototypeOf((new Map).entries()),
            f = l && "function" == typeof Array.prototype[Symbol.iterator],
            g = f && Object.getPrototypeOf([][Symbol.iterator]()),
            y = l && "function" == typeof String.prototype[Symbol.iterator],
            m = y && Object.getPrototypeOf("" [Symbol.iterator]());
          return function(r) {
            var l, u, h = typeof r;
            if ("object" !== h) return h;
            if (null === r) return "null";
            if (r === e) return "global";
            if (Array.isArray(r) && (!1 === c || !(Symbol.toStringTag in r))) return "Array";
            if ("object" == typeof window && null !== window) {
              if ("object" == typeof window.location && r === window.location) return "Location";
              if ("object" == typeof window.document && r === window.document) return "Document";
              if ("object" == typeof window.navigator) {
                if ("object" == typeof window.navigator.mimeTypes && r === window.navigator.mimeTypes) return "MimeTypeArray";
                if ("object" == typeof window.navigator.plugins && r === window.navigator.plugins) return "PluginArray"
              }
              if (("function" == typeof window.HTMLElement || "object" == typeof window.HTMLElement) && r instanceof window.HTMLElement) {
                if ("BLOCKQUOTE" === r.tagName) return "HTMLQuoteElement";
                if ("TD" === r.tagName) return "HTMLTableDataCellElement";
                if ("TH" === r.tagName) return "HTMLTableHeaderCellElement"
              }
            }
            return "string" == typeof(l = c && r[Symbol.toStringTag]) ? l : (u = Object.getPrototypeOf(r)) === RegExp.prototype ? "RegExp" : u === Date.prototype ? "Date" : t && u === Promise.prototype ? "Promise" : o && u === Set.prototype ? "Set" : n && u === Map.prototype ? "Map" : i && u === WeakSet.prototype ? "WeakSet" : s && u === WeakMap.prototype ? "WeakMap" : a && u === DataView.prototype ? "DataView" : n && u === d ? "Map Iterator" : o && u === p ? "Set Iterator" : f && u === g ? "Array Iterator" : y && u === m ? "String Iterator" : null === u ? "Object" : Object.prototype.toString.call(r).slice(8, -1)
          }
        }, "object" == typeof t && typeof e < "u" ? e.exports = n() : "function" == typeof define && define.amd ? define(n) : (r = typeof globalThis < "u" ? globalThis : r || self).typeDetect = n()
      })),
      kr = rr(((t, e) => {
        "use strict";

        function r() {
          this._key = "chai/deep-eql__" + Math.random() + Date.now()
        }

        function n(t, e, r) {
          var n, o;
          return !r || g(t) || g(e) ? null : (n = r.get(t)) && "boolean" == typeof(o = n.get(e)) ? o : null
        }

        function o(t, e, r, n) {
          if (r && !g(t) && !g(e)) {
            var o = r.get(t);
            o ? o.set(e, n) : ((o = new m).set(e, n), r.set(t, o))
          }
        }

        function s(t, e, r) {
          if (r && r.comparator) return a(t, e, r);
          var n = i(t, e);
          return null !== n ? n : a(t, e, r)
        }

        function i(t, e) {
          return t === e ? 0 !== t || 1 / t == 1 / e : t != t && e != e || !g(t) && !g(e) && null
        }

        function a(t, e, r) {
          var a, g, v, b, x, C, P;
          if ((r = r || {}).memoize = !1 !== r.memoize && (r.memoize || new m), a = r && r.comparator, null !== (g = n(t, e, r.memoize))) return g;
          if (null !== (v = n(e, t, r.memoize))) return v;
          if (a) {
            if (!1 === (b = a(t, e)) || !0 === b) return o(t, e, r.memoize, b), b;
            if (null !== (x = i(t, e))) return x
          }
          return (C = w(t)) !== w(e) ? (o(t, e, r.memoize, !1), !1) : (o(t, e, r.memoize, !0), P = function(t, e, r, n) {
            switch (r) {
              case "String":
              case "Number":
              case "Boolean":
              case "Date":
                return s(t.valueOf(), e.valueOf());
              case "Promise":
              case "Symbol":
              case "function":
              case "WeakMap":
              case "WeakSet":
                return t === e;
              case "Error":
                return f(t, e, ["name", "message", "code"], n);
              case "Arguments":
              case "Int8Array":
              case "Uint8Array":
              case "Uint8ClampedArray":
              case "Int16Array":
              case "Uint16Array":
              case "Int32Array":
              case "Uint32Array":
              case "Float32Array":
              case "Float64Array":
              case "Array":
                return c(t, e, n);
              case "RegExp":
                return function(t, e) {
                  return t.toString() === e.toString()
                }(t, e);
              case "Generator":
                return function(t, e, r) {
                  return c(h(t), h(e), r)
                }(t, e, n);
              case "DataView":
                return c(new Uint8Array(t.buffer), new Uint8Array(e.buffer), n);
              case "ArrayBuffer":
                return c(new Uint8Array(t), new Uint8Array(e), n);
              case "Set":
              case "Map":
                return l(t, e, n);
              case "Temporal.PlainDate":
              case "Temporal.PlainTime":
              case "Temporal.PlainDateTime":
              case "Temporal.Instant":
              case "Temporal.ZonedDateTime":
              case "Temporal.PlainYearMonth":
              case "Temporal.PlainMonthDay":
                return t.equals(e);
              case "Temporal.Duration":
                return t.total("nanoseconds") === e.total("nanoseconds");
              case "Temporal.TimeZone":
              case "Temporal.Calendar":
                return t.toString() === e.toString();
              default:
                return function(t, e, r) {
                  var n, o, s = p(t),
                    i = p(e),
                    a = d(t),
                    l = d(e);
                  if (s = s.concat(a), i = i.concat(l), s.length && s.length === i.length) return !1 !== c(y(s).sort(), y(i).sort()) && f(t, e, s, r);
                  n = u(t), o = u(e);
                  return n.length && n.length === o.length ? (n.sort(), o.sort(), c(n, o, r)) : 0 === s.length && 0 === n.length && 0 === i.length && 0 === o.length
                }(t, e, n)
            }
          }(t, e, C, r), o(t, e, r.memoize, P), P)
        }

        function l(t, e, r) {
          try {
            if (t.size !== e.size) return !1;
            if (0 === t.size) return !0
          } catch {
            return !1
          }
          var n = [],
            o = [];
          return t.forEach((function(t, e) {
            n.push([t, e])
          })), e.forEach((function(t, e) {
            o.push([t, e])
          })), c(n.sort(), o.sort(), r)
        }

        function c(t, e, r) {
          var n, o = t.length;
          if (o !== e.length) return !1;
          if (0 === o) return !0;
          for (n = -1; ++n < o;)
            if (!1 === s(t[n], e[n], r)) return !1;
          return !0
        }

        function u(t) {
          if (function(t) {
              return typeof Symbol < "u" && "object" == typeof t && typeof Symbol.iterator < "u" && "function" == typeof t[Symbol.iterator]
            }(t)) try {
            return h(t[Symbol.iterator]())
          } catch {
            return []
          }
          return []
        }

        function h(t) {
          for (var e = t.next(), r = [e.value]; !1 === e.done;) e = t.next(), r.push(e.value);
          return r
        }

        function p(t) {
          var e, r = [];
          for (e in t) r.push(e);
          return r
        }

        function d(t) {
          var e, r, n, o;
          for (e = [], r = Object.getOwnPropertySymbols(t), n = 0; n < r.length; n += 1) o = r[n], Object.getOwnPropertyDescriptor(t, o).enumerable && e.push(o);
          return e
        }

        function f(t, e, r, n) {
          var o, i = r.length;
          if (0 === i) return !0;
          for (o = 0; o < i; o += 1)
            if (!1 === s(t[r[o]], e[r[o]], n)) return !1;
          return !0
        }

        function g(t) {
          return null === t || "object" != typeof t
        }

        function y(t) {
          return t.map((function(t) {
            return "symbol" == typeof t ? t.toString() : t
          }))
        }
        var m, w = Pr();
        r.prototype = {
          get: function(t) {
            return t[this._key]
          },
          set: function(t, e) {
            Object.isExtensible(t) && Object.defineProperty(t, this._key, {
              value: e,
              configurable: !0
            })
          }
        }, m = "function" == typeof WeakMap ? WeakMap : r, e.exports = s, e.exports.MemoizeMap = m
      })),
      _r = rr((t => {
        "use strict";
        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.asArraysFactory = void 0, t.asArraysFactory = function(t) {
          return () => t.map((t => t.items))
        }
      })),
      jr = rr((t => {
        "use strict";
        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.asEntriesFactory = void 0, t.asEntriesFactory = function(t) {
          return e => {
            var r, n;
            let o = null !== (r = e?.keyName) && void 0 !== r ? r : "key",
              s = null !== (n = e?.itemsName) && void 0 !== n ? n : "items";
            return t.map((t => ({
              [o]: t.key,
              [s]: t.items
            })))
          }
        }
      })),
      Or = rr((t => {
        "use strict";
        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.asMapFactory = void 0, t.asMapFactory = function(t) {
          return () => {
            let e = new Map;
            for (let r of t) e.set(r.key, r.items);
            return e
          }
        }
      })),
      Ar = rr((t => {
        "use strict";

        function e(t) {
          return "string" == typeof t || "number" == typeof t || "symbol" == typeof t
        }
        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.asObjectFactory = void 0, t.asObjectFactory = function(t) {
          return () => {
            let r = {};
            for (let n of t) e(n.key) && (r[n.key] = n.items);
            return r
          }
        }
      })),
      Sr = rr((t => {
        "use strict";
        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.asTuplesFactory = void 0, t.asTuplesFactory = function(t) {
          return () => t.map((t => [t.key, t.items]))
        }
      })),
      Er = rr((t => {
        "use strict";
        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.keysFactory = void 0, t.keysFactory = function(t) {
          return () => t.map((t => t.key))
        }
      })),
      Mr = rr((t => {
        "use strict";
        var e, r, n, o, s, i, a, l = t && t.__importDefault || function(t) {
          return t && t.__esModule ? t : {
            default: t
          }
        };
        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.group = void 0, e = l(kr()), r = _r(), n = jr(), o = Or(), s = Ar(), i = Sr(), a = Er(), t.group = function(t) {
          return Object.freeze({
            by: l => {
              let c = function(t, r) {
                let n = [],
                  o = new Map,
                  s = 0;
                for (let i of t) {
                  let t = r(i, s);
                  s++;
                  let a = "object" == typeof t ? JSON.stringify(t) : t,
                    l = o.get(a);
                  null == l && (l = [], o.set(a, l));
                  let c = !1;
                  for (let r of l)
                    if ((0, e.default)(r.key, t)) {
                      r.items.push(i), c = !0;
                      break
                    } if (!c) {
                    let e = {
                      key: t,
                      items: [i]
                    };
                    n.push(e), l.push(e)
                  }
                }
                return n
              }(t, "function" == typeof l ? l : t => t[l]);
              return Object.freeze({
                asArrays: (0, r.asArraysFactory)(c),
                asEntries: (0, n.asEntriesFactory)(c),
                asMap: (0, o.asMapFactory)(c),
                asObject: (0, s.asObjectFactory)(c),
                asTuples: (0, i.asTuplesFactory)(c),
                keys: (0, a.keysFactory)(c)
              })
            }
          })
        }
      })),
      Tr = rr((t => {
        "use strict";
        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.group = void 0;
        var e = Mr();
        Object.defineProperty(t, "group", {
          enumerable: !0,
          get: function() {
            return e.group
          }
        })
      })),
      Ir = rr(((t, e) => {
        "use strict";
        var r = function() {
          function t(t, e) {
            if (!o[t]) {
              o[t] = {};
              for (var r = 0; r < t.length; r++) o[t][t.charAt(r)] = r
            }
            return o[t][e]
          }
          var e = String.fromCharCode,
            r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",
            o = {},
            s = {
              compressToBase64: function(t) {
                if (null == t) return "";
                var e = s._compress(t, 6, (function(t) {
                  return r.charAt(t)
                }));
                switch (e.length % 4) {
                  default:
                  case 0:
                    return e;
                  case 1:
                    return e + "===";
                  case 2:
                    return e + "==";
                  case 3:
                    return e + "="
                }
              },
              decompressFromBase64: function(e) {
                return null == e ? "" : "" == e ? null : s._decompress(e.length, 32, (function(n) {
                  return t(r, e.charAt(n))
                }))
              },
              compressToUTF16: function(t) {
                return null == t ? "" : s._compress(t, 15, (function(t) {
                  return e(t + 32)
                })) + " "
              },
              decompressFromUTF16: function(t) {
                return null == t ? "" : "" == t ? null : s._decompress(t.length, 16384, (function(e) {
                  return t.charCodeAt(e) - 32
                }))
              },
              compressToUint8Array: function(t) {
                var e, r, n, o, i;
                for (e = s.compress(t), r = new Uint8Array(2 * e.length), n = 0, o = e.length; n < o; n++) i = e.charCodeAt(n), r[2 * n] = i >>> 8, r[2 * n + 1] = i % 256;
                return r
              },
              decompressFromUint8Array: function(t) {
                var r, n, o, i;
                if (null == t) return s.decompress(t);
                for (n = 0, o = (r = new Array(t.length / 2)).length; n < o; n++) r[n] = 256 * t[2 * n] + t[2 * n + 1];
                return i = [], r.forEach((function(t) {
                  i.push(e(t))
                })), s.decompress(i.join(""))
              },
              compressToEncodedURIComponent: function(t) {
                return null == t ? "" : s._compress(t, 6, (function(t) {
                  return n.charAt(t)
                }))
              },
              decompressFromEncodedURIComponent: function(e) {
                return null == e ? "" : "" == e ? null : (e = e.replace(/ /g, "+"), s._decompress(e.length, 32, (function(r) {
                  return t(n, e.charAt(r))
                })))
              },
              compress: function(t) {
                return s._compress(t, 16, (function(t) {
                  return e(t)
                }))
              },
              _compress: function(t, e, r) {
                if (null == t) return "";
                var n, o, s, i = {},
                  a = {},
                  l = "",
                  c = "",
                  u = "",
                  h = 2,
                  p = 3,
                  d = 2,
                  f = [],
                  g = 0,
                  y = 0;
                for (s = 0; s < t.length; s += 1)
                  if (l = t.charAt(s), Object.prototype.hasOwnProperty.call(i, l) || (i[l] = p++, a[l] = !0), c = u + l, Object.prototype.hasOwnProperty.call(i, c)) u = c;
                  else {
                    if (Object.prototype.hasOwnProperty.call(a, u)) {
                      if (u.charCodeAt(0) < 256) {
                        for (n = 0; n < d; n++) g <<= 1, y == e - 1 ? (y = 0, f.push(r(g)), g = 0) : y++;
                        for (o = u.charCodeAt(0), n = 0; n < 8; n++) g = g << 1 | 1 & o, y == e - 1 ? (y = 0, f.push(r(g)), g = 0) : y++, o >>= 1
                      } else {
                        for (o = 1, n = 0; n < d; n++) g = g << 1 | o, y == e - 1 ? (y = 0, f.push(r(g)), g = 0) : y++, o = 0;
                        for (o = u.charCodeAt(0), n = 0; n < 16; n++) g = g << 1 | 1 & o, y == e - 1 ? (y = 0, f.push(r(g)), g = 0) : y++, o >>= 1
                      }
                      0 == --h && (h = Math.pow(2, d), d++), delete a[u]
                    } else
                      for (o = i[u], n = 0; n < d; n++) g = g << 1 | 1 & o, y == e - 1 ? (y = 0, f.push(r(g)), g = 0) : y++, o >>= 1;
                    0 == --h && (h = Math.pow(2, d), d++), i[c] = p++, u = String(l)
                  } if ("" !== u) {
                  if (Object.prototype.hasOwnProperty.call(a, u)) {
                    if (u.charCodeAt(0) < 256) {
                      for (n = 0; n < d; n++) g <<= 1, y == e - 1 ? (y = 0, f.push(r(g)), g = 0) : y++;
                      for (o = u.charCodeAt(0), n = 0; n < 8; n++) g = g << 1 | 1 & o, y == e - 1 ? (y = 0, f.push(r(g)), g = 0) : y++, o >>= 1
                    } else {
                      for (o = 1, n = 0; n < d; n++) g = g << 1 | o, y == e - 1 ? (y = 0, f.push(r(g)), g = 0) : y++, o = 0;
                      for (o = u.charCodeAt(0), n = 0; n < 16; n++) g = g << 1 | 1 & o, y == e - 1 ? (y = 0, f.push(r(g)), g = 0) : y++, o >>= 1
                    }
                    0 == --h && (h = Math.pow(2, d), d++), delete a[u]
                  } else
                    for (o = i[u], n = 0; n < d; n++) g = g << 1 | 1 & o, y == e - 1 ? (y = 0, f.push(r(g)), g = 0) : y++, o >>= 1;
                  0 == --h && (h = Math.pow(2, d), d++)
                }
                for (o = 2, n = 0; n < d; n++) g = g << 1 | 1 & o, y == e - 1 ? (y = 0, f.push(r(g)), g = 0) : y++, o >>= 1;
                for (;;) {
                  if (g <<= 1, y == e - 1) {
                    f.push(r(g));
                    break
                  }
                  y++
                }
                return f.join("")
              },
              decompress: function(t) {
                return null == t ? "" : "" == t ? null : s._decompress(t.length, 32768, (function(e) {
                  return t.charCodeAt(e)
                }))
              },
              _decompress: function(t, r, n) {
                var o, s, i, a, l, c, u, h = [],
                  p = 4,
                  d = 4,
                  f = 3,
                  g = "",
                  y = [],
                  m = {
                    val: n(0),
                    position: r,
                    index: 1
                  };
                for (o = 0; o < 3; o += 1) h[o] = o;
                for (i = 0, l = Math.pow(2, 2), c = 1; c != l;) a = m.val & m.position, m.position >>= 1, 0 == m.position && (m.position = r, m.val = n(m.index++)), i |= (a > 0 ? 1 : 0) * c, c <<= 1;
                switch (i) {
                  case 0:
                    for (i = 0, l = Math.pow(2, 8), c = 1; c != l;) a = m.val & m.position, m.position >>= 1, 0 == m.position && (m.position = r, m.val = n(m.index++)), i |= (a > 0 ? 1 : 0) * c, c <<= 1;
                    u = e(i);
                    break;
                  case 1:
                    for (i = 0, l = Math.pow(2, 16), c = 1; c != l;) a = m.val & m.position, m.position >>= 1, 0 == m.position && (m.position = r, m.val = n(m.index++)), i |= (a > 0 ? 1 : 0) * c, c <<= 1;
                    u = e(i);
                    break;
                  case 2:
                    return ""
                }
                for (h[3] = u, s = u, y.push(u);;) {
                  if (m.index > t) return "";
                  for (i = 0, l = Math.pow(2, f), c = 1; c != l;) a = m.val & m.position, m.position >>= 1, 0 == m.position && (m.position = r, m.val = n(m.index++)), i |= (a > 0 ? 1 : 0) * c, c <<= 1;
                  switch (u = i) {
                    case 0:
                      for (i = 0, l = Math.pow(2, 8), c = 1; c != l;) a = m.val & m.position, m.position >>= 1, 0 == m.position && (m.position = r, m.val = n(m.index++)), i |= (a > 0 ? 1 : 0) * c, c <<= 1;
                      h[d++] = e(i), u = d - 1, p--;
                      break;
                    case 1:
                      for (i = 0, l = Math.pow(2, 16), c = 1; c != l;) a = m.val & m.position, m.position >>= 1, 0 == m.position && (m.position = r, m.val = n(m.index++)), i |= (a > 0 ? 1 : 0) * c, c <<= 1;
                      h[d++] = e(i), u = d - 1, p--;
                      break;
                    case 2:
                      return y.join("")
                  }
                  if (0 == p && (p = Math.pow(2, f), f++), h[u]) g = h[u];
                  else {
                    if (u !== d) return null;
                    g = s + s.charAt(0)
                  }
                  y.push(g), h[d++] = s + g.charAt(0), s = g, 0 == --p && (p = Math.pow(2, f), f++)
                }
              }
            };
          return s
        }();
        "function" == typeof define && define.amd ? define((function() {
          return r
        })) : typeof e < "u" && null != e ? e.exports = r : typeof angular < "u" && null != angular && angular.module("LZString", []).factory("LZString", (function() {
          return r
        }))
      })),
      Lr = rr(((t, e) => {
        "use strict";
        e.exports = function(t, e) {
          return function(r) {
            return t(e(r))
          }
        }
      })),
      Dr = rr(((t, e) => {
        "use strict";
        var r = Lr()(Object.getPrototypeOf, Object);
        e.exports = r
      })),
      Ur = rr(((t, e) => {
        "use strict";
        var r = dr(),
          n = Dr(),
          o = fr(),
          s = Function.prototype,
          i = Object.prototype,
          a = s.toString,
          l = i.hasOwnProperty,
          c = a.call(Object);
        e.exports = function(t) {
          var e, s;
          return !(!o(t) || "[object Object]" != r(t)) && (null === (e = n(t)) || "function" == typeof(s = l.call(e, "constructor") && e.constructor) && s instanceof s && a.call(s) == c)
        }
      })),
      zr = rr(((t, e) => {
        "use strict";
        var r = dr(),
          n = fr(),
          o = Ur();
        e.exports = function(t) {
          if (!n(t)) return !1;
          var e = r(t);
          return "[object Error]" == e || "[object DOMException]" == e || "string" == typeof t.message && "string" == typeof t.name && !o(t)
        }
      })),
      Rr = rr(((t, e) => {
        "use strict";
        e.exports = function() {
          this.__data__ = [], this.size = 0
        }
      })),
      Nr = rr(((t, e) => {
        "use strict";
        e.exports = function(t, e) {
          return t === e || t != t && e != e
        }
      })),
      Wr = rr(((t, e) => {
        "use strict";
        var r = Nr();
        e.exports = function(t, e) {
          for (var n = t.length; n--;)
            if (r(t[n][0], e)) return n;
          return -1
        }
      })),
      Br = rr(((t, e) => {
        "use strict";
        var r = Wr(),
          n = Array.prototype.splice;
        e.exports = function(t) {
          var e = this.__data__,
            o = r(e, t);
          return !(o < 0) && (o == e.length - 1 ? e.pop() : n.call(e, o, 1), --this.size, !0)
        }
      })),
      Fr = rr(((t, e) => {
        "use strict";
        var r = Wr();
        e.exports = function(t) {
          var e = this.__data__,
            n = r(e, t);
          return n < 0 ? void 0 : e[n][1]
        }
      })),
      $r = rr(((t, e) => {
        "use strict";
        var r = Wr();
        e.exports = function(t) {
          return r(this.__data__, t) > -1
        }
      })),
      Hr = rr(((t, e) => {
        "use strict";
        var r = Wr();
        e.exports = function(t, e) {
          var n = this.__data__,
            o = r(n, t);
          return o < 0 ? (++this.size, n.push([t, e])) : n[o][1] = e, this
        }
      })),
      Gr = rr(((t, e) => {
        "use strict";

        function r(t) {
          var e, r = -1,
            n = null == t ? 0 : t.length;
          for (this.clear(); ++r < n;) e = t[r], this.set(e[0], e[1])
        }
        var n = Rr(),
          o = Br(),
          s = Fr(),
          i = $r(),
          a = Hr();
        r.prototype.clear = n, r.prototype.delete = o, r.prototype.get = s, r.prototype.has = i, r.prototype.set = a, e.exports = r
      })),
      Vr = rr(((t, e) => {
        "use strict";
        var r = Gr();
        e.exports = function() {
          this.__data__ = new r, this.size = 0
        }
      })),
      Yr = rr(((t, e) => {
        "use strict";
        e.exports = function(t) {
          var e = this.__data__,
            r = e.delete(t);
          return this.size = e.size, r
        }
      })),
      qr = rr(((t, e) => {
        "use strict";
        e.exports = function(t) {
          return this.__data__.get(t)
        }
      })),
      Xr = rr(((t, e) => {
        "use strict";
        e.exports = function(t) {
          return this.__data__.has(t)
        }
      })),
      Kr = rr(((t, e) => {
        "use strict";
        var r = dr(),
          n = ar();
        e.exports = function(t) {
          if (!n(t)) return !1;
          var e = r(t);
          return "[object Function]" == e || "[object GeneratorFunction]" == e || "[object AsyncFunction]" == e || "[object Proxy]" == e
        }
      })),
      Zr = rr(((t, e) => {
        "use strict";
        var r = cr()["__core-js_shared__"];
        e.exports = r
      })),
      Qr = rr(((t, e) => {
        "use strict";
        var r, n = Zr(),
          o = (r = /[^.]+$/.exec(n && n.keys && n.keys.IE_PROTO || "")) ? "Symbol(src)_1." + r : "";
        e.exports = function(t) {
          return !!o && o in t
        }
      })),
      Jr = rr(((t, e) => {
        "use strict";
        var r = Function.prototype.toString;
        e.exports = function(t) {
          if (null != t) {
            try {
              return r.call(t)
            } catch {}
            try {
              return t + ""
            } catch {}
          }
          return ""
        }
      })),
      tn = rr(((t, e) => {
        "use strict";
        var r = Kr(),
          n = Qr(),
          o = ar(),
          s = Jr(),
          i = /^\[object .+?Constructor\]$/,
          a = Function.prototype,
          l = Object.prototype,
          c = a.toString,
          u = l.hasOwnProperty,
          h = RegExp("^" + c.call(u).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
        e.exports = function(t) {
          return !(!o(t) || n(t)) && (r(t) ? h : i).test(s(t))
        }
      })),
      en = rr(((t, e) => {
        "use strict";
        e.exports = function(t, e) {
          return t?.[e]
        }
      })),
      rn = rr(((t, e) => {
        "use strict";
        var r = tn(),
          n = en();
        e.exports = function(t, e) {
          var o = n(t, e);
          return r(o) ? o : void 0
        }
      })),
      nn = rr(((t, e) => {
        "use strict";
        var r = rn()(cr(), "Map");
        e.exports = r
      })),
      on = rr(((t, e) => {
        "use strict";
        var r = rn()(Object, "create");
        e.exports = r
      })),
      sn = rr(((t, e) => {
        "use strict";
        var r = on();
        e.exports = function() {
          this.__data__ = r ? r(null) : {}, this.size = 0
        }
      })),
      an = rr(((t, e) => {
        "use strict";
        e.exports = function(t) {
          var e = this.has(t) && delete this.__data__[t];
          return this.size -= e ? 1 : 0, e
        }
      })),
      ln = rr(((t, e) => {
        "use strict";
        var r = on(),
          n = Object.prototype.hasOwnProperty;
        e.exports = function(t) {
          var e, o = this.__data__;
          return r ? "__lodash_hash_undefined__" === (e = o[t]) ? void 0 : e : n.call(o, t) ? o[t] : void 0
        }
      })),
      cn = rr(((t, e) => {
        "use strict";
        var r = on(),
          n = Object.prototype.hasOwnProperty;
        e.exports = function(t) {
          var e = this.__data__;
          return r ? void 0 !== e[t] : n.call(e, t)
        }
      })),
      un = rr(((t, e) => {
        "use strict";
        var r = on();
        e.exports = function(t, e) {
          var n = this.__data__;
          return this.size += this.has(t) ? 0 : 1, n[t] = r && void 0 === e ? "__lodash_hash_undefined__" : e, this
        }
      })),
      hn = rr(((t, e) => {
        "use strict";

        function r(t) {
          var e, r = -1,
            n = null == t ? 0 : t.length;
          for (this.clear(); ++r < n;) e = t[r], this.set(e[0], e[1])
        }
        var n = sn(),
          o = an(),
          s = ln(),
          i = cn(),
          a = un();
        r.prototype.clear = n, r.prototype.delete = o, r.prototype.get = s, r.prototype.has = i, r.prototype.set = a, e.exports = r
      })),
      pn = rr(((t, e) => {
        "use strict";
        var r = hn(),
          n = Gr(),
          o = nn();
        e.exports = function() {
          this.size = 0, this.__data__ = {
            hash: new r,
            map: new(o || n),
            string: new r
          }
        }
      })),
      dn = rr(((t, e) => {
        "use strict";
        e.exports = function(t) {
          var e = typeof t;
          return "string" == e || "number" == e || "symbol" == e || "boolean" == e ? "__proto__" !== t : null === t
        }
      })),
      fn = rr(((t, e) => {
        "use strict";
        var r = dn();
        e.exports = function(t, e) {
          var n = t.__data__;
          return r(e) ? n["string" == typeof e ? "string" : "hash"] : n.map
        }
      })),
      gn = rr(((t, e) => {
        "use strict";
        var r = fn();
        e.exports = function(t) {
          var e = r(this, t).delete(t);
          return this.size -= e ? 1 : 0, e
        }
      })),
      yn = rr(((t, e) => {
        "use strict";
        var r = fn();
        e.exports = function(t) {
          return r(this, t).get(t)
        }
      })),
      mn = rr(((t, e) => {
        "use strict";
        var r = fn();
        e.exports = function(t) {
          return r(this, t).has(t)
        }
      })),
      wn = rr(((t, e) => {
        "use strict";
        var r = fn();
        e.exports = function(t, e) {
          var n = r(this, t),
            o = n.size;
          return n.set(t, e), this.size += n.size == o ? 0 : 1, this
        }
      })),
      vn = rr(((t, e) => {
        "use strict";

        function r(t) {
          var e, r = -1,
            n = null == t ? 0 : t.length;
          for (this.clear(); ++r < n;) e = t[r], this.set(e[0], e[1])
        }
        var n = pn(),
          o = gn(),
          s = yn(),
          i = mn(),
          a = wn();
        r.prototype.clear = n, r.prototype.delete = o, r.prototype.get = s, r.prototype.has = i, r.prototype.set = a, e.exports = r
      })),
      bn = rr(((t, e) => {
        "use strict";
        var r = Gr(),
          n = nn(),
          o = vn();
        e.exports = function(t, e) {
          var s, i = this.__data__;
          if (i instanceof r) {
            if (s = i.__data__, !n || s.length < 199) return s.push([t, e]), this.size = ++i.size, this;
            i = this.__data__ = new o(s)
          }
          return i.set(t, e), this.size = i.size, this
        }
      })),
      xn = rr(((t, e) => {
        "use strict";

        function r(t) {
          var e = this.__data__ = new n(t);
          this.size = e.size
        }
        var n = Gr(),
          o = Vr(),
          s = Yr(),
          i = qr(),
          a = Xr(),
          l = bn();
        r.prototype.clear = o, r.prototype.delete = s, r.prototype.get = i, r.prototype.has = a, r.prototype.set = l, e.exports = r
      })),
      Cn = rr(((t, e) => {
        "use strict";
        e.exports = function(t, e) {
          for (var r = -1, n = null == t ? 0 : t.length; ++r < n && !1 !== e(t[r], r, t););
          return t
        }
      })),
      Pn = rr(((t, e) => {
        "use strict";
        var r = rn(),
          n = function() {
            try {
              var t = r(Object, "defineProperty");
              return t({}, "", {}), t
            } catch {}
          }();
        e.exports = n
      })),
      kn = rr(((t, e) => {
        "use strict";
        var r = Pn();
        e.exports = function(t, e, n) {
          "__proto__" == e && r ? r(t, e, {
            configurable: !0,
            enumerable: !0,
            value: n,
            writable: !0
          }) : t[e] = n
        }
      })),
      _n = rr(((t, e) => {
        "use strict";
        var r = kn(),
          n = Nr(),
          o = Object.prototype.hasOwnProperty;
        e.exports = function(t, e, s) {
          var i = t[e];
          (!o.call(t, e) || !n(i, s) || void 0 === s && !(e in t)) && r(t, e, s)
        }
      })),
      jn = rr(((t, e) => {
        "use strict";
        var r = _n(),
          n = kn();
        e.exports = function(t, e, o, s) {
          var i, a, l, c, u = !o;
          for (o || (o = {}), i = -1, a = e.length; ++i < a;) l = e[i], void 0 === (c = s ? s(o[l], t[l], l, o, t) : void 0) && (c = t[l]), u ? n(o, l, c) : r(o, l, c);
          return o
        }
      })),
      On = rr(((t, e) => {
        "use strict";
        e.exports = function(t, e) {
          for (var r = -1, n = Array(t); ++r < t;) n[r] = e(r);
          return n
        }
      })),
      An = rr(((t, e) => {
        "use strict";
        var r = dr(),
          n = fr();
        e.exports = function(t) {
          return n(t) && "[object Arguments]" == r(t)
        }
      })),
      Sn = rr(((t, e) => {
        "use strict";
        var r = An(),
          n = fr(),
          o = Object.prototype,
          s = o.hasOwnProperty,
          i = o.propertyIsEnumerable,
          a = r(function() {
            return arguments
          }()) ? r : function(t) {
            return n(t) && s.call(t, "callee") && !i.call(t, "callee")
          };
        e.exports = a
      })),
      En = rr(((t, e) => {
        "use strict";
        var r = Array.isArray;
        e.exports = r
      })),
      Mn = rr(((t, e) => {
        "use strict";
        e.exports = function() {
          return !1
        }
      })),
      Tn = rr(((t, e) => {
        "use strict";
        var r = cr(),
          n = Mn(),
          o = "object" == typeof t && t && !t.nodeType && t,
          s = o && "object" == typeof e && e && !e.nodeType && e,
          i = s && s.exports === o ? r.Buffer : void 0,
          a = (i ? i.isBuffer : void 0) || n;
        e.exports = a
      })),
      In = rr(((t, e) => {
        "use strict";
        var r = /^(?:0|[1-9]\d*)$/;
        e.exports = function(t, e) {
          var n = typeof t;
          return !!(e = e ?? 9007199254740991) && ("number" == n || "symbol" != n && r.test(t)) && t > -1 && t % 1 == 0 && t < e
        }
      })),
      Ln = rr(((t, e) => {
        "use strict";
        e.exports = function(t) {
          return "number" == typeof t && t > -1 && t % 1 == 0 && t <= 9007199254740991
        }
      })),
      Dn = rr(((t, e) => {
        "use strict";
        var r = dr(),
          n = Ln(),
          o = fr(),
          s = {};
        s["[object Float32Array]"] = s["[object Float64Array]"] = s["[object Int8Array]"] = s["[object Int16Array]"] = s["[object Int32Array]"] = s["[object Uint8Array]"] = s["[object Uint8ClampedArray]"] = s["[object Uint16Array]"] = s["[object Uint32Array]"] = !0, s["[object Arguments]"] = s["[object Array]"] = s["[object ArrayBuffer]"] = s["[object Boolean]"] = s["[object DataView]"] = s["[object Date]"] = s["[object Error]"] = s["[object Function]"] = s["[object Map]"] = s["[object Number]"] = s["[object Object]"] = s["[object RegExp]"] = s["[object Set]"] = s["[object String]"] = s["[object WeakMap]"] = !1, e.exports = function(t) {
          return o(t) && n(t.length) && !!s[r(t)]
        }
      })),
      Un = rr(((t, e) => {
        "use strict";
        e.exports = function(t) {
          return function(e) {
            return t(e)
          }
        }
      })),
      zn = rr(((t, e) => {
        "use strict";
        var r = lr(),
          n = "object" == typeof t && t && !t.nodeType && t,
          o = n && "object" == typeof e && e && !e.nodeType && e,
          s = o && o.exports === n && r.process,
          i = function() {
            try {
              return o && o.require && o.require("util").types || s && s.binding && s.binding("util")
            } catch {}
          }();
        e.exports = i
      })),
      Rn = rr(((t, e) => {
        "use strict";
        var r = Dn(),
          n = Un(),
          o = zn(),
          s = o && o.isTypedArray,
          i = s ? n(s) : r;
        e.exports = i
      })),
      Nn = rr(((t, e) => {
        "use strict";
        var r = On(),
          n = Sn(),
          o = En(),
          s = Tn(),
          i = In(),
          a = Rn(),
          l = Object.prototype.hasOwnProperty;
        e.exports = function(t, e) {
          var c, u = o(t),
            h = !u && n(t),
            p = !u && !h && s(t),
            d = !u && !h && !p && a(t),
            f = u || h || p || d,
            g = f ? r(t.length, String) : [],
            y = g.length;
          for (c in t)(e || l.call(t, c)) && (!f || !("length" == c || p && ("offset" == c || "parent" == c) || d && ("buffer" == c || "byteLength" == c || "byteOffset" == c) || i(c, y))) && g.push(c);
          return g
        }
      })),
      Wn = rr(((t, e) => {
        "use strict";
        var r = Object.prototype;
        e.exports = function(t) {
          var e = t && t.constructor;
          return t === ("function" == typeof e && e.prototype || r)
        }
      })),
      Bn = rr(((t, e) => {
        "use strict";
        var r = Lr()(Object.keys, Object);
        e.exports = r
      })),
      Fn = rr(((t, e) => {
        "use strict";
        var r = Wn(),
          n = Bn(),
          o = Object.prototype.hasOwnProperty;
        e.exports = function(t) {
          var e, s;
          if (!r(t)) return n(t);
          for (s in e = [], Object(t)) o.call(t, s) && "constructor" != s && e.push(s);
          return e
        }
      })),
      $n = rr(((t, e) => {
        "use strict";
        var r = Kr(),
          n = Ln();
        e.exports = function(t) {
          return null != t && n(t.length) && !r(t)
        }
      })),
      Hn = rr(((t, e) => {
        "use strict";
        var r = Nn(),
          n = Fn(),
          o = $n();
        e.exports = function(t) {
          return o(t) ? r(t) : n(t)
        }
      })),
      Gn = rr(((t, e) => {
        "use strict";
        var r = jn(),
          n = Hn();
        e.exports = function(t, e) {
          return t && r(e, n(e), t)
        }
      })),
      Vn = rr(((t, e) => {
        "use strict";
        e.exports = function(t) {
          var e, r = [];
          if (null != t)
            for (e in Object(t)) r.push(e);
          return r
        }
      })),
      Yn = rr(((t, e) => {
        "use strict";
        var r = ar(),
          n = Wn(),
          o = Vn(),
          s = Object.prototype.hasOwnProperty;
        e.exports = function(t) {
          var e, i, a;
          if (!r(t)) return o(t);
          for (a in e = n(t), i = [], t) "constructor" == a && (e || !s.call(t, a)) || i.push(a);
          return i
        }
      })),
      qn = rr(((t, e) => {
        "use strict";
        var r = Nn(),
          n = Yn(),
          o = $n();
        e.exports = function(t) {
          return o(t) ? r(t, !0) : n(t)
        }
      })),
      Xn = rr(((t, e) => {
        "use strict";
        var r = jn(),
          n = qn();
        e.exports = function(t, e) {
          return t && r(e, n(e), t)
        }
      })),
      Kn = rr(((t, e) => {
        "use strict";
        var r = cr(),
          n = "object" == typeof t && t && !t.nodeType && t,
          o = n && "object" == typeof e && e && !e.nodeType && e,
          s = o && o.exports === n ? r.Buffer : void 0,
          i = s ? s.allocUnsafe : void 0;
        e.exports = function(t, e) {
          if (e) return t.slice();
          var r = t.length,
            n = i ? i(r) : new t.constructor(r);
          return t.copy(n), n
        }
      })),
      Zn = rr(((t, e) => {
        "use strict";
        e.exports = function(t, e) {
          var r = -1,
            n = t.length;
          for (e || (e = Array(n)); ++r < n;) e[r] = t[r];
          return e
        }
      })),
      Qn = rr(((t, e) => {
        "use strict";
        e.exports = function(t, e) {
          var r, n, o, s, i;
          for (r = -1, n = null == t ? 0 : t.length, o = 0, s = []; ++r < n;) e(i = t[r], r, t) && (s[o++] = i);
          return s
        }
      })),
      Jn = rr(((t, e) => {
        "use strict";
        e.exports = function() {
          return []
        }
      })),
      to = rr(((t, e) => {
        "use strict";
        var r = Qn(),
          n = Jn(),
          o = Object.prototype.propertyIsEnumerable,
          s = Object.getOwnPropertySymbols,
          i = s ? function(t) {
            return null == t ? [] : (t = Object(t), r(s(t), (function(e) {
              return o.call(t, e)
            })))
          } : n;
        e.exports = i
      })),
      eo = rr(((t, e) => {
        "use strict";
        var r = jn(),
          n = to();
        e.exports = function(t, e) {
          return r(t, n(t), e)
        }
      })),
      ro = rr(((t, e) => {
        "use strict";
        e.exports = function(t, e) {
          for (var r = -1, n = e.length, o = t.length; ++r < n;) t[o + r] = e[r];
          return t
        }
      })),
      no = rr(((t, e) => {
        "use strict";
        var r = ro(),
          n = Dr(),
          o = to(),
          s = Jn(),
          i = Object.getOwnPropertySymbols ? function(t) {
            for (var e = []; t;) r(e, o(t)), t = n(t);
            return e
          } : s;
        e.exports = i
      })),
      oo = rr(((t, e) => {
        "use strict";
        var r = jn(),
          n = no();
        e.exports = function(t, e) {
          return r(t, n(t), e)
        }
      })),
      so = rr(((t, e) => {
        "use strict";
        var r = ro(),
          n = En();
        e.exports = function(t, e, o) {
          var s = e(t);
          return n(t) ? s : r(s, o(t))
        }
      })),
      io = rr(((t, e) => {
        "use strict";
        var r = so(),
          n = to(),
          o = Hn();
        e.exports = function(t) {
          return r(t, o, n)
        }
      })),
      ao = rr(((t, e) => {
        "use strict";
        var r = so(),
          n = no(),
          o = qn();
        e.exports = function(t) {
          return r(t, o, n)
        }
      })),
      lo = rr(((t, e) => {
        "use strict";
        var r = rn()(cr(), "DataView");
        e.exports = r
      })),
      co = rr(((t, e) => {
        "use strict";
        var r = rn()(cr(), "Promise");
        e.exports = r
      })),
      uo = rr(((t, e) => {
        "use strict";
        var r = rn()(cr(), "Set");
        e.exports = r
      })),
      ho = rr(((t, e) => {
        "use strict";
        var r = rn()(cr(), "WeakMap");
        e.exports = r
      })),
      po = rr(((t, e) => {
        "use strict";
        var r = lo(),
          n = nn(),
          o = co(),
          s = uo(),
          i = ho(),
          a = dr(),
          l = Jr(),
          c = "[object Map]",
          u = "[object Promise]",
          h = "[object Set]",
          p = "[object WeakMap]",
          d = "[object DataView]",
          f = l(r),
          g = l(n),
          y = l(o),
          m = l(s),
          w = l(i),
          v = a;
        (r && v(new r(new ArrayBuffer(1))) != d || n && v(new n) != c || o && v(o.resolve()) != u || s && v(new s) != h || i && v(new i) != p) && (v = function(t) {
          var e = a(t),
            r = "[object Object]" == e ? t.constructor : void 0,
            n = r ? l(r) : "";
          if (n) switch (n) {
            case f:
              return d;
            case g:
              return c;
            case y:
              return u;
            case m:
              return h;
            case w:
              return p
          }
          return e
        }), e.exports = v
      })),
      fo = rr(((t, e) => {
        "use strict";
        var r = Object.prototype.hasOwnProperty;
        e.exports = function(t) {
          var e = t.length,
            n = new t.constructor(e);
          return e && "string" == typeof t[0] && r.call(t, "index") && (n.index = t.index, n.input = t.input), n
        }
      })),
      go = rr(((t, e) => {
        "use strict";
        var r = cr().Uint8Array;
        e.exports = r
      })),
      yo = rr(((t, e) => {
        "use strict";
        var r = go();
        e.exports = function(t) {
          var e = new t.constructor(t.byteLength);
          return new r(e).set(new r(t)), e
        }
      })),
      mo = rr(((t, e) => {
        "use strict";
        var r = yo();
        e.exports = function(t, e) {
          var n = e ? r(t.buffer) : t.buffer;
          return new t.constructor(n, t.byteOffset, t.byteLength)
        }
      })),
      wo = rr(((t, e) => {
        "use strict";
        var r = /\w*$/;
        e.exports = function(t) {
          var e = new t.constructor(t.source, r.exec(t));
          return e.lastIndex = t.lastIndex, e
        }
      })),
      vo = rr(((t, e) => {
        "use strict";
        var r = ur(),
          n = r ? r.prototype : void 0,
          o = n ? n.valueOf : void 0;
        e.exports = function(t) {
          return o ? Object(o.call(t)) : {}
        }
      })),
      bo = rr(((t, e) => {
        "use strict";
        var r = yo();
        e.exports = function(t, e) {
          var n = e ? r(t.buffer) : t.buffer;
          return new t.constructor(n, t.byteOffset, t.length)
        }
      })),
      xo = rr(((t, e) => {
        "use strict";
        var r = yo(),
          n = mo(),
          o = wo(),
          s = vo(),
          i = bo();
        e.exports = function(t, e, a) {
          var l = t.constructor;
          switch (e) {
            case "[object ArrayBuffer]":
              return r(t);
            case "[object Boolean]":
            case "[object Date]":
              return new l(+t);
            case "[object DataView]":
              return n(t, a);
            case "[object Float32Array]":
            case "[object Float64Array]":
            case "[object Int8Array]":
            case "[object Int16Array]":
            case "[object Int32Array]":
            case "[object Uint8Array]":
            case "[object Uint8ClampedArray]":
            case "[object Uint16Array]":
            case "[object Uint32Array]":
              return i(t, a);
            case "[object Map]":
            case "[object Set]":
              return new l;
            case "[object Number]":
            case "[object String]":
              return new l(t);
            case "[object RegExp]":
              return o(t);
            case "[object Symbol]":
              return s(t)
          }
        }
      })),
      Co = rr(((t, e) => {
        "use strict";
        var r = ar(),
          n = Object.create,
          o = function() {
            function t() {}
            return function(e) {
              if (!r(e)) return {};
              if (n) return n(e);
              t.prototype = e;
              var o = new t;
              return t.prototype = void 0, o
            }
          }();
        e.exports = o
      })),
      Po = rr(((t, e) => {
        "use strict";
        var r = Co(),
          n = Dr(),
          o = Wn();
        e.exports = function(t) {
          return "function" != typeof t.constructor || o(t) ? {} : r(n(t))
        }
      })),
      ko = rr(((t, e) => {
        "use strict";
        var r = po(),
          n = fr();
        e.exports = function(t) {
          return n(t) && "[object Map]" == r(t)
        }
      })),
      _o = rr(((t, e) => {
        "use strict";
        var r = ko(),
          n = Un(),
          o = zn(),
          s = o && o.isMap,
          i = s ? n(s) : r;
        e.exports = i
      })),
      jo = rr(((t, e) => {
        "use strict";
        var r = po(),
          n = fr();
        e.exports = function(t) {
          return n(t) && "[object Set]" == r(t)
        }
      })),
      Oo = rr(((t, e) => {
        "use strict";
        var r = jo(),
          n = Un(),
          o = zn(),
          s = o && o.isSet,
          i = s ? n(s) : r;
        e.exports = i
      })),
      Ao = rr(((t, e) => {
        "use strict";
        var r = xn(),
          n = Cn(),
          o = _n(),
          s = Gn(),
          i = Xn(),
          a = Kn(),
          l = Zn(),
          c = eo(),
          u = oo(),
          h = io(),
          p = ao(),
          d = po(),
          f = fo(),
          g = xo(),
          y = Po(),
          m = En(),
          w = Tn(),
          v = _o(),
          b = ar(),
          x = Oo(),
          C = Hn(),
          P = qn(),
          k = "[object Arguments]",
          _ = "[object Function]",
          j = "[object Object]",
          O = {};
        O[k] = O["[object Array]"] = O["[object ArrayBuffer]"] = O["[object DataView]"] = O["[object Boolean]"] = O["[object Date]"] = O["[object Float32Array]"] = O["[object Float64Array]"] = O["[object Int8Array]"] = O["[object Int16Array]"] = O["[object Int32Array]"] = O["[object Map]"] = O["[object Number]"] = O[j] = O["[object RegExp]"] = O["[object Set]"] = O["[object String]"] = O["[object Symbol]"] = O["[object Uint8Array]"] = O["[object Uint8ClampedArray]"] = O["[object Uint16Array]"] = O["[object Uint32Array]"] = !0, O["[object Error]"] = O[_] = O["[object WeakMap]"] = !1, e.exports = function t(e, A, S, E, M, T) {
          var I, L, D, U, z, R, N = 1 & A,
            W = 2 & A,
            B = 4 & A;
          if (S && (I = M ? S(e, E, M, T) : S(e)), void 0 !== I) return I;
          if (!b(e)) return e;
          if (L = m(e)) {
            if (I = f(e), !N) return l(e, I)
          } else {
            if (U = (D = d(e)) == _ || "[object GeneratorFunction]" == D, w(e)) return a(e, N);
            if (D == j || D == k || U && !M) {
              if (I = W || U ? {} : y(e), !N) return W ? u(e, i(I, e)) : c(e, s(I, e))
            } else {
              if (!O[D]) return M ? e : {};
              I = g(e, D, N)
            }
          }
          return T || (T = new r), (z = T.get(e)) ? z : (T.set(e, I), x(e) ? e.forEach((function(r) {
            I.add(t(r, A, S, r, e, T))
          })) : v(e) && e.forEach((function(r, n) {
            I.set(n, t(r, A, S, n, e, T))
          })), R = L ? void 0 : (B ? W ? p : h : W ? P : C)(e), n(R || e, (function(r, n) {
            R && (r = e[n = r]), o(I, n, t(r, A, S, n, e, T))
          })), I)
        }
      })),
      So = rr(((t, e) => {
        "use strict";
        var r = Ao();
        e.exports = function(t) {
          return r(t, 4)
        }
      })),
      Eo = or(br()),
      Mo = or(xr()),
      To = new Error("no connection"),
      Io = new Error("need template source"),
      Lo = (new Error("no access to canvas api"), new Error("need template position")),
      Do = new Error("canvas undefined"),
      Uo = new Error("strategy undefined"),
      zo = new Error("promise deadline"),
      Ro = new Error("errAborterTriggered"),
      No = new Error("default strategy doesnt exists"),
      Wo = new Error("errSeveralNoPlacePixelResult"),
      Bo = new Error("Max attempts reached"),
      Fo = class extends Mo.default {
        wait(t, e = 5e3) {
          return new Promise(((r, n) => {
            let o = setTimeout((() => n(zo)), e);
            this.once(t, (t => {
              clearTimeout(o), r(t)
            }))
          }))
        }
      },
      $o = class extends Fo {
        on(t, e) {
          return super.on(t, e)
        }
        once(t, e) {
          return super.once(t, e)
        }
        wait(t, e) {
          return super.wait(t, e)
        }
        off(t, e) {
          return super.off(t, e)
        }
        emit(t, e) {
          return void 0 !== e ? super.emit(t, e) : super.emit(t)
        }
      },
      Ho = class extends $o {
        constructor(t, e) {
          super(), this.ws = null, this.url = t, e && e.reconnectDelay && this.on(1, (t => {
            t.wasClean || setTimeout(!0 === e.hideReconnectErrors ? () => this.connect().catch((() => {})) : () => this.connect(), e.reconnectDelay)
          }))
        }
        get connected() {
          return null !== this.ws && this.ws.readyState === WebSocket.OPEN
        }
        get disconnected() {
          return !this.connected
        }
        get connecting() {
          return this.ws && this.ws.readyState === WebSocket.CONNECTING
        }
        connect() {
          return new Promise(((t, e) => {
            (this.ws?.readyState === WebSocket.CONNECTING || this.ws?.readyState === WebSocket.OPEN) && e(new Error("try connect when websocket is OPEN or CONNECTING"));
            let r = !1;
            this.ws = new WebSocket(this.url), this.ws.binaryType = "arraybuffer", this.ws.onopen = () => {
              this.emit(0), r = !0, t()
            }, this.ws.onclose = t => {
              this.emit(1, t), r || e(t)
            }, this.ws.onerror = t => {
              this.emit(2, t)
            }, this.ws.onmessage = ({
              data: t
            }) => {
              "string" == typeof t ? this.emit(3, t) : this.emit(4, t)
            }
          }))
        }
        async disconnect() {
          this.ws && (this.ws.close(), await this.wait(1), this.ws = null)
        }
        send(t) {
          if (null === this.ws || this.disconnected) throw To;
          this.ws.send(t)
        }
      },
      Go = class t {
        constructor(t, e, r, n) {
          this.x1 = t, this.y1 = e, this.x2 = r, this.y2 = n
        }
        get width() {
          return this.x2 - this.x1
        }
        set width(t) {
          this.x2 = this.x1 + t
        }
        get height() {
          return this.y2 - this.y1
        }
        set height(t) {
          this.y2 = this.y1 + t
        }
        get localCenter() {
          return [this.width / 2, this.height / 2]
        }
        get center() {
          return [(this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2]
        }
        in(t, e) {
          return this.x1 <= t && t < this.x2 && this.y1 <= e && e < this.y2
        }
        localIn(t, e) {
          return t >= 0 && e >= 0 && t < this.width && e < this.height
        }
        toArray() {
          return [this.x1, this.y1, this.x2, this.y2]
        }
        moveY(t) {
          this.move(this.x1, t)
        }
        moveX(t) {
          this.move(t, this.y1)
        }
        move(t, e) {
          let r = this.width,
            n = this.height;
          this.x1 = t, this.y1 = e, this.width = r, this.height = n
        }
        copy() {
          return new t(this.x1, this.y1, this.x2, this.y2)
        }
      },
      Vo = class {
        constructor(t = 6e4) {
          this.triggered = !1, this.resolve = () => {}, this.timeout = setTimeout((() => this.destroy()), t), this.promise = new Promise((t => this.resolve = t))
        }
        abort() {
          this.resolve(Ro), clearTimeout(this.timeout), this.triggered = !0
        }
        destroy() {
          this.resolve(), clearTimeout(this.timeout)
        }
      },
      Yo = class {
        constructor(t, e) {
          this.build = t, this.onerror = e
        }
        #t = null;
        #e = null;
        get ready() {
          return null !== this.#t && !(this.#t instanceof Promise)
        }
        async clear() {
          let t;
          return this.#t instanceof Promise && (t = this.#t.then((t => {
            if (t && "destroy" in t) return t.destroy()
          })).then((() => {})), this.#t = null, this.#e?.abort(), this.#e = null), null !== this.#t && (this.#t = null), t || Promise.resolve()
        }
        get() {
          return null === this.#t ? (this.#e = new Vo, this.#t = Promise.any([this.build().then((t => this.#t = t)).catch((t => (this.onerror?.(t), null))), this.#e.promise.then((() => null))]), this.#t) : this.#t instanceof Promise ? this.#t : Promise.resolve(this.#t)
        }
        getExists() {
          return Promise.resolve(this.#t)
        }
        now() {
          return null === this.#t || this.#t instanceof Promise ? null : this.#t
        }
      },
      qo = "black-and-red.space",
      Xo = "wss://" + qo + "/ws",
      Ko = "https://boosty.to/touchedbydarkness",
      Zo = "https://discord.gg/VyfVmD2nhZ",
      Qo = "http://github.com/TouchedByDarkness",
      Jo = ["From Void with love", "Made in Void", "From Void to all", "Let's all love void"],
      ts = "darkness_bot",
      es = class {
        constructor() {
          this.updatedAt = 0, this.cooldown = 0
        }
        update(t) {
          this.cooldown = t, this.updatedAt = Date.now()
        }
        get() {
          return Math.max(0, this.cooldown - (Date.now() - this.updatedAt))
        }
      },
      rs = class {
        constructor() {
          this.timer = new es
        }
        get chunkSize() {
          return this.info.chunkWidth * this.info.chunkHeight
        }
        getChunksCoords(t, e, r, n) {
          t = Math.floor((t + this.info.worldWidth / 2) / this.info.chunkWidth), e = Math.floor((e + this.info.worldHeight / 2) / this.info.chunkHeight), r = Math.floor((r - 1 + this.info.worldWidth / 2) / this.info.chunkWidth), n = Math.floor((n - 1 + this.info.worldHeight / 2) / this.info.chunkHeight);
          let o = [];
          for (let s = t; s <= r; s++)
            for (let t = e; t <= n; t++) o.push([s, t]);
          return o
        }
        toTiled(t, e) {
          return t += this.info.worldWidth >> 1, e += this.info.worldHeight >> 1, [Math.floor(t / this.info.chunkWidth), Math.floor(e / this.info.chunkHeight), e % this.info.chunkHeight * this.info.chunkWidth + t % this.info.chunkWidth]
        }
        toWorld(t, e, r) {
          return [t * this.info.chunkWidth - (this.info.worldWidth >> 1) + r % this.info.chunkWidth, e * this.info.chunkHeight - (this.info.worldHeight >> 1) + Math.floor(r / this.info.chunkWidth)]
        }
      },
      ns = class {
        constructor() {
          this.dict = new Map
        }
        get(t, e) {
          return this.dict.get(this.coordsToIndex(t, e))
        }
        delete(t, e) {
          return this.dict.delete(this.coordsToIndex(t, e))
        }
        has(t, e) {
          return this.dict.has(this.coordsToIndex(t, e))
        }
        set(t, e, r) {
          this.dict.set(this.coordsToIndex(e, r), t)
        }
        clear() {
          this.dict.clear()
        }
        coordsToIndex(t, e) {
          return e.toString() + "_" + t.toString()
        }
      },
      os = class {
        constructor(t) {
          this.data = t
        }
        get length() {
          return this.data.length
        }
        get(t) {
          return this.data[t]
        }
        set(t, e) {
          this.data[t] = e
        }
      },
      ss = {
        palette: {
          offset: 0,
          colors: []
        },
        chunkWidth: 0,
        chunkHeight: 0,
        worldWidth: 0,
        worldHeight: 0,
        haveStack: !1,
        stack: 0,
        minCd: 0,
        maxCd: 0,
        borders: new Go(0, 0, 0, 0)
      },
      is = class {
        constructor(t, e) {
          this.offset = t, this.colors = e, this.monochromes = this.colors.map((t => t.reduce(((t, e) => t + e)) / 3)), this.rgbToIdDict = Object.fromEntries(this.colors.map(((t, e) => [t.toString(), e]))), this.sameColorIds = Object.fromEntries(this.colors.map(((t, e) => [e, this.colors.findIndex(((r, n) => e !== n && t.every(((t, e) => t === r[e]))))])).filter((([, t]) => -1 !== t)))
        }
        monochrome(t) {
          return this.monochromes[t]
        }
        sameColors(t, e) {
          return t === e || this.sameColorIds[t] === e
        }
        same(t, e, r = 15) {
          return Math.abs(t[0] - e[0]) < r && Math.abs(t[1] - e[1]) < r && Math.abs(t[2] - e[2]) < r
        }
        strictSame(t, e) {
          return t[0] === e[0] && t[1] === e[1] && t[2] === e[2]
        }
        hasRGB(t) {
          return null !== this.rgbToId(t)
        }
        hasId(t) {
          return !!this.idToRGB(t)
        }
        idToRGB(t) {
          return this.colors[t]
        }
        convert(t, e, r) {
          let n = this.rgbToId([t, e, r]);
          if (null !== n) return n;
          let o = 0,
            s = 1 / 0;
          for (let n = this.offset; n !== this.colors.length; n++) {
            let i = this.colors[n],
              a = w(i[0] - t) + w(i[1] - e) + w(i[2] - r);
            a < s && (s = a, o = n)
          }
          return o
        }
        rgbToId(t) {
          return this.rgbToIdDict[t.toString()] ?? null
        }
      },
      as = (t, e) => t[0] === e[0] && t[1] === e[1],
      ls = (t, e) => t.some((t => as(t, e))),
      cs = or(Cr()),
      us = class {
        constructor(t) {
          this.low = t, this.workspaces = [], this.chunks = [];
          let {
            offset: e,
            colors: r
          } = this.info.palette;
          this.palette = new is(e, r)
        }
        get info() {
          return this.low.info
        }
        on(t, e) {
          return this.low.emitter.on(t, e)
        }
        emit(t, e) {
          return this.low.emitter.emit(t, e)
        }
        wait(t) {
          return this.low.emitter.wait(t)
        }
        getCaptcha() {
          return this.low.getCaptcha()
        }
        sendAnswer(t) {
          return this.low.sendAnswer(t)
        }
        getCooldown() {
          return this.low.timer.get()
        }
        pixelsCanPlace() {
          let t = Math.max(this.info.minCd, this.info.maxCd);
          return Math.floor((this.info.stack - this.getCooldown()) / t)
        }
        get(t, e) {
          return this.low.get(t, e)
        }
        compare(t) {
          let e = this.get(t.x, t.y);
          return this.palette.sameColors(e, t.id)
        }
        predictCooldown(t, e) {
          return this.low.predictCooldown(t, e)
        }
        createWorkspace(t, e, r, n) {
          return {
            x1: t,
            y1: e,
            x2: r,
            y2: n,
            chunks: this.low.getChunksCoords(t, e, r, n)
          }
        }
        hasWorkspace(t) {
          return this.workspaces.some((e => e.x1 === t.x1 && e.y1 === t.y1 && e.x2 === t.x2 && e.y2 === t.y2))
        }
        async changeWorkspace(t) {
          this.clearWorkspaces(), await this.addWorkspace(t)
        }
        async addWorkspace(t) {
          let e = t.chunks.filter((t => !ls(this.chunks, t)));
          await this.low.prepareChunks(e), this.chunks.push(...e), this.workspaces.push(t)
        }
        clearWorkspaces() {
          this.chunks.length && this.low.dropChunks(this.chunks), this.chunks = []
        }
        placePixels(t) {
          return this.low.placePixels(t)
        }
        async smartPlace(t, e) {
          for (t = t.slice(0);;) {
            if (e?.triggered) throw Ro;
            let r = t.shift();
            if (!r) break;
            await this.low.placePixels([r]);
            let n = (0, cs.default)(t);
            n && await this.waitBecausePixelsDistance(r, n)
          }
          e && e.destroy()
        }
        async download(t, e, r, n) {
          await this.low.prepareChunks(this.low.getChunksCoords(t, e, r, n));
          let o = r - t,
            s = n - e,
            i = H(o, s),
            a = i.getImageData(0, 0, o, s),
            l = a.data;
          for (let o = e, s = 0; o !== n; o++)
            for (let e = t; e !== r; e++, s += 4) {
              let t = this.palette.idToRGB(this.get(e, o));
              void 0 !== t ? (l.set(t, s), l[3 | s] = 255) : console.log("wrong id", this.get(e, o), "at", e, o)
            }
          i.putImageData(a, 0, 0);
          let c = new Date,
            u = c.getDate() + "-" + (c.getMonth() + 1) + "-" + c.getFullYear() + "_" + c.getHours() + ":" + c.getMinutes() + ":" + c.getSeconds();
          I(i.canvas, `${u}_${t}_${e}_${r}_${n}`)
        }
        destroy() {
          return this.low.destroy()
        }
        waitBecausePixelsDistance(t, e) {
          let r, n = Math.sqrt(w(t.x - e.x) + w(t.y - e.y));
          return r = 1 === n ? 50 : n < 1.5 ? 100 : 125 * n, v(Math.min(.75 * this.info.minCd, r))
        }
      },
      hs = or(Tr()),
      ps = 0,
      ds = 1,
      fs = 2,
      gs = 3,
      ys = 4,
      ms = 5,
      ws = 6,
      vs = 7,
      bs = 8,
      xs = 9,
      Cs = 10,
      Ps = 11,
      ks = 12,
      _s = 13,
      js = 14,
      Os = {
        errNoPlacePixelResult: new Error("errNoPlacePixelResult"),
        errMustAuth: new Error("errMustAuth"),
        errTooLowScore: new Error("errTooLowScore"),
        errPixelProtected: new Error("errPixelProtected"),
        errFullStack: new Error("errFullStack"),
        errCaptcha: new Error("errCaptcha"),
        errYouAreProxy: new Error("errYouAreProxy"),
        errCanvasAPIInteraction: new Error("errCanvasAPIInteraction"),
        errUnknownError: new Error("errUnknownError"),
        errAPIIsntReady: new Error("errAPIIsntReady"),
        errResponseIsntOk: new Error('response isnt "ok"'),
        errResponseStatusIsnt200: new Error("response status isnt 200"),
        errParallelPlace: new Error("errParallelPlace"),
        errYouAreBanned: new Error("errYouAreBanned")
      },
      As = {
        errCaptchaTimeout: new Error("You took too long, try again."),
        errInvalidSolution: new Error("No or invalid captcha text")
      },
      Ss = t => {
        let {
          size: e
        } = t;
        return {
          palette: {
            offset: t.cli,
            colors: t.colors
          },
          chunkWidth: 256,
          chunkHeight: 256,
          worldWidth: e,
          worldHeight: e,
          haveStack: !0,
          stack: t.cds,
          minCd: t.bcd,
          maxCd: t.pcd,
          borders: new Go(-e / 2, -e / 2, e / 2, e / 2)
        }
      },
      Es = (() => {
        if (!unsafeWindow?.ssv?.shard || "fuckyouarkeros.fun" === unsafeWindow.location.host) return "";
        let t = window.location.host.split(".");
        return t.length > 2 && t.shift(), `${unsafeWindow.ssv.shard}.${t.join(".")}`
      })(),
      Ms = Es && `${unsafeWindow.location.protocol}//${Es}`,
      Ts = t => t[0] << 8 | t[1],
      Is = t => [t >> 8, 255 & t],
      Ls = {
        REG_CANVAS_OP: 160,
        REG_CHUNK_OP: 161,
        DEREG_CHUNK_OP: 162,
        REG_MCHUNKS_OP: 163,
        DEREG_MCHUNKS_OP: 164,
        CHANGE_ME_OP: 166,
        ONLINE_COUNTER_OP: 167,
        PING_OP: 176,
        PIXEL_UPDATE_OP: 193,
        COOLDOWN_OP: 194,
        PIXEL_RETURN_OP: 195,
        CHUNK_UPDATE_MB_OP: 196,
        PIXEL_UPDATE_MB_OP: 197,
        CAPTCHA_RETURN_OP: 198
      },
      Ds = {
        ...Ls,
        PIXEL_UPDATE_OP: 145
      },
      Us = new class extends $o {
        constructor() {
          super(...arguments), this.call = this.emit
        }
      },
      zs = class {
        goto(t, e, r) {
          let n = location.hash.split(",").filter(Boolean)[0];
          location.hash && (location.hash = [n, ~~t, ~~e].join(",") + (r ? "," + ~~r : ""))
        }
      },
      Rs = async () => new zs, Ns = t(Ds), Ws = () => {
        setInterval((() => {
          let t = g("img[alt=CAPTCHA]");
          !t || t.hasAttribute("handled") || (t.style.filter = "invert(1) " + "sepia(1) ".repeat(10) + "grayscale(1)", t.setAttribute("handled", ""))
        }), 250), e()
      }, Bs = t(Ls), Fs = t(Ls), $s = {
        ...Ls,
        TIMESTAMP_OP: 168
      }, Hs = t => {
        let e = new ArrayBuffer(5),
          r = new DataView(e);
        return r.setUint8(0, $s.TIMESTAMP_OP), r.setInt32(1, +t.getTime().toString().slice(0, 5)), e
      }, Gs = class extends(t($s)) {
        constructor(t) {
          console.log("pixelya api constructor"), super(t), this.ws.on(0, (() => {
            console.log("send time"), this.ws.send(Hs(new Date))
          }))
        }
      }, Vs = t(Ls), Ys = t(Ls), qs = (0, Eo.default)(e), Xs = (0, Eo.default)(Ws), Ks = (0, Eo.default)(e), Zs = (0, Eo.default)(e), Qs = (0, Eo.default)(e), Js = (0, Eo.default)(e), ti = t => {
        let e = [];
        return t.iterateOverVisible(((t, r) => e.push([t, r]))), e
      }, ei = {
        random: t => C(ti(t)),
        line_upToDown: ti,
        line_downToUp: t => ti(t).reverse(),
        line_leftToRight: t => k(ti(t), (t => t[0])),
        line_RightToLeft: t => _(ti(t), (t => t[0])),
        circle_inToOut: t => {
          let e = t.localCenter,
            r = Math.floor(F(e, [t.width, t.height])) + 1,
            n = new Array(r).fill(0).map((() => []));
          return t.iterateOverVisible(((t, r) => {
            let o = [t, r],
              s = Math.trunc(F(e, o));
            n[s].push(o)
          })), n.map(C).flat()
        },
        circle_outToIn: t => ei.circle_inToOut(t).reverse(),
        throughLine: t => {
          let e = t.size;
          return _(ti(t), (t => 1 & t[1] ? t[0] + t[1] : t[0] + t[1] - e))
        },
        chess_1x1: t => {
          let e = t.size;
          return _(ti(t), (t => (1 & t[0]) != (1 & t[1]) ? t[1] + e : t[1]))
        },
        chess_2x2: t => {
          let e = t.size;
          return _(ti(t), (t => (3 & t[0] ^ 3 & t[1]) <= 1 ? t[1] - e : t[1]))
        },
        chess_3x3: t => {
          let e = t.size;
          return _(ti(t), (t => (7 & t[0] ^ 7 & t[1]) <= 3 ? t[1] - e : t[1]))
        },
        chessCorner_1x1: t => {
          let e = t.size;
          return _(ti(t), (t => (1 & t[0]) != (1 & t[1]) ? t[0] + t[1] + e : t[0] + t[1]))
        },
        woyken: t => {
          let e = t.size,
            [r, n] = t.localCenter;
          return k(ti(t), (o => {
            let s = o[0],
              i = o[1];
            if (0 !== s && 0 !== i && s !== t.width - 1 && i !== t.height - 1 && t.isOutline(s, i)) return -e + i;
            if ((s + i) % 8 == 0 || Math.abs(s - i) % 8 == 0) return i;
            let a = P(s - r) + P(i - n);
            return e - Math.trunc(Math.sqrt(a))
          }))
        },
        colorByColor: t => {
          let e = ti(t),
            r = {};
          e.forEach((e => {
            let n = t.get(e[0], e[1]),
              o = r[n];
            o ? o.push(e) : r[n] = [e]
          })), e = new Array(e.length);
          let n = t.size,
            o = [t.width / 2, t.height / 2],
            s = 0;
          return Object.values(r).forEach((t => {
            _(t, (t => n - Math.trunc(Math.sqrt(P(t[0] - o[0]) + P(t[1] - o[1]))))), t.forEach((t => e[s++] = t))
          })), e
        },
        squareBySquare: t => {
          let e = [];
          for (let r = 0; r < t.height; r += 8)
            for (let n = 0; n < t.width; n += 8)
              for (let o = r; o !== r + 8 && !(o >= t.height); o++)
                for (let r = n; r !== n + 8; r++) r >= t.width || t.isTransparent(r, o) || e.push([r, o]);
          return e
        },
        zipper: t => _(ti(t), (t => Math.trunc(Math.sqrt(t[0] + t[1])))),
        zipper2: t => _(ti(t), (e => Math.trunc(Math.sqrt(e[0] + e[1] - 3 * t.get(e[0], e[1]))))),
        rhombLine: t => {
          let [e, r] = t.localCenter;
          return ti(t).sort(((t, n) => Math.sin(Math.abs(t[0] - e) + Math.abs(t[1] - r)) - Math.sin(Math.abs(n[0] - e) + Math.abs(n[1] - r))))
        },
        rhombLine2: t => {
          let [e, r] = t.localCenter;
          return ti(t).sort(((t, n) => Math.tan(Math.abs(t[0] - e) + Math.abs(t[1] - r)) - Math.tan(Math.abs(n[0] - e) + Math.abs(n[1] - r))))
        },
        alienRandom: t => ti(t).sort(((t, e) => Math.tan(w(t[0] - e[1]) - w(t[1] - e[0])))),
        alien1: t => _(ti(t), (t => Math.tan(w(t[0]) + w(t[1])))),
        alien2: t => _(ti(t), (t => Math.exp(Math.cos(t[0] * t[1])))),
        alien3: t => {
          let e = new Map;
          return _(ti(t), (t => {
            let r = e.get(t[0]);
            return void 0 === r && (r = Math.pow(7, t[0] * Math.sin(t[0])), e.set(t[0], r)), r - Math.pow(t[0], 7 * Math.sin(t[1]))
          }))
        },
        alien4: t => {
          let e = new Map,
            r = new Map;
          return _(ti(t), (t => {
            let n = e.get(t[0]);
            void 0 === n && (n = Math.pow(Math.sin(t[0]), t[0]), e.set(t[0], n));
            let o = r.get(t[1]);
            return void 0 === o && (o = Math.pow(Math.cos(t[1]), t[1]), r.set(t[1], o)), n + o
          }))
        },
        complex: t => {
          let [e, s] = function(t, e) {
            let r = t.width - 1,
              n = t.height - 1,
              o = [],
              s = [];
            return e.forEach((e => {
              0 === e[0] || 0 === e[1] || e[0] === r || e[1] === n || t.isOutline(e[0], e[1]) ? o.push(e) : s.push(e)
            })), [o, s]
          }(t, ti(t)), i = Object.values(r(t, s)), a = k(Object.values(r(t, e)), (t => t.length));
          e = s = [];
          let l = i.map(n),
            c = [],
            u = [];
          for (let e = 0; e !== a.length; e++) {
            let r = a[e],
              s = n(r),
              h = t.get(r[0][0], r[0][1]);
            u.push(o(C(r)));
            let p = -1,
              d = 1 / 0;
            if (i.forEach(((e, r) => {
                let n = t.get(e[0][0], e[0][1]);
                if (h !== n || c.includes(r)) return;
                let o = F(s, l[r]);
                o < d && (d = o, p = r)
              })), -1 === p) {
              if (c.length === i.length) {
                u.push(...a.slice(e + 1).map(o));
                break
              }
              for (; - 1 === p;) p = Math.trunc(Math.random() * i.length), c.includes(p) && (p = -1)
            } else c.push(p), u.push(o(i[p]))
          }
          return [].concat(...u)
        },
        binary: t => _(ti(t), (t => t[0] & t[1])),
        near: t => o(C(ti(t)))
      }, ri = ei, ni = new Error("template unloaded"), oi = new Error("template unquantized"), si = class t extends Go {
        constructor(e) {
          super(e.x, e.y, e.x + (e.width ?? 0), e.y + (e.height ?? 0)), this.readyState = t.UNLOADED, this.ctx = null, this.ids = new Uint8Array(0), this.name = e.name
        }
        static {
          this.UNLOADED = 0
        }
        static {
          this.LOADING = 1
        }
        static {
          this.LOADED = 2
        }
        static {
          this.QUANTIZED = 3
        }
        get canvas() {
          return this.ctx?.canvas
        }
        get size() {
          return this.width * this.height
        }
        get(t, e) {
          return this.ids[t + e * this.width]
        }
        isTransparent(t, e) {
          return 255 === this.get(t, e)
        }
        iterateOverVisible(t) {
          for (let e = 0, r = 0; e !== this.height; e++)
            for (let n = 0; n !== this.width; n++, r++) {
              let o = this.ids[r];
              255 !== o && t(n, e, o)
            }
        }
        countTransparent() {
          if (this.readyState === t.QUANTIZED) {
            let t = 0;
            for (let e of this.ids) 255 === e && t++;
            return t
          }
          throw oi
        }
        isOutline(t, e) {
          let r = this.get(t, e);
          return this.get(t - 1, e - 1) !== r || this.get(t - 1, e) !== r || this.get(t - 1, e + 1) !== r || this.get(t, e - 1) !== r || this.get(t, e + 1) !== r || this.get(t + 1, e - 1) !== r || this.get(t + 1, e) !== r || this.get(t + 1, e + 1) !== r
        }
        intersects(t, e, r, n) {
          return this.x1 < r && this.x2 > t && this.y1 < n && this.y2 > e
        }
        async load(e) {
          this.readyState = t.LOADING;
          let r = await y(e);
          return this.width = r.width, this.height = r.height, this.ctx = H(this.width, this.height), this.ctx.drawImage(r, 0, 0), this.readyState = t.LOADED, this
        }
        quantize(e) {
          if (!this.ctx) throw ni;
          let r = this.ctx.getImageData(0, 0, this.width, this.height),
            n = r.data;
          this.ids = new Uint8Array(n.length >> 2);
          let o = new Map;
          for (let t = 0; t !== n.length; t += 4)
            if (0 === n[3 | t]) this.ids[t >> 2] = 255, n[0 | t] = n[1 | t] = n[2 | t] = n[3 | t] = 0;
            else {
              let r = n[0 | t] << 16 | n[1 | t] << 8 | n[2 | t],
                s = o.get(r);
              s || (s = e.convert(r >> 16, r >> 8 & 255, 255 & r), o.set(r, s)), this.ids[t >> 2] = s;
              let i = e.idToRGB(s);
              n[0 | t] = i[0], n[1 | t] = i[1], n[2 | t] = i[2], n[3 | t] = 255
            } return this.ctx.putImageData(r, 0, 0), this.readyState = t.QUANTIZED, this
        }
      }, ii = class {
        constructor(t, e) {
          this.api = t, this.template = e, this.template.readyState === si.LOADED && this.template.quantize(this.api.palette)
        }
        get width() {
          return this.template.width
        }
        get height() {
          return this.template.height
        }
        _countErrors() {
          let t = this.api.palette,
            e = 0,
            r = 0;
          return this.template.iterateOverVisible(((n, o, s) => {
            let i = n + this.template.x1,
              a = o + this.template.y1,
              l = this.api.get(i, a);
            t.sameColors(s, l) || (e++, r += this.api.predictCooldown(i, a))
          })), {
            errors: e,
            timeToEnd: r
          }
        }
        checkTarget(t) {
          return !this.api.palette.sameColors(this.template.get(t[0], t[1]), this.api.get(t[0] + this.template.x1, t[1] + this.template.y1))
        }
        handleTarget(t) {
          let e = this.template.get(t[0], t[1]),
            r = this.api.get(t[0] + this.template.x1, t[1] + this.template.y1);
          if (!this.api.palette.sameColors(e, r)) return {
            x: t[0] + this.template.x1,
            y: t[1] + this.template.y1,
            id: e
          }
        }
        targetToPixel(t) {
          return {
            x: t[0] + this.template.x1,
            y: t[1] + this.template.y1,
            id: this.template.get(t[0], t[1])
          }
        }
        pixelToTarget(t) {
          return [t.x - this.template.x1, t.y - this.template.y1]
        }
      }, ai = class {
        constructor(t) {
          this.max = t, this.value = 0
        }
        get() {
          return this.value
        }
        inc(t = 1) {
          for (let e = 0; e !== t; e++) this.value++, this.value === this.max && (this.value = 0);
          return this.value
        }
        deinc() {
          return this.value--, -1 === this.value && (this.value = this.max - 1), this.value
        }
      }, li = class extends ii {
        constructor(t, e, r) {
          super(t, e), this.targets = r(this.template), this.counter = new ai(this.targets.length)
        }
        nexts(t) {
          let e = this.targets.length,
            r = [],
            n = this.handleTarget(this.targets[this.counter.get()]);
          if (n && r.push(n) === t) return r;
          for (let n = 0; n !== e && 0 !== this.counter.get(); n++) {
            let e = this.handleTarget(this.targets[this.counter.deinc()]);
            if (!e) break;
            if (r.push(e) === t) return r
          }
          for (let n = 0; n !== e; n++) {
            let e = this.handleTarget(this.targets[this.counter.inc()]);
            if (e && r.push(e) === t) return r
          }
          return r
        }
        countErrors() {
          return this._countErrors()
        }
        countTargets() {
          return this.targets.length
        }
      }, ci = {};
    for (let t in ri) ci[t] = (e, r) => new li(e, r, ri[t]);
    if (d = (t, e, r) => "string" == typeof r ? r in ci ? ci[r](t, e) : void 0 : new li(t, e, r), f = (t, e) => {
        "Notification" in window && ("granted" === Notification.permission ? new Notification(t, e) : "denied" !== Notification.permission && Notification.requestPermission((r => "granted" === r && new Notification(t, e))))
      }, g = t => document.querySelector(t), y = t => new Promise(((e, r) => {
        let n = new Image;
        n.crossOrigin = "", n.onload = () => e(n), n.onerror = r, n.src = t
      })), m = t => t.split("").join("‎"), w = t => t * t, v = t => new Promise((e => setTimeout(e, t))), b = new RegExp(/-?\d+/g), x = t => t.match(b)?.map(parseFloat), C = t => {
        for (let e = t.length - 1; - 1 !== e; e--) {
          let r = Math.trunc(Math.random() * (e + 1)),
            n = t[e];
          t[e] = t[r], t[r] = n
        }
        return t
      }, P = t => w(Math.floor(t)), k = (t, e) => t.sort(((t, r) => e(t) > e(r) ? 1 : -1)), _ = (t, e) => t.sort(((t, r) => e(t) < e(r) ? 1 : -1)), j = t => {
        let e = 0;
        for (let r = 0; r !== t.length; r++) e = (e << 5) - e + t.charCodeAt(r), e |= 0;
        return e
      }, O = async () => {
        if (/.*:\/\/.*(pixelplanet)|(fuckyouarkeros)\.fun.*/.test(location.origin) || /localhost/.test(location.origin)) {
          let t = location.hash.match(/#[a-z]/g),
            e = t ? t[0][1] : "d",
            r = await Ns.getCanvasIdByCanvasIdent(e);
          return qs(), Promise.all([Ns.build(r), Rs()])
        }
        if (/.*:\/\/.*pixmap\.fun.*/.test(location.origin)) {
          let t = location.hash.match(/#[a-z]/g),
            e = t ? t[0][1] : "d",
            r = await Bs.getCanvasIdByCanvasIdent(e);
          return Xs(), Promise.all([Bs.build(r), Rs()])
        }
        if (/.*:\/\/.*chillpixel\.xyz.*/.test(location.origin)) {
          let t = location.hash.match(/#[a-z]/g),
            e = t ? t[0][1] : "d",
            r = await Fs.getCanvasIdByCanvasIdent(e);
          return Ks(), Promise.all([Fs.build(r), Rs()])
        }
        if (/.*:\/\/.*pixelya\.fun.*/.test(location.origin)) {
          let t = location.hash.match(/#[a-z]/g),
            e = t ? t[0][1] : "d",
            r = await Gs.getCanvasIdByCanvasIdent(e);
          return Zs(), Promise.all([Gs.build(r), Rs()])
        }
        if (/.*:\/\/.*canvasland\.net.*/.test(location.origin)) {
          let t = location.hash.match(/#[a-z]/g),
            e = t ? t[0][1] : "d",
            r = await Vs.getCanvasIdByCanvasIdent(e);
          return Qs(), Promise.all([Vs.build(r), Rs()])
        }
        if (/.*:\/\/.*globepixel\.fun.*/.test(location.origin)) {
          let t = location.hash.match(/#[a-z]/g),
            e = t ? t[0][1] : "d",
            r = await Ys.getCanvasIdByCanvasIdent(e);
          return Js(), Promise.all([Ys.build(r), Rs()])
        }
        throw Do
      }, A = (t, e) => t + Math.floor(Math.random() * (e - t)), S = t => t[t.length - 1], E = (t, e, r) => {
        let n = 0,
          o = 0,
          s = 0,
          i = 0,
          a = t => T(0, t, unsafeWindow.innerWidth - e.offsetWidth),
          l = t => T(0, t, unsafeWindow.innerHeight - e.offsetHeight);
        e.style.top = l(e.offsetTop) + "px", e.style.left = a(e.offsetLeft) + "px";
        let c = t => {
            t.preventDefault(), n = s - t.clientX, o = i - t.clientY, s = t.clientX, i = t.clientY, e.style.top = l(e.offsetTop - o) + "px", e.style.left = a(e.offsetLeft - n) + "px";
            let c = x(e.style.left),
              u = x(e.style.top);
            c && u && r?.(c[0], u[0])
          },
          u = () => {
            window.removeEventListener("mouseup", u), window.removeEventListener("mousemove", c)
          };
        t.addEventListener("mousedown", (t => {
          t.preventDefault(), s = t.clientX, i = t.clientY, window.addEventListener("mouseup", u), window.addEventListener("mousemove", c)
        }))
      }, M = null, document.addEventListener("keydown", (t => {
        M && (t.stopPropagation(), M(t))
      }), !0), M = null, T = (t, e, r) => Math.max(t, Math.min(e, r)), I = (t, e = "unnamed") => {
        let r = document.createElement("a");
        r.setAttribute("href", t.toDataURL("image/png")), r.setAttribute("download", e), r.click()
      }, L = (t, e = "unnamed") => {
        let r = document.createElement("a");
        r.setAttribute("href", "data:text/html;charset=utf-8," + encodeURIComponent(t)), r.setAttribute("download", e), r.click()
      }, D = t => {
        if (!(t instanceof li)) return;
        let {
          width: e,
          height: r,
          targets: n
        } = t, o = H(e, r), s = o.getImageData(0, 0, e, r), {
          data: i
        } = s;
        return n.forEach(((t, r) => {
          let o = Math.floor((n.length - r) / n.length * 255),
            s = t[1] * e + t[0] << 2;
          i[0 | s] = o, i[3 | s] = 255
        })), o.putImageData(s, 0, 0), o
      }, U = t => {
        if (!(t instanceof li)) return;
        let {
          width: e,
          height: r,
          targets: n
        } = t, o = new Array(n.length << 1), s = new Array(n.length);
        n.forEach(((e, r) => {
          o[r << 1] = e[0].toString(), o[r << 1 | 1] = e[1].toString(), s[r] = t.template.get(e[0], e[1]).toString()
        }));
        let i = t.api.palette.colors.flat();
        return `\n\t\t<!DOCTYPE html>\n\t\t<html>\n\t\t\t<body style="background: black;">\n\t\t\t\t<div style="position: absolute; top: 0; left: 0; height: 100%">\n\t\t\t\t\t<canvas style="height: 100%; border: 1px red solid; background: rgba(64, 64, 64, 0.3);"></canvas>\n\t\t\t\t</div>\n\t\t\t\t<script>\n\t\t\t\t\tconst width = ${e};\n\t\t\t\t\tconst height = ${r};\n\t\t\t\t\tconst ctx = document.querySelector('canvas').getContext('2d');\n\t\t\t\t\tctx.canvas.width = width;\n\t\t\t\t\tctx.canvas.height = height;\n\t\t\t\t\tctx.clearRect(0, 0, width, height);\n\n\t\t\t\t\tctx.mozImageSmoothingEnabled = false;\n\t\t\t\t\tctx.webkitImageSmoothingEnabled = false;\n\t\t\t\t\tctx.msImageSmoothingEnabled = false;\n\t\t\t\t\tctx.imageSmoothingEnabled = false;\n\n\t\t\t\t\tconst delay = 100;\n\t\t\t\t\tconst pixelsAtOnce = 10;\n\n\t\t\t\t\tconst targets = new Uint16Array([${o.join(",")}]);\n\t\t\t\t\tconst colors = new Uint8Array([${s.join(",")}]);\n\t\t\t\t\tconst palette = new Uint8Array([${i.join(",")}]);\n\n\t\t\t\t\t(async () => {\n\t\t\t\t\t\tlet prevClrId = -1;\n\t\t\t\t\t\tfor (let i = 0; i !== targets.length; i+=2) {\n\t\t\t\t\t\t\tconst id = colors[i >> 1];\n\t\t\t\t\t\t\tif (prevClrId !== id) {\n\t\t\t\t\t\t\t\tconst j = id * 3;\n\t\t\t\t\t\t\t\tctx.fillStyle = 'rgb(' + [palette[j], palette[j + 1], palette[j + 2]] + ')';\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tctx.fillRect(targets[i], targets[i | 1], 1, 1)\n\t\t\t\t\t\t\tconst a = (i >> 1) / pixelsAtOnce;\n\t\t\t\t\t\t\tif (~~a === a) {\n\t\t\t\t\t\t\t\tawait new Promise(r => setTimeout(r, delay));\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t})();\n\t\t\t\t<\/script>\n\t\t\t</body>\n\t\t</html>`
      }, z = async ({
        delay: t,
        func: e,
        maxAttempts: r,
        onerror: n
      }) => {
        let o = 0;
        for (; o < r;) try {
          return await e()
        } catch (e) {
          o++, n?.(e), await v(t)
        }
        throw Bo
      }, R = t => new Promise((e => {
        let r = document.createElement("input");
        r.type = "file", t && (r.accept = t), r.addEventListener("change", (() => e(r.files?.length ? r.files[0] : null))), r.click()
      })), N = () => "image/*", W = () => R(N()), B = t => t[~~(Math.random() * t.length)], F = (t, e) => w(t[0] - e[0]) + w(t[1] - e[1]), $ = t => {
        let e = new Uint8Array(t.length);
        for (let r = 0; r !== t.length; r++) e[r] = t.charCodeAt(r);
        return e
      }, H = (t, e) => {
        let r = document.createElement("canvas").getContext("2d");
        return r.canvas.width = t, r.canvas.height = e, r
      }, G = (...t) => fetch(...t).then((t => t.json())), V = or(Ir()), Y = class extends $o {
        constructor(t, e) {
          super(), this.ws = new Ho(t, {
            reconnectDelay: 3e3,
            hideReconnectErrors: !1,
            ...e
          }), this.ws.on(0, (() => console.log("connected to void server"))), this.ws.on(1, (() => console.log("disconnected from void server"))), this.ws.on(3, (t => {
            let e = $((0, V.decompressFromBase64)(t)),
              r = e[0],
              n = e.slice(1).buffer;
            0 === r ? this.emit(0, this.deserializeOnlinePacket(n)) : console.warn(`undefined void server opcode "${r}"`)
          })), this.ws.connect()
        }
        deserializeOnlinePacket(t) {
          let e = new Uint8Array(t);
          return {
            connections: e[0] | e[1] << 8,
            users: e[2] | e[3] << 8
          }
        }
      }, q = "zipper2", X = {
        smartPlace: !0,
        showErrors: !0
      }, K = !0, Z = !0, Q = [16, 16], J = 1, tt = 3, et = {}, nt = "http://www.w3.org/2000/svg", ot = t => t, st = (rt = []).map, it = Array.isArray, at = typeof requestAnimationFrame < "u" ? requestAnimationFrame : setTimeout, lt = t => {
        var e, r, n = "";
        if ("string" == typeof t) return t;
        if (it(t))
          for (e = 0; e < t.length; e++)(r = lt(t[e])) && (n += (n && " ") + r);
        else
          for (e in t) t[e] && (n += (n && " ") + e);
        return n
      }, ct = (t, e) => {
        for (var r in {
            ...t,
            ...e
          })
          if ("function" == typeof(it(t[r]) ? t[r][0] : t[r])) e[r] = t[r];
          else if (t[r] !== e[r]) return !0
      }, ut = (t, e = rt, r) => {
        for (var n, o, s = [], i = 0; i < t.length || i < e.length; i++) n = t[i], o = e[i], s.push(o && !0 !== o ? !n || o[0] !== n[0] || ct(o[1], n[1]) ? [o[0], o[1], (n && n[2](), o[0](r, o[1]))] : n : n && n[2]());
        return s
      }, ht = t => null == t ? t : t.key, pt = (t, e, r, n, o, s) => {
        if ("style" === e)
          for (var i in {
              ...r,
              ...n
            }) r = null == n || null == n[i] ? "" : n[i], "-" === i[0] ? t[e].setProperty(i, r) : t[e][i] = r;
        else "o" === e[0] && "n" === e[1] ? ((t.events || (t.events = {}))[e = e.slice(2)] = n) ? r || t.addEventListener(e, o) : t.removeEventListener(e, o) : !s && "list" !== e && "form" !== e && e in t ? t[e] = n ?? "" : null == n || !1 === n ? t.removeAttribute(e) : t.setAttribute(e, n)
      }, dt = (t, e, r) => {
        var n, o, s = t.props,
          i = t.type === tt ? document.createTextNode(t.tag) : (r = r || "svg" === t.tag) ? document.createElementNS(nt, t.tag, s.is && s) : document.createElement(t.tag, s.is && s);
        for (n in s) pt(i, n, null, s[n], e, r);
        for (o = 0; o < t.children.length; o++) i.appendChild(dt(t.children[o] = yt(t.children[o]), e, r));
        return t.node = i
      }, ft = (t, e, r, n, o, s) => {
        var i, a, l, c, u, h, p, d, f, g, y, m, w, v, b;
        if (r !== n)
          if (null != r && r.type === tt && n.type === tt) r.tag !== n.tag && (e.nodeValue = n.tag);
          else if (null == r || r.tag !== n.tag) e = t.insertBefore(dt(n = yt(n), o, s), e), null != r && t.removeChild(r.node);
        else {
          for (w in u = r.props, h = n.props, p = r.children, d = n.children, f = 0, g = 0, y = p.length - 1, m = d.length - 1, s = s || "svg" === n.tag, {
              ...u,
              ...h
            })("value" === w || "selected" === w || "checked" === w ? e[w] : u[w]) !== h[w] && pt(e, w, u[w], h[w], o, s);
          for (; g <= m && f <= y && null != (l = ht(p[f])) && l === ht(d[g]);) ft(e, p[f].node, p[f], d[g] = yt(d[g++], p[f++]), o, s);
          for (; g <= m && f <= y && null != (l = ht(p[y])) && l === ht(d[m]);) ft(e, p[y].node, p[y], d[m] = yt(d[m--], p[y--]), o, s);
          if (f > y)
            for (; g <= m;) e.insertBefore(dt(d[g] = yt(d[g++]), o, s), (a = p[f]) && a.node);
          else if (g > m)
            for (; f <= y;) e.removeChild(p[f++].node);
          else {
            for (v = {}, b = {}, w = f; w <= y; w++) null != (l = p[w].key) && (v[l] = p[w]);
            for (; g <= m;) l = ht(a = p[f]), c = ht(d[g] = yt(d[g], a)), b[l] || null != c && c === ht(p[f + 1]) ? (null == l && e.removeChild(a.node), f++) : null == c || r.type === J ? (null == l && (ft(e, a && a.node, a, d[g], o, s), g++), f++) : (l === c ? (ft(e, a.node, a, d[g], o, s), b[c] = !0, f++) : null != (i = v[c]) ? (ft(e, e.insertBefore(i.node, a && a.node), i, d[g], o, s), b[c] = !0) : ft(e, a && a.node, null, d[g], o, s), g++);
            for (; f <= y;) null == ht(a = p[f++]) && e.removeChild(a.node);
            for (w in v) null == b[w] && e.removeChild(v[w].node)
          }
        }
        return n.node = e
      }, gt = (t, e) => {
        var r;
        for (r in t)
          if (t[r] !== e[r]) return !0;
        for (r in e)
          if (t[r] !== e[r]) return !0
      }, yt = (t, e) => !0 !== t && !1 !== t && t ? "function" == typeof t.tag ? ((!e || null == e.memo || gt(e.memo, t.memo)) && ((e = t.tag(t.memo)).memo = t.memo), e) : t : vt(""), mt = t => t.nodeType === tt ? vt(t.nodeValue, t) : wt(t.nodeName.toLowerCase(), et, st.call(t.childNodes, mt), J, t), wt = (t, {
        key: e,
        ...r
      }, n, o, s) => ({
        tag: t,
        props: r,
        key: e,
        children: n,
        type: o,
        node: s
      }), vt = (t, e) => wt(t, et, rt, tt, e), bt = (t, {
        class: e,
        ...r
      }, n = rt) => wt(t, {
        ...r,
        ...e ? {
          class: lt(e)
        } : et
      }, it(n) ? n : [n]), xt = ({
        node: t,
        view: e,
        subscriptions: r,
        dispatch: n = ot,
        init: o = et
      }) => {
        var s, i, a = t && mt(t),
          l = [],
          c = t => {
            s !== t && (null == (s = t) && (n = r = u = ot), r && (l = ut(l, r(s), n)), e && !i && at(u, i = !0))
          },
          u = () => t = ft(t.parentNode, t, a, a = e(s), h, i = !1),
          h = function(t) {
            n(this.events[t.type], t)
          };
        return (n = n(((t, e) => "function" == typeof t ? n(t(s, e)) : it(t) ? "function" == typeof t[0] ? n(t[0], t[1]) : t.slice(1).map((t => t && !0 !== t && (t[0] || t)(n, t[1])), c(t[0])) : c(t))))(o), n
      }, Pt = "green", _t = {
        width: "100%"
      }, jt = {
        fontFamily: "monospace"
      }, Ot = {
        cursor: "pointer"
      }, At = {
        display: "flex",
        alignItems: "center",
        justifyContent: "content"
      }, St = t => ({
        width: `${t}px`,
        height: `${t}px`
      }), Et = {
        color: "red",
        position: "absolute",
        fontWeight: "bolder",
        fontFamily: "system-ui",
        fontSize: "14px",
        width: "400px",
        background: kt = "rgba(0, 0, 0, 0.9)",
        padding: "4px",
        border: "1px solid",
        borderColor: Ct = "darkred",
        display: "flex",
        flexDirection: "column",
        gap: "2px"
      }, Mt = {
        fontWeight: "bold",
        fontSize: "18px"
      }, Tt = {
        cursor: "move",
        display: "flex",
        justifyContent: "space-between"
      }, It = {
        display: "inline-flex",
        color: "red",
        columnGap: "5px"
      }, Lt = {
        background: "red",
        height: "1px",
        marginTop: "2px",
        marginBottom: "2px"
      }, Dt = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "auto 1fr",
        rowGap: "6px",
        columnGap: "10px"
      }, Ut = {
        ...{
          fontWeight: "bold",
          fontSize: "14px"
        },
        textTransform: "uppercase"
      }, zt = {
        overflow: "hidden",
        paddingLeft: "5px",
        display: "flex",
        flexDirection: "column",
        gap: "5px"
      }, Rt = {
        color: "inherit",
        ..._t,
        ...jt,
        fontWeight: "inherit",
        background: "transparent",
        outline: "none",
        padding: "1px 2px 1px 2px",
        margin: "0",
        borderRadius: "initial",
        border: "rgb(118,118,118) 2px inset"
      }, Nt = {
        display: "flex",
        gap: "5px",
        flexDirection: "row"
      }, Wt = {
        display: "flex",
        gap: "4px"
      }, Bt = {
        display: "flex",
        gap: "4px",
        alignItems: "center"
      }, Ft = {
        background: "black"
      }, $t = {
        background: "inherit",
        ..._t,
        color: "inherit",
        cursor: "pointer",
        borderColor: Ct,
        font: "inherit",
        outline: "none",
        padding: "0",
        margin: "0",
        borderRadius: "0"
      }, Ht = {
        ...jt,
        display: "inline-flex",
        gap: "5px",
        alignItems: "center"
      }, Gt = {
        width: "",
        ...St(14)
      }, Vt = {
        lineHeight: "90%"
      }, Yt = {
        ...Ot,
        cursor: "pointer",
        display: "flex",
        gap: "5px",
        alignItems: "center"
      }, qt = {
        opacity: "0.6",
        fontSize: "12px",
        lineHeight: "20px"
      }, Xt = {
        borderColor: Ct,
        backgroundColor: "transparent",
        color: "inherit",
        font: "inherit",
        borderWidth: "1px",
        borderStyle: "solid",
        padding: "2px",
        cursor: "pointer",
        width: "fit-content"
      }, Kt = t => vt(m(t)), Zt = ({
        size: t
      }) => ({
        stroke: "currentColor",
        fill: "currentColor",
        "stroke-width": "0",
        height: `${t}px`,
        width: `${t}px`,
        xmlns: "http://www.w3.org/2000/svg",
        role: "img"
      }), Qt = ({
        style: t,
        size: e
      }) => bt("svg", {
        style: t,
        viewBox: "0 0 24 24",
        ...Zt({
          size: e
        })
      }, bt("path", {
        d: "M15 4H5V20H19V8H15V4ZM3 2.9918C3 2.44405 3.44749 2 3.9985 2H16L20.9997 7L21 20.9925C21 21.5489 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918ZM13 12V16H11V12H8L12 8L16 12H13Z"
      })), Jt = ({
        style: t,
        size: e
      }) => bt("svg", {
        style: t,
        viewBox: "0 0 15 15",
        ...Zt({
          size: e
        })
      }, bt("path", {
        "fill-rule": "evenodd",
        "clip-rule": "evenodd",
        fill: "currentColor",
        d: "M5.07451 1.82584C5.03267 1.81926 4.99014 1.81825 4.94803 1.82284C4.10683 1.91446 2.82673 2.36828 2.07115 2.77808C2.02106 2.80525 1.97621 2.84112 1.93869 2.88402C1.62502 3.24266 1.34046 3.82836 1.11706 4.38186C0.887447 4.95076 0.697293 5.55032 0.588937 5.98354C0.236232 7.39369 0.042502 9.08728 0.0174948 10.6925C0.0162429 10.7729 0.0351883 10.8523 0.0725931 10.9234C0.373679 11.496 1.02015 12.027 1.66809 12.4152C2.32332 12.8078 3.08732 13.1182 3.70385 13.1778C3.85335 13.1922 4.00098 13.1358 4.10282 13.0255C4.2572 12.8581 4.5193 12.4676 4.71745 12.1643C4.80739 12.0267 4.89157 11.8953 4.95845 11.7901C5.62023 11.9106 6.45043 11.9801 7.50002 11.9801C8.54844 11.9801 9.37796 11.9107 10.0394 11.7905C10.1062 11.8957 10.1903 12.0269 10.2801 12.1643C10.4783 12.4676 10.7404 12.8581 10.8947 13.0255C10.9966 13.1358 11.1442 13.1922 11.2937 13.1778C11.9102 13.1182 12.6742 12.8078 13.3295 12.4152C13.9774 12.027 14.6239 11.496 14.925 10.9234C14.9624 10.8523 14.9813 10.7729 14.9801 10.6925C14.9551 9.08728 14.7613 7.39369 14.4086 5.98354C14.3003 5.55032 14.1101 4.95076 13.8805 4.38186C13.6571 3.82836 13.3725 3.24266 13.0589 2.88402C13.0214 2.84112 12.9765 2.80525 12.9264 2.77808C12.1708 2.36828 10.8907 1.91446 10.0495 1.82284C10.0074 1.81825 9.96489 1.81926 9.92305 1.82584C9.71676 1.85825 9.5391 1.96458 9.40809 2.06355C9.26977 2.16804 9.1413 2.29668 9.0304 2.42682C8.86968 2.61544 8.71437 2.84488 8.61428 3.06225C8.27237 3.03501 7.90138 3.02 7.5 3.02C7.0977 3.02 6.72593 3.03508 6.38337 3.06244C6.28328 2.84501 6.12792 2.61549 5.96716 2.42682C5.85626 2.29668 5.72778 2.16804 5.58947 2.06355C5.45846 1.96458 5.2808 1.85825 5.07451 1.82584ZM11.0181 11.5382C11.0395 11.5713 11.0615 11.6051 11.0838 11.6392C11.2169 11.843 11.3487 12.0385 11.4508 12.1809C11.8475 12.0916 12.352 11.8818 12.8361 11.5917C13.3795 11.2661 13.8098 10.8918 14.0177 10.5739C13.9852 9.06758 13.7993 7.50369 13.4773 6.21648C13.38 5.82759 13.2038 5.27021 12.9903 4.74117C12.7893 4.24326 12.5753 3.82162 12.388 3.5792C11.7376 3.24219 10.7129 2.88582 10.0454 2.78987C10.0308 2.79839 10.0113 2.81102 9.98675 2.82955C9.91863 2.881 9.84018 2.95666 9.76111 3.04945C9.71959 3.09817 9.68166 3.1471 9.64768 3.19449C9.953 3.25031 10.2253 3.3171 10.4662 3.39123C11.1499 3.6016 11.6428 3.89039 11.884 4.212C12.0431 4.42408 12.0001 4.72494 11.788 4.884C11.5759 5.04306 11.2751 5.00008 11.116 4.788C11.0572 4.70961 10.8001 4.4984 10.1838 4.30877C9.58933 4.12585 8.71356 3.98 7.5 3.98C6.28644 3.98 5.41067 4.12585 4.81616 4.30877C4.19988 4.4984 3.94279 4.70961 3.884 4.788C3.72494 5.00008 3.42408 5.04306 3.212 4.884C2.99992 4.72494 2.95694 4.42408 3.116 4.212C3.35721 3.89039 3.85011 3.6016 4.53383 3.39123C4.77418 3.31727 5.04571 3.25062 5.35016 3.19488C5.31611 3.14738 5.27808 3.09831 5.23645 3.04945C5.15738 2.95666 5.07893 2.881 5.01081 2.82955C4.98628 2.81102 4.96674 2.79839 4.95217 2.78987C4.28464 2.88582 3.25999 3.24219 2.60954 3.5792C2.42226 3.82162 2.20825 4.24326 2.00729 4.74117C1.79376 5.27021 1.61752 5.82759 1.52025 6.21648C1.19829 7.50369 1.01236 9.06758 0.97986 10.5739C1.18772 10.8918 1.61807 11.2661 2.16148 11.5917C2.64557 11.8818 3.15003 12.0916 3.5468 12.1809C3.64885 12.0385 3.78065 11.843 3.9138 11.6392C3.93626 11.6048 3.95838 11.5708 3.97996 11.5375C3.19521 11.2591 2.77361 10.8758 2.50064 10.4664C2.35359 10.2458 2.4132 9.94778 2.63377 9.80074C2.85435 9.65369 3.15236 9.71329 3.29941 9.93387C3.56077 10.3259 4.24355 11.0201 7.50002 11.0201C10.7565 11.0201 11.4392 10.326 11.7006 9.93386C11.8477 9.71329 12.1457 9.65369 12.3663 9.80074C12.5869 9.94779 12.6465 10.2458 12.4994 10.4664C12.2262 10.8762 11.8041 11.2598 11.0181 11.5382ZM4.08049 7.01221C4.32412 6.74984 4.65476 6.60162 5.00007 6.59998C5.34538 6.60162 5.67603 6.74984 5.91966 7.01221C6.16329 7.27459 6.30007 7.62974 6.30007 7.99998C6.30007 8.37021 6.16329 8.72536 5.91966 8.98774C5.67603 9.25011 5.34538 9.39833 5.00007 9.39998C4.65476 9.39833 4.32412 9.25011 4.08049 8.98774C3.83685 8.72536 3.70007 8.37021 3.70007 7.99998C3.70007 7.62974 3.83685 7.27459 4.08049 7.01221ZM9.99885 6.59998C9.65354 6.60162 9.3229 6.74984 9.07926 7.01221C8.83563 7.27459 8.69885 7.62974 8.69885 7.99998C8.69885 8.37021 8.83563 8.72536 9.07926 8.98774C9.3229 9.25011 9.65354 9.39833 9.99885 9.39998C10.3442 9.39833 10.6748 9.25011 10.9184 8.98774C11.1621 8.72536 11.2989 8.37021 11.2989 7.99998C11.2989 7.62974 11.1621 7.27459 10.9184 7.01221C10.6748 6.74984 10.3442 6.60162 9.99885 6.59998Z"
      })), te = ({
        style: t,
        size: e
      }) => bt("svg", {
        style: t,
        viewBox: "0 0 24 24",
        ...Zt({
          size: e
        })
      }, bt("path", {
        d: "M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm3.163 21.783h-.093a.513.513 0 0 1-.382-.14.513.513 0 0 1-.14-.372v-1.406c.006-.467.01-.94.01-1.416a3.693 3.693 0 0 0-.151-1.028 1.832 1.832 0 0 0-.542-.875 8.014 8.014 0 0 0 2.038-.471 4.051 4.051 0 0 0 1.466-.964c.407-.427.71-.943.885-1.506a6.77 6.77 0 0 0 .3-2.13 4.138 4.138 0 0 0-.26-1.476 3.892 3.892 0 0 0-.795-1.284 2.81 2.81 0 0 0 .162-.582c.033-.2.05-.402.05-.604 0-.26-.03-.52-.09-.773a5.309 5.309 0 0 0-.221-.763.293.293 0 0 0-.111-.02h-.11c-.23.002-.456.04-.674.111a5.34 5.34 0 0 0-.703.26 6.503 6.503 0 0 0-.661.343c-.215.127-.405.249-.573.362a9.578 9.578 0 0 0-5.143 0 13.507 13.507 0 0 0-.572-.362 6.022 6.022 0 0 0-.672-.342 4.516 4.516 0 0 0-.705-.261 2.203 2.203 0 0 0-.662-.111h-.11a.29.29 0 0 0-.11.02 5.844 5.844 0 0 0-.23.763c-.054.254-.08.513-.081.773 0 .202.017.404.051.604.033.199.086.394.16.582A3.888 3.888 0 0 0 5.702 10a4.142 4.142 0 0 0-.263 1.476 6.871 6.871 0 0 0 .292 2.12c.181.563.483 1.08.884 1.516.415.422.915.75 1.466.964.653.25 1.337.41 2.033.476a1.828 1.828 0 0 0-.452.633 2.99 2.99 0 0 0-.2.744 2.754 2.754 0 0 1-1.175.27 1.788 1.788 0 0 1-1.065-.3 2.904 2.904 0 0 1-.752-.824 3.1 3.1 0 0 0-.292-.382 2.693 2.693 0 0 0-.372-.343 1.841 1.841 0 0 0-.432-.24 1.2 1.2 0 0 0-.481-.101c-.04.001-.08.005-.12.01a.649.649 0 0 0-.162.02.408.408 0 0 0-.13.06.116.116 0 0 0-.06.1.33.33 0 0 0 .14.242c.093.074.17.131.232.171l.03.021c.133.103.261.214.382.333.112.098.213.209.3.33.09.119.168.246.231.381.073.134.15.288.231.463.188.474.522.875.954 1.145.453.243.961.364 1.476.351.174 0 .349-.01.522-.03.172-.028.343-.057.515-.091v1.743a.5.5 0 0 1-.533.521h-.062a10.286 10.286 0 1 1 6.324 0v.005z"
      })), ee = ({
        style: t,
        size: e
      }) => bt("svg", {
        style: t,
        viewBox: "0 0 576 512",
        ...Zt({
          size: e
        })
      }, bt("path", {
        d: "M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z"
      })), re = ({
        style: t,
        size: e
      }) => bt("svg", {
        style: t,
        viewBox: "0 0 24 24",
        ...Zt({
          size: e
        })
      }, [bt("path", {
        d: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"
      }), bt("circle", {
        cx: "12",
        cy: "9",
        r: "2.5"
      })]), ne = ({
        style: t,
        size: e
      }) => bt("svg", {
        style: t,
        viewBox: "0 0 24 24",
        ...Zt({
          size: e
        }),
        fill: "none",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }, [bt("path", {
        d: "M20.5 10a2.5 2.5 0 0 1-2.4-3H18a2.95 2.95 0 0 1-2.6-4.4 10 10 0 1 0 6.3 7.1c-.3.2-.8.3-1.2.3"
      }), bt("circle", {
        cx: "12",
        cy: "12",
        r: "3"
      })]), oe = 100, se = {
        position: "fixed",
        display: "flex",
        pointerEvents: "none",
        backgroundColor: kt,
        imageRendering: "pixelated"
      }, ie = {
        width: "100%",
        height: "100%",
        objectFit: "contain"
      }, ae = ({
        state: t
      }) => bt("div", {
        style: {
          ...se,
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: Ct,
          width: `${oe}px`,
          height: `${oe}px`,
          ...t.showTemplate && t.templateSrc ? {
            top: `${t.mouseClientY}px`,
            left: `${t.mouseClientX}px`
          } : {
            display: "none"
          }
        }
      }, bt("img", {
        src: t.templateSrc,
        style: ie
      })), le = {
        width: "100%",
        overflow: "hidden"
      }, ce = {
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: "5px",
        alignItems: "center",
        overflow: "hidden",
        ...Ot,
        borderColor: Ct,
        padding: "2px",
        borderWidth: "1px",
        borderStyle: "solid"
      }, ue = ({
        state: t,
        onChange: e
      }) => bt("div", {
        style: ce,
        onclick: t => (W().then((async t => {
          t && async function(t) {
            return new Promise((e => {
              let r = new FileReader;
              r.onload = async () => e(r.result), r.readAsDataURL(t)
            }))
          }(t).then((t => {
            Us.emit(0, t), e(t)
          }))
        })), t)
      }, [Qt({
        size: 20
      }), null === t.templateSrc ? bt("span", {}, vt("click to upload")) : bt("span", {
        style: le
      }, vt(t.templateSrc.slice(0, 100))), bt("div", {
        style: {
          ...At,
          cursor: "none"
        },
        onmouseenter: t => ({
          ...t,
          showTemplate: !0
        }),
        onmouseleave: t => ({
          ...t,
          showTemplate: !1
        })
      }, ee({
        size: 20
      })), ae({
        state: t
      })]), he = ({
        state: t
      }) => bt("button", {
        style: {
          ...Xt,
          borderColor: t.botWorksNow ? Pt : Ct
        },
        onclick: t => (Us.emit(2), t)
      }, Kt("stop/start")), pe = ({
        style: t,
        href: e,
        childs: r
      }) => bt("a", {
        style: {
          color: "inherit",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          ...t
        },
        href: e,
        target: "_blank"
      }, r), de = ({
        style: t,
        size: e
      }) => pe({
        style: t,
        href: Zo,
        childs: Jt({
          size: e
        })
      }), fe = ({
        style: t,
        size: e
      }) => pe({
        style: t,
        href: Qo,
        childs: te({
          size: e
        })
      }), ge = ({
        style: t,
        size: e
      }) => pe({
        style: t,
        href: Ko,
        childs: ne({
          size: e
        })
      }), ye = ({
        state: t
      }) => bt("div", {
        style: Yt,
        onclick: t => (Us.emit(5, !t.stopOnCaptcha), {
          ...t,
          stopOnCaptcha: !t.stopOnCaptcha
        })
      }, [bt("span", {}, Kt("stop on captcha")), bt("input", {
        type: "checkbox",
        checked: t.stopOnCaptcha,
        style: {
          cursor: "pointer"
        }
      })]), me = {
        lineHeight: "90%"
      }, we = ({
        state: t
      }) => bt("div", {
        style: me,
        title: "connections (users)"
      }, [Kt("online: "), bt("span", {
        style: jt
      }, t.online ? Kt(`${t.online.connections}(${t.online.users})`) : vt("-"))]), ve = () => bt("button", {
        style: Xt,
        onclick: t => (Us.emit(8), t)
      }, Kt("heatmap")), be = () => bt("button", {
        style: Xt,
        onclick: t => (Us.emit(9), t)
      }, Kt("heatweb")), xe = ({
        state: t
      }) => bt("div", {
        style: Yt,
        onclick: t => (Us.emit(7, !t.advancedMode), {
          ...t,
          advancedMode: !t.advancedMode
        })
      }, [bt("span", {}, Kt("advanced")), bt("input", {
        type: "checkbox",
        checked: t.advancedMode,
        style: {
          cursor: "pointer"
        }
      })]), Ce = or(zr()), Pe = ({
        state: t,
        style: e
      }) => {
        let r = (0, Ce.default)(t.botStatus) ? `${t.botStatus.message} ${t.botStatus.stack??""}` : t.botStatus;
        return bt("div", {
          ...(0, Ce.default)(t.botStatus) && {
            title: "click to copy error",
            onclick: t => (navigator.clipboard.writeText(r), t)
          },
          style: {
            ...(0, Ce.default)(t.botStatus) && {
              cursor: "pointer"
            },
            ...e,
            display: "flex",
            gap: "0.5em",
            flexDirection: "row",
            alignItems: "baseline",
            overflow: "hidden"
          }
        }, [bt("span", {}, Kt("status: ")), bt("span", {
          style: {
            textOverflow: "ellipsis",
            textWrap: "nowrap",
            ...jt,
            overflow: "hidden"
          }
        }, vt(r))])
      }, ke = or(zr()), (_e = {
        storage: new class extends Fo {
          constructor(t) {
            super(), this.localStorageData = {}, this.data = {}, this.localStorageKey = "storage", t && t.localStorageKey && (this.localStorageKey = t.localStorageKey), this.load()
          }
          set(t, e, r = !0) {
            if (r && t in this.data || !r && t in this.localStorageData) throw new Error(`try to duplicate field "${t}" with value "${e}"`);
            r ? (this.emit("beforeChangeLC." + t, e), this.localStorageData[t] = e, this.save(), this.emit("afterChangeLC." + t, e)) : (this.emit("beforeChange." + t, e), this.data[t] = e, this.emit("afterChange." + t, e))
          }
          get(t) {
            return t in this.data ? this.data[t] : t in this.localStorageData ? this.localStorageData[t] : null
          }
          has(t) {
            return t in this.data || t in this.localStorageData
          }
          save() {
            Object.keys(this.localStorageData).length && localStorage.setItem(this.localStorageKey, JSON.stringify(this.localStorageData))
          }
          load() {
            let t = localStorage.getItem(this.localStorageKey);
            null !== t && (this.localStorageData = JSON.parse(t))
          }
        }({
          localStorageKey: ts
        }),
        csa: null
      }).storage.has("strategy") || _e.storage.set("strategy", q), _e.storage.has("stopOnCaptcha") || _e.storage.set("stopOnCaptcha", K), _e.storage.has("smartPlace") || _e.storage.set("smartPlace", K), je = ({
        state: t,
        style: e
      }) => bt("div", {
        style: {
          ...t.placedPixel && {
            cursor: "pointer"
          },
          ...e
        },
        onclick: t => (t.placedPixel && _e.csa?.goto(...t.placedPixel), t)
      }, [Kt("placed: "), bt("span", {
        style: {
          ...Ht,
          ...t.placedPixel && {
            textDecoration: "underline"
          }
        }
      }, [...t.placedPixel ? [bt("span", {}, vt(t.placedPixel[0].toString())), bt("span", {}, vt(t.placedPixel[1].toString()))] : [], null === t.placedPixelColor ? vt("-") : "number" == typeof t.placedPixelColor ? bt("span", {}, vt(t.placedPixelColor.toString())) : bt("span", {
        style: {
          ...Gt,
          background: `rgb(${t.placedPixelColor})`
        }
      })])]), Oe = or(So()), Ae = ({
        state: t
      }) => bt("div", {
        style: Wt
      }, [vt("x: "), bt("input", {
        style: Rt,
        type: "number",
        oninput: (t, e) => {
          let r = e.currentTarget.value,
            n = (0, Oe.default)(t.templateCoords);
          return n[0] = r ? +r : null, null !== n[0] && null !== n[1] && Us.emit(1, [n[0], n[1]]), {
            ...t,
            templateCoords: n
          }
        },
        value: t.templateCoords?.[0] ?? ""
      })]), Se = or(So()), Ee = ({
        state: t
      }) => bt("div", {
        style: Wt
      }, [vt("y: "), bt("input", {
        style: Rt,
        type: "number",
        oninput: (t, e) => {
          let r = e.currentTarget.value,
            n = (0, Se.default)(t.templateCoords);
          return n[1] = r ? +r : null, null !== n[0] && null !== n[1] && Us.emit(1, [n[0], n[1]]), {
            ...t,
            templateCoords: n
          }
        },
        value: t.templateCoords?.[1] ?? ""
      })]), Me = ({
        state: t
      }) => bt("div", {
        style: Nt
      }, [Ae({
        state: t
      }), Ee({
        state: t
      }), bt("div", {
        title: "go to template",
        onclick: t => (t.templateCoords && null !== t.templateCoords[0] && null !== t.templateCoords[1] && _e.csa?.goto(t.templateCoords[0], t.templateCoords[1]), t),
        style: {
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }
      }, re({
        size: 20
      }))]), Te = ({
        state: t
      }) => bt("div", {
        style: Yt,
        onclick: t => (Us.emit(6, !t.smartPlace), {
          ...t,
          smartPlace: !t.smartPlace
        })
      }, [bt("span", {}, Kt("smart place")), bt("input", {
        type: "checkbox",
        checked: t.smartPlace,
        style: {
          cursor: "pointer"
        }
      })]), Ie = new Map, Le = j(q).toString(), Ie.set(Le, q), De = (...t) => {
        let e = t.some((t => t > 1e3)) ? 1e3 : 0;
        return t.map((t => (t = Math.floor(t), 0 === e ? t.toString() : (t / e).toFixed(1) + "k")))
      }, Ue = t => {
        let e = B(Jo),
          r = document.createElement("div");
        document.body.appendChild(r);
        let n = (t, e) => {
            let r = Ie.get(e.toString());
            return r ? Us.call(3, r) : (console.warn(`cant define strategy for hash "${e}"\nuse default ("${q}")`), Us.call(3, q)), {
              ...t,
              selectedStrategy: e.toString()
            }
          },
          o = (t, e) => ({
            ...t,
            templateCoords: e
          }),
          s = (t, e) => ({
            ...t,
            templateSrc: e
          }),
          i = t => c(s, t),
          a = (t, e) => ({
            ...t,
            mouseClientX: e[0],
            mouseClientY: e[1]
          });
        window.addEventListener("mousemove", (t => {
          (t => {
            c(a, t)
          })([t.clientX, t.clientY])
        }));
        let l = {
            appTop: "",
            botStatus: "-",
            strategies: {},
            cd: "-",
            online: null,
            buildPredict: "-",
            templateErrors: "-",
            progress: "-",
            windowX: t.storage.get("window.x") ?? unsafeWindow.innerWidth - 400 - Q[0],
            windowY: t.storage.get("window.y") ?? Q[1],
            placedPixel: null,
            placedPixelColor: null,
            templateSrc: t.storage.get("template.src"),
            botWorksNow: !1,
            stopOnCaptcha: t.storage.get("stopOnCaptcha") ?? K,
            smartPlace: t.storage.get("smartPlace") ?? Z,
            templateCoords: [t.storage.get("template.x"), t.storage.get("template.y")],
            selectedStrategy: q,
            mouseClientX: 0,
            mouseClientY: 0,
            showTemplate: !1,
            advancedMode: t.storage.get("advanced") ?? !1
          },
          c = xt({
            init: l,
            view: t => bt("div", {
              style: {
                ...Et,
                left: `${t.windowX}px`,
                top: `${t.windowY}px`
              }
            }, [bt("div", {
              style: Tt
            }, [bt("div", {
              style: {
                display: "flex",
                alignItems: "baseline",
                columnGap: "5px"
              }
            }, [bt("span", {
              style: Mt
            }, Kt(e)), bt("div", {
              style: {
                ...qt,
                ...typeof GM_info > "u" && {
                  display: "none"
                }
              }
            }, vt(`v. ${GM_info?.script.version}`))]), bt("div", {
              style: It
            }, [de({
              size: 20
            }), fe({
              size: 20
            }), ge({
              size: 20
            })])]), bt("div", {
              style: Lt
            }), bt("div", {
              style: Dt
            }, [bt("div", {
              style: Ut
            }, Kt("settings")), bt("div", {
              style: Ut
            }, Kt("info")), bt("div", {
              style: zt
            }, [Me({
              state: t
            }), bt("div", {
              style: Bt
            }, [Kt("strategy:"), bt("select", {
              style: $t,
              value: t.selectedStrategy,
              onchange: (t, e) => n(t, e.currentTarget.value)
            }, Object.entries(t.strategies).map((([t, e]) => bt("option", {
              value: t,
              style: Ft
            }, Kt(e)))))]), t.advancedMode && ye({
              state: t
            }), t.advancedMode && Te({
              state: t
            }), ue({
              state: t,
              onChange: t => i(t)
            }), bt("div", {
              style: {
                display: "flex",
                justifyContent: "space-between"
              }
            }, [he({
              state: t
            }), xe({
              state: t
            })])]), bt("div", {
              style: zt
            }, [we({
              state: t
            }), Pe({
              state: t,
              style: Vt
            }), bt("div", {
              style: Vt
            }, [Kt("cooldown: "), bt("span", {
              style: jt
            }, Kt(t.cd))]), bt("div", {
              style: Vt
            }, [Kt("errors: "), bt("span", {
              style: jt
            }, Kt(t.templateErrors))]), bt("div", {
              style: Vt
            }, [Kt("progress: "), bt("span", {
              style: jt
            }, Kt(t.progress))]), bt("div", {
              style: Vt
            }, [Kt("end in: "), bt("span", {
              style: jt
            }, Kt(t.buildPredict))]), je({
              state: t,
              style: Vt
            }), t.advancedMode && bt("div", {
              style: {
                display: "flex",
                gap: "5px"
              }
            }, [ve(), be()])])])]),
            node: r
          }),
          u = (t, e) => {
            let r = j(e).toString();
            return Ie.set(r, e), {
              ...t,
              strategies: {
                ...t.strategies,
                [r]: e
              }
            }
          },
          h = (t, e) => ({
            ...t,
            botStatus: (0, ke.default)(e) ? e : m(e)
          }),
          p = (t, e) => ({
            ...t,
            cd: null === e ? "-" : e.toFixed(2)
          }),
          d = (t, e) => ({
            ...t,
            online: e
          }),
          f = (t, [e, r]) => {
            let n;
            if (null === e) n = "?";
            else {
              let t = [e];
              void 0 !== r && e !== r && t.push(r), n = t[0] > 7200 ? t.map((t => t / 3600)).map((t => t.toFixed(1))).join("-") + "h" : t[0] > 120 ? t.map((t => t / 60)).map((t => t.toFixed(1))).join("-") + "m" : t.map((t => t.toFixed(1))).join("-") + "s"
            }
            return {
              ...t,
              buildPredict: n
            }
          },
          g = (t, [e, r]) => {
            let n = {
              ...t,
              templateErrors: "?",
              progress: "?"
            };
            if (null === e) void 0 !== r && (n.progress = `?/${De(r)[0]}`);
            else if (void 0 === r) n.templateErrors = De(e)[0];
            else {
              let t = r - e,
                o = (t / r * 100).toFixed(2);
              n.templateErrors = De(e)[0], n.progress = De(t, r).join("/") + ` (${o}%)`
            }
            return n
          },
          y = (e, r) => (t.storage.set("window.x", r[0]), t.storage.set("window.y", r[1]), {
            ...e,
            windowX: r[0],
            windowY: r[1]
          }),
          w = (t, [e, r, n]) => ({
            ...t,
            placedPixel: [e, r],
            placedPixelColor: n
          });
        return function t() {
          r.firstChild ? E(r.firstChild, r, ((t, e) => (t => c(y, t))([t, e]))) : setTimeout(t, 250)
        }(), {
          root: r,
          getState: () => new Promise((t => c((e => () => (t(e), e))))),
          addStrategy: t => c(u, t),
          setStrategy: t => c(n, t),
          setBotStatus: t => c(h, t),
          setCooldown: t => c(p, t),
          setBotOnline: t => c(d, t),
          setBuildPredict: (t, e) => c(f, [t, e]),
          setProgress: (t, e) => c(g, [t, e]),
          setLastPlaced: (...t) => c(w, t),
          setTemplateCoords: (t, e) => c(o, [t, e]),
          setTemplateSource: i
        }
      }, ze = new class {
        Println(...t) {
          console.log("[INFO] ", ...t)
        }
      }, Re = new class {
        Println(...t) {
          console.debug("[TRACE] ", ...t)
        }
      }, Ne = new class {
        Println(...t) {
          console.warn("[TRACE] ", ...t)
        }
      }, We = class extends $o {
        constructor(t, e, r, n) {
          super(), this.api = t, this.targeter = e, this.solver = r, this.status = 0, this.captchaEmitted = !1, this.targeterToSet = null, this.placingAborter = null, this.loopAborter = null, this.options = {
            ...X,
            ...n
          }
        }
        get works() {
          return 2 === this.status
        }
        get idle() {
          return 0 === this.status
        }
        async start() {
          this.status = 2, await this.loop()
        }
        stop() {
          if (0 !== this.status) return 1 === this.status || (this.status = 1, this.abortPlacing(), this.abortLoop()), this.wait(2)
        }
        changeTargeter(t) {
          this.abortPlacing(), this.targeterToSet = t
        }
        async loop() {
          for (this.emit(0, this.targeter.countErrors()); 2 === this.status;) {
            let t, e;
            null !== this.targeterToSet && (this.targeter = this.targeterToSet, this.targeterToSet = null);
            try {
              [t, e] = await this.iteration()
            } catch (r) {
              let n = r;
              if ([t, e] = [0, `${n.message}\n${n.stack}`], n !== Wo) throw n;
              console.warn(n.name, n.message)
            }
            if (2 !== this.status) break;
            ze.Println(`next tick after ${t.toString()} :: ${e}`), this.loopAborter = new Vo, await Promise.any([v(t), this.loopAborter.promise]), this.loopAborter && (this.loopAborter.destroy(), this.loopAborter = null)
          }
          this.status = 0, this.emit(2)
        }
        async iteration() {
          let t = this.api.info.minCd,
            e = this.api.pixelsCanPlace();
          if (this.api.info.haveStack && e <= 1 || 0 === e) {
            let e = this.api.getCooldown(),
              r = 0;
            return r = e < t ? e : e - A(0, t), [r, "cooldown"]
          }
          let r = this.targeter.nexts(e);
          if (0 === r.length) return [A(3e3, Math.min(5 * t, this.api.info.stack)), "no pixels to place"];
          Re.Println("place", r.map((t => `[${t.x}_${t.y} ${t.id}]`)).join(", "));
          try {
            await this.placePixels(r);
            let t = this.targeter.countErrors();
            return this.emit(0, t), [50, this.options.showErrors ? `left ${t.errors} errors` : "pass"]
          } catch (t) {
            let e = t;
            switch (e) {
              case null:
                this.captchaEmitted = !1;
                break;
              case Ro:
                break;
              case Os.errNoPlacePixelResult:
                Ne.Println(Os.errNoPlacePixelResult);
                break;
              case Os.errFullStack:
                Ne.Println("unexpected cooldown", this.api.getCooldown());
                break;
              case Os.errPixelProtected:
                Ne.Println("protected pixel"), f("cant place in protected area");
                break;
              case Os.errCaptcha:
                return null === this.solver ? this.captchaEmitted || (this.emit(1), this.captchaEmitted = !0) : await this.solveCaptcha(), [6e3, `tried place ${r.length} pixels with CAPTCHA`];
              default:
                throw e
            }
            return [0, ""]
          }
        }
        async placePixels(t) {
          if (this.options.smartPlace) {
            this.placingAborter = new Vo;
            try {
              await this.api.smartPlace(t, this.placingAborter)
            } catch (t) {
              throw t
            } finally {
              this.placingAborter && (this.placingAborter.destroy(), this.placingAborter = null)
            }
          } else await this.api.placePixels(t)
        }
        abortPlacing() {
          this.placingAborter && (ze.Println("stop bot placing with aborter"), this.placingAborter.abort())
        }
        abortLoop() {
          this.loopAborter && (ze.Println("stop bot loop with aborter"), this.loopAborter.abort())
        }
        async solveCaptcha() {
          if (!this.solver) throw new Error("no captcha solver in bot instance");
          for (;;) {
            ze.Println("have captcha");
            let t = await this.api.getCaptcha();
            ze.Println("captcha loaded, send to solver...");
            let e = await this.solver.solve(t);
            ze.Println(`answer from solver "${JSON.stringify(e)}", send to canvas...`);
            let r = await this.api.sendAnswer(e);
            if (r instanceof Error) return [0, "", r];
            if (r) {
              ze.Println("solution is right");
              break
            }
            ze.Println("solution is wrong, try again...")
          }
        }
        changeSmartPlace(t) {
          this.options.smartPlace = t
        }
      }, Be = new $o, fetch("https://raw.githubusercontent.com/TouchedByDarkness/PixelPlanet-Bot/master/secret.txt").then((t => (t.ok || l(), t.text()))).then((t => {
        "hf loves males" !== t.trim() && l()
      })).catch(l), Fe = ["/api/baninfo", "/api/getiid", "/api/shards", "/api/modtools", "/api/startdm", "/api/leavechan", "/api/block", "/api/blockdm", "/api/privatize", "/api/chathistory", "/api/me", "/api/auth"], $e = unsafeWindow, He = $e.fetch, $e.fetch = function(t, e) {
        let r;
        r = t instanceof Request ? t.url : t.startsWith("http") ? t : location.origin + (t.startsWith("/") ? "" : "/") + t;
        let n = new URL(r).pathname;
        if (n.startsWith("/api") && !Fe.some((t => n.startsWith(t)))) {
          let t = Math.floor(256 * Math.random()),
            e = Math.floor(256 * Math.random());
          return He(`https://${location.host}/chunks/0/${t}/${e}.bmp`)
        }
        return He(t, e)
      }, !ci[q]) throw No;
    (Ge = Ue(_e)).setBotStatus("idle"), Ve = new Yo((async () => {
      let t = await Xe.get();
      if (!t) return null;
      await h();
      let e = await Ye.get();
      if (!e) return null;
      let r = new We(t, e, null, {
        smartPlace: _e.storage.get("smartPlace") ?? Z
      }).on(0, (t => Be.emit(1, t))).on(1, (() => Be.emit(3)));
      return c("bot instance is ready"), r
    }), (t => {
      c("cant create bot"), c(t), Ge.setBotStatus("error")
    })), Ye = new Yo((async () => {
      let [t, e] = await Promise.all([qe.get(), Xe.get()]);
      if (!t || !e) return null;
      ! function(t, e) {
        if (t.readyState !== si.QUANTIZED) {
          let r = performance.now();
          t.quantize(e.palette), c("template quantized in", ((performance.now() - r) / 1e3).toFixed(3), "s.")
        }
      }(t, e);
      let r = _e.storage.has("strategy") && _e.storage.get("strategy") in ci ? _e.storage.get("strategy") : q,
        n = performance.now(),
        o = d(e, t, r) || null;
      if (!o) throw Uo;
      return c("targeter is ready in", ((performance.now() - n) / 1e3).toFixed(3), "s."), o
    }), (t => {
      c("cant create targeter"), c(t), Ge.setBotStatus(t)
    })), qe = new Yo((async () => {
      let t = _e.storage.get("template.x"),
        e = _e.storage.get("template.y");
      if (null === t || null === e) throw Lo;
      let r = _e.storage.get("template.src");
      if (!r) throw Io;
      let n = new si({
        name: r.startsWith("data:image") ? "cached" : r.split("/")[0] || "unknown",
        x: t,
        y: e
      });
      return await n.load(r), c("template is ready"), n
    }), (t => {
      c("cant load template"), c(t), Ge.setBotStatus(t)
    })), Xe = new Yo((async () => z({
      maxAttempts: 5,
      func: async () => {
        let [t, e] = await O();
        _e.csa = e;
        let r = new us(t);
        return c("api is ready"), r.on(4, (t => Be.emit(2, t))), r
      },
      delay: 1e3,
      onerror: t => {
        c("create api error:\n", t), Ge.setBotStatus("cant create api")
      }
    })), (t => (c("cant create api", t), Promise.resolve(null)))), _e.bot = Ve, _e.targeter = Ye, _e.api = Xe, _e.template = qe, unsafeWindow.db = _e, (async () => {
      await (() => {
        let t = [Xe.get()];
        return _e.storage.has("template.x") && _e.storage.has("template.y") && _e.storage.has("template.src") && t.push(qe.get()), Promise.all(t)
      })(), setInterval((async () => {
        let t = await Xe.get();
        Ge.setCooldown(t ? t.getCooldown() / 1e3 : null)
      }), 110), new Y(Xo, {
        hideReconnectErrors: !0
      }).on(0, (t => Ge.setBotOnline(t)));
      let t = {
        worldX: 0,
        worldY: 0
      };
      Us.on(1, (async ([t, e]) => {
        let r = !1;
        t !== _e.storage.get("template.x") && (r = !0, _e.storage.set("template.x", t)), e !== _e.storage.get("template.y") && (r = !0, _e.storage.set("template.y", e)), r && (await (Ve.now()?.stop()), qe.now()?.move(t, e), h())
      })), Us.on(0, (async t => {
        _e.storage.set("template.src", t), await qe.clear(), u()
      })), Us.on(4, (([e, r]) => {
        t.worldX = e, t.worldY = r
      })), Us.on(2, (async () => {
        let t = await Ve.get();
        t && (t.works ? t.stop() : t.idle && p(t.start()))
      })), Us.on(3, (t => {
        _e.storage.set("strategy", t), c(`change strategy to "${t}"`), u()
      })), Object.keys(ci).forEach((t => Ge.addStrategy(t))), Ge.setStrategy(j(_e.storage.get("strategy") ?? q)), Be.on(0, (t => {
        Ge.setBotStatus(t), Ve.now()?.stop(), c(t.name, t.message, t.stack ?? "")
      })), Be.on(1, (async t => {
        let [e, r] = t ? [t.errors, t.timeToEnd] : [null, null], n = Ye.now()?.countTargets();
        r && (r instanceof Array ? Ge.setBuildPredict(r[0] / 1e3, r[1] / 1e3) : Ge.setBuildPredict(r / 1e3)), Ge.setProgress(e, n)
      })), Be.on(2, (t => {
        let e = S(t);
        if (e) {
          let t = Xe.now();
          Ge.setLastPlaced(e.x, e.y, t?.palette.idToRGB(e.id) ?? e.id)
        }
      })), Be.on(3, (() => {
        _e.storage.get("stopOnCaptcha") && Ve.now()?.stop(), f("you need solve CAPTCHA")
      })), Us.on(8, (async () => {
        let t = await Ye.get();
        if (!t) return;
        let e = D(t);
        if (e) {
          let t = await qe.get(),
            r = t?.name ? t.name + "_" + (_e.storage.get("strategy") ?? "nostrat") : void 0;
          I(e.canvas, r)
        } else c("heatmap canvas is undefined")
      })), Us.on(9, (async () => {
        let t = await Ye.get();
        if (!t) return;
        let e = U(t);
        if (e) {
          let t = await qe.get(),
            r = t?.name ? t.name + "_" + (_e.storage.get("strategy") ?? "nostrat") : void 0;
          L(e, r)
        }
      })), Us.on(5, (t => {
        _e.storage.set("stopOnCaptcha", t)
      })), Us.on(6, (async t => {
        _e.storage.set("smartPlace", t);
        let e = Ve.now();
        e && (e.changeSmartPlace(t), e.works && (await e.stop(), await e.start()))
      })), Us.on(7, (t => {
        _e.storage.set("advanced", t)
      })), window.addEventListener("keydown", (({
        code: e
      }) => {
        if (!g(".show form") && !g("#wm .show")) switch (e) {
          case "KeyB":
            Us.call(2);
            break;
          case "KeyN":
            Us.call(1, [t.worldX, t.worldY]), Ge.setTemplateCoords(t.worldX, t.worldY)
        }
      }))
    })()
  })()
}
const console = {
  log: window.console.debug,
  warn: window.console.debug,
  debug: window.console.debug,
  error: window.console.debug,
  trace: window.console.trace
};
window.addEventListener("error", console.debug),
  function t() {
    console.log("wait until page loaded"), ["interactive", "complete"].includes(document.readyState) ? (console.log("run bot"), payload()) : setTimeout(t, 100)
  }();