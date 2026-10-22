(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/whisper.worker.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Offline speech-to-text. Runs Whisper in a Web Worker using only files
// served from /public, so voice logging works without internet.
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$huggingface$2f$transformers$2f$dist$2f$transformers$2e$web$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@huggingface/transformers/dist/transformers.web.js [app-client] (ecmascript)");
;
const MODEL = 'onnx-community/whisper-base';
// The worker may be loaded from a blob: URL, so relative paths are resolved
// against the site origin. Model paths must stay relative: transformers.js
// only treats relative paths as local files.
const ORIGIN = self.location.origin;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$huggingface$2f$transformers$2f$dist$2f$transformers$2e$web$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["env"].allowRemoteModels = false;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$huggingface$2f$transformers$2f$dist$2f$transformers$2e$web$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["env"].allowLocalModels = true;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$huggingface$2f$transformers$2f$dist$2f$transformers$2e$web$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["env"].localModelPath = '/models/';
// The Cache API needs absolute URLs; the files are local anyway
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$huggingface$2f$transformers$2f$dist$2f$transformers$2e$web$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["env"].useBrowserCache = false;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$huggingface$2f$transformers$2f$dist$2f$transformers$2e$web$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["env"].fetch = (input, init)=>fetch(typeof input === 'string' && input.startsWith('/') ? ORIGIN + input : input, init);
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$huggingface$2f$transformers$2f$dist$2f$transformers$2e$web$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["env"].backends.onnx.wasm.wasmPaths = {
    mjs: "".concat(ORIGIN, "/ort/ort-wasm-simd-threaded.asyncify.mjs"),
    wasm: "".concat(ORIGIN, "/ort/ort-wasm-simd-threaded.asyncify.wasm")
};
let loading = null;
function load() {
    loading !== null && loading !== void 0 ? loading : loading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$huggingface$2f$transformers$2f$dist$2f$transformers$2e$web$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pipeline"])('automatic-speech-recognition', MODEL, {
        dtype: 'q8',
        device: 'wasm',
        progress_callback: (p)=>{
            if (p.status === 'progress_total' && typeof p.progress === 'number') post({
                type: 'progress',
                pct: Math.round(p.progress)
            });
        }
    });
    return loading;
}
const post = (m)=>self.postMessage(m);
self.onmessage = async (e)=>{
    const msg = e.data;
    try {
        var _out_;
        const asr = await load();
        if (msg.type === 'load') return post({
            type: 'ready'
        });
        const out = await asr(msg.audio, {
            language: msg.language,
            task: 'transcribe'
        });
        var _ref;
        const text = (_ref = Array.isArray(out) ? (_out_ = out[0]) === null || _out_ === void 0 ? void 0 : _out_.text : out.text) !== null && _ref !== void 0 ? _ref : '';
        post({
            type: 'result',
            id: msg.id,
            text: text.trim()
        });
    } catch (err) {
        loading = null;
        post({
            type: 'error',
            id: msg.type === 'transcribe' ? msg.id : undefined,
            message: String(err)
        });
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_whisper_worker_ts_246c9a4e._.js.map