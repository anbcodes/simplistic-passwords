// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
const stringToByteArray$1 = function(str) {
    const out = [];
    let p1 = 0;
    for(let i = 0; i < str.length; i++){
        let c = str.charCodeAt(i);
        if (c < 128) {
            out[p1++] = c;
        } else if (c < 2048) {
            out[p1++] = c >> 6 | 192;
            out[p1++] = c & 63 | 128;
        } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
            c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
            out[p1++] = c >> 18 | 240;
            out[p1++] = c >> 12 & 63 | 128;
            out[p1++] = c >> 6 & 63 | 128;
            out[p1++] = c & 63 | 128;
        } else {
            out[p1++] = c >> 12 | 224;
            out[p1++] = c >> 6 & 63 | 128;
            out[p1++] = c & 63 | 128;
        }
    }
    return out;
};
const byteArrayToString = function(bytes) {
    const out = [];
    let pos = 0, c = 0;
    while(pos < bytes.length){
        const c1 = bytes[pos++];
        if (c1 < 128) {
            out[c++] = String.fromCharCode(c1);
        } else if (c1 > 191 && c1 < 224) {
            const c2 = bytes[pos++];
            out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
        } else if (c1 > 239 && c1 < 365) {
            const c2 = bytes[pos++];
            const c3 = bytes[pos++];
            const c4 = bytes[pos++];
            const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
            out[c++] = String.fromCharCode(55296 + (u >> 10));
            out[c++] = String.fromCharCode(56320 + (u & 1023));
        } else {
            const c2 = bytes[pos++];
            const c3 = bytes[pos++];
            out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
        }
    }
    return out.join("");
};
const base64 = {
    byteToCharMap_: null,
    charToByteMap_: null,
    byteToCharMapWebSafe_: null,
    charToByteMapWebSafe_: null,
    ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    get ENCODED_VALS () {
        return this.ENCODED_VALS_BASE + "+/=";
    },
    get ENCODED_VALS_WEBSAFE () {
        return this.ENCODED_VALS_BASE + "-_.";
    },
    HAS_NATIVE_SUPPORT: typeof atob === "function",
    encodeByteArray (input, webSafe) {
        if (!Array.isArray(input)) {
            throw Error("encodeByteArray takes an array as a parameter");
        }
        this.init_();
        const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
        const output = [];
        for(let i = 0; i < input.length; i += 3){
            const byte1 = input[i];
            const haveByte2 = i + 1 < input.length;
            const byte2 = haveByte2 ? input[i + 1] : 0;
            const haveByte3 = i + 2 < input.length;
            const byte3 = haveByte3 ? input[i + 2] : 0;
            const outByte1 = byte1 >> 2;
            const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
            let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
            let outByte4 = byte3 & 63;
            if (!haveByte3) {
                outByte4 = 64;
                if (!haveByte2) {
                    outByte3 = 64;
                }
            }
            output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
        }
        return output.join("");
    },
    encodeString (input, webSafe) {
        if (this.HAS_NATIVE_SUPPORT && !webSafe) {
            return btoa(input);
        }
        return this.encodeByteArray(stringToByteArray$1(input), webSafe);
    },
    decodeString (input, webSafe) {
        if (this.HAS_NATIVE_SUPPORT && !webSafe) {
            return atob(input);
        }
        return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
    },
    decodeStringToByteArray (input, webSafe) {
        this.init_();
        const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
        const output = [];
        for(let i = 0; i < input.length;){
            const byte1 = charToByteMap[input.charAt(i++)];
            const haveByte2 = i < input.length;
            const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
            ++i;
            const haveByte3 = i < input.length;
            const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
            ++i;
            const haveByte4 = i < input.length;
            const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
            ++i;
            if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
                throw Error();
            }
            const outByte1 = byte1 << 2 | byte2 >> 4;
            output.push(outByte1);
            if (byte3 !== 64) {
                const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
                output.push(outByte2);
                if (byte4 !== 64) {
                    const outByte3 = byte3 << 6 & 192 | byte4;
                    output.push(outByte3);
                }
            }
        }
        return output;
    },
    init_ () {
        if (!this.byteToCharMap_) {
            this.byteToCharMap_ = {};
            this.charToByteMap_ = {};
            this.byteToCharMapWebSafe_ = {};
            this.charToByteMapWebSafe_ = {};
            for(let i = 0; i < this.ENCODED_VALS.length; i++){
                this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
                this.charToByteMap_[this.byteToCharMap_[i]] = i;
                this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
                this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
                if (i >= this.ENCODED_VALS_BASE.length) {
                    this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
                    this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
                }
            }
        }
    }
};
const base64Encode = function(str) {
    const utf8Bytes = stringToByteArray$1(str);
    return base64.encodeByteArray(utf8Bytes, true);
};
const base64urlEncodeWithoutPadding = function(str) {
    return base64Encode(str).replace(/\./g, "");
};
const base64Decode = function(str) {
    try {
        return base64.decodeString(str, true);
    } catch (e) {
        console.error("base64Decode failed: ", e);
    }
    return null;
};
class Deferred {
    constructor(){
        this.reject = ()=>{};
        this.resolve = ()=>{};
        this.promise = new Promise((resolve, reject)=>{
            this.resolve = resolve;
            this.reject = reject;
        });
    }
    wrapCallback(callback) {
        return (error1, value)=>{
            if (error1) {
                this.reject(error1);
            } else {
                this.resolve(value);
            }
            if (typeof callback === "function") {
                this.promise.catch(()=>{});
                if (callback.length === 1) {
                    callback(error1);
                } else {
                    callback(error1, value);
                }
            }
        };
    }
}
function getUA() {
    if (typeof navigator !== "undefined" && typeof navigator["userAgent"] === "string") {
        return navigator["userAgent"];
    } else {
        return "";
    }
}
function isMobileCordova() {
    return typeof window !== "undefined" && !!(window["cordova"] || window["phonegap"] || window["PhoneGap"]) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(getUA());
}
function isNode() {
    try {
        return Object.prototype.toString.call(global$1.process) === "[object process]";
    } catch (e) {
        return false;
    }
}
function isBrowserExtension() {
    const runtime = typeof chrome === "object" ? chrome.runtime : typeof browser === "object" ? browser.runtime : void 0;
    return typeof runtime === "object" && runtime.id !== void 0;
}
function isReactNative() {
    return typeof navigator === "object" && navigator["product"] === "ReactNative";
}
function isElectron() {
    return getUA().indexOf("Electron/") >= 0;
}
function isIE() {
    const ua2 = getUA();
    return ua2.indexOf("MSIE ") >= 0 || ua2.indexOf("Trident/") >= 0;
}
function isUWP() {
    return getUA().indexOf("MSAppHost/") >= 0;
}
function isSafari() {
    return !isNode() && navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome");
}
function isIndexedDBAvailable() {
    return typeof indexedDB === "object";
}
function validateIndexedDBOpenable() {
    return new Promise((resolve, reject)=>{
        try {
            let preExist = true;
            const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
            const request = self.indexedDB.open(DB_CHECK_NAME);
            request.onsuccess = ()=>{
                request.result.close();
                if (!preExist) {
                    self.indexedDB.deleteDatabase(DB_CHECK_NAME);
                }
                resolve(true);
            };
            request.onupgradeneeded = ()=>{
                preExist = false;
            };
            request.onerror = ()=>{
                var _a;
                reject(((_a = request.error) === null || _a === void 0 ? void 0 : _a.message) || "");
            };
        } catch (error2) {
            reject(error2);
        }
    });
}
const ERROR_NAME = "FirebaseError";
class FirebaseError extends Error {
    constructor(code, message, customData){
        super(message);
        this.code = code;
        this.customData = customData;
        this.name = ERROR_NAME;
        Object.setPrototypeOf(this, FirebaseError.prototype);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ErrorFactory.prototype.create);
        }
    }
}
class ErrorFactory {
    constructor(service, serviceName, errors){
        this.service = service;
        this.serviceName = serviceName;
        this.errors = errors;
    }
    create(code, ...data) {
        const customData = data[0] || {};
        const fullCode = `${this.service}/${code}`;
        const template = this.errors[code];
        const message = template ? replaceTemplate(template, customData) : "Error";
        const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
        const error3 = new FirebaseError(fullCode, fullMessage, customData);
        return error3;
    }
}
function replaceTemplate(template, data) {
    return template.replace(PATTERN, (_, key1)=>{
        const value = data[key1];
        return value != null ? String(value) : `<${key1}?>`;
    });
}
const PATTERN = /\{\$([^}]+)}/g;
function isEmpty(obj) {
    for(const key2 in obj){
        if (Object.prototype.hasOwnProperty.call(obj, key2)) {
            return false;
        }
    }
    return true;
}
function deepEqual(a, b) {
    if (a === b) {
        return true;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    for (const k2 of aKeys){
        if (!bKeys.includes(k2)) {
            return false;
        }
        const aProp = a[k2];
        const bProp = b[k2];
        if (isObject(aProp) && isObject(bProp)) {
            if (!deepEqual(aProp, bProp)) {
                return false;
            }
        } else if (aProp !== bProp) {
            return false;
        }
    }
    for (const k1 of bKeys){
        if (!aKeys.includes(k1)) {
            return false;
        }
    }
    return true;
}
function isObject(thing) {
    return thing !== null && typeof thing === "object";
}
function querystring(querystringParams) {
    const params = [];
    for (const [key3, value] of Object.entries(querystringParams)){
        if (Array.isArray(value)) {
            value.forEach((arrayVal)=>{
                params.push(encodeURIComponent(key3) + "=" + encodeURIComponent(arrayVal));
            });
        } else {
            params.push(encodeURIComponent(key3) + "=" + encodeURIComponent(value));
        }
    }
    return params.length ? "&" + params.join("&") : "";
}
function querystringDecode(querystring2) {
    const obj = {};
    const tokens = querystring2.replace(/^\?/, "").split("&");
    tokens.forEach((token)=>{
        if (token) {
            const [key4, value] = token.split("=");
            obj[decodeURIComponent(key4)] = decodeURIComponent(value);
        }
    });
    return obj;
}
function extractQuerystring(url) {
    const queryStart = url.indexOf("?");
    if (!queryStart) {
        return "";
    }
    const fragmentStart = url.indexOf("#", queryStart);
    return url.substring(queryStart, fragmentStart > 0 ? fragmentStart : void 0);
}
function createSubscribe(executor, onNoObservers) {
    const proxy = new ObserverProxy(executor, onNoObservers);
    return proxy.subscribe.bind(proxy);
}
class ObserverProxy {
    constructor(executor, onNoObservers){
        this.observers = [];
        this.unsubscribes = [];
        this.observerCount = 0;
        this.task = Promise.resolve();
        this.finalized = false;
        this.onNoObservers = onNoObservers;
        this.task.then(()=>{
            executor(this);
        }).catch((e)=>{
            this.error(e);
        });
    }
    next(value) {
        this.forEachObserver((observer)=>{
            observer.next(value);
        });
    }
    error(error4) {
        this.forEachObserver((observer)=>{
            observer.error(error4);
        });
        this.close(error4);
    }
    complete() {
        this.forEachObserver((observer)=>{
            observer.complete();
        });
        this.close();
    }
    subscribe(nextOrObserver, error5, complete) {
        let observer;
        if (nextOrObserver === void 0 && error5 === void 0 && complete === void 0) {
            throw new Error("Missing Observer.");
        }
        if (implementsAnyMethods(nextOrObserver, [
            "next",
            "error",
            "complete"
        ])) {
            observer = nextOrObserver;
        } else {
            observer = {
                next: nextOrObserver,
                error: error5,
                complete
            };
        }
        if (observer.next === void 0) {
            observer.next = noop;
        }
        if (observer.error === void 0) {
            observer.error = noop;
        }
        if (observer.complete === void 0) {
            observer.complete = noop;
        }
        const unsub = this.unsubscribeOne.bind(this, this.observers.length);
        if (this.finalized) {
            this.task.then(()=>{
                try {
                    if (this.finalError) {
                        observer.error(this.finalError);
                    } else {
                        observer.complete();
                    }
                } catch (e) {}
                return;
            });
        }
        this.observers.push(observer);
        return unsub;
    }
    unsubscribeOne(i) {
        if (this.observers === void 0 || this.observers[i] === void 0) {
            return;
        }
        delete this.observers[i];
        this.observerCount -= 1;
        if (this.observerCount === 0 && this.onNoObservers !== void 0) {
            this.onNoObservers(this);
        }
    }
    forEachObserver(fn1) {
        if (this.finalized) {
            return;
        }
        for(let i = 0; i < this.observers.length; i++){
            this.sendOne(i, fn1);
        }
    }
    sendOne(i, fn2) {
        this.task.then(()=>{
            if (this.observers !== void 0 && this.observers[i] !== void 0) {
                try {
                    fn2(this.observers[i]);
                } catch (e) {
                    if (typeof console !== "undefined" && console.error) {
                        console.error(e);
                    }
                }
            }
        });
    }
    close(err) {
        if (this.finalized) {
            return;
        }
        this.finalized = true;
        if (err !== void 0) {
            this.finalError = err;
        }
        this.task.then(()=>{
            this.observers = void 0;
            this.onNoObservers = void 0;
        });
    }
}
function implementsAnyMethods(obj, methods) {
    if (typeof obj !== "object" || obj === null) {
        return false;
    }
    for (const method of methods){
        if (method in obj && typeof obj[method] === "function") {
            return true;
        }
    }
    return false;
}
function noop() {}
function getModularInstance(service) {
    if (service && service._delegate) {
        return service._delegate;
    } else {
        return service;
    }
}
function promisifyRequest(request, errorMessage) {
    return new Promise((resolve, reject)=>{
        request.onsuccess = (event)=>{
            resolve(event.target.result);
        };
        request.onerror = (event)=>{
            var _a;
            reject(`${errorMessage}: ${(_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message}`);
        };
    });
}
class DBWrapper {
    constructor(_db){
        this._db = _db;
        this.objectStoreNames = this._db.objectStoreNames;
    }
    transaction(storeNames, mode) {
        return new TransactionWrapper(this._db.transaction.call(this._db, storeNames, mode));
    }
    createObjectStore(storeName, options) {
        return new ObjectStoreWrapper(this._db.createObjectStore(storeName, options));
    }
    close() {
        this._db.close();
    }
}
class TransactionWrapper {
    constructor(_transaction){
        this._transaction = _transaction;
        this.complete = new Promise((resolve, reject)=>{
            this._transaction.oncomplete = function() {
                resolve();
            };
            this._transaction.onerror = ()=>{
                reject(this._transaction.error);
            };
            this._transaction.onabort = ()=>{
                reject(this._transaction.error);
            };
        });
    }
    objectStore(storeName) {
        return new ObjectStoreWrapper(this._transaction.objectStore(storeName));
    }
}
class ObjectStoreWrapper {
    constructor(_store){
        this._store = _store;
    }
    index(name3) {
        return new IndexWrapper(this._store.index(name3));
    }
    createIndex(name4, keypath, options) {
        return new IndexWrapper(this._store.createIndex(name4, keypath, options));
    }
    get(key5) {
        const request = this._store.get(key5);
        return promisifyRequest(request, "Error reading from IndexedDB");
    }
    put(value, key6) {
        const request = this._store.put(value, key6);
        return promisifyRequest(request, "Error writing to IndexedDB");
    }
    delete(key7) {
        const request = this._store.delete(key7);
        return promisifyRequest(request, "Error deleting from IndexedDB");
    }
    clear() {
        const request = this._store.clear();
        return promisifyRequest(request, "Error clearing IndexedDB object store");
    }
}
class IndexWrapper {
    constructor(_index){
        this._index = _index;
    }
    get(key8) {
        const request = this._index.get(key8);
        return promisifyRequest(request, "Error reading from IndexedDB");
    }
}
function openDB(dbName, dbVersion, upgradeCallback) {
    return new Promise((resolve, reject)=>{
        try {
            const request = indexedDB.open(dbName, dbVersion);
            request.onsuccess = (event)=>{
                resolve(new DBWrapper(event.target.result));
            };
            request.onerror = (event)=>{
                var _a;
                reject(`Error opening indexedDB: ${(_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message}`);
            };
            request.onupgradeneeded = (event)=>{
                upgradeCallback(new DBWrapper(request.result), event.oldVersion, event.newVersion, new TransactionWrapper(request.transaction));
            };
        } catch (e) {
            reject(`Error opening indexedDB: ${e.message}`);
        }
    });
}
class Component {
    constructor(name5, instanceFactory, type){
        this.name = name5;
        this.instanceFactory = instanceFactory;
        this.type = type;
        this.multipleInstances = false;
        this.serviceProps = {};
        this.instantiationMode = "LAZY";
        this.onInstanceCreated = null;
    }
    setInstantiationMode(mode) {
        this.instantiationMode = mode;
        return this;
    }
    setMultipleInstances(multipleInstances) {
        this.multipleInstances = multipleInstances;
        return this;
    }
    setServiceProps(props) {
        this.serviceProps = props;
        return this;
    }
    setInstanceCreatedCallback(callback) {
        this.onInstanceCreated = callback;
        return this;
    }
}
const DEFAULT_ENTRY_NAME = "[DEFAULT]";
class Provider {
    constructor(name6, container){
        this.name = name6;
        this.container = container;
        this.component = null;
        this.instances = new Map();
        this.instancesDeferred = new Map();
        this.instancesOptions = new Map();
        this.onInitCallbacks = new Map();
    }
    get(identifier) {
        const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
        if (!this.instancesDeferred.has(normalizedIdentifier)) {
            const deferred = new Deferred();
            this.instancesDeferred.set(normalizedIdentifier, deferred);
            if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
                try {
                    const instance = this.getOrInitializeService({
                        instanceIdentifier: normalizedIdentifier
                    });
                    if (instance) {
                        deferred.resolve(instance);
                    }
                } catch (e) {}
            }
        }
        return this.instancesDeferred.get(normalizedIdentifier).promise;
    }
    getImmediate(options) {
        var _a;
        const normalizedIdentifier = this.normalizeInstanceIdentifier(options === null || options === void 0 ? void 0 : options.identifier);
        const optional = (_a = options === null || options === void 0 ? void 0 : options.optional) !== null && _a !== void 0 ? _a : false;
        if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
            try {
                return this.getOrInitializeService({
                    instanceIdentifier: normalizedIdentifier
                });
            } catch (e) {
                if (optional) {
                    return null;
                } else {
                    throw e;
                }
            }
        } else {
            if (optional) {
                return null;
            } else {
                throw Error(`Service ${this.name} is not available`);
            }
        }
    }
    getComponent() {
        return this.component;
    }
    setComponent(component1) {
        if (component1.name !== this.name) {
            throw Error(`Mismatching Component ${component1.name} for Provider ${this.name}.`);
        }
        if (this.component) {
            throw Error(`Component for ${this.name} has already been provided`);
        }
        this.component = component1;
        if (!this.shouldAutoInitialize()) {
            return;
        }
        if (isComponentEager(component1)) {
            try {
                this.getOrInitializeService({
                    instanceIdentifier: DEFAULT_ENTRY_NAME
                });
            } catch (e) {}
        }
        for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()){
            const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
            try {
                const instance = this.getOrInitializeService({
                    instanceIdentifier: normalizedIdentifier
                });
                instanceDeferred.resolve(instance);
            } catch (e) {}
        }
    }
    clearInstance(identifier = DEFAULT_ENTRY_NAME) {
        this.instancesDeferred.delete(identifier);
        this.instancesOptions.delete(identifier);
        this.instances.delete(identifier);
    }
    async delete() {
        const services = Array.from(this.instances.values());
        await Promise.all([
            ...services.filter((service)=>"INTERNAL" in service
            ).map((service)=>service.INTERNAL.delete()
            ),
            ...services.filter((service)=>"_delete" in service
            ).map((service)=>service._delete()
            )
        ]);
    }
    isComponentSet() {
        return this.component != null;
    }
    isInitialized(identifier = DEFAULT_ENTRY_NAME) {
        return this.instances.has(identifier);
    }
    getOptions(identifier = DEFAULT_ENTRY_NAME) {
        return this.instancesOptions.get(identifier) || {};
    }
    initialize(opts = {}) {
        const { options ={}  } = opts;
        const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
        if (this.isInitialized(normalizedIdentifier)) {
            throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
        }
        if (!this.isComponentSet()) {
            throw Error(`Component ${this.name} has not been registered yet`);
        }
        const instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier,
            options
        });
        for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()){
            const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
            if (normalizedIdentifier === normalizedDeferredIdentifier) {
                instanceDeferred.resolve(instance);
            }
        }
        return instance;
    }
    onInit(callback, identifier) {
        var _a;
        const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
        const existingCallbacks = (_a = this.onInitCallbacks.get(normalizedIdentifier)) !== null && _a !== void 0 ? _a : new Set();
        existingCallbacks.add(callback);
        this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
        const existingInstance = this.instances.get(normalizedIdentifier);
        if (existingInstance) {
            callback(existingInstance, normalizedIdentifier);
        }
        return ()=>{
            existingCallbacks.delete(callback);
        };
    }
    invokeOnInitCallbacks(instance, identifier) {
        const callbacks = this.onInitCallbacks.get(identifier);
        if (!callbacks) {
            return;
        }
        for (const callback of callbacks){
            try {
                callback(instance, identifier);
            } catch (_a) {}
        }
    }
    getOrInitializeService({ instanceIdentifier , options ={}  }) {
        let instance = this.instances.get(instanceIdentifier);
        if (!instance && this.component) {
            instance = this.component.instanceFactory(this.container, {
                instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
                options
            });
            this.instances.set(instanceIdentifier, instance);
            this.instancesOptions.set(instanceIdentifier, options);
            this.invokeOnInitCallbacks(instance, instanceIdentifier);
            if (this.component.onInstanceCreated) {
                try {
                    this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
                } catch (_a) {}
            }
        }
        return instance || null;
    }
    normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME) {
        if (this.component) {
            return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
        } else {
            return identifier;
        }
    }
    shouldAutoInitialize() {
        return !!this.component && this.component.instantiationMode !== "EXPLICIT";
    }
}
function normalizeIdentifierForFactory(identifier) {
    return identifier === DEFAULT_ENTRY_NAME ? void 0 : identifier;
}
function isComponentEager(component2) {
    return component2.instantiationMode === "EAGER";
}
class ComponentContainer {
    constructor(name7){
        this.name = name7;
        this.providers = new Map();
    }
    addComponent(component3) {
        const provider = this.getProvider(component3.name);
        if (provider.isComponentSet()) {
            throw new Error(`Component ${component3.name} has already been registered with ${this.name}`);
        }
        provider.setComponent(component3);
    }
    addOrOverwriteComponent(component4) {
        const provider = this.getProvider(component4.name);
        if (provider.isComponentSet()) {
            this.providers.delete(component4.name);
        }
        this.addComponent(component4);
    }
    getProvider(name8) {
        if (this.providers.has(name8)) {
            return this.providers.get(name8);
        }
        const provider = new Provider(name8, this);
        this.providers.set(name8, provider);
        return provider;
    }
    getProviders() {
        return Array.from(this.providers.values());
    }
}
const instances = [];
var LogLevel;
(function(LogLevel2) {
    LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
    LogLevel2[LogLevel2["VERBOSE"] = 1] = "VERBOSE";
    LogLevel2[LogLevel2["INFO"] = 2] = "INFO";
    LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
    LogLevel2[LogLevel2["ERROR"] = 4] = "ERROR";
    LogLevel2[LogLevel2["SILENT"] = 5] = "SILENT";
})(LogLevel || (LogLevel = {}));
const levelStringToEnum = {
    debug: LogLevel.DEBUG,
    verbose: LogLevel.VERBOSE,
    info: LogLevel.INFO,
    warn: LogLevel.WARN,
    error: LogLevel.ERROR,
    silent: LogLevel.SILENT
};
const defaultLogLevel = LogLevel.INFO;
const ConsoleMethod = {
    [LogLevel.DEBUG]: "log",
    [LogLevel.VERBOSE]: "log",
    [LogLevel.INFO]: "info",
    [LogLevel.WARN]: "warn",
    [LogLevel.ERROR]: "error"
};
const defaultLogHandler = (instance, logType, ...args)=>{
    if (logType < instance.logLevel) {
        return;
    }
    const now = new Date().toISOString();
    const method = ConsoleMethod[logType];
    if (method) {
        console[method](`[${now}]  ${instance.name}:`, ...args);
    } else {
        throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
    }
};
class Logger {
    constructor(name9){
        this.name = name9;
        this._logLevel = defaultLogLevel;
        this._logHandler = defaultLogHandler;
        this._userLogHandler = null;
        instances.push(this);
    }
    get logLevel() {
        return this._logLevel;
    }
    set logLevel(val) {
        if (!(val in LogLevel)) {
            throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
        }
        this._logLevel = val;
    }
    setLogLevel(val) {
        this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
    }
    get logHandler() {
        return this._logHandler;
    }
    set logHandler(val) {
        if (typeof val !== "function") {
            throw new TypeError("Value assigned to `logHandler` must be a function");
        }
        this._logHandler = val;
    }
    get userLogHandler() {
        return this._userLogHandler;
    }
    set userLogHandler(val) {
        this._userLogHandler = val;
    }
    debug(...args) {
        this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
        this._logHandler(this, LogLevel.DEBUG, ...args);
    }
    log(...args) {
        this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
        this._logHandler(this, LogLevel.VERBOSE, ...args);
    }
    info(...args) {
        this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
        this._logHandler(this, LogLevel.INFO, ...args);
    }
    warn(...args) {
        this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
        this._logHandler(this, LogLevel.WARN, ...args);
    }
    error(...args) {
        this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
        this._logHandler(this, LogLevel.ERROR, ...args);
    }
}
class PlatformLoggerServiceImpl {
    constructor(container){
        this.container = container;
    }
    getPlatformInfoString() {
        const providers = this.container.getProviders();
        return providers.map((provider)=>{
            if (isVersionServiceProvider(provider)) {
                const service = provider.getImmediate();
                return `${service.library}/${service.version}`;
            } else {
                return null;
            }
        }).filter((logString)=>logString
        ).join(" ");
    }
}
function isVersionServiceProvider(provider) {
    const component2 = provider.getComponent();
    return (component2 === null || component2 === void 0 ? void 0 : component2.type) === "VERSION";
}
const name$o = "@firebase/app";
const version$1 = "0.7.20";
const logger2 = new Logger("@firebase/app");
const name$n = "@firebase/app-compat";
const name$m = "@firebase/analytics-compat";
const name$l = "@firebase/analytics";
const name$k = "@firebase/app-check-compat";
const name$j = "@firebase/app-check";
const name$i = "@firebase/auth";
const name$h = "@firebase/auth-compat";
const name$g = "@firebase/database";
const name$f = "@firebase/database-compat";
const name$e = "@firebase/functions";
const name$d = "@firebase/functions-compat";
const name$c = "@firebase/installations";
const name$b = "@firebase/installations-compat";
const name$a = "@firebase/messaging";
const name$9 = "@firebase/messaging-compat";
const name$8 = "@firebase/performance";
const name$7 = "@firebase/performance-compat";
const name$6 = "@firebase/remote-config";
const name$5 = "@firebase/remote-config-compat";
const name$4 = "@firebase/storage";
const name$3 = "@firebase/storage-compat";
const name$2 = "@firebase/firestore";
const name$1 = "@firebase/firestore-compat";
const name = "firebase";
const version = "9.6.10";
const DEFAULT_ENTRY_NAME1 = "[DEFAULT]";
const PLATFORM_LOG_STRING = {
    [name$o]: "fire-core",
    [name$n]: "fire-core-compat",
    [name$l]: "fire-analytics",
    [name$m]: "fire-analytics-compat",
    [name$j]: "fire-app-check",
    [name$k]: "fire-app-check-compat",
    [name$i]: "fire-auth",
    [name$h]: "fire-auth-compat",
    [name$g]: "fire-rtdb",
    [name$f]: "fire-rtdb-compat",
    [name$e]: "fire-fn",
    [name$d]: "fire-fn-compat",
    [name$c]: "fire-iid",
    [name$b]: "fire-iid-compat",
    [name$a]: "fire-fcm",
    [name$9]: "fire-fcm-compat",
    [name$8]: "fire-perf",
    [name$7]: "fire-perf-compat",
    [name$6]: "fire-rc",
    [name$5]: "fire-rc-compat",
    [name$4]: "fire-gcs",
    [name$3]: "fire-gcs-compat",
    [name$2]: "fire-fst",
    [name$1]: "fire-fst-compat",
    "fire-js": "fire-js",
    [name]: "fire-js-all"
};
const _apps = new Map();
const _components = new Map();
function _addComponent(app, component2) {
    try {
        app.container.addComponent(component2);
    } catch (e) {
        logger2.debug(`Component ${component2.name} failed to register with FirebaseApp ${app.name}`, e);
    }
}
function _registerComponent(component2) {
    const componentName = component2.name;
    if (_components.has(componentName)) {
        logger2.debug(`There were multiple attempts to register component ${componentName}.`);
        return false;
    }
    _components.set(componentName, component2);
    for (const app of _apps.values()){
        _addComponent(app, component2);
    }
    return true;
}
function _getProvider(app, name2) {
    const heartbeatController = app.container.getProvider("heartbeat").getImmediate({
        optional: true
    });
    if (heartbeatController) {
        void heartbeatController.triggerHeartbeat();
    }
    return app.container.getProvider(name2);
}
const ERRORS = {
    ["no-app"]: "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()",
    ["bad-app-name"]: "Illegal App name: '{$appName}",
    ["duplicate-app"]: "Firebase App named '{$appName}' already exists with different options or config",
    ["app-deleted"]: "Firebase App named '{$appName}' already deleted",
    ["invalid-app-argument"]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
    ["invalid-log-argument"]: "First argument to `onLog` must be null or a function.",
    ["storage-open"]: "Error thrown when opening storage. Original error: {$originalErrorMessage}.",
    ["storage-get"]: "Error thrown when reading from storage. Original error: {$originalErrorMessage}.",
    ["storage-set"]: "Error thrown when writing to storage. Original error: {$originalErrorMessage}.",
    ["storage-delete"]: "Error thrown when deleting from storage. Original error: {$originalErrorMessage}."
};
const ERROR_FACTORY = new ErrorFactory("app", "Firebase", ERRORS);
class FirebaseAppImpl {
    constructor(options, config1, container){
        this._isDeleted = false;
        this._options = Object.assign({}, options);
        this._config = Object.assign({}, config1);
        this._name = config1.name;
        this._automaticDataCollectionEnabled = config1.automaticDataCollectionEnabled;
        this._container = container;
        this.container.addComponent(new Component("app", ()=>this
        , "PUBLIC"));
    }
    get automaticDataCollectionEnabled() {
        this.checkDestroyed();
        return this._automaticDataCollectionEnabled;
    }
    set automaticDataCollectionEnabled(val) {
        this.checkDestroyed();
        this._automaticDataCollectionEnabled = val;
    }
    get name() {
        this.checkDestroyed();
        return this._name;
    }
    get options() {
        this.checkDestroyed();
        return this._options;
    }
    get config() {
        this.checkDestroyed();
        return this._config;
    }
    get container() {
        return this._container;
    }
    get isDeleted() {
        return this._isDeleted;
    }
    set isDeleted(val) {
        this._isDeleted = val;
    }
    checkDestroyed() {
        if (this.isDeleted) {
            throw ERROR_FACTORY.create("app-deleted", {
                appName: this._name
            });
        }
    }
}
const SDK_VERSION = version;
function initializeApp(options, rawConfig = {}) {
    if (typeof rawConfig !== "object") {
        const name3 = rawConfig;
        rawConfig = {
            name: name3
        };
    }
    const config2 = Object.assign({
        name: DEFAULT_ENTRY_NAME1,
        automaticDataCollectionEnabled: false
    }, rawConfig);
    const name2 = config2.name;
    if (typeof name2 !== "string" || !name2) {
        throw ERROR_FACTORY.create("bad-app-name", {
            appName: String(name2)
        });
    }
    const existingApp = _apps.get(name2);
    if (existingApp) {
        if (deepEqual(options, existingApp.options) && deepEqual(config2, existingApp.config)) {
            return existingApp;
        } else {
            throw ERROR_FACTORY.create("duplicate-app", {
                appName: name2
            });
        }
    }
    const container = new ComponentContainer(name2);
    for (const component2 of _components.values()){
        container.addComponent(component2);
    }
    const newApp = new FirebaseAppImpl(options, config2, container);
    _apps.set(name2, newApp);
    return newApp;
}
function getApp(name2 = DEFAULT_ENTRY_NAME1) {
    const app = _apps.get(name2);
    if (!app) {
        throw ERROR_FACTORY.create("no-app", {
            appName: name2
        });
    }
    return app;
}
function registerVersion(libraryKeyOrName, version2, variant) {
    var _a;
    let library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== void 0 ? _a : libraryKeyOrName;
    if (variant) {
        library += `-${variant}`;
    }
    const libraryMismatch = library.match(/\s|\//);
    const versionMismatch = version2.match(/\s|\//);
    if (libraryMismatch || versionMismatch) {
        const warning = [
            `Unable to register library "${library}" with version "${version2}":`
        ];
        if (libraryMismatch) {
            warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
        }
        if (libraryMismatch && versionMismatch) {
            warning.push("and");
        }
        if (versionMismatch) {
            warning.push(`version name "${version2}" contains illegal characters (whitespace or "/")`);
        }
        logger2.warn(warning.join(" "));
        return;
    }
    _registerComponent(new Component(`${library}-version`, ()=>({
            library,
            version: version2
        })
    , "VERSION"));
}
const DB_NAME = "firebase-heartbeat-database";
const DB_VERSION = 1;
const STORE_NAME = "firebase-heartbeat-store";
let dbPromise = null;
function getDbPromise() {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, DB_VERSION, (db2, oldVersion)=>{
            switch(oldVersion){
                case 0:
                    db2.createObjectStore(STORE_NAME);
            }
        }).catch((e)=>{
            throw ERROR_FACTORY.create("storage-open", {
                originalErrorMessage: e.message
            });
        });
    }
    return dbPromise;
}
async function readHeartbeatsFromIndexedDB(app) {
    try {
        const db3 = await getDbPromise();
        return db3.transaction(STORE_NAME).objectStore(STORE_NAME).get(computeKey(app));
    } catch (e) {
        throw ERROR_FACTORY.create("storage-get", {
            originalErrorMessage: e.message
        });
    }
}
async function writeHeartbeatsToIndexedDB(app, heartbeatObject) {
    try {
        const db4 = await getDbPromise();
        const tx = db4.transaction(STORE_NAME, "readwrite");
        const objectStore = tx.objectStore(STORE_NAME);
        await objectStore.put(heartbeatObject, computeKey(app));
        return tx.complete;
    } catch (e) {
        throw ERROR_FACTORY.create("storage-set", {
            originalErrorMessage: e.message
        });
    }
}
function computeKey(app) {
    return `${app.name}!${app.options.appId}`;
}
const STORED_HEARTBEAT_RETENTION_MAX_MILLIS = 30 * 24 * 60 * 60 * 1000;
class HeartbeatServiceImpl {
    constructor(container){
        this.container = container;
        this._heartbeatsCache = null;
        const app = this.container.getProvider("app").getImmediate();
        this._storage = new HeartbeatStorageImpl(app);
        this._heartbeatsCachePromise = this._storage.read().then((result)=>{
            this._heartbeatsCache = result;
            return result;
        });
    }
    async triggerHeartbeat() {
        const platformLogger = this.container.getProvider("platform-logger").getImmediate();
        const agent = platformLogger.getPlatformInfoString();
        const date = getUTCDateString();
        if (this._heartbeatsCache === null) {
            this._heartbeatsCache = await this._heartbeatsCachePromise;
        }
        if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat)=>singleDateHeartbeat.date === date
        )) {
            return;
        } else {
            this._heartbeatsCache.heartbeats.push({
                date,
                agent
            });
        }
        this._heartbeatsCache.heartbeats = this._heartbeatsCache.heartbeats.filter((singleDateHeartbeat)=>{
            const hbTimestamp = new Date(singleDateHeartbeat.date).valueOf();
            const now = Date.now();
            return now - hbTimestamp <= STORED_HEARTBEAT_RETENTION_MAX_MILLIS;
        });
        return this._storage.overwrite(this._heartbeatsCache);
    }
    async getHeartbeatsHeader() {
        if (this._heartbeatsCache === null) {
            await this._heartbeatsCachePromise;
        }
        if (this._heartbeatsCache === null || this._heartbeatsCache.heartbeats.length === 0) {
            return "";
        }
        const date = getUTCDateString();
        const { heartbeatsToSend , unsentEntries  } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
        const headerString = base64urlEncodeWithoutPadding(JSON.stringify({
            version: 2,
            heartbeats: heartbeatsToSend
        }));
        this._heartbeatsCache.lastSentHeartbeatDate = date;
        if (unsentEntries.length > 0) {
            this._heartbeatsCache.heartbeats = unsentEntries;
            await this._storage.overwrite(this._heartbeatsCache);
        } else {
            this._heartbeatsCache.heartbeats = [];
            void this._storage.overwrite(this._heartbeatsCache);
        }
        return headerString;
    }
}
function getUTCDateString() {
    const today = new Date();
    return today.toISOString().substring(0, 10);
}
function extractHeartbeatsForHeader(heartbeatsCache, maxSize = 1024) {
    const heartbeatsToSend = [];
    let unsentEntries = heartbeatsCache.slice();
    for (const singleDateHeartbeat of heartbeatsCache){
        const heartbeatEntry = heartbeatsToSend.find((hb1)=>hb1.agent === singleDateHeartbeat.agent
        );
        if (!heartbeatEntry) {
            heartbeatsToSend.push({
                agent: singleDateHeartbeat.agent,
                dates: [
                    singleDateHeartbeat.date
                ]
            });
            if (countBytes(heartbeatsToSend) > maxSize) {
                heartbeatsToSend.pop();
                break;
            }
        } else {
            heartbeatEntry.dates.push(singleDateHeartbeat.date);
            if (countBytes(heartbeatsToSend) > maxSize) {
                heartbeatEntry.dates.pop();
                break;
            }
        }
        unsentEntries = unsentEntries.slice(1);
    }
    return {
        heartbeatsToSend,
        unsentEntries
    };
}
class HeartbeatStorageImpl {
    constructor(app){
        this.app = app;
        this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
    }
    async runIndexedDBEnvironmentCheck() {
        if (!isIndexedDBAvailable()) {
            return false;
        } else {
            return validateIndexedDBOpenable().then(()=>true
            ).catch(()=>false
            );
        }
    }
    async read() {
        const canUseIndexedDB = await this._canUseIndexedDBPromise;
        if (!canUseIndexedDB) {
            return {
                heartbeats: []
            };
        } else {
            const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
            return idbHeartbeatObject || {
                heartbeats: []
            };
        }
    }
    async overwrite(heartbeatsObject) {
        var _a;
        const canUseIndexedDB = await this._canUseIndexedDBPromise;
        if (!canUseIndexedDB) {
            return;
        } else {
            const existingHeartbeatsObject = await this.read();
            return writeHeartbeatsToIndexedDB(this.app, {
                lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
                heartbeats: heartbeatsObject.heartbeats
            });
        }
    }
    async add(heartbeatsObject) {
        var _a;
        const canUseIndexedDB = await this._canUseIndexedDBPromise;
        if (!canUseIndexedDB) {
            return;
        } else {
            const existingHeartbeatsObject = await this.read();
            return writeHeartbeatsToIndexedDB(this.app, {
                lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
                heartbeats: [
                    ...existingHeartbeatsObject.heartbeats,
                    ...heartbeatsObject.heartbeats
                ]
            });
        }
    }
}
function countBytes(heartbeatsCache) {
    return base64urlEncodeWithoutPadding(JSON.stringify({
        version: 2,
        heartbeats: heartbeatsCache
    })).length;
}
function registerCoreComponents(variant) {
    _registerComponent(new Component("platform-logger", (container)=>new PlatformLoggerServiceImpl(container)
    , "PRIVATE"));
    _registerComponent(new Component("heartbeat", (container)=>new HeartbeatServiceImpl(container)
    , "PRIVATE"));
    registerVersion(name$o, version$1, variant);
    registerVersion(name$o, version$1, "esm2017");
    registerVersion("fire-js", "");
}
registerCoreComponents("");
var name1 = "firebase";
var version1 = "9.6.10";
registerVersion(name1, version1, "app");
var global$11 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global$11 !== "undefined" ? global$11 : typeof self !== "undefined" ? self : {};
var esm = {};
var k, goog = goog || {}, l = commonjsGlobal || self;
function aa() {}
function ba(a) {
    var b = typeof a;
    b = b != "object" ? b : a ? Array.isArray(a) ? "array" : b : "null";
    return b == "array" || b == "object" && typeof a.length == "number";
}
function p(a) {
    var b = typeof a;
    return b == "object" && a != null || b == "function";
}
function da(a) {
    return Object.prototype.hasOwnProperty.call(a, ea) && a[ea] || (a[ea] = ++fa);
}
var ea = "closure_uid_" + (1000000000 * Math.random() >>> 0), fa = 0;
function ha(a, b, c) {
    return a.call.apply(a.bind, arguments);
}
function ia(a, b, c) {
    if (!a) throw Error();
    if (2 < arguments.length) {
        var d = Array.prototype.slice.call(arguments, 2);
        return function() {
            var e = Array.prototype.slice.call(arguments);
            Array.prototype.unshift.apply(e, d);
            return a.apply(b, e);
        };
    }
    return function() {
        return a.apply(b, arguments);
    };
}
function q(a, b, c) {
    Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? q = ha : q = ia;
    return q.apply(null, arguments);
}
function ja(a, b) {
    var c = Array.prototype.slice.call(arguments, 1);
    return function() {
        var d = c.slice();
        d.push.apply(d, arguments);
        return a.apply(this, d);
    };
}
function t(a, b) {
    function c() {}
    c.prototype = b.prototype;
    a.Z = b.prototype;
    a.prototype = new c();
    a.prototype.constructor = a;
    a.Vb = function(d, e, f) {
        for(var h = Array(arguments.length - 2), n = 2; n < arguments.length; n++)h[n - 2] = arguments[n];
        return b.prototype[e].apply(d, h);
    };
}
function v() {
    this.s = this.s;
    this.o = this.o;
}
var ka = 0;
v.prototype.s = false;
v.prototype.na = function() {
    if (!this.s && (this.s = true, this.M(), ka != 0)) {
        da(this);
    }
};
v.prototype.M = function() {
    if (this.o) for(; this.o.length;)this.o.shift()();
};
const ma = Array.prototype.indexOf ? function(a, b) {
    return Array.prototype.indexOf.call(a, b, void 0);
} : function(a, b) {
    if (typeof a === "string") return typeof b !== "string" || b.length != 1 ? -1 : a.indexOf(b, 0);
    for(let c = 0; c < a.length; c++)if (c in a && a[c] === b) return c;
    return -1;
}, na = Array.prototype.forEach ? function(a, b, c) {
    Array.prototype.forEach.call(a, b, c);
} : function(a, b, c) {
    const d = a.length, e = typeof a === "string" ? a.split("") : a;
    for(let f = 0; f < d; f++)f in e && b.call(c, e[f], f, a);
};
function oa(a) {
    a: {
        var b = pa;
        const c = a.length, d = typeof a === "string" ? a.split("") : a;
        for(let e = 0; e < c; e++)if (e in d && b.call(void 0, d[e], e, a)) {
            b = e;
            break a;
        }
        b = -1;
    }
    return 0 > b ? null : typeof a === "string" ? a.charAt(b) : a[b];
}
function qa(a) {
    return Array.prototype.concat.apply([], arguments);
}
function ra(a) {
    const b = a.length;
    if (0 < b) {
        const c = Array(b);
        for(let d = 0; d < b; d++)c[d] = a[d];
        return c;
    }
    return [];
}
function sa(a) {
    return /^[\s\xa0]*$/.test(a);
}
var ta = String.prototype.trim ? function(a) {
    return a.trim();
} : function(a) {
    return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1];
};
function w(a, b) {
    return a.indexOf(b) != -1;
}
function ua(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}
var x;
a: {
    var va = l.navigator;
    if (va) {
        var wa = va.userAgent;
        if (wa) {
            x = wa;
            break a;
        }
    }
    x = "";
}
function xa(a, b, c) {
    for(const d in a)b.call(c, a[d], d, a);
}
function ya(a) {
    const b = {};
    for(const c in a)b[c] = a[c];
    return b;
}
var za = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function Aa(a, b) {
    let c, d;
    for(let e = 1; e < arguments.length; e++){
        d = arguments[e];
        for(c in d)a[c] = d[c];
        for(let f = 0; f < za.length; f++)c = za[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
    }
}
function Ca(a) {
    Ca[" "](a);
    return a;
}
Ca[" "] = aa;
function Fa(a) {
    var b = Ga;
    return Object.prototype.hasOwnProperty.call(b, 9) ? b[9] : b[9] = a(9);
}
var Ha = w(x, "Opera"), y = w(x, "Trident") || w(x, "MSIE"), Ia = w(x, "Edge"), Ja = Ia || y, Ka = w(x, "Gecko") && !(w(x.toLowerCase(), "webkit") && !w(x, "Edge")) && !(w(x, "Trident") || w(x, "MSIE")) && !w(x, "Edge"), La = w(x.toLowerCase(), "webkit") && !w(x, "Edge");
function Ma() {
    var a = l.document;
    return a ? a.documentMode : void 0;
}
var Na;
a: {
    var Oa = "", Pa = function() {
        var a = x;
        if (Ka) return /rv:([^\);]+)(\)|;)/.exec(a);
        if (Ia) return /Edge\/([\d\.]+)/.exec(a);
        if (y) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
        if (La) return /WebKit\/(\S+)/.exec(a);
        if (Ha) return /(?:Version)[ \/]?(\S+)/.exec(a);
    }();
    Pa && (Oa = Pa ? Pa[1] : "");
    if (y) {
        var Qa = Ma();
        if (Qa != null && Qa > parseFloat(Oa)) {
            Na = String(Qa);
            break a;
        }
    }
    Na = Oa;
}
var Ga = {};
function Ra() {
    return Fa(function() {
        let a = 0;
        const b = ta(String(Na)).split("."), c = ta("9").split("."), d = Math.max(b.length, c.length);
        for(let h = 0; a == 0 && h < d; h++){
            var e = b[h] || "", f = c[h] || "";
            do {
                e = /(\d*)(\D*)(.*)/.exec(e) || [
                    "",
                    "",
                    "",
                    ""
                ];
                f = /(\d*)(\D*)(.*)/.exec(f) || [
                    "",
                    "",
                    "",
                    ""
                ];
                if (e[0].length == 0 && f[0].length == 0) break;
                a = ua(e[1].length == 0 ? 0 : parseInt(e[1], 10), f[1].length == 0 ? 0 : parseInt(f[1], 10)) || ua(e[2].length == 0, f[2].length == 0) || ua(e[2], f[2]);
                e = e[3];
                f = f[3];
            }while (a == 0)
        }
        return 0 <= a;
    });
}
var Sa;
if (l.document && y) {
    var Ta = Ma();
    Sa = Ta ? Ta : parseInt(Na, 10) || void 0;
} else Sa = void 0;
var Ua = Sa;
var Va = function() {
    if (!l.addEventListener || !Object.defineProperty) return false;
    var a = false, b = Object.defineProperty({}, "passive", {
        get: function() {
            a = true;
        }
    });
    try {
        l.addEventListener("test", aa, b), l.removeEventListener("test", aa, b);
    } catch (c) {}
    return a;
}();
function z(a, b) {
    this.type = a;
    this.g = this.target = b;
    this.defaultPrevented = false;
}
z.prototype.h = function() {
    this.defaultPrevented = true;
};
function A(a, b) {
    z.call(this, a ? a.type : "");
    this.relatedTarget = this.g = this.target = null;
    this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
    this.key = "";
    this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = false;
    this.state = null;
    this.pointerId = 0;
    this.pointerType = "";
    this.i = null;
    if (a) {
        var c = this.type = a.type, d = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
        this.target = a.target || a.srcElement;
        this.g = b;
        if (b = a.relatedTarget) {
            if (Ka) {
                a: {
                    try {
                        Ca(b.nodeName);
                        var e = true;
                        break a;
                    } catch (f) {}
                    e = false;
                }
                e || (b = null);
            }
        } else c == "mouseover" ? b = a.fromElement : c == "mouseout" && (b = a.toElement);
        this.relatedTarget = b;
        d ? (this.clientX = d.clientX !== void 0 ? d.clientX : d.pageX, this.clientY = d.clientY !== void 0 ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0) : (this.clientX = a.clientX !== void 0 ? a.clientX : a.pageX, this.clientY = a.clientY !== void 0 ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0);
        this.button = a.button;
        this.key = a.key || "";
        this.ctrlKey = a.ctrlKey;
        this.altKey = a.altKey;
        this.shiftKey = a.shiftKey;
        this.metaKey = a.metaKey;
        this.pointerId = a.pointerId || 0;
        this.pointerType = typeof a.pointerType === "string" ? a.pointerType : Wa[a.pointerType] || "";
        this.state = a.state;
        this.i = a;
        a.defaultPrevented && A.Z.h.call(this);
    }
}
t(A, z);
var Wa = {
    2: "touch",
    3: "pen",
    4: "mouse"
};
A.prototype.h = function() {
    A.Z.h.call(this);
    var a = this.i;
    a.preventDefault ? a.preventDefault() : a.returnValue = false;
};
var B = "closure_listenable_" + (1000000 * Math.random() | 0);
var Xa = 0;
function Ya(a, b, c, d, e) {
    this.listener = a;
    this.proxy = null;
    this.src = b;
    this.type = c;
    this.capture = !!d;
    this.ia = e;
    this.key = ++Xa;
    this.ca = this.fa = false;
}
function Za(a) {
    a.ca = true;
    a.listener = null;
    a.proxy = null;
    a.src = null;
    a.ia = null;
}
function $a(a) {
    this.src = a;
    this.g = {};
    this.h = 0;
}
$a.prototype.add = function(a, b, c, d, e) {
    var f = a.toString();
    a = this.g[f];
    a || (a = this.g[f] = [], this.h++);
    var h = ab(a, b, d, e);
    -1 < h ? (b = a[h], c || (b.fa = false)) : (b = new Ya(b, this.src, f, !!d, e), b.fa = c, a.push(b));
    return b;
};
function bb(a, b) {
    var c = b.type;
    if (c in a.g) {
        var d = a.g[c], e = ma(d, b), f;
        (f = 0 <= e) && Array.prototype.splice.call(d, e, 1);
        f && (Za(b), a.g[c].length == 0 && (delete a.g[c], a.h--));
    }
}
function ab(a, b, c, d) {
    for(var e = 0; e < a.length; ++e){
        var f = a[e];
        if (!f.ca && f.listener == b && f.capture == !!c && f.ia == d) return e;
    }
    return -1;
}
var cb = "closure_lm_" + (1000000 * Math.random() | 0), db = {};
function fb(a, b, c, d, e) {
    if (d && d.once) return gb(a, b, c, d, e);
    if (Array.isArray(b)) {
        for(var f = 0; f < b.length; f++)fb(a, b[f], c, d, e);
        return null;
    }
    c = hb(c);
    return a && a[B] ? a.N(b, c, p(d) ? !!d.capture : !!d, e) : ib(a, b, c, false, d, e);
}
function ib(a, b, c, d, e, f) {
    if (!b) throw Error("Invalid event type");
    var h = p(e) ? !!e.capture : !!e, n = jb(a);
    n || (a[cb] = n = new $a(a));
    c = n.add(b, c, d, h, f);
    if (c.proxy) return c;
    d = kb();
    c.proxy = d;
    d.src = a;
    d.listener = c;
    if (a.addEventListener) Va || (e = h), e === void 0 && (e = false), a.addEventListener(b.toString(), d, e);
    else if (a.attachEvent) a.attachEvent(lb(b.toString()), d);
    else if (a.addListener && a.removeListener) a.addListener(d);
    else throw Error("addEventListener and attachEvent are unavailable.");
    return c;
}
function kb() {
    function a(c) {
        return b.call(a.src, a.listener, c);
    }
    var b = mb;
    return a;
}
function gb(a, b, c, d, e) {
    if (Array.isArray(b)) {
        for(var f = 0; f < b.length; f++)gb(a, b[f], c, d, e);
        return null;
    }
    c = hb(c);
    return a && a[B] ? a.O(b, c, p(d) ? !!d.capture : !!d, e) : ib(a, b, c, true, d, e);
}
function nb(a, b, c, d, e) {
    if (Array.isArray(b)) for(var f = 0; f < b.length; f++)nb(a, b[f], c, d, e);
    else (d = p(d) ? !!d.capture : !!d, c = hb(c), a && a[B]) ? (a = a.i, b = String(b).toString(), b in a.g && (f = a.g[b], c = ab(f, c, d, e), -1 < c && (Za(f[c]), Array.prototype.splice.call(f, c, 1), f.length == 0 && (delete a.g[b], a.h--)))) : a && (a = jb(a)) && (b = a.g[b.toString()], a = -1, b && (a = ab(b, c, d, e)), (c = -1 < a ? b[a] : null) && ob(c));
}
function ob(a) {
    if (typeof a !== "number" && a && !a.ca) {
        var b = a.src;
        if (b && b[B]) bb(b.i, a);
        else {
            var c = a.type, d = a.proxy;
            b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(lb(c), d) : b.addListener && b.removeListener && b.removeListener(d);
            (c = jb(b)) ? (bb(c, a), c.h == 0 && (c.src = null, b[cb] = null)) : Za(a);
        }
    }
}
function lb(a) {
    return a in db ? db[a] : db[a] = "on" + a;
}
function mb(a, b) {
    if (a.ca) a = true;
    else {
        b = new A(b, this);
        var c = a.listener, d = a.ia || a.src;
        a.fa && ob(a);
        a = c.call(d, b);
    }
    return a;
}
function jb(a) {
    a = a[cb];
    return a instanceof $a ? a : null;
}
var pb = "__closure_events_fn_" + (1000000000 * Math.random() >>> 0);
function hb(a) {
    if (typeof a === "function") return a;
    a[pb] || (a[pb] = function(b) {
        return a.handleEvent(b);
    });
    return a[pb];
}
function C() {
    v.call(this);
    this.i = new $a(this);
    this.P = this;
    this.I = null;
}
t(C, v);
C.prototype[B] = true;
C.prototype.removeEventListener = function(a, b, c, d) {
    nb(this, a, b, c, d);
};
function D(a, b) {
    var c, d = a.I;
    if (d) for(c = []; d; d = d.I)c.push(d);
    a = a.P;
    d = b.type || b;
    if (typeof b === "string") b = new z(b, a);
    else if (b instanceof z) b.target = b.target || a;
    else {
        var e = b;
        b = new z(d, a);
        Aa(b, e);
    }
    e = true;
    if (c) for(var f = c.length - 1; 0 <= f; f--){
        var h = b.g = c[f];
        e = qb(h, d, true, b) && e;
    }
    h = b.g = a;
    e = qb(h, d, true, b) && e;
    e = qb(h, d, false, b) && e;
    if (c) for(f = 0; f < c.length; f++)h = b.g = c[f], e = qb(h, d, false, b) && e;
}
C.prototype.M = function() {
    C.Z.M.call(this);
    if (this.i) {
        var a = this.i, c;
        for(c in a.g){
            for(var d = a.g[c], e = 0; e < d.length; e++)Za(d[e]);
            delete a.g[c];
            a.h--;
        }
    }
    this.I = null;
};
C.prototype.N = function(a, b, c, d) {
    return this.i.add(String(a), b, false, c, d);
};
C.prototype.O = function(a, b, c, d) {
    return this.i.add(String(a), b, true, c, d);
};
function qb(a, b, c, d) {
    b = a.i.g[String(b)];
    if (!b) return true;
    b = b.concat();
    for(var e = true, f = 0; f < b.length; ++f){
        var h = b[f];
        if (h && !h.ca && h.capture == c) {
            var n = h.listener, u = h.ia || h.src;
            h.fa && bb(a.i, h);
            e = n.call(u, d) !== false && e;
        }
    }
    return e && !d.defaultPrevented;
}
var rb = l.JSON.stringify;
function sb() {
    var a = tb;
    let b = null;
    a.g && (b = a.g, a.g = a.g.next, a.g || (a.h = null), b.next = null);
    return b;
}
class ub {
    constructor(){
        this.h = this.g = null;
    }
    add(a, b) {
        const c = vb.get();
        c.set(a, b);
        this.h ? this.h.next = c : this.g = c;
        this.h = c;
    }
}
var vb = new class {
    constructor(a, b){
        this.i = a;
        this.j = b;
        this.h = 0;
        this.g = null;
    }
    get() {
        let a;
        0 < this.h ? (this.h--, a = this.g, this.g = a.next, a.next = null) : a = this.i();
        return a;
    }
}(()=>new wb()
, (a)=>a.reset()
);
class wb {
    constructor(){
        this.next = this.g = this.h = null;
    }
    set(a, b) {
        this.h = a;
        this.g = b;
        this.next = null;
    }
    reset() {
        this.next = this.g = this.h = null;
    }
}
function yb(a) {
    l.setTimeout(()=>{
        throw a;
    }, 0);
}
function zb(a, b) {
    Ab || Bb();
    Cb || (Ab(), Cb = true);
    tb.add(a, b);
}
var Ab;
function Bb() {
    var a = l.Promise.resolve(void 0);
    Ab = function() {
        a.then(Db);
    };
}
var Cb = false, tb = new ub();
function Db() {
    for(var a; a = sb();){
        try {
            a.h.call(a.g);
        } catch (c) {
            yb(c);
        }
        var b = vb;
        b.j(a);
        100 > b.h && (b.h++, a.next = b.g, b.g = a);
    }
    Cb = false;
}
function Eb(a, b) {
    C.call(this);
    this.h = a || 1;
    this.g = b || l;
    this.j = q(this.kb, this);
    this.l = Date.now();
}
t(Eb, C);
k = Eb.prototype;
k.da = false;
k.S = null;
k.kb = function() {
    if (this.da) {
        var a = Date.now() - this.l;
        0 < a && a < 0.8 * this.h ? this.S = this.g.setTimeout(this.j, this.h - a) : (this.S && (this.g.clearTimeout(this.S), this.S = null), D(this, "tick"), this.da && (Fb(this), this.start()));
    }
};
k.start = function() {
    this.da = true;
    this.S || (this.S = this.g.setTimeout(this.j, this.h), this.l = Date.now());
};
function Fb(a) {
    a.da = false;
    a.S && (a.g.clearTimeout(a.S), a.S = null);
}
k.M = function() {
    Eb.Z.M.call(this);
    Fb(this);
    delete this.g;
};
function Gb(a, b, c) {
    if (typeof a === "function") c && (a = q(a, c));
    else if (a && typeof a.handleEvent == "function") a = q(a.handleEvent, a);
    else throw Error("Invalid listener argument");
    return 2147483647 < Number(b) ? -1 : l.setTimeout(a, b || 0);
}
function Hb(a) {
    a.g = Gb(()=>{
        a.g = null;
        a.i && (a.i = false, Hb(a));
    }, a.j);
    const b = a.h;
    a.h = null;
    a.m.apply(null, b);
}
class Ib extends v {
    constructor(a, b){
        super();
        this.m = a;
        this.j = b;
        this.h = null;
        this.i = false;
        this.g = null;
    }
    l(a) {
        this.h = arguments;
        this.g ? this.i = true : Hb(this);
    }
    M() {
        super.M();
        this.g && (l.clearTimeout(this.g), this.g = null, this.i = false, this.h = null);
    }
}
function E(a) {
    v.call(this);
    this.h = a;
    this.g = {};
}
t(E, v);
var Jb = [];
function Kb(a, b, c, d) {
    Array.isArray(c) || (c && (Jb[0] = c.toString()), c = Jb);
    for(var e = 0; e < c.length; e++){
        var f = fb(b, c[e], d || a.handleEvent, false, a.h || a);
        if (!f) break;
        a.g[f.key] = f;
    }
}
function Lb(a) {
    xa(a.g, function(b, c) {
        this.g.hasOwnProperty(c) && ob(b);
    }, a);
    a.g = {};
}
E.prototype.M = function() {
    E.Z.M.call(this);
    Lb(this);
};
E.prototype.handleEvent = function() {
    throw Error("EventHandler.handleEvent not implemented");
};
function Mb() {
    this.g = true;
}
Mb.prototype.Aa = function() {
    this.g = false;
};
function Nb(a, b, c, d, e, f) {
    a.info(function() {
        if (a.g) if (f) {
            var h = "";
            for(var n = f.split("&"), u = 0; u < n.length; u++){
                var m = n[u].split("=");
                if (1 < m.length) {
                    var r = m[0];
                    m = m[1];
                    var G1 = r.split("_");
                    h = 2 <= G1.length && G1[1] == "type" ? h + (r + "=" + m + "&") : h + (r + "=redacted&");
                }
            }
        } else h = null;
        else h = f;
        return "XMLHTTP REQ (" + d + ") [attempt " + e + "]: " + b + "\n" + c + "\n" + h;
    });
}
function Ob(a, b, c, d, e, f, h) {
    a.info(function() {
        return "XMLHTTP RESP (" + d + ") [ attempt " + e + "]: " + b + "\n" + c + "\n" + f + " " + h;
    });
}
function F(a, b, c, d) {
    a.info(function() {
        return "XMLHTTP TEXT (" + b + "): " + Pb(a, c) + (d ? " " + d : "");
    });
}
function Qb(a, b) {
    a.info(function() {
        return "TIMEOUT: " + b;
    });
}
Mb.prototype.info = function() {};
function Pb(a, b) {
    if (!a.g) return b;
    if (!b) return null;
    try {
        var c = JSON.parse(b);
        if (c) {
            for(a = 0; a < c.length; a++)if (Array.isArray(c[a])) {
                var d = c[a];
                if (!(2 > d.length)) {
                    var e = d[1];
                    if (Array.isArray(e) && !(1 > e.length)) {
                        var f = e[0];
                        if (f != "noop" && f != "stop" && f != "close") for(var h = 1; h < e.length; h++)e[h] = "";
                    }
                }
            }
        }
        return rb(c);
    } catch (n) {
        return b;
    }
}
var H = {}, Rb = null;
function Sb() {
    return Rb = Rb || new C();
}
H.Ma = "serverreachability";
function Tb(a) {
    z.call(this, H.Ma, a);
}
t(Tb, z);
function I(a) {
    const b = Sb();
    D(b, new Tb(b, a));
}
H.STAT_EVENT = "statevent";
function Ub(a, b) {
    z.call(this, H.STAT_EVENT, a);
    this.stat = b;
}
t(Ub, z);
function J(a) {
    const b = Sb();
    D(b, new Ub(b, a));
}
H.Na = "timingevent";
function Vb(a, b) {
    z.call(this, H.Na, a);
    this.size = b;
}
t(Vb, z);
function K(a, b) {
    if (typeof a !== "function") throw Error("Fn must not be null and must be a function");
    return l.setTimeout(function() {
        a();
    }, b);
}
var Wb = {
    NO_ERROR: 0,
    lb: 1,
    yb: 2,
    xb: 3,
    sb: 4,
    wb: 5,
    zb: 6,
    Ja: 7,
    TIMEOUT: 8,
    Cb: 9
};
var Xb = {
    qb: "complete",
    Mb: "success",
    Ka: "error",
    Ja: "abort",
    Eb: "ready",
    Fb: "readystatechange",
    TIMEOUT: "timeout",
    Ab: "incrementaldata",
    Db: "progress",
    tb: "downloadprogress",
    Ub: "uploadprogress"
};
function Yb() {}
Yb.prototype.h = null;
function Zb(a) {
    return a.h || (a.h = a.i());
}
function $b() {}
var L = {
    OPEN: "a",
    pb: "b",
    Ka: "c",
    Bb: "d"
};
function ac() {
    z.call(this, "d");
}
t(ac, z);
function bc() {
    z.call(this, "c");
}
t(bc, z);
var cc;
function dc() {}
t(dc, Yb);
dc.prototype.g = function() {
    return new XMLHttpRequest();
};
dc.prototype.i = function() {
    return {};
};
cc = new dc();
function M(a, b, c, d) {
    this.l = a;
    this.j = b;
    this.m = c;
    this.X = d || 1;
    this.V = new E(this);
    this.P = ec;
    a = Ja ? 125 : void 0;
    this.W = new Eb(a);
    this.H = null;
    this.i = false;
    this.s = this.A = this.v = this.K = this.F = this.Y = this.B = null;
    this.D = [];
    this.g = null;
    this.C = 0;
    this.o = this.u = null;
    this.N = -1;
    this.I = false;
    this.O = 0;
    this.L = null;
    this.aa = this.J = this.$ = this.U = false;
    this.h = new fc();
}
function fc() {
    this.i = null;
    this.g = "";
    this.h = false;
}
var ec = 45000, gc = {}, hc = {};
k = M.prototype;
k.setTimeout = function(a) {
    this.P = a;
};
function ic(a, b, c) {
    a.K = 1;
    a.v = jc(N(b));
    a.s = c;
    a.U = true;
    kc(a, null);
}
function kc(a, b) {
    a.F = Date.now();
    lc(a);
    a.A = N(a.v);
    var c = a.A, d = a.X;
    Array.isArray(d) || (d = [
        String(d)
    ]);
    mc(c.h, "t", d);
    a.C = 0;
    c = a.l.H;
    a.h = new fc();
    a.g = nc(a.l, c ? b : null, !a.s);
    0 < a.O && (a.L = new Ib(q(a.Ia, a, a.g), a.O));
    Kb(a.V, a.g, "readystatechange", a.gb);
    b = a.H ? ya(a.H) : {};
    a.s ? (a.u || (a.u = "POST"), b["Content-Type"] = "application/x-www-form-urlencoded", a.g.ea(a.A, a.u, a.s, b)) : (a.u = "GET", a.g.ea(a.A, a.u, null, b));
    I(1);
    Nb(a.j, a.u, a.A, a.m, a.X, a.s);
}
k.gb = function(a) {
    a = a.target;
    const b = this.L;
    b && O(a) == 3 ? b.l() : this.Ia(a);
};
k.Ia = function(a) {
    try {
        if (a == this.g) a: {
            const r = O(this.g);
            var b = this.g.Da();
            const G2 = this.g.ba();
            if (!(3 > r) && (r != 3 || Ja || this.g && (this.h.h || this.g.ga() || oc(this.g)))) {
                this.I || r != 4 || b == 7 || (b == 8 || 0 >= G2 ? I(3) : I(2));
                pc(this);
                var c = this.g.ba();
                this.N = c;
                b: if (qc(this)) {
                    var d = oc(this.g);
                    a = "";
                    var e = d.length, f = O(this.g) == 4;
                    if (!this.h.i) {
                        if (typeof TextDecoder === "undefined") {
                            P(this);
                            rc(this);
                            var h = "";
                            break b;
                        }
                        this.h.i = new l.TextDecoder();
                    }
                    for(b = 0; b < e; b++)this.h.h = true, a += this.h.i.decode(d[b], {
                        stream: f && b == e - 1
                    });
                    d.splice(0, e);
                    this.h.g += a;
                    this.C = 0;
                    h = this.h.g;
                } else h = this.g.ga();
                this.i = c == 200;
                Ob(this.j, this.u, this.A, this.m, this.X, r, c);
                if (this.i) {
                    if (this.$ && !this.J) {
                        b: {
                            if (this.g) {
                                var n, u = this.g;
                                if ((n = u.g ? u.g.getResponseHeader("X-HTTP-Initial-Response") : null) && !sa(n)) {
                                    var m = n;
                                    break b;
                                }
                            }
                            m = null;
                        }
                        if (c = m) F(this.j, this.m, c, "Initial handshake response via X-HTTP-Initial-Response"), this.J = true, sc(this, c);
                        else {
                            this.i = false;
                            this.o = 3;
                            J(12);
                            P(this);
                            rc(this);
                            break a;
                        }
                    }
                    this.U ? (tc(this, r, h), Ja && this.i && r == 3 && (Kb(this.V, this.W, "tick", this.fb), this.W.start())) : (F(this.j, this.m, h, null), sc(this, h));
                    r == 4 && P(this);
                    this.i && !this.I && (r == 4 ? uc(this.l, this) : (this.i = false, lc(this)));
                } else c == 400 && 0 < h.indexOf("Unknown SID") ? (this.o = 3, J(12)) : (this.o = 0, J(13)), P(this), rc(this);
            }
        }
    } catch (r) {} finally{}
};
function qc(a) {
    return a.g ? a.u == "GET" && a.K != 2 && a.l.Ba : false;
}
function tc(a, b, c) {
    let d = true, e;
    for(; !a.I && a.C < c.length;)if (e = vc(a, c), e == hc) {
        b == 4 && (a.o = 4, J(14), d = false);
        F(a.j, a.m, null, "[Incomplete Response]");
        break;
    } else if (e == gc) {
        a.o = 4;
        J(15);
        F(a.j, a.m, c, "[Invalid Chunk]");
        d = false;
        break;
    } else F(a.j, a.m, e, null), sc(a, e);
    qc(a) && e != hc && e != gc && (a.h.g = "", a.C = 0);
    b != 4 || c.length != 0 || a.h.h || (a.o = 1, J(16), d = false);
    a.i = a.i && d;
    d ? 0 < c.length && !a.aa && (a.aa = true, b = a.l, b.g == a && b.$ && !b.L && (b.h.info("Great, no buffering proxy detected. Bytes received: " + c.length), wc(b), b.L = true, J(11))) : (F(a.j, a.m, c, "[Invalid Chunked Response]"), P(a), rc(a));
}
k.fb = function() {
    if (this.g) {
        var a = O(this.g), b = this.g.ga();
        this.C < b.length && (pc(this), tc(this, a, b), this.i && a != 4 && lc(this));
    }
};
function vc(a, b) {
    var c = a.C, d = b.indexOf("\n", c);
    if (d == -1) return hc;
    c = Number(b.substring(c, d));
    if (isNaN(c)) return gc;
    d += 1;
    if (d + c > b.length) return hc;
    b = b.substr(d, c);
    a.C = d + c;
    return b;
}
k.cancel = function() {
    this.I = true;
    P(this);
};
function lc(a) {
    a.Y = Date.now() + a.P;
    xc(a, a.P);
}
function xc(a, b) {
    if (a.B != null) throw Error("WatchDog timer not null");
    a.B = K(q(a.eb, a), b);
}
function pc(a) {
    a.B && (l.clearTimeout(a.B), a.B = null);
}
k.eb = function() {
    this.B = null;
    const a = Date.now();
    0 <= a - this.Y ? (Qb(this.j, this.A), this.K != 2 && (I(3), J(17)), P(this), this.o = 2, rc(this)) : xc(this, this.Y - a);
};
function rc(a) {
    a.l.G == 0 || a.I || uc(a.l, a);
}
function P(a) {
    pc(a);
    var b = a.L;
    b && typeof b.na == "function" && b.na();
    a.L = null;
    Fb(a.W);
    Lb(a.V);
    a.g && (b = a.g, a.g = null, b.abort(), b.na());
}
function sc(a, b) {
    try {
        var c = a.l;
        if (c.G != 0 && (c.g == a || yc(c.i, a))) {
            if (c.I = a.N, !a.J && yc(c.i, a) && c.G == 3) {
                try {
                    var d = c.Ca.g.parse(b);
                } catch (m) {
                    d = null;
                }
                if (Array.isArray(d) && d.length == 3) {
                    var e = d;
                    if (e[0] == 0) a: {
                        if (!c.u) {
                            if (c.g) if (c.g.F + 3000 < a.F) zc(c), Ac(c);
                            else break a;
                            Bc(c);
                            J(18);
                        }
                    }
                    else c.ta = e[1], 0 < c.ta - c.U && 37500 > e[2] && c.N && c.A == 0 && !c.v && (c.v = K(q(c.ab, c), 6000));
                    if (1 >= Cc(c.i) && c.ka) {
                        try {
                            c.ka();
                        } catch (m) {}
                        c.ka = void 0;
                    }
                } else Q(c, 11);
            } else if ((a.J || c.g == a) && zc(c), !sa(b)) for(e = c.Ca.g.parse(b), b = 0; b < e.length; b++){
                let m = e[b];
                c.U = m[0];
                m = m[1];
                if (c.G == 2) if (m[0] == "c") {
                    c.J = m[1];
                    c.la = m[2];
                    const r = m[3];
                    r != null && (c.ma = r, c.h.info("VER=" + c.ma));
                    const G3 = m[4];
                    G3 != null && (c.za = G3, c.h.info("SVER=" + c.za));
                    const Da = m[5];
                    Da != null && typeof Da === "number" && 0 < Da && (d = 1.5 * Da, c.K = d, c.h.info("backChannelRequestTimeoutMs_=" + d));
                    d = c;
                    const ca1 = a.g;
                    if (ca1) {
                        const Ea = ca1.g ? ca1.g.getResponseHeader("X-Client-Wire-Protocol") : null;
                        if (Ea) {
                            var f = d.i;
                            !f.g && (w(Ea, "spdy") || w(Ea, "quic") || w(Ea, "h2")) && (f.j = f.l, f.g = new Set(), f.h && (Dc(f, f.h), f.h = null));
                        }
                        if (d.D) {
                            const xb = ca1.g ? ca1.g.getResponseHeader("X-HTTP-Session-Id") : null;
                            xb && (d.sa = xb, R(d.F, d.D, xb));
                        }
                    }
                    c.G = 3;
                    c.j && c.j.xa();
                    c.$ && (c.O = Date.now() - a.F, c.h.info("Handshake RTT: " + c.O + "ms"));
                    d = c;
                    var h = a;
                    d.oa = Ec(d, d.H ? d.la : null, d.W);
                    if (h.J) {
                        Fc(d.i, h);
                        var n = h, u = d.K;
                        u && n.setTimeout(u);
                        n.B && (pc(n), lc(n));
                        d.g = h;
                    } else Gc(d);
                    0 < c.l.length && Hc(c);
                } else m[0] != "stop" && m[0] != "close" || Q(c, 7);
                else c.G == 3 && (m[0] == "stop" || m[0] == "close" ? m[0] == "stop" ? Q(c, 7) : Ic(c) : m[0] != "noop" && c.j && c.j.wa(m), c.A = 0);
            }
        }
        I(4);
    } catch (m) {}
}
function Jc(a) {
    if (a.R && typeof a.R == "function") return a.R();
    if (typeof a === "string") return a.split("");
    if (ba(a)) {
        for(var b = [], c = a.length, d = 0; d < c; d++)b.push(a[d]);
        return b;
    }
    b = [];
    c = 0;
    for(d in a)b[c++] = a[d];
    return b;
}
function Kc(a, b) {
    if (a.forEach && typeof a.forEach == "function") a.forEach(b, void 0);
    else if (ba(a) || typeof a === "string") na(a, b, void 0);
    else {
        if (a.T && typeof a.T == "function") var c = a.T();
        else if (a.R && typeof a.R == "function") c = void 0;
        else if (ba(a) || typeof a === "string") {
            c = [];
            for(var d = a.length, e = 0; e < d; e++)c.push(e);
        } else for(e in c = [], d = 0, a)c[d++] = e;
        d = Jc(a);
        e = d.length;
        for(var f = 0; f < e; f++)b.call(void 0, d[f], c && c[f], a);
    }
}
function S(a, b) {
    this.h = {};
    this.g = [];
    this.i = 0;
    var c = arguments.length;
    if (1 < c) {
        if (c % 2) throw Error("Uneven number of arguments");
        for(var d = 0; d < c; d += 2)this.set(arguments[d], arguments[d + 1]);
    } else if (a) if (a instanceof S) for(c = a.T(), d = 0; d < c.length; d++)this.set(c[d], a.get(c[d]));
    else for(d in a)this.set(d, a[d]);
}
k = S.prototype;
k.R = function() {
    Lc(this);
    for(var a = [], b = 0; b < this.g.length; b++)a.push(this.h[this.g[b]]);
    return a;
};
k.T = function() {
    Lc(this);
    return this.g.concat();
};
function Lc(a) {
    if (a.i != a.g.length) {
        for(var b = 0, c = 0; b < a.g.length;){
            var d = a.g[b];
            T(a.h, d) && (a.g[c++] = d);
            b++;
        }
        a.g.length = c;
    }
    if (a.i != a.g.length) {
        var e = {};
        for(c = b = 0; b < a.g.length;)d = a.g[b], T(e, d) || (a.g[c++] = d, e[d] = 1), b++;
        a.g.length = c;
    }
}
k.get = function(a, b) {
    return T(this.h, a) ? this.h[a] : b;
};
k.set = function(a, b) {
    T(this.h, a) || (this.i++, this.g.push(a));
    this.h[a] = b;
};
k.forEach = function(a, b) {
    for(var c = this.T(), d = 0; d < c.length; d++){
        var e = c[d], f = this.get(e);
        a.call(b, f, e, this);
    }
};
function T(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
}
var Mc = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^\\/?#]*)@)?([^\\/?#]*?)(?::([0-9]+))?(?=[\\/?#]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;
function Nc(a, b) {
    if (a) {
        a = a.split("&");
        for(var c = 0; c < a.length; c++){
            var d = a[c].indexOf("="), e = null;
            if (0 <= d) {
                var f = a[c].substring(0, d);
                e = a[c].substring(d + 1);
            } else f = a[c];
            b(f, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "");
        }
    }
}
function U(a, b) {
    this.i = this.s = this.j = "";
    this.m = null;
    this.o = this.l = "";
    this.g = false;
    if (a instanceof U) {
        this.g = b !== void 0 ? b : a.g;
        Oc(this, a.j);
        this.s = a.s;
        Pc(this, a.i);
        Qc(this, a.m);
        this.l = a.l;
        b = a.h;
        var c = new Rc();
        c.i = b.i;
        b.g && (c.g = new S(b.g), c.h = b.h);
        Sc(this, c);
        this.o = a.o;
    } else a && (c = String(a).match(Mc)) ? (this.g = !!b, Oc(this, c[1] || "", true), this.s = Tc(c[2] || ""), Pc(this, c[3] || "", true), Qc(this, c[4]), this.l = Tc(c[5] || "", true), Sc(this, c[6] || "", true), this.o = Tc(c[7] || "")) : (this.g = !!b, this.h = new Rc(null, this.g));
}
U.prototype.toString = function() {
    var a = [], b = this.j;
    b && a.push(Uc(b, Vc, true), ":");
    var c = this.i;
    if (c || b == "file") a.push("//"), (b = this.s) && a.push(Uc(b, Vc, true), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.m, c != null && a.push(":", String(c));
    if (c = this.l) this.i && c.charAt(0) != "/" && a.push("/"), a.push(Uc(c, c.charAt(0) == "/" ? Wc : Xc, true));
    (c = this.h.toString()) && a.push("?", c);
    (c = this.o) && a.push("#", Uc(c, Yc));
    return a.join("");
};
function N(a) {
    return new U(a);
}
function Oc(a, b, c) {
    a.j = c ? Tc(b, true) : b;
    a.j && (a.j = a.j.replace(/:$/, ""));
}
function Pc(a, b, c) {
    a.i = c ? Tc(b, true) : b;
}
function Qc(a, b) {
    if (b) {
        b = Number(b);
        if (isNaN(b) || 0 > b) throw Error("Bad port number " + b);
        a.m = b;
    } else a.m = null;
}
function Sc(a, b, c) {
    b instanceof Rc ? (a.h = b, Zc(a.h, a.g)) : (c || (b = Uc(b, $c)), a.h = new Rc(b, a.g));
}
function R(a, b, c) {
    a.h.set(b, c);
}
function jc(a) {
    R(a, "zx", Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ Date.now()).toString(36));
    return a;
}
function ad(a) {
    return a instanceof U ? N(a) : new U(a, void 0);
}
function bd(a, b, c, d) {
    var e = new U(null, void 0);
    a && Oc(e, a);
    b && Pc(e, b);
    c && Qc(e, c);
    d && (e.l = d);
    return e;
}
function Tc(a, b) {
    return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : "";
}
function Uc(a, b, c) {
    return typeof a === "string" ? (a = encodeURI(a).replace(b, cd), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null;
}
function cd(a) {
    a = a.charCodeAt(0);
    return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
}
var Vc = /[#\/\?@]/g, Xc = /[#\?:]/g, Wc = /[#\?]/g, $c = /[#\?@]/g, Yc = /#/g;
function Rc(a, b) {
    this.h = this.g = null;
    this.i = a || null;
    this.j = !!b;
}
function V(a) {
    a.g || (a.g = new S(), a.h = 0, a.i && Nc(a.i, function(b, c) {
        a.add(decodeURIComponent(b.replace(/\+/g, " ")), c);
    }));
}
k = Rc.prototype;
k.add = function(a, b) {
    V(this);
    this.i = null;
    a = W(this, a);
    var c = this.g.get(a);
    c || this.g.set(a, c = []);
    c.push(b);
    this.h += 1;
    return this;
};
function dd(a, b) {
    V(a);
    b = W(a, b);
    T(a.g.h, b) && (a.i = null, a.h -= a.g.get(b).length, a = a.g, T(a.h, b) && (delete a.h[b], a.i--, a.g.length > 2 * a.i && Lc(a)));
}
function ed(a, b) {
    V(a);
    b = W(a, b);
    return T(a.g.h, b);
}
k.forEach = function(a, b) {
    V(this);
    this.g.forEach(function(c, d) {
        na(c, function(e) {
            a.call(b, e, d, this);
        }, this);
    }, this);
};
k.T = function() {
    V(this);
    for(var a = this.g.R(), b = this.g.T(), c = [], d = 0; d < b.length; d++)for(var e = a[d], f = 0; f < e.length; f++)c.push(b[d]);
    return c;
};
k.R = function(a) {
    V(this);
    var b = [];
    if (typeof a === "string") ed(this, a) && (b = qa(b, this.g.get(W(this, a))));
    else {
        a = this.g.R();
        for(var c = 0; c < a.length; c++)b = qa(b, a[c]);
    }
    return b;
};
k.set = function(a, b) {
    V(this);
    this.i = null;
    a = W(this, a);
    ed(this, a) && (this.h -= this.g.get(a).length);
    this.g.set(a, [
        b
    ]);
    this.h += 1;
    return this;
};
k.get = function(a, b) {
    if (!a) return b;
    a = this.R(a);
    return 0 < a.length ? String(a[0]) : b;
};
function mc(a, b, c) {
    dd(a, b);
    0 < c.length && (a.i = null, a.g.set(W(a, b), ra(c)), a.h += c.length);
}
k.toString = function() {
    if (this.i) return this.i;
    if (!this.g) return "";
    for(var a = [], b = this.g.T(), c = 0; c < b.length; c++){
        var d = b[c], e = encodeURIComponent(String(d));
        d = this.R(d);
        for(var f = 0; f < d.length; f++){
            var h = e;
            d[f] !== "" && (h += "=" + encodeURIComponent(String(d[f])));
            a.push(h);
        }
    }
    return this.i = a.join("&");
};
function W(a, b) {
    b = String(b);
    a.j && (b = b.toLowerCase());
    return b;
}
function Zc(a, b) {
    b && !a.j && (V(a), a.i = null, a.g.forEach(function(c, d) {
        var e = d.toLowerCase();
        d != e && (dd(this, d), mc(this, e, c));
    }, a));
    a.j = b;
}
var fd = class {
    constructor(a, b){
        this.h = a;
        this.g = b;
    }
};
function gd(a) {
    this.l = a || hd;
    l.PerformanceNavigationTiming ? (a = l.performance.getEntriesByType("navigation"), a = 0 < a.length && (a[0].nextHopProtocol == "hq" || a[0].nextHopProtocol == "h2")) : a = !!(l.g && l.g.Ea && l.g.Ea() && l.g.Ea().Zb);
    this.j = a ? this.l : 1;
    this.g = null;
    1 < this.j && (this.g = new Set());
    this.h = null;
    this.i = [];
}
var hd = 10;
function id(a) {
    return a.h ? true : a.g ? a.g.size >= a.j : false;
}
function Cc(a) {
    return a.h ? 1 : a.g ? a.g.size : 0;
}
function yc(a, b) {
    return a.h ? a.h == b : a.g ? a.g.has(b) : false;
}
function Dc(a, b) {
    a.g ? a.g.add(b) : a.h = b;
}
function Fc(a, b) {
    a.h && a.h == b ? a.h = null : a.g && a.g.has(b) && a.g.delete(b);
}
gd.prototype.cancel = function() {
    this.i = jd(this);
    if (this.h) this.h.cancel(), this.h = null;
    else if (this.g && this.g.size !== 0) {
        for (const a of this.g.values())a.cancel();
        this.g.clear();
    }
};
function jd(a) {
    if (a.h != null) return a.i.concat(a.h.D);
    if (a.g != null && a.g.size !== 0) {
        let b = a.i;
        for (const c of a.g.values())b = b.concat(c.D);
        return b;
    }
    return ra(a.i);
}
function kd() {}
kd.prototype.stringify = function(a) {
    return l.JSON.stringify(a, void 0);
};
kd.prototype.parse = function(a) {
    return l.JSON.parse(a, void 0);
};
function ld() {
    this.g = new kd();
}
function md(a, b, c) {
    const d = c || "";
    try {
        Kc(a, function(e, f) {
            let h = e;
            p(e) && (h = rb(e));
            b.push(d + f + "=" + encodeURIComponent(h));
        });
    } catch (e) {
        throw b.push(d + "type=" + encodeURIComponent("_badmap")), e;
    }
}
function nd(a, b) {
    const c = new Mb();
    if (l.Image) {
        const d = new Image();
        d.onload = ja(od, c, d, "TestLoadImage: loaded", true, b);
        d.onerror = ja(od, c, d, "TestLoadImage: error", false, b);
        d.onabort = ja(od, c, d, "TestLoadImage: abort", false, b);
        d.ontimeout = ja(od, c, d, "TestLoadImage: timeout", false, b);
        l.setTimeout(function() {
            if (d.ontimeout) d.ontimeout();
        }, 10000);
        d.src = a;
    } else b(false);
}
function od(a, b, c, d, e) {
    try {
        b.onload = null, b.onerror = null, b.onabort = null, b.ontimeout = null, e(d);
    } catch (f) {}
}
function pd(a) {
    this.l = a.$b || null;
    this.j = a.ib || false;
}
t(pd, Yb);
pd.prototype.g = function() {
    return new qd(this.l, this.j);
};
pd.prototype.i = (function(a) {
    return function() {
        return a;
    };
})({});
function qd(a, b) {
    C.call(this);
    this.D = a;
    this.u = b;
    this.m = void 0;
    this.readyState = rd;
    this.status = 0;
    this.responseType = this.responseText = this.response = this.statusText = "";
    this.onreadystatechange = null;
    this.v = new Headers();
    this.h = null;
    this.C = "GET";
    this.B = "";
    this.g = false;
    this.A = this.j = this.l = null;
}
t(qd, C);
var rd = 0;
k = qd.prototype;
k.open = function(a, b) {
    if (this.readyState != rd) throw this.abort(), Error("Error reopening a connection");
    this.C = a;
    this.B = b;
    this.readyState = 1;
    sd(this);
};
k.send = function(a) {
    if (this.readyState != 1) throw this.abort(), Error("need to call open() first. ");
    this.g = true;
    const b = {
        headers: this.v,
        method: this.C,
        credentials: this.m,
        cache: void 0
    };
    a && (b.body = a);
    (this.D || l).fetch(new Request(this.B, b)).then(this.Va.bind(this), this.ha.bind(this));
};
k.abort = function() {
    this.response = this.responseText = "";
    this.v = new Headers();
    this.status = 0;
    this.j && this.j.cancel("Request was aborted.");
    1 <= this.readyState && this.g && this.readyState != 4 && (this.g = false, td(this));
    this.readyState = rd;
};
k.Va = function(a) {
    if (this.g && (this.l = a, this.h || (this.status = this.l.status, this.statusText = this.l.statusText, this.h = a.headers, this.readyState = 2, sd(this)), this.g && (this.readyState = 3, sd(this), this.g))) if (this.responseType === "arraybuffer") a.arrayBuffer().then(this.Ta.bind(this), this.ha.bind(this));
    else if (typeof l.ReadableStream !== "undefined" && "body" in a) {
        this.j = a.body.getReader();
        if (this.u) {
            if (this.responseType) throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');
            this.response = [];
        } else this.response = this.responseText = "", this.A = new TextDecoder();
        ud(this);
    } else a.text().then(this.Ua.bind(this), this.ha.bind(this));
};
function ud(a) {
    a.j.read().then(a.Sa.bind(a)).catch(a.ha.bind(a));
}
k.Sa = function(a) {
    if (this.g) {
        if (this.u && a.value) this.response.push(a.value);
        else if (!this.u) {
            var b = a.value ? a.value : new Uint8Array(0);
            if (b = this.A.decode(b, {
                stream: !a.done
            })) this.response = this.responseText += b;
        }
        a.done ? td(this) : sd(this);
        this.readyState == 3 && ud(this);
    }
};
k.Ua = function(a) {
    this.g && (this.response = this.responseText = a, td(this));
};
k.Ta = function(a) {
    this.g && (this.response = a, td(this));
};
k.ha = function() {
    this.g && td(this);
};
function td(a) {
    a.readyState = 4;
    a.l = null;
    a.j = null;
    a.A = null;
    sd(a);
}
k.setRequestHeader = function(a, b) {
    this.v.append(a, b);
};
k.getResponseHeader = function(a) {
    return this.h ? this.h.get(a.toLowerCase()) || "" : "";
};
k.getAllResponseHeaders = function() {
    if (!this.h) return "";
    const a = [], b = this.h.entries();
    for(var c = b.next(); !c.done;)c = c.value, a.push(c[0] + ": " + c[1]), c = b.next();
    return a.join("\r\n");
};
function sd(a) {
    a.onreadystatechange && a.onreadystatechange.call(a);
}
Object.defineProperty(qd.prototype, "withCredentials", {
    get: function() {
        return this.m === "include";
    },
    set: function(a) {
        this.m = a ? "include" : "same-origin";
    }
});
var vd = l.JSON.parse;
function X(a) {
    C.call(this);
    this.headers = new S();
    this.u = a || null;
    this.h = false;
    this.C = this.g = null;
    this.H = "";
    this.m = 0;
    this.j = "";
    this.l = this.F = this.v = this.D = false;
    this.B = 0;
    this.A = null;
    this.J = wd;
    this.K = this.L = false;
}
t(X, C);
var wd = "", xd = /^https?$/i, yd = [
    "POST",
    "PUT"
];
k = X.prototype;
k.ea = function(a, b, c, d) {
    if (this.g) throw Error("[goog.net.XhrIo] Object is active with another request=" + this.H + "; newUri=" + a);
    b = b ? b.toUpperCase() : "GET";
    this.H = a;
    this.j = "";
    this.m = 0;
    this.D = false;
    this.h = true;
    this.g = this.u ? this.u.g() : cc.g();
    this.C = this.u ? Zb(this.u) : Zb(cc);
    this.g.onreadystatechange = q(this.Fa, this);
    try {
        this.F = true, this.g.open(b, String(a), true), this.F = false;
    } catch (f1) {
        zd(this, f1);
        return;
    }
    a = c || "";
    const e = new S(this.headers);
    d && Kc(d, function(f, h) {
        e.set(h, f);
    });
    d = oa(e.T());
    c = l.FormData && a instanceof l.FormData;
    !(0 <= ma(yd, b)) || d || c || e.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    e.forEach(function(f, h) {
        this.g.setRequestHeader(h, f);
    }, this);
    this.J && (this.g.responseType = this.J);
    "withCredentials" in this.g && this.g.withCredentials !== this.L && (this.g.withCredentials = this.L);
    try {
        Ad(this), 0 < this.B && ((this.K = Bd(this.g)) ? (this.g.timeout = this.B, this.g.ontimeout = q(this.pa, this)) : this.A = Gb(this.pa, this.B, this)), this.v = true, this.g.send(a), this.v = false;
    } catch (f) {
        zd(this, f);
    }
};
function Bd(a) {
    return y && Ra() && typeof a.timeout === "number" && a.ontimeout !== void 0;
}
function pa(a) {
    return a.toLowerCase() == "content-type";
}
k.pa = function() {
    typeof goog != "undefined" && this.g && (this.j = "Timed out after " + this.B + "ms, aborting", this.m = 8, D(this, "timeout"), this.abort(8));
};
function zd(a, b) {
    a.h = false;
    a.g && (a.l = true, a.g.abort(), a.l = false);
    a.j = b;
    a.m = 5;
    Cd(a);
    Dd(a);
}
function Cd(a) {
    a.D || (a.D = true, D(a, "complete"), D(a, "error"));
}
k.abort = function(a) {
    this.g && this.h && (this.h = false, this.l = true, this.g.abort(), this.l = false, this.m = a || 7, D(this, "complete"), D(this, "abort"), Dd(this));
};
k.M = function() {
    this.g && (this.h && (this.h = false, this.l = true, this.g.abort(), this.l = false), Dd(this, true));
    X.Z.M.call(this);
};
k.Fa = function() {
    this.s || (this.F || this.v || this.l ? Ed(this) : this.cb());
};
k.cb = function() {
    Ed(this);
};
function Ed(a) {
    if (a.h && typeof goog != "undefined" && (!a.C[1] || O(a) != 4 || a.ba() != 2)) {
        if (a.v && O(a) == 4) Gb(a.Fa, 0, a);
        else if (D(a, "readystatechange"), O(a) == 4) {
            a.h = false;
            try {
                const n = a.ba();
                a: switch(n){
                    case 200:
                    case 201:
                    case 202:
                    case 204:
                    case 206:
                    case 304:
                    case 1223:
                        var b = true;
                        break a;
                    default:
                        b = false;
                }
                var c;
                if (!(c = b)) {
                    var d;
                    if (d = n === 0) {
                        var e = String(a.H).match(Mc)[1] || null;
                        if (!e && l.self && l.self.location) {
                            var f = l.self.location.protocol;
                            e = f.substr(0, f.length - 1);
                        }
                        d = !xd.test(e ? e.toLowerCase() : "");
                    }
                    c = d;
                }
                if (c) D(a, "complete"), D(a, "success");
                else {
                    a.m = 6;
                    try {
                        var h = 2 < O(a) ? a.g.statusText : "";
                    } catch (u) {
                        h = "";
                    }
                    a.j = h + " [" + a.ba() + "]";
                    Cd(a);
                }
            } finally{
                Dd(a);
            }
        }
    }
}
function Dd(a, b) {
    if (a.g) {
        Ad(a);
        const c = a.g, d = a.C[0] ? aa : null;
        a.g = null;
        a.C = null;
        b || D(a, "ready");
        try {
            c.onreadystatechange = d;
        } catch (e) {}
    }
}
function Ad(a) {
    a.g && a.K && (a.g.ontimeout = null);
    a.A && (l.clearTimeout(a.A), a.A = null);
}
function O(a) {
    return a.g ? a.g.readyState : 0;
}
k.ba = function() {
    try {
        return 2 < O(this) ? this.g.status : -1;
    } catch (a) {
        return -1;
    }
};
k.ga = function() {
    try {
        return this.g ? this.g.responseText : "";
    } catch (a) {
        return "";
    }
};
k.Qa = function(a) {
    if (this.g) {
        var b = this.g.responseText;
        a && b.indexOf(a) == 0 && (b = b.substring(a.length));
        return vd(b);
    }
};
function oc(a) {
    try {
        if (!a.g) return null;
        if ("response" in a.g) return a.g.response;
        switch(a.J){
            case wd:
            case "text":
                return a.g.responseText;
            case "arraybuffer":
                if ("mozResponseArrayBuffer" in a.g) return a.g.mozResponseArrayBuffer;
        }
        return null;
    } catch (b) {
        return null;
    }
}
k.Da = function() {
    return this.m;
};
k.La = function() {
    return typeof this.j === "string" ? this.j : String(this.j);
};
function Fd(a) {
    let b = "";
    xa(a, function(c, d) {
        b += d;
        b += ":";
        b += c;
        b += "\r\n";
    });
    return b;
}
function Gd(a, b, c) {
    a: {
        for(d in c){
            var d = false;
            break a;
        }
        d = true;
    }
    d || (c = Fd(c), typeof a === "string" ? c != null && encodeURIComponent(String(c)) : R(a, b, c));
}
function Hd(a, b, c) {
    return c && c.internalChannelParams ? c.internalChannelParams[a] || b : b;
}
function Id(a) {
    this.za = 0;
    this.l = [];
    this.h = new Mb();
    this.la = this.oa = this.F = this.W = this.g = this.sa = this.D = this.aa = this.o = this.P = this.s = null;
    this.Za = this.V = 0;
    this.Xa = Hd("failFast", false, a);
    this.N = this.v = this.u = this.m = this.j = null;
    this.X = true;
    this.I = this.ta = this.U = -1;
    this.Y = this.A = this.C = 0;
    this.Pa = Hd("baseRetryDelayMs", 5000, a);
    this.$a = Hd("retryDelaySeedMs", 10000, a);
    this.Ya = Hd("forwardChannelMaxRetries", 2, a);
    this.ra = Hd("forwardChannelRequestTimeoutMs", 20000, a);
    this.qa = a && a.xmlHttpFactory || void 0;
    this.Ba = a && a.Yb || false;
    this.K = void 0;
    this.H = a && a.supportsCrossDomainXhr || false;
    this.J = "";
    this.i = new gd(a && a.concurrentRequestLimit);
    this.Ca = new ld();
    this.ja = a && a.fastHandshake || false;
    this.Ra = a && a.Wb || false;
    a && a.Aa && this.h.Aa();
    a && a.forceLongPolling && (this.X = false);
    this.$ = !this.ja && this.X && a && a.detectBufferingProxy || false;
    this.ka = void 0;
    this.O = 0;
    this.L = false;
    this.B = null;
    this.Wa = !a || a.Xb !== false;
}
k = Id.prototype;
k.ma = 8;
k.G = 1;
function Ic(a) {
    Jd(a);
    if (a.G == 3) {
        var b = a.V++, c = N(a.F);
        R(c, "SID", a.J);
        R(c, "RID", b);
        R(c, "TYPE", "terminate");
        Kd(a, c);
        b = new M(a, a.h, b, void 0);
        b.K = 2;
        b.v = jc(N(c));
        c = false;
        l.navigator && l.navigator.sendBeacon && (c = l.navigator.sendBeacon(b.v.toString(), ""));
        !c && l.Image && (new Image().src = b.v, c = true);
        c || (b.g = nc(b.l, null), b.g.ea(b.v));
        b.F = Date.now();
        lc(b);
    }
    Ld(a);
}
k.hb = function(a) {
    try {
        this.h.info("Origin Trials invoked: " + a);
    } catch (b) {}
};
function Ac(a) {
    a.g && (wc(a), a.g.cancel(), a.g = null);
}
function Jd(a) {
    Ac(a);
    a.u && (l.clearTimeout(a.u), a.u = null);
    zc(a);
    a.i.cancel();
    a.m && (typeof a.m === "number" && l.clearTimeout(a.m), a.m = null);
}
function Md(a, b) {
    a.l.push(new fd(a.Za++, b));
    a.G == 3 && Hc(a);
}
function Hc(a) {
    id(a.i) || a.m || (a.m = true, zb(a.Ha, a), a.C = 0);
}
function Nd(a, b) {
    if (Cc(a.i) >= a.i.j - (a.m ? 1 : 0)) return false;
    if (a.m) return a.l = b.D.concat(a.l), true;
    if (a.G == 1 || a.G == 2 || a.C >= (a.Xa ? 0 : a.Ya)) return false;
    a.m = K(q(a.Ha, a, b), Od(a, a.C));
    a.C++;
    return true;
}
k.Ha = function(a) {
    if (this.m) if (this.m = null, this.G == 1) {
        if (!a) {
            this.V = Math.floor(100000 * Math.random());
            a = this.V++;
            const e = new M(this, this.h, a, void 0);
            let f = this.s;
            this.P && (f ? (f = ya(f), Aa(f, this.P)) : f = this.P);
            this.o === null && (e.H = f);
            if (this.ja) a: {
                var b = 0;
                for(var c = 0; c < this.l.length; c++){
                    b: {
                        var d = this.l[c];
                        if ("__data__" in d.g && (d = d.g.__data__, typeof d === "string")) {
                            d = d.length;
                            break b;
                        }
                        d = void 0;
                    }
                    if (d === void 0) break;
                    b += d;
                    if (4096 < b) {
                        b = c;
                        break a;
                    }
                    if (b === 4096 || c === this.l.length - 1) {
                        b = c + 1;
                        break a;
                    }
                }
                b = 1000;
            }
            else b = 1000;
            b = Pd(this, e, b);
            c = N(this.F);
            R(c, "RID", a);
            R(c, "CVER", 22);
            this.D && R(c, "X-HTTP-Session-Id", this.D);
            Kd(this, c);
            this.o && f && Gd(c, this.o, f);
            Dc(this.i, e);
            this.Ra && R(c, "TYPE", "init");
            this.ja ? (R(c, "$req", b), R(c, "SID", "null"), e.$ = true, ic(e, c, null)) : ic(e, c, b);
            this.G = 2;
        }
    } else this.G == 3 && (a ? Qd(this, a) : this.l.length == 0 || id(this.i) || Qd(this));
};
function Qd(a, b) {
    var c;
    b ? c = b.m : c = a.V++;
    const d = N(a.F);
    R(d, "SID", a.J);
    R(d, "RID", c);
    R(d, "AID", a.U);
    Kd(a, d);
    a.o && a.s && Gd(d, a.o, a.s);
    c = new M(a, a.h, c, a.C + 1);
    a.o === null && (c.H = a.s);
    b && (a.l = b.D.concat(a.l));
    b = Pd(a, c, 1000);
    c.setTimeout(Math.round(0.5 * a.ra) + Math.round(0.5 * a.ra * Math.random()));
    Dc(a.i, c);
    ic(c, d, b);
}
function Kd(a, b) {
    a.j && Kc({}, function(c, d) {
        R(b, d, c);
    });
}
function Pd(a, b, c) {
    c = Math.min(a.l.length, c);
    var d = a.j ? q(a.j.Oa, a.j, a) : null;
    a: {
        var e = a.l;
        let f = -1;
        for(;;){
            const h = [
                "count=" + c
            ];
            f == -1 ? 0 < c ? (f = e[0].h, h.push("ofs=" + f)) : f = 0 : h.push("ofs=" + f);
            let n = true;
            for(let u = 0; u < c; u++){
                let m = e[u].h;
                const r = e[u].g;
                m -= f;
                if (0 > m) f = Math.max(0, e[u].h - 100), n = false;
                else try {
                    md(r, h, "req" + m + "_");
                } catch (G) {
                    d && d(r);
                }
            }
            if (n) {
                d = h.join("&");
                break a;
            }
        }
    }
    a = a.l.splice(0, c);
    b.D = a;
    return d;
}
function Gc(a) {
    a.g || a.u || (a.Y = 1, zb(a.Ga, a), a.A = 0);
}
function Bc(a) {
    if (a.g || a.u || 3 <= a.A) return false;
    a.Y++;
    a.u = K(q(a.Ga, a), Od(a, a.A));
    a.A++;
    return true;
}
k.Ga = function() {
    this.u = null;
    Rd(this);
    if (this.$ && !(this.L || this.g == null || 0 >= this.O)) {
        var a = 2 * this.O;
        this.h.info("BP detection timer enabled: " + a);
        this.B = K(q(this.bb, this), a);
    }
};
k.bb = function() {
    this.B && (this.B = null, this.h.info("BP detection timeout reached."), this.h.info("Buffering proxy detected and switch to long-polling!"), this.N = false, this.L = true, J(10), Ac(this), Rd(this));
};
function wc(a) {
    a.B != null && (l.clearTimeout(a.B), a.B = null);
}
function Rd(a) {
    a.g = new M(a, a.h, "rpc", a.Y);
    a.o === null && (a.g.H = a.s);
    a.g.O = 0;
    var b = N(a.oa);
    R(b, "RID", "rpc");
    R(b, "SID", a.J);
    R(b, "CI", a.N ? "0" : "1");
    R(b, "AID", a.U);
    Kd(a, b);
    R(b, "TYPE", "xmlhttp");
    a.o && a.s && Gd(b, a.o, a.s);
    a.K && a.g.setTimeout(a.K);
    var c = a.g;
    a = a.la;
    c.K = 1;
    c.v = jc(N(b));
    c.s = null;
    c.U = true;
    kc(c, a);
}
k.ab = function() {
    this.v != null && (this.v = null, Ac(this), Bc(this), J(19));
};
function zc(a) {
    a.v != null && (l.clearTimeout(a.v), a.v = null);
}
function uc(a, b) {
    var c = null;
    if (a.g == b) {
        zc(a);
        wc(a);
        a.g = null;
        var d = 2;
    } else if (yc(a.i, b)) c = b.D, Fc(a.i, b), d = 1;
    else return;
    a.I = b.N;
    if (a.G != 0) {
        if (b.i) if (d == 1) {
            c = b.s ? b.s.length : 0;
            b = Date.now() - b.F;
            var e = a.C;
            d = Sb();
            D(d, new Vb(d, c, b, e));
            Hc(a);
        } else Gc(a);
        else if (e = b.o, e == 3 || e == 0 && 0 < a.I || !(d == 1 && Nd(a, b) || d == 2 && Bc(a))) switch(c && 0 < c.length && (b = a.i, b.i = b.i.concat(c)), e){
            case 1:
                Q(a, 5);
                break;
            case 4:
                Q(a, 10);
                break;
            case 3:
                Q(a, 6);
                break;
            default:
                Q(a, 2);
        }
    }
}
function Od(a, b) {
    let c = a.Pa + Math.floor(Math.random() * a.$a);
    a.j || (c *= 2);
    return c * b;
}
function Q(a, b) {
    a.h.info("Error code " + b);
    if (b == 2) {
        var c = null;
        a.j && (c = null);
        var d = q(a.jb, a);
        c || (c = new U("//www.google.com/images/cleardot.gif"), l.location && l.location.protocol == "http" || Oc(c, "https"), jc(c));
        nd(c.toString(), d);
    } else J(2);
    a.G = 0;
    a.j && a.j.va(b);
    Ld(a);
    Jd(a);
}
k.jb = function(a) {
    a ? (this.h.info("Successfully pinged google.com"), J(2)) : (this.h.info("Failed to ping google.com"), J(1));
};
function Ld(a) {
    a.G = 0;
    a.I = -1;
    if (a.j) {
        if (jd(a.i).length != 0 || a.l.length != 0) a.i.i.length = 0, ra(a.l), a.l.length = 0;
        a.j.ua();
    }
}
function Ec(a, b, c) {
    let d = ad(c);
    if (d.i != "") b && Pc(d, b + "." + d.i), Qc(d, d.m);
    else {
        const e = l.location;
        d = bd(e.protocol, b ? b + "." + e.hostname : e.hostname, +e.port, c);
    }
    a.aa && xa(a.aa, function(e, f) {
        R(d, f, e);
    });
    b = a.D;
    c = a.sa;
    b && c && R(d, b, c);
    R(d, "VER", a.ma);
    Kd(a, d);
    return d;
}
function nc(a, b, c) {
    if (b && !a.H) throw Error("Can't create secondary domain capable XhrIo object.");
    b = c && a.Ba && !a.qa ? new X(new pd({
        ib: true
    })) : new X(a.qa);
    b.L = a.H;
    return b;
}
function Sd() {}
k = Sd.prototype;
k.xa = function() {};
k.wa = function() {};
k.va = function() {};
k.ua = function() {};
k.Oa = function() {};
function Td() {
    if (y && !(10 <= Number(Ua))) throw Error("Environmental error: no available transport.");
}
Td.prototype.g = function(a, b) {
    return new Y(a, b);
};
function Y(a, b) {
    C.call(this);
    this.g = new Id(b);
    this.l = a;
    this.h = b && b.messageUrlParams || null;
    a = b && b.messageHeaders || null;
    b && b.clientProtocolHeaderRequired && (a ? a["X-Client-Protocol"] = "webchannel" : a = {
        "X-Client-Protocol": "webchannel"
    });
    this.g.s = a;
    a = b && b.initMessageHeaders || null;
    b && b.messageContentType && (a ? a["X-WebChannel-Content-Type"] = b.messageContentType : a = {
        "X-WebChannel-Content-Type": b.messageContentType
    });
    b && b.ya && (a ? a["X-WebChannel-Client-Profile"] = b.ya : a = {
        "X-WebChannel-Client-Profile": b.ya
    });
    this.g.P = a;
    (a = b && b.httpHeadersOverwriteParam) && !sa(a) && (this.g.o = a);
    this.A = b && b.supportsCrossDomainXhr || false;
    this.v = b && b.sendRawJson || false;
    (b = b && b.httpSessionIdParam) && !sa(b) && (this.g.D = b, a = this.h, a !== null && b in a && (a = this.h, b in a && delete a[b]));
    this.j = new Z(this);
}
t(Y, C);
Y.prototype.m = function() {
    this.g.j = this.j;
    this.A && (this.g.H = true);
    var a = this.g, b = this.l, c = this.h || void 0;
    a.Wa && (a.h.info("Origin Trials enabled."), zb(q(a.hb, a, b)));
    J(0);
    a.W = b;
    a.aa = c || {};
    a.N = a.X;
    a.F = Ec(a, null, a.W);
    Hc(a);
};
Y.prototype.close = function() {
    Ic(this.g);
};
Y.prototype.u = function(a) {
    if (typeof a === "string") {
        var b = {};
        b.__data__ = a;
        Md(this.g, b);
    } else this.v ? (b = {}, b.__data__ = rb(a), Md(this.g, b)) : Md(this.g, a);
};
Y.prototype.M = function() {
    this.g.j = null;
    delete this.j;
    Ic(this.g);
    delete this.g;
    Y.Z.M.call(this);
};
function Ud(a) {
    ac.call(this);
    var b = a.__sm__;
    if (b) {
        a: {
            for(const c in b){
                a = c;
                break a;
            }
            a = void 0;
        }
        if (this.i = a) a = this.i, b = b !== null && a in b ? b[a] : void 0;
        this.data = b;
    } else this.data = a;
}
t(Ud, ac);
function Vd() {
    bc.call(this);
    this.status = 1;
}
t(Vd, bc);
function Z(a) {
    this.g = a;
}
t(Z, Sd);
Z.prototype.xa = function() {
    D(this.g, "a");
};
Z.prototype.wa = function(a) {
    D(this.g, new Ud(a));
};
Z.prototype.va = function(a) {
    D(this.g, new Vd(a));
};
Z.prototype.ua = function() {
    D(this.g, "b");
};
Td.prototype.createWebChannel = Td.prototype.g;
Y.prototype.send = Y.prototype.u;
Y.prototype.open = Y.prototype.m;
Y.prototype.close = Y.prototype.close;
Wb.NO_ERROR = 0;
Wb.TIMEOUT = 8;
Wb.HTTP_ERROR = 6;
Xb.COMPLETE = "complete";
$b.EventType = L;
L.OPEN = "a";
L.CLOSE = "b";
L.ERROR = "c";
L.MESSAGE = "d";
C.prototype.listen = C.prototype.N;
X.prototype.listenOnce = X.prototype.O;
X.prototype.getLastError = X.prototype.La;
X.prototype.getLastErrorCode = X.prototype.Da;
X.prototype.getStatus = X.prototype.ba;
X.prototype.getResponseJson = X.prototype.Qa;
X.prototype.getResponseText = X.prototype.ga;
X.prototype.send = X.prototype.ea;
var createWebChannelTransport = esm.createWebChannelTransport = function() {
    return new Td();
};
var getStatEventTarget = esm.getStatEventTarget = function() {
    return Sb();
};
var ErrorCode = esm.ErrorCode = Wb;
var EventType = esm.EventType = Xb;
var Event = esm.Event = H;
var Stat = esm.Stat = {
    rb: 0,
    ub: 1,
    vb: 2,
    Ob: 3,
    Tb: 4,
    Qb: 5,
    Rb: 6,
    Pb: 7,
    Nb: 8,
    Sb: 9,
    PROXY: 10,
    NOPROXY: 11,
    Lb: 12,
    Hb: 13,
    Ib: 14,
    Gb: 15,
    Jb: 16,
    Kb: 17,
    nb: 18,
    mb: 19,
    ob: 20
};
var FetchXmlHttpFactory = esm.FetchXmlHttpFactory = pd;
var WebChannel = esm.WebChannel = $b;
var XhrIo = esm.XhrIo = X;
function defaultSetTimout() {
    throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
    throw new Error("clearTimeout has not been defined");
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
var globalContext;
if (typeof window !== "undefined") {
    globalContext = window;
} else if (typeof self !== "undefined") {
    globalContext = self;
} else {
    globalContext = {};
}
if (typeof globalContext.setTimeout === "function") {
    cachedSetTimeout = setTimeout;
}
if (typeof globalContext.clearTimeout === "function") {
    cachedClearTimeout = clearTimeout;
}
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        return setTimeout(fun, 0);
    }
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e2) {
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        return clearTimeout(marker);
    }
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            return cachedClearTimeout.call(null, marker);
        } catch (e2) {
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}
function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;
    var len = queue.length;
    while(len){
        currentQueue = queue;
        queue = [];
        while(++queueIndex < len){
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for(var i = 1; i < arguments.length; i++){
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function() {
    this.fun.apply(null, this.array);
};
var title = "browser";
var platform = "browser";
var browser1 = true;
var argv = [];
var version2 = "";
var versions = {};
var release = {};
var config = {};
function noop1() {}
var on = noop1;
var addListener = noop1;
var once = noop1;
var off = noop1;
var removeListener = noop1;
var removeAllListeners = noop1;
var emit = noop1;
function binding(name) {
    throw new Error("process.binding is not supported");
}
function cwd() {
    return "/";
}
function chdir(dir) {
    throw new Error("process.chdir is not supported");
}
function umask() {
    return 0;
}
var performance = globalContext.performance || {};
var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {
    return new Date().getTime();
};
function hrtime(previousTimestamp) {
    var clocktime = performanceNow.call(performance) * 0.001;
    var seconds = Math.floor(clocktime);
    var nanoseconds = Math.floor(clocktime % 1 * 1000000000);
    if (previousTimestamp) {
        seconds = seconds - previousTimestamp[0];
        nanoseconds = nanoseconds - previousTimestamp[1];
        if (nanoseconds < 0) {
            seconds--;
            nanoseconds += 1000000000;
        }
    }
    return [
        seconds,
        nanoseconds
    ];
}
var startTime = new Date();
function uptime() {
    var currentTime = new Date();
    var dif = currentTime - startTime;
    return dif / 1000;
}
var process = {
    nextTick,
    title,
    browser: browser1,
    env: {
        NODE_ENV: "production"
    },
    argv,
    version: version2,
    versions,
    on,
    addListener,
    once,
    off,
    removeListener,
    removeAllListeners,
    emit,
    binding,
    cwd,
    chdir,
    umask,
    hrtime,
    platform,
    release,
    config,
    uptime
};
const D1 = "@firebase/firestore";
class C1 {
    constructor(t1){
        this.uid = t1;
    }
    isAuthenticated() {
        return this.uid != null;
    }
    toKey() {
        return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
    }
    isEqual(t2) {
        return t2.uid === this.uid;
    }
}
C1.UNAUTHENTICATED = new C1(null), C1.GOOGLE_CREDENTIALS = new C1("google-credentials-uid"), C1.FIRST_PARTY = new C1("first-party-uid"), C1.MOCK_USER = new C1("mock-user");
let x1 = "9.6.10";
const N1 = new Logger("@firebase/firestore");
function k1() {
    return N1.logLevel;
}
function O1(t3, ...e) {
    if (N1.logLevel <= LogLevel.DEBUG) {
        const n = e.map(B1);
        N1.debug(`Firestore (${x1}): ${t3}`, ...n);
    }
}
function F1(t4, ...e) {
    if (N1.logLevel <= LogLevel.ERROR) {
        const n = e.map(B1);
        N1.error(`Firestore (${x1}): ${t4}`, ...n);
    }
}
function $(t5, ...e) {
    if (N1.logLevel <= LogLevel.WARN) {
        const n = e.map(B1);
        N1.warn(`Firestore (${x1}): ${t5}`, ...n);
    }
}
function B1(t6) {
    if (typeof t6 == "string") return t6;
    try {
        return e = t6, JSON.stringify(e);
    } catch (e2) {
        return t6;
    }
    var e;
}
function L1(t7 = "Unexpected state") {
    const e = `FIRESTORE (${x1}) INTERNAL ASSERTION FAILED: ` + t7;
    throw F1(e), new Error(e);
}
function U1(t8, e) {
    t8 || L1();
}
function G(t9, e) {
    return t9;
}
const K1 = {
    OK: "ok",
    CANCELLED: "cancelled",
    UNKNOWN: "unknown",
    INVALID_ARGUMENT: "invalid-argument",
    DEADLINE_EXCEEDED: "deadline-exceeded",
    NOT_FOUND: "not-found",
    ALREADY_EXISTS: "already-exists",
    PERMISSION_DENIED: "permission-denied",
    UNAUTHENTICATED: "unauthenticated",
    RESOURCE_EXHAUSTED: "resource-exhausted",
    FAILED_PRECONDITION: "failed-precondition",
    ABORTED: "aborted",
    OUT_OF_RANGE: "out-of-range",
    UNIMPLEMENTED: "unimplemented",
    INTERNAL: "internal",
    UNAVAILABLE: "unavailable",
    DATA_LOSS: "data-loss"
};
class Q1 extends FirebaseError {
    constructor(t10, e){
        super(t10, e), this.code = t10, this.message = e, this.toString = ()=>`${this.name}: [code=${this.code}]: ${this.message}`
        ;
    }
}
class j {
    constructor(){
        this.promise = new Promise((t11, e)=>{
            this.resolve = t11, this.reject = e;
        });
    }
}
class W1 {
    constructor(t12, e){
        this.user = e, this.type = "OAuth", this.headers = new Map(), this.headers.set("Authorization", `Bearer ${t12}`);
    }
}
class z1 {
    getToken() {
        return Promise.resolve(null);
    }
    invalidateToken() {}
    start(t13, e) {
        t13.enqueueRetryable(()=>e(C1.UNAUTHENTICATED)
        );
    }
    shutdown() {}
}
class J1 {
    constructor(t14){
        this.t = t14, this.currentUser = C1.UNAUTHENTICATED, this.i = 0, this.forceRefresh = false, this.auth = null;
    }
    start(t15, e) {
        let n = this.i;
        const s = (t2)=>this.i !== n ? (n = this.i, e(t2)) : Promise.resolve()
        ;
        let i = new j();
        this.o = ()=>{
            this.i++, this.currentUser = this.u(), i.resolve(), i = new j(), t15.enqueueRetryable(()=>s(this.currentUser)
            );
        };
        const r = ()=>{
            const e2 = i;
            t15.enqueueRetryable(async ()=>{
                await e2.promise, await s(this.currentUser);
            });
        }, o = (t2)=>{
            O1("FirebaseAuthCredentialsProvider", "Auth detected"), this.auth = t2, this.auth.addAuthTokenListener(this.o), r();
        };
        this.t.onInit((t2)=>o(t2)
        ), setTimeout(()=>{
            if (!this.auth) {
                const t2 = this.t.getImmediate({
                    optional: true
                });
                t2 ? o(t2) : (O1("FirebaseAuthCredentialsProvider", "Auth not yet detected"), i.resolve(), i = new j());
            }
        }, 0), r();
    }
    getToken() {
        const t16 = this.i, e = this.forceRefresh;
        return this.forceRefresh = false, this.auth ? this.auth.getToken(e).then((e2)=>this.i !== t16 ? (O1("FirebaseAuthCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : e2 ? (U1(typeof e2.accessToken == "string"), new W1(e2.accessToken, this.currentUser)) : null
        ) : Promise.resolve(null);
    }
    invalidateToken() {
        this.forceRefresh = true;
    }
    shutdown() {
        this.auth && this.auth.removeAuthTokenListener(this.o);
    }
    u() {
        const t17 = this.auth && this.auth.getUid();
        return U1(t17 === null || typeof t17 == "string"), new C1(t17);
    }
}
class Y1 {
    constructor(t18, e, n){
        this.type = "FirstParty", this.user = C1.FIRST_PARTY, this.headers = new Map(), this.headers.set("X-Goog-AuthUser", e);
        const s = t18.auth.getAuthHeaderValueForFirstParty([]);
        s && this.headers.set("Authorization", s), n && this.headers.set("X-Goog-Iam-Authorization-Token", n);
    }
}
class X1 {
    constructor(t19, e, n){
        this.h = t19, this.l = e, this.m = n;
    }
    getToken() {
        return Promise.resolve(new Y1(this.h, this.l, this.m));
    }
    start(t20, e) {
        t20.enqueueRetryable(()=>e(C1.FIRST_PARTY)
        );
    }
    shutdown() {}
    invalidateToken() {}
}
class Z1 {
    constructor(t21){
        this.value = t21, this.type = "AppCheck", this.headers = new Map(), t21 && t21.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
    }
}
class tt {
    constructor(t22){
        this.g = t22, this.forceRefresh = false, this.appCheck = null, this.p = null;
    }
    start(t23, e) {
        const n = (t2)=>{
            t2.error != null && O1("FirebaseAppCheckTokenProvider", `Error getting App Check token; using placeholder token instead. Error: ${t2.error.message}`);
            const n2 = t2.token !== this.p;
            return this.p = t2.token, O1("FirebaseAppCheckTokenProvider", `Received ${n2 ? "new" : "existing"} token.`), n2 ? e(t2.token) : Promise.resolve();
        };
        this.o = (e2)=>{
            t23.enqueueRetryable(()=>n(e2)
            );
        };
        const s = (t2)=>{
            O1("FirebaseAppCheckTokenProvider", "AppCheck detected"), this.appCheck = t2, this.appCheck.addTokenListener(this.o);
        };
        this.g.onInit((t2)=>s(t2)
        ), setTimeout(()=>{
            if (!this.appCheck) {
                const t2 = this.g.getImmediate({
                    optional: true
                });
                t2 ? s(t2) : O1("FirebaseAppCheckTokenProvider", "AppCheck not yet detected");
            }
        }, 0);
    }
    getToken() {
        const t24 = this.forceRefresh;
        return this.forceRefresh = false, this.appCheck ? this.appCheck.getToken(t24).then((t2)=>t2 ? (U1(typeof t2.token == "string"), this.p = t2.token, new Z1(t2.token)) : null
        ) : Promise.resolve(null);
    }
    invalidateToken() {
        this.forceRefresh = true;
    }
    shutdown() {
        this.appCheck && this.appCheck.removeTokenListener(this.o);
    }
}
class nt {
    constructor(t25, e){
        this.previousValue = t25, e && (e.sequenceNumberHandler = (t2)=>this.I(t2)
        , this.T = (t2)=>e.writeSequenceNumber(t2)
        );
    }
    I(t26) {
        return this.previousValue = Math.max(t26, this.previousValue), this.previousValue;
    }
    next() {
        const t27 = ++this.previousValue;
        return this.T && this.T(t27), t27;
    }
}
function st(t28) {
    const e = typeof self != "undefined" && (self.crypto || self.msCrypto), n = new Uint8Array(t28);
    if (e && typeof e.getRandomValues == "function") e.getRandomValues(n);
    else for(let e2 = 0; e2 < t28; e2++)n[e2] = Math.floor(256 * Math.random());
    return n;
}
nt.A = -1;
class it {
    static R() {
        const t29 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", e = Math.floor(256 / t29.length) * t29.length;
        let n = "";
        for(; n.length < 20;){
            const s = st(40);
            for(let i = 0; i < s.length; ++i)n.length < 20 && s[i] < e && (n += t29.charAt(s[i] % t29.length));
        }
        return n;
    }
}
function rt(t30, e) {
    return t30 < e ? -1 : t30 > e ? 1 : 0;
}
function ot(t31, e, n) {
    return t31.length === e.length && t31.every((t2, s)=>n(t2, e[s])
    );
}
function ut(t32) {
    return t32 + "\0";
}
class at {
    constructor(t33, e){
        if (this.seconds = t33, this.nanoseconds = e, e < 0) throw new Q1(K1.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + e);
        if (e >= 1000000000) throw new Q1(K1.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + e);
        if (t33 < -62135596800) throw new Q1(K1.INVALID_ARGUMENT, "Timestamp seconds out of range: " + t33);
        if (t33 >= 253402300800) throw new Q1(K1.INVALID_ARGUMENT, "Timestamp seconds out of range: " + t33);
    }
    static now() {
        return at.fromMillis(Date.now());
    }
    static fromDate(t34) {
        return at.fromMillis(t34.getTime());
    }
    static fromMillis(t35) {
        const e = Math.floor(t35 / 1000), n = Math.floor(1000000 * (t35 - 1000 * e));
        return new at(e, n);
    }
    toDate() {
        return new Date(this.toMillis());
    }
    toMillis() {
        return 1000 * this.seconds + this.nanoseconds / 1000000;
    }
    _compareTo(t36) {
        return this.seconds === t36.seconds ? rt(this.nanoseconds, t36.nanoseconds) : rt(this.seconds, t36.seconds);
    }
    isEqual(t37) {
        return t37.seconds === this.seconds && t37.nanoseconds === this.nanoseconds;
    }
    toString() {
        return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
    }
    toJSON() {
        return {
            seconds: this.seconds,
            nanoseconds: this.nanoseconds
        };
    }
    valueOf() {
        const t38 = this.seconds - -62135596800;
        return String(t38).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
    }
}
class ct {
    constructor(t39){
        this.timestamp = t39;
    }
    static fromTimestamp(t40) {
        return new ct(t40);
    }
    static min() {
        return new ct(new at(0, 0));
    }
    static max() {
        return new ct(new at(253402300799, 999999999));
    }
    compareTo(t41) {
        return this.timestamp._compareTo(t41.timestamp);
    }
    isEqual(t42) {
        return this.timestamp.isEqual(t42.timestamp);
    }
    toMicroseconds() {
        return 1000000 * this.timestamp.seconds + this.timestamp.nanoseconds / 1000;
    }
    toString() {
        return "SnapshotVersion(" + this.timestamp.toString() + ")";
    }
    toTimestamp() {
        return this.timestamp;
    }
}
function ht(t43) {
    let e = 0;
    for(const n in t43)Object.prototype.hasOwnProperty.call(t43, n) && e++;
    return e;
}
function lt(t44, e) {
    for(const n in t44)Object.prototype.hasOwnProperty.call(t44, n) && e(n, t44[n]);
}
function ft(t45) {
    for(const e in t45)if (Object.prototype.hasOwnProperty.call(t45, e)) return false;
    return true;
}
class dt {
    constructor(t46, e, n){
        e === void 0 ? e = 0 : e > t46.length && L1(), n === void 0 ? n = t46.length - e : n > t46.length - e && L1(), this.segments = t46, this.offset = e, this.len = n;
    }
    get length() {
        return this.len;
    }
    isEqual(t47) {
        return dt.comparator(this, t47) === 0;
    }
    child(t48) {
        const e = this.segments.slice(this.offset, this.limit());
        return t48 instanceof dt ? t48.forEach((t2)=>{
            e.push(t2);
        }) : e.push(t48), this.construct(e);
    }
    limit() {
        return this.offset + this.length;
    }
    popFirst(t49) {
        return t49 = t49 === void 0 ? 1 : t49, this.construct(this.segments, this.offset + t49, this.length - t49);
    }
    popLast() {
        return this.construct(this.segments, this.offset, this.length - 1);
    }
    firstSegment() {
        return this.segments[this.offset];
    }
    lastSegment() {
        return this.get(this.length - 1);
    }
    get(t50) {
        return this.segments[this.offset + t50];
    }
    isEmpty() {
        return this.length === 0;
    }
    isPrefixOf(t51) {
        if (t51.length < this.length) return false;
        for(let e = 0; e < this.length; e++)if (this.get(e) !== t51.get(e)) return false;
        return true;
    }
    isImmediateParentOf(t52) {
        if (this.length + 1 !== t52.length) return false;
        for(let e = 0; e < this.length; e++)if (this.get(e) !== t52.get(e)) return false;
        return true;
    }
    forEach(t53) {
        for(let e = this.offset, n = this.limit(); e < n; e++)t53(this.segments[e]);
    }
    toArray() {
        return this.segments.slice(this.offset, this.limit());
    }
    static comparator(t54, e) {
        const n = Math.min(t54.length, e.length);
        for(let s = 0; s < n; s++){
            const n2 = t54.get(s), i = e.get(s);
            if (n2 < i) return -1;
            if (n2 > i) return 1;
        }
        return t54.length < e.length ? -1 : t54.length > e.length ? 1 : 0;
    }
}
class _t extends dt {
    construct(t55, e, n) {
        return new _t(t55, e, n);
    }
    canonicalString() {
        return this.toArray().join("/");
    }
    toString() {
        return this.canonicalString();
    }
    static fromString(...t56) {
        const e = [];
        for (const n of t56){
            if (n.indexOf("//") >= 0) throw new Q1(K1.INVALID_ARGUMENT, `Invalid segment (${n}). Paths must not contain // in them.`);
            e.push(...n.split("/").filter((t2)=>t2.length > 0
            ));
        }
        return new _t(e);
    }
    static emptyPath() {
        return new _t([]);
    }
}
const wt = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
class mt extends dt {
    construct(t57, e, n) {
        return new mt(t57, e, n);
    }
    static isValidIdentifier(t58) {
        return wt.test(t58);
    }
    canonicalString() {
        return this.toArray().map((t59)=>(t59 = t59.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), mt.isValidIdentifier(t59) || (t59 = "`" + t59 + "`"), t59)
        ).join(".");
    }
    toString() {
        return this.canonicalString();
    }
    isKeyField() {
        return this.length === 1 && this.get(0) === "__name__";
    }
    static keyField() {
        return new mt([
            "__name__"
        ]);
    }
    static fromServerFormat(t60) {
        const e = [];
        let n = "", s = 0;
        const i = ()=>{
            if (n.length === 0) throw new Q1(K1.INVALID_ARGUMENT, `Invalid field path (${t60}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
            e.push(n), n = "";
        };
        let r = false;
        for(; s < t60.length;){
            const e2 = t60[s];
            if (e2 === "\\") {
                if (s + 1 === t60.length) throw new Q1(K1.INVALID_ARGUMENT, "Path has trailing escape character: " + t60);
                const e3 = t60[s + 1];
                if (e3 !== "\\" && e3 !== "." && e3 !== "`") throw new Q1(K1.INVALID_ARGUMENT, "Path has invalid escape sequence: " + t60);
                n += e3, s += 2;
            } else e2 === "`" ? (r = !r, s++) : e2 !== "." || r ? (n += e2, s++) : (i(), s++);
        }
        if (i(), r) throw new Q1(K1.INVALID_ARGUMENT, "Unterminated ` in path: " + t60);
        return new mt(e);
    }
    static emptyPath() {
        return new mt([]);
    }
}
class gt {
    constructor(t61){
        this.fields = t61, t61.sort(mt.comparator);
    }
    covers(t62) {
        for (const e of this.fields)if (e.isPrefixOf(t62)) return true;
        return false;
    }
    isEqual(t63) {
        return ot(this.fields, t63.fields, (t2, e)=>t2.isEqual(e)
        );
    }
}
class pt {
    constructor(t64){
        this.binaryString = t64;
    }
    static fromBase64String(t65) {
        const e = atob(t65);
        return new pt(e);
    }
    static fromUint8Array(t66) {
        const e = function(t2) {
            let e2 = "";
            for(let n = 0; n < t2.length; ++n)e2 += String.fromCharCode(t2[n]);
            return e2;
        }(t66);
        return new pt(e);
    }
    [Symbol.iterator]() {
        let t67 = 0;
        return {
            next: ()=>t67 < this.binaryString.length ? {
                    value: this.binaryString.charCodeAt(t67++),
                    done: false
                } : {
                    value: void 0,
                    done: true
                }
        };
    }
    toBase64() {
        return t68 = this.binaryString, btoa(t68);
        var t68;
    }
    toUint8Array() {
        return (function(t69) {
            const e = new Uint8Array(t69.length);
            for(let n = 0; n < t69.length; n++)e[n] = t69.charCodeAt(n);
            return e;
        })(this.binaryString);
    }
    approximateByteSize() {
        return 2 * this.binaryString.length;
    }
    compareTo(t70) {
        return rt(this.binaryString, t70.binaryString);
    }
    isEqual(t71) {
        return this.binaryString === t71.binaryString;
    }
}
pt.EMPTY_BYTE_STRING = new pt("");
const It = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
function Tt(t72) {
    if (U1(!!t72), typeof t72 == "string") {
        let e = 0;
        const n = It.exec(t72);
        if (U1(!!n), n[1]) {
            let t2 = n[1];
            t2 = (t2 + "000000000").substr(0, 9), e = Number(t2);
        }
        const s = new Date(t72);
        return {
            seconds: Math.floor(s.getTime() / 1000),
            nanos: e
        };
    }
    return {
        seconds: Et(t72.seconds),
        nanos: Et(t72.nanos)
    };
}
function Et(t73) {
    return typeof t73 == "number" ? t73 : typeof t73 == "string" ? Number(t73) : 0;
}
function At(t74) {
    return typeof t74 == "string" ? pt.fromBase64String(t74) : pt.fromUint8Array(t74);
}
function Rt(t75) {
    var e, n;
    return ((n = (((e = t75 == null ? void 0 : t75.mapValue) === null || e === void 0 ? void 0 : e.fields) || {}).__type__) === null || n === void 0 ? void 0 : n.stringValue) === "server_timestamp";
}
function bt(t76) {
    const e = t76.mapValue.fields.__previous_value__;
    return Rt(e) ? bt(e) : e;
}
function Pt(t77) {
    const e = Tt(t77.mapValue.fields.__local_write_time__.timestampValue);
    return new at(e.seconds, e.nanos);
}
class Vt {
    constructor(t78, e, n, s, i, r, o, u){
        this.databaseId = t78, this.appId = e, this.persistenceKey = n, this.host = s, this.ssl = i, this.forceLongPolling = r, this.autoDetectLongPolling = o, this.useFetchStreams = u;
    }
}
class vt {
    constructor(t79, e){
        this.projectId = t79, this.database = e || "(default)";
    }
    static empty() {
        return new vt("", "");
    }
    get isDefaultDatabase() {
        return this.database === "(default)";
    }
    isEqual(t80) {
        return t80 instanceof vt && t80.projectId === this.projectId && t80.database === this.database;
    }
}
function St(t81) {
    return t81 == null;
}
function Dt(t82) {
    return t82 === 0 && 1 / t82 == -1 / 0;
}
function Ct(t83) {
    return typeof t83 == "number" && Number.isInteger(t83) && !Dt(t83) && t83 <= Number.MAX_SAFE_INTEGER && t83 >= Number.MIN_SAFE_INTEGER;
}
class xt {
    constructor(t84){
        this.path = t84;
    }
    static fromPath(t85) {
        return new xt(_t.fromString(t85));
    }
    static fromName(t86) {
        return new xt(_t.fromString(t86).popFirst(5));
    }
    static empty() {
        return new xt(_t.emptyPath());
    }
    get collectionGroup() {
        return this.path.popLast().lastSegment();
    }
    hasCollectionId(t87) {
        return this.path.length >= 2 && this.path.get(this.path.length - 2) === t87;
    }
    getCollectionGroup() {
        return this.path.get(this.path.length - 2);
    }
    getCollectionPath() {
        return this.path.popLast();
    }
    isEqual(t88) {
        return t88 !== null && _t.comparator(this.path, t88.path) === 0;
    }
    toString() {
        return this.path.toString();
    }
    static comparator(t89, e) {
        return _t.comparator(t89.path, e.path);
    }
    static isDocumentKey(t90) {
        return t90.length % 2 == 0;
    }
    static fromSegments(t91) {
        return new xt(new _t(t91.slice()));
    }
}
const Nt = {
    mapValue: {
        fields: {
            __type__: {
                stringValue: "__max__"
            }
        }
    }
}, kt = {
    nullValue: "NULL_VALUE"
};
function Mt(t92) {
    return "nullValue" in t92 ? 0 : "booleanValue" in t92 ? 1 : "integerValue" in t92 || "doubleValue" in t92 ? 2 : "timestampValue" in t92 ? 3 : "stringValue" in t92 ? 5 : "bytesValue" in t92 ? 6 : "referenceValue" in t92 ? 7 : "geoPointValue" in t92 ? 8 : "arrayValue" in t92 ? 9 : "mapValue" in t92 ? Rt(t92) ? 4 : Ht(t92) ? 9 : 10 : L1();
}
function Ot(t93, e) {
    if (t93 === e) return true;
    const n = Mt(t93);
    if (n !== Mt(e)) return false;
    switch(n){
        case 0:
        case 9007199254740991:
            return true;
        case 1:
            return t93.booleanValue === e.booleanValue;
        case 4:
            return Pt(t93).isEqual(Pt(e));
        case 3:
            return (function(t2, e2) {
                if (typeof t2.timestampValue == "string" && typeof e2.timestampValue == "string" && t2.timestampValue.length === e2.timestampValue.length) return t2.timestampValue === e2.timestampValue;
                const n2 = Tt(t2.timestampValue), s = Tt(e2.timestampValue);
                return n2.seconds === s.seconds && n2.nanos === s.nanos;
            })(t93, e);
        case 5:
            return t93.stringValue === e.stringValue;
        case 6:
            return (function(t2, e2) {
                return At(t2.bytesValue).isEqual(At(e2.bytesValue));
            })(t93, e);
        case 7:
            return t93.referenceValue === e.referenceValue;
        case 8:
            return (function(t2, e2) {
                return Et(t2.geoPointValue.latitude) === Et(e2.geoPointValue.latitude) && Et(t2.geoPointValue.longitude) === Et(e2.geoPointValue.longitude);
            })(t93, e);
        case 2:
            return (function(t2, e2) {
                if ("integerValue" in t2 && "integerValue" in e2) return Et(t2.integerValue) === Et(e2.integerValue);
                if ("doubleValue" in t2 && "doubleValue" in e2) {
                    const n2 = Et(t2.doubleValue), s = Et(e2.doubleValue);
                    return n2 === s ? Dt(n2) === Dt(s) : isNaN(n2) && isNaN(s);
                }
                return false;
            })(t93, e);
        case 9:
            return ot(t93.arrayValue.values || [], e.arrayValue.values || [], Ot);
        case 10:
            return (function(t2, e2) {
                const n2 = t2.mapValue.fields || {}, s = e2.mapValue.fields || {};
                if (ht(n2) !== ht(s)) return false;
                for(const t3 in n2)if (n2.hasOwnProperty(t3) && (s[t3] === void 0 || !Ot(n2[t3], s[t3]))) return false;
                return true;
            })(t93, e);
        default:
            return L1();
    }
}
function Ft(t94, e) {
    return (t94.values || []).find((t2)=>Ot(t2, e)
    ) !== void 0;
}
function $t(t95, e) {
    if (t95 === e) return 0;
    const n = Mt(t95), s = Mt(e);
    if (n !== s) return rt(n, s);
    switch(n){
        case 0:
        case 9007199254740991:
            return 0;
        case 1:
            return rt(t95.booleanValue, e.booleanValue);
        case 2:
            return (function(t2, e2) {
                const n2 = Et(t2.integerValue || t2.doubleValue), s2 = Et(e2.integerValue || e2.doubleValue);
                return n2 < s2 ? -1 : n2 > s2 ? 1 : n2 === s2 ? 0 : isNaN(n2) ? isNaN(s2) ? 0 : -1 : 1;
            })(t95, e);
        case 3:
            return Bt(t95.timestampValue, e.timestampValue);
        case 4:
            return Bt(Pt(t95), Pt(e));
        case 5:
            return rt(t95.stringValue, e.stringValue);
        case 6:
            return (function(t2, e2) {
                const n2 = At(t2), s2 = At(e2);
                return n2.compareTo(s2);
            })(t95.bytesValue, e.bytesValue);
        case 7:
            return (function(t2, e2) {
                const n2 = t2.split("/"), s2 = e2.split("/");
                for(let t3 = 0; t3 < n2.length && t3 < s2.length; t3++){
                    const e3 = rt(n2[t3], s2[t3]);
                    if (e3 !== 0) return e3;
                }
                return rt(n2.length, s2.length);
            })(t95.referenceValue, e.referenceValue);
        case 8:
            return (function(t2, e2) {
                const n2 = rt(Et(t2.latitude), Et(e2.latitude));
                if (n2 !== 0) return n2;
                return rt(Et(t2.longitude), Et(e2.longitude));
            })(t95.geoPointValue, e.geoPointValue);
        case 9:
            return (function(t2, e2) {
                const n2 = t2.values || [], s2 = e2.values || [];
                for(let t3 = 0; t3 < n2.length && t3 < s2.length; ++t3){
                    const e3 = $t(n2[t3], s2[t3]);
                    if (e3) return e3;
                }
                return rt(n2.length, s2.length);
            })(t95.arrayValue, e.arrayValue);
        case 10:
            return (function(t2, e2) {
                const n2 = t2.fields || {}, s2 = Object.keys(n2), i = e2.fields || {}, r = Object.keys(i);
                s2.sort(), r.sort();
                for(let t3 = 0; t3 < s2.length && t3 < r.length; ++t3){
                    const e3 = rt(s2[t3], r[t3]);
                    if (e3 !== 0) return e3;
                    const o = $t(n2[s2[t3]], i[r[t3]]);
                    if (o !== 0) return o;
                }
                return rt(s2.length, r.length);
            })(t95.mapValue, e.mapValue);
        default:
            throw L1();
    }
}
function Bt(t96, e) {
    if (typeof t96 == "string" && typeof e == "string" && t96.length === e.length) return rt(t96, e);
    const n = Tt(t96), s = Tt(e), i = rt(n.seconds, s.seconds);
    return i !== 0 ? i : rt(n.nanos, s.nanos);
}
function Lt(t97) {
    return Ut(t97);
}
function Ut(t98) {
    return "nullValue" in t98 ? "null" : "booleanValue" in t98 ? "" + t98.booleanValue : "integerValue" in t98 ? "" + t98.integerValue : "doubleValue" in t98 ? "" + t98.doubleValue : "timestampValue" in t98 ? (function(t2) {
        const e2 = Tt(t2);
        return `time(${e2.seconds},${e2.nanos})`;
    })(t98.timestampValue) : "stringValue" in t98 ? t98.stringValue : "bytesValue" in t98 ? At(t98.bytesValue).toBase64() : "referenceValue" in t98 ? (n = t98.referenceValue, xt.fromName(n).toString()) : "geoPointValue" in t98 ? `geo(${(e = t98.geoPointValue).latitude},${e.longitude})` : "arrayValue" in t98 ? (function(t2) {
        let e2 = "[", n2 = true;
        for (const s of t2.values || [])n2 ? n2 = false : e2 += ",", e2 += Ut(s);
        return e2 + "]";
    })(t98.arrayValue) : "mapValue" in t98 ? (function(t2) {
        const e2 = Object.keys(t2.fields || {}).sort();
        let n2 = "{", s = true;
        for (const i of e2)s ? s = false : n2 += ",", n2 += `${i}:${Ut(t2.fields[i])}`;
        return n2 + "}";
    })(t98.mapValue) : L1();
    var e, n;
}
function qt(t99, e) {
    return {
        referenceValue: `projects/${t99.projectId}/databases/${t99.database}/documents/${e.path.canonicalString()}`
    };
}
function Gt(t100) {
    return !!t100 && "integerValue" in t100;
}
function Kt(t101) {
    return !!t101 && "arrayValue" in t101;
}
function Qt(t102) {
    return !!t102 && "nullValue" in t102;
}
function jt(t103) {
    return !!t103 && "doubleValue" in t103 && isNaN(Number(t103.doubleValue));
}
function Wt(t104) {
    return !!t104 && "mapValue" in t104;
}
function zt(t105) {
    if (t105.geoPointValue) return {
        geoPointValue: Object.assign({}, t105.geoPointValue)
    };
    if (t105.timestampValue && typeof t105.timestampValue == "object") return {
        timestampValue: Object.assign({}, t105.timestampValue)
    };
    if (t105.mapValue) {
        const e = {
            mapValue: {
                fields: {}
            }
        };
        return lt(t105.mapValue.fields, (t2, n)=>e.mapValue.fields[t2] = zt(n)
        ), e;
    }
    if (t105.arrayValue) {
        const e = {
            arrayValue: {
                values: []
            }
        };
        for(let n = 0; n < (t105.arrayValue.values || []).length; ++n)e.arrayValue.values[n] = zt(t105.arrayValue.values[n]);
        return e;
    }
    return Object.assign({}, t105);
}
function Ht(t106) {
    return (((t106.mapValue || {}).fields || {}).__type__ || {}).stringValue === "__max__";
}
function Jt(t107, e) {
    return t107 === void 0 ? e : e === void 0 || $t(t107, e) > 0 ? t107 : e;
}
function Yt(t108, e) {
    return t108 === void 0 ? e : e === void 0 || $t(t108, e) < 0 ? t108 : e;
}
class Xt {
    constructor(t109){
        this.value = t109;
    }
    static empty() {
        return new Xt({
            mapValue: {}
        });
    }
    field(t110) {
        if (t110.isEmpty()) return this.value;
        {
            let e = this.value;
            for(let n = 0; n < t110.length - 1; ++n)if (e = (e.mapValue.fields || {})[t110.get(n)], !Wt(e)) return null;
            return e = (e.mapValue.fields || {})[t110.lastSegment()], e || null;
        }
    }
    set(t111, e) {
        this.getFieldsMap(t111.popLast())[t111.lastSegment()] = zt(e);
    }
    setAll(t112) {
        let e = mt.emptyPath(), n = {}, s = [];
        t112.forEach((t2, i2)=>{
            if (!e.isImmediateParentOf(i2)) {
                const t3 = this.getFieldsMap(e);
                this.applyChanges(t3, n, s), n = {}, s = [], e = i2.popLast();
            }
            t2 ? n[i2.lastSegment()] = zt(t2) : s.push(i2.lastSegment());
        });
        const i = this.getFieldsMap(e);
        this.applyChanges(i, n, s);
    }
    delete(t113) {
        const e = this.field(t113.popLast());
        Wt(e) && e.mapValue.fields && delete e.mapValue.fields[t113.lastSegment()];
    }
    isEqual(t114) {
        return Ot(this.value, t114.value);
    }
    getFieldsMap(t115) {
        let e = this.value;
        e.mapValue.fields || (e.mapValue = {
            fields: {}
        });
        for(let n = 0; n < t115.length; ++n){
            let s = e.mapValue.fields[t115.get(n)];
            Wt(s) && s.mapValue.fields || (s = {
                mapValue: {
                    fields: {}
                }
            }, e.mapValue.fields[t115.get(n)] = s), e = s;
        }
        return e.mapValue.fields;
    }
    applyChanges(t116, e, n) {
        lt(e, (e2, n2)=>t116[e2] = n2
        );
        for (const e21 of n)delete t116[e21];
    }
    clone() {
        return new Xt(zt(this.value));
    }
}
function Zt(t117) {
    const e = [];
    return lt(t117.fields, (t2, n)=>{
        const s = new mt([
            t2
        ]);
        if (Wt(n)) {
            const t3 = Zt(n.mapValue).fields;
            if (t3.length === 0) e.push(s);
            else for (const n2 of t3)e.push(s.child(n2));
        } else e.push(s);
    }), new gt(e);
}
class te {
    constructor(t118, e, n, s, i, r){
        this.key = t118, this.documentType = e, this.version = n, this.readTime = s, this.data = i, this.documentState = r;
    }
    static newInvalidDocument(t119) {
        return new te(t119, 0, ct.min(), ct.min(), Xt.empty(), 0);
    }
    static newFoundDocument(t120, e, n) {
        return new te(t120, 1, e, ct.min(), n, 0);
    }
    static newNoDocument(t121, e) {
        return new te(t121, 2, e, ct.min(), Xt.empty(), 0);
    }
    static newUnknownDocument(t122, e) {
        return new te(t122, 3, e, ct.min(), Xt.empty(), 2);
    }
    convertToFoundDocument(t123, e) {
        return this.version = t123, this.documentType = 1, this.data = e, this.documentState = 0, this;
    }
    convertToNoDocument(t124) {
        return this.version = t124, this.documentType = 2, this.data = Xt.empty(), this.documentState = 0, this;
    }
    convertToUnknownDocument(t125) {
        return this.version = t125, this.documentType = 3, this.data = Xt.empty(), this.documentState = 2, this;
    }
    setHasCommittedMutations() {
        return this.documentState = 2, this;
    }
    setHasLocalMutations() {
        return this.documentState = 1, this;
    }
    setReadTime(t126) {
        return this.readTime = t126, this;
    }
    get hasLocalMutations() {
        return this.documentState === 1;
    }
    get hasCommittedMutations() {
        return this.documentState === 2;
    }
    get hasPendingWrites() {
        return this.hasLocalMutations || this.hasCommittedMutations;
    }
    isValidDocument() {
        return this.documentType !== 0;
    }
    isFoundDocument() {
        return this.documentType === 1;
    }
    isNoDocument() {
        return this.documentType === 2;
    }
    isUnknownDocument() {
        return this.documentType === 3;
    }
    isEqual(t127) {
        return t127 instanceof te && this.key.isEqual(t127.key) && this.version.isEqual(t127.version) && this.documentType === t127.documentType && this.documentState === t127.documentState && this.data.isEqual(t127.data);
    }
    mutableCopy() {
        return new te(this.key, this.documentType, this.version, this.readTime, this.data.clone(), this.documentState);
    }
    toString() {
        return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
    }
}
class ee {
    constructor(t128, e, n, s){
        this.indexId = t128, this.collectionGroup = e, this.fields = n, this.indexState = s;
    }
}
function ne(t129) {
    return t129.fields.find((t2)=>t2.kind === 2
    );
}
function se(t130) {
    return t130.fields.filter((t2)=>t2.kind !== 2
    );
}
ee.UNKNOWN_ID = -1;
class ie {
    constructor(t131, e){
        this.fieldPath = t131, this.kind = e;
    }
}
class re {
    constructor(t132, e){
        this.sequenceNumber = t132, this.offset = e;
    }
    static empty() {
        return new re(0, ae.min());
    }
}
function oe(t133, e) {
    const n = t133.toTimestamp().seconds, s = t133.toTimestamp().nanoseconds + 1, i = ct.fromTimestamp(s === 1000000000 ? new at(n + 1, 0) : new at(n, s));
    return new ae(i, xt.empty(), e);
}
function ue(t134) {
    return new ae(t134.readTime, t134.key, -1);
}
class ae {
    constructor(t135, e, n){
        this.readTime = t135, this.documentKey = e, this.largestBatchId = n;
    }
    static min() {
        return new ae(ct.min(), xt.empty(), -1);
    }
    static max() {
        return new ae(ct.max(), xt.empty(), -1);
    }
}
function ce(t136, e) {
    let n = t136.readTime.compareTo(e.readTime);
    return n !== 0 ? n : (n = xt.comparator(t136.documentKey, e.documentKey), n !== 0 ? n : rt(t136.largestBatchId, e.largestBatchId));
}
class he {
    constructor(t137, e = null, n = [], s = [], i = null, r = null, o = null){
        this.path = t137, this.collectionGroup = e, this.orderBy = n, this.filters = s, this.limit = i, this.startAt = r, this.endAt = o, this.P = null;
    }
}
function le(t138, e = null, n = [], s = [], i = null, r = null, o = null) {
    return new he(t138, e, n, s, i, r, o);
}
function fe(t139) {
    const e = G(t139);
    if (e.P === null) {
        let t2 = e.path.canonicalString();
        e.collectionGroup !== null && (t2 += "|cg:" + e.collectionGroup), t2 += "|f:", t2 += e.filters.map((t3)=>{
            return (e2 = t3).field.canonicalString() + e2.op.toString() + Lt(e2.value);
            var e2;
        }).join(","), t2 += "|ob:", t2 += e.orderBy.map((t3)=>(function(t4) {
                return t4.field.canonicalString() + t4.dir;
            })(t3)
        ).join(","), St(e.limit) || (t2 += "|l:", t2 += e.limit), e.startAt && (t2 += "|lb:", t2 += e.startAt.inclusive ? "b:" : "a:", t2 += e.startAt.position.map((t3)=>Lt(t3)
        ).join(",")), e.endAt && (t2 += "|ub:", t2 += e.endAt.inclusive ? "a:" : "b:", t2 += e.endAt.position.map((t3)=>Lt(t3)
        ).join(",")), e.P = t2;
    }
    return e.P;
}
function de(t140) {
    let e = t140.path.canonicalString();
    return t140.collectionGroup !== null && (e += " collectionGroup=" + t140.collectionGroup), t140.filters.length > 0 && (e += `, filters: [${t140.filters.map((t2)=>{
        return `${(e2 = t2).field.canonicalString()} ${e2.op} ${Lt(e2.value)}`;
        var e2;
    }).join(", ")}]`), St(t140.limit) || (e += ", limit: " + t140.limit), t140.orderBy.length > 0 && (e += `, orderBy: [${t140.orderBy.map((t2)=>(function(t3) {
            return `${t3.field.canonicalString()} (${t3.dir})`;
        })(t2)
    ).join(", ")}]`), t140.startAt && (e += ", startAt: ", e += t140.startAt.inclusive ? "b:" : "a:", e += t140.startAt.position.map((t2)=>Lt(t2)
    ).join(",")), t140.endAt && (e += ", endAt: ", e += t140.endAt.inclusive ? "a:" : "b:", e += t140.endAt.position.map((t2)=>Lt(t2)
    ).join(",")), `Target(${e})`;
}
function _e(t141, e) {
    if (t141.limit !== e.limit) return false;
    if (t141.orderBy.length !== e.orderBy.length) return false;
    for(let n2 = 0; n2 < t141.orderBy.length; n2++)if (!ve(t141.orderBy[n2], e.orderBy[n2])) return false;
    if (t141.filters.length !== e.filters.length) return false;
    for(let i = 0; i < t141.filters.length; i++)if (n = t141.filters[i], s = e.filters[i], n.op !== s.op || !n.field.isEqual(s.field) || !Ot(n.value, s.value)) return false;
    var n, s;
    return t141.collectionGroup === e.collectionGroup && !!t141.path.isEqual(e.path) && !!De(t141.startAt, e.startAt) && De(t141.endAt, e.endAt);
}
function we(t142) {
    return xt.isDocumentKey(t142.path) && t142.collectionGroup === null && t142.filters.length === 0;
}
function me(t143, e) {
    return t143.filters.filter((t2)=>t2 instanceof ge && t2.field.isEqual(e)
    );
}
class ge extends class {
} {
    constructor(t144, e, n){
        super(), this.field = t144, this.op = e, this.value = n;
    }
    static create(t145, e, n) {
        return t145.isKeyField() ? e === "in" || e === "not-in" ? this.V(t145, e, n) : new ye(t145, e, n) : e === "array-contains" ? new Ee(t145, n) : e === "in" ? new Ae(t145, n) : e === "not-in" ? new Re(t145, n) : e === "array-contains-any" ? new be(t145, n) : new ge(t145, e, n);
    }
    static V(t146, e, n) {
        return e === "in" ? new pe(t146, n) : new Ie(t146, n);
    }
    matches(t147) {
        const e = t147.data.field(this.field);
        return this.op === "!=" ? e !== null && this.v($t(e, this.value)) : e !== null && Mt(this.value) === Mt(e) && this.v($t(e, this.value));
    }
    v(t148) {
        switch(this.op){
            case "<":
                return t148 < 0;
            case "<=":
                return t148 <= 0;
            case "==":
                return t148 === 0;
            case "!=":
                return t148 !== 0;
            case ">":
                return t148 > 0;
            case ">=":
                return t148 >= 0;
            default:
                return L1();
        }
    }
    S() {
        return [
            "<",
            "<=",
            ">",
            ">=",
            "!=",
            "not-in"
        ].indexOf(this.op) >= 0;
    }
}
class ye extends ge {
    constructor(t149, e, n){
        super(t149, e, n), this.key = xt.fromName(n.referenceValue);
    }
    matches(t150) {
        const e = xt.comparator(t150.key, this.key);
        return this.v(e);
    }
}
class pe extends ge {
    constructor(t151, e){
        super(t151, "in", e), this.keys = Te("in", e);
    }
    matches(t152) {
        return this.keys.some((e)=>e.isEqual(t152.key)
        );
    }
}
class Ie extends ge {
    constructor(t153, e){
        super(t153, "not-in", e), this.keys = Te("not-in", e);
    }
    matches(t154) {
        return !this.keys.some((e)=>e.isEqual(t154.key)
        );
    }
}
function Te(t, e) {
    var n;
    return (((n = e.arrayValue) === null || n === void 0 ? void 0 : n.values) || []).map((t2)=>xt.fromName(t2.referenceValue)
    );
}
class Ee extends ge {
    constructor(t155, e){
        super(t155, "array-contains", e);
    }
    matches(t156) {
        const e = t156.data.field(this.field);
        return Kt(e) && Ft(e.arrayValue, this.value);
    }
}
class Ae extends ge {
    constructor(t157, e){
        super(t157, "in", e);
    }
    matches(t158) {
        const e = t158.data.field(this.field);
        return e !== null && Ft(this.value.arrayValue, e);
    }
}
class Re extends ge {
    constructor(t159, e){
        super(t159, "not-in", e);
    }
    matches(t160) {
        if (Ft(this.value.arrayValue, {
            nullValue: "NULL_VALUE"
        })) return false;
        const e = t160.data.field(this.field);
        return e !== null && !Ft(this.value.arrayValue, e);
    }
}
class be extends ge {
    constructor(t161, e){
        super(t161, "array-contains-any", e);
    }
    matches(t162) {
        const e = t162.data.field(this.field);
        return !(!Kt(e) || !e.arrayValue.values) && e.arrayValue.values.some((t2)=>Ft(this.value.arrayValue, t2)
        );
    }
}
class Pe {
    constructor(t163, e){
        this.position = t163, this.inclusive = e;
    }
}
class Ve {
    constructor(t164, e = "asc"){
        this.field = t164, this.dir = e;
    }
}
function ve(t165, e) {
    return t165.dir === e.dir && t165.field.isEqual(e.field);
}
function Se(t166, e, n) {
    let s = 0;
    for(let i = 0; i < t166.position.length; i++){
        const r = e[i], o = t166.position[i];
        if (r.field.isKeyField()) s = xt.comparator(xt.fromName(o.referenceValue), n.key);
        else {
            s = $t(o, n.data.field(r.field));
        }
        if (r.dir === "desc" && (s *= -1), s !== 0) break;
    }
    return s;
}
function De(t167, e) {
    if (t167 === null) return e === null;
    if (e === null) return false;
    if (t167.inclusive !== e.inclusive || t167.position.length !== e.position.length) return false;
    for(let n = 0; n < t167.position.length; n++){
        if (!Ot(t167.position[n], e.position[n])) return false;
    }
    return true;
}
class Ce {
    constructor(t168, e = null, n = [], s = [], i = null, r = "F", o = null, u = null){
        this.path = t168, this.collectionGroup = e, this.explicitOrderBy = n, this.filters = s, this.limit = i, this.limitType = r, this.startAt = o, this.endAt = u, this.D = null, this.C = null, this.startAt, this.endAt;
    }
}
function xe(t169, e, n, s, i, r, o, u) {
    return new Ce(t169, e, n, s, i, r, o, u);
}
function Ne(t170) {
    return new Ce(t170);
}
function ke(t171) {
    return !St(t171.limit) && t171.limitType === "F";
}
function Me(t172) {
    return !St(t172.limit) && t172.limitType === "L";
}
function Oe(t173) {
    return t173.explicitOrderBy.length > 0 ? t173.explicitOrderBy[0].field : null;
}
function Fe(t174) {
    for (const e of t174.filters)if (e.S()) return e.field;
    return null;
}
function $e(t175) {
    return t175.collectionGroup !== null;
}
function Be(t176) {
    const e = G(t176);
    if (e.D === null) {
        e.D = [];
        const t2 = Fe(e), n = Oe(e);
        if (t2 !== null && n === null) t2.isKeyField() || e.D.push(new Ve(t2)), e.D.push(new Ve(mt.keyField(), "asc"));
        else {
            let t3 = false;
            for (const n2 of e.explicitOrderBy)e.D.push(n2), n2.field.isKeyField() && (t3 = true);
            if (!t3) {
                const t4 = e.explicitOrderBy.length > 0 ? e.explicitOrderBy[e.explicitOrderBy.length - 1].dir : "asc";
                e.D.push(new Ve(mt.keyField(), t4));
            }
        }
    }
    return e.D;
}
function Le(t177) {
    const e = G(t177);
    if (!e.C) if (e.limitType === "F") e.C = le(e.path, e.collectionGroup, Be(e), e.filters, e.limit, e.startAt, e.endAt);
    else {
        const t2 = [];
        for (const n2 of Be(e)){
            const e2 = n2.dir === "desc" ? "asc" : "desc";
            t2.push(new Ve(n2.field, e2));
        }
        const n = e.endAt ? new Pe(e.endAt.position, !e.endAt.inclusive) : null, s = e.startAt ? new Pe(e.startAt.position, !e.startAt.inclusive) : null;
        e.C = le(e.path, e.collectionGroup, t2, e.filters, e.limit, n, s);
    }
    return e.C;
}
function Ue(t178, e, n) {
    return new Ce(t178.path, t178.collectionGroup, t178.explicitOrderBy.slice(), t178.filters.slice(), e, n, t178.startAt, t178.endAt);
}
function qe(t179, e) {
    return _e(Le(t179), Le(e)) && t179.limitType === e.limitType;
}
function Ge(t180) {
    return `${fe(Le(t180))}|lt:${t180.limitType}`;
}
function Ke(t181) {
    return `Query(target=${de(Le(t181))}; limitType=${t181.limitType})`;
}
function Qe(t182, e) {
    return e.isFoundDocument() && (function(t2, e2) {
        const n = e2.key.path;
        return t2.collectionGroup !== null ? e2.key.hasCollectionId(t2.collectionGroup) && t2.path.isPrefixOf(n) : xt.isDocumentKey(t2.path) ? t2.path.isEqual(n) : t2.path.isImmediateParentOf(n);
    })(t182, e) && (function(t2, e2) {
        for (const n of t2.explicitOrderBy)if (!n.field.isKeyField() && e2.data.field(n.field) === null) return false;
        return true;
    })(t182, e) && (function(t2, e2) {
        for (const n of t2.filters)if (!n.matches(e2)) return false;
        return true;
    })(t182, e) && (function(t2, e2) {
        if (t2.startAt && !function(t3, e3, n) {
            const s = Se(t3, e3, n);
            return t3.inclusive ? s <= 0 : s < 0;
        }(t2.startAt, Be(t2), e2)) return false;
        if (t2.endAt && !function(t3, e3, n) {
            const s = Se(t3, e3, n);
            return t3.inclusive ? s >= 0 : s > 0;
        }(t2.endAt, Be(t2), e2)) return false;
        return true;
    })(t182, e);
}
function je(t183) {
    return t183.collectionGroup || (t183.path.length % 2 == 1 ? t183.path.lastSegment() : t183.path.get(t183.path.length - 2));
}
function We(t184) {
    return (e, n)=>{
        let s = false;
        for (const i of Be(t184)){
            const t2 = ze(i, e, n);
            if (t2 !== 0) return t2;
            s = s || i.field.isKeyField();
        }
        return 0;
    };
}
function ze(t185, e, n) {
    const s = t185.field.isKeyField() ? xt.comparator(e.key, n.key) : function(t2, e2, n2) {
        const s2 = e2.data.field(t2), i = n2.data.field(t2);
        return s2 !== null && i !== null ? $t(s2, i) : L1();
    }(t185.field, e, n);
    switch(t185.dir){
        case "asc":
            return s;
        case "desc":
            return -1 * s;
        default:
            return L1();
    }
}
function He(t186, e) {
    if (t186.N) {
        if (isNaN(e)) return {
            doubleValue: "NaN"
        };
        if (e === 1 / 0) return {
            doubleValue: "Infinity"
        };
        if (e === -1 / 0) return {
            doubleValue: "-Infinity"
        };
    }
    return {
        doubleValue: Dt(e) ? "-0" : e
    };
}
function Je(t187) {
    return {
        integerValue: "" + t187
    };
}
function Ye(t188, e) {
    return Ct(e) ? Je(e) : He(t188, e);
}
class Xe {
    constructor(){
        this._ = void 0;
    }
}
function Ze(t189, e, n) {
    return t189 instanceof nn ? (function(t2, e2) {
        const n2 = {
            fields: {
                __type__: {
                    stringValue: "server_timestamp"
                },
                __local_write_time__: {
                    timestampValue: {
                        seconds: t2.seconds,
                        nanos: t2.nanoseconds
                    }
                }
            }
        };
        return e2 && (n2.fields.__previous_value__ = e2), {
            mapValue: n2
        };
    })(n, e) : t189 instanceof sn ? rn(t189, e) : t189 instanceof on$1 ? un(t189, e) : (function(t2, e2) {
        const n2 = en(t2, e2), s = cn(n2) + cn(t2.k);
        return Gt(n2) && Gt(t2.k) ? Je(s) : He(t2.M, s);
    })(t189, e);
}
function tn(t190, e, n) {
    return t190 instanceof sn ? rn(t190, e) : t190 instanceof on$1 ? un(t190, e) : n;
}
function en(t191, e) {
    return t191 instanceof an ? Gt(n = e) || (function(t2) {
        return !!t2 && "doubleValue" in t2;
    })(n) ? e : {
        integerValue: 0
    } : null;
    var n;
}
class nn extends Xe {
}
class sn extends Xe {
    constructor(t192){
        super(), this.elements = t192;
    }
}
function rn(t193, e) {
    const n = hn(e);
    for (const e2 of t193.elements)n.some((t2)=>Ot(t2, e2)
    ) || n.push(e2);
    return {
        arrayValue: {
            values: n
        }
    };
}
class on$1 extends Xe {
    constructor(t194){
        super(), this.elements = t194;
    }
}
function un(t195, e) {
    let n = hn(e);
    for (const e2 of t195.elements)n = n.filter((t2)=>!Ot(t2, e2)
    );
    return {
        arrayValue: {
            values: n
        }
    };
}
class an extends Xe {
    constructor(t196, e){
        super(), this.M = t196, this.k = e;
    }
}
function cn(t197) {
    return Et(t197.integerValue || t197.doubleValue);
}
function hn(t198) {
    return Kt(t198) && t198.arrayValue.values ? t198.arrayValue.values.slice() : [];
}
class ln {
    constructor(t199, e){
        this.field = t199, this.transform = e;
    }
}
function fn(t200, e) {
    return t200.field.isEqual(e.field) && (function(t2, e2) {
        return t2 instanceof sn && e2 instanceof sn || t2 instanceof on$1 && e2 instanceof on$1 ? ot(t2.elements, e2.elements, Ot) : t2 instanceof an && e2 instanceof an ? Ot(t2.k, e2.k) : t2 instanceof nn && e2 instanceof nn;
    })(t200.transform, e.transform);
}
class dn {
    constructor(t201, e){
        this.version = t201, this.transformResults = e;
    }
}
class _n {
    constructor(t202, e){
        this.updateTime = t202, this.exists = e;
    }
    static none() {
        return new _n();
    }
    static exists(t203) {
        return new _n(void 0, t203);
    }
    static updateTime(t204) {
        return new _n(t204);
    }
    get isNone() {
        return this.updateTime === void 0 && this.exists === void 0;
    }
    isEqual(t205) {
        return this.exists === t205.exists && (this.updateTime ? !!t205.updateTime && this.updateTime.isEqual(t205.updateTime) : !t205.updateTime);
    }
}
function wn(t206, e) {
    return t206.updateTime !== void 0 ? e.isFoundDocument() && e.version.isEqual(t206.updateTime) : t206.exists === void 0 || t206.exists === e.isFoundDocument();
}
class mn {
}
function gn(t207, e, n) {
    t207 instanceof En ? (function(t2, e2, n2) {
        const s = t2.value.clone(), i = bn(t2.fieldTransforms, e2, n2.transformResults);
        s.setAll(i), e2.convertToFoundDocument(n2.version, s).setHasCommittedMutations();
    })(t207, e, n) : t207 instanceof An ? (function(t2, e2, n2) {
        if (!wn(t2.precondition, e2)) return void e2.convertToUnknownDocument(n2.version);
        const s = bn(t2.fieldTransforms, e2, n2.transformResults), i = e2.data;
        i.setAll(Rn(t2)), i.setAll(s), e2.convertToFoundDocument(n2.version, i).setHasCommittedMutations();
    })(t207, e, n) : (function(t2, e2, n2) {
        e2.convertToNoDocument(n2.version).setHasCommittedMutations();
    })(0, e, n);
}
function yn(t208, e, n) {
    t208 instanceof En ? (function(t2, e2, n2) {
        if (!wn(t2.precondition, e2)) return;
        const s = t2.value.clone(), i = Pn(t2.fieldTransforms, n2, e2);
        s.setAll(i), e2.convertToFoundDocument(Tn(e2), s).setHasLocalMutations();
    })(t208, e, n) : t208 instanceof An ? (function(t2, e2, n2) {
        if (!wn(t2.precondition, e2)) return;
        const s = Pn(t2.fieldTransforms, n2, e2), i = e2.data;
        i.setAll(Rn(t2)), i.setAll(s), e2.convertToFoundDocument(Tn(e2), i).setHasLocalMutations();
    })(t208, e, n) : (function(t2, e2) {
        wn(t2.precondition, e2) && e2.convertToNoDocument(ct.min());
    })(t208, e);
}
function pn(t209, e) {
    let n = null;
    for (const s of t209.fieldTransforms){
        const t2 = e.data.field(s.field), i = en(s.transform, t2 || null);
        i != null && (n == null && (n = Xt.empty()), n.set(s.field, i));
    }
    return n || null;
}
function In(t210, e) {
    return t210.type === e.type && !!t210.key.isEqual(e.key) && !!t210.precondition.isEqual(e.precondition) && !!function(t2, e2) {
        return t2 === void 0 && e2 === void 0 || !(!t2 || !e2) && ot(t2, e2, (t3, e3)=>fn(t3, e3)
        );
    }(t210.fieldTransforms, e.fieldTransforms) && (t210.type === 0 ? t210.value.isEqual(e.value) : t210.type !== 1 || t210.data.isEqual(e.data) && t210.fieldMask.isEqual(e.fieldMask));
}
function Tn(t211) {
    return t211.isFoundDocument() ? t211.version : ct.min();
}
class En extends mn {
    constructor(t212, e, n, s = []){
        super(), this.key = t212, this.value = e, this.precondition = n, this.fieldTransforms = s, this.type = 0;
    }
}
class An extends mn {
    constructor(t213, e, n, s, i = []){
        super(), this.key = t213, this.data = e, this.fieldMask = n, this.precondition = s, this.fieldTransforms = i, this.type = 1;
    }
}
function Rn(t214) {
    const e = new Map();
    return t214.fieldMask.fields.forEach((n)=>{
        if (!n.isEmpty()) {
            const s = t214.data.field(n);
            e.set(n, s);
        }
    }), e;
}
function bn(t215, e, n) {
    const s = new Map();
    U1(t215.length === n.length);
    for(let i = 0; i < n.length; i++){
        const r = t215[i], o = r.transform, u = e.data.field(r.field);
        s.set(r.field, tn(o, u, n[i]));
    }
    return s;
}
function Pn(t216, e, n) {
    const s = new Map();
    for (const i of t216){
        const t2 = i.transform, r = n.data.field(i.field);
        s.set(i.field, Ze(t2, r, e));
    }
    return s;
}
class Vn extends mn {
    constructor(t217, e){
        super(), this.key = t217, this.precondition = e, this.type = 2, this.fieldTransforms = [];
    }
}
class vn extends mn {
    constructor(t218, e){
        super(), this.key = t218, this.precondition = e, this.type = 3, this.fieldTransforms = [];
    }
}
class Sn {
    constructor(t219){
        this.count = t219;
    }
}
var Dn, Cn;
function xn(t220) {
    switch(t220){
        default:
            return L1();
        case K1.CANCELLED:
        case K1.UNKNOWN:
        case K1.DEADLINE_EXCEEDED:
        case K1.RESOURCE_EXHAUSTED:
        case K1.INTERNAL:
        case K1.UNAVAILABLE:
        case K1.UNAUTHENTICATED:
            return false;
        case K1.INVALID_ARGUMENT:
        case K1.NOT_FOUND:
        case K1.ALREADY_EXISTS:
        case K1.PERMISSION_DENIED:
        case K1.FAILED_PRECONDITION:
        case K1.ABORTED:
        case K1.OUT_OF_RANGE:
        case K1.UNIMPLEMENTED:
        case K1.DATA_LOSS:
            return true;
    }
}
function Nn(t221) {
    if (t221 === void 0) return F1("GRPC error has no .code"), K1.UNKNOWN;
    switch(t221){
        case Dn.OK:
            return K1.OK;
        case Dn.CANCELLED:
            return K1.CANCELLED;
        case Dn.UNKNOWN:
            return K1.UNKNOWN;
        case Dn.DEADLINE_EXCEEDED:
            return K1.DEADLINE_EXCEEDED;
        case Dn.RESOURCE_EXHAUSTED:
            return K1.RESOURCE_EXHAUSTED;
        case Dn.INTERNAL:
            return K1.INTERNAL;
        case Dn.UNAVAILABLE:
            return K1.UNAVAILABLE;
        case Dn.UNAUTHENTICATED:
            return K1.UNAUTHENTICATED;
        case Dn.INVALID_ARGUMENT:
            return K1.INVALID_ARGUMENT;
        case Dn.NOT_FOUND:
            return K1.NOT_FOUND;
        case Dn.ALREADY_EXISTS:
            return K1.ALREADY_EXISTS;
        case Dn.PERMISSION_DENIED:
            return K1.PERMISSION_DENIED;
        case Dn.FAILED_PRECONDITION:
            return K1.FAILED_PRECONDITION;
        case Dn.ABORTED:
            return K1.ABORTED;
        case Dn.OUT_OF_RANGE:
            return K1.OUT_OF_RANGE;
        case Dn.UNIMPLEMENTED:
            return K1.UNIMPLEMENTED;
        case Dn.DATA_LOSS:
            return K1.DATA_LOSS;
        default:
            return L1();
    }
}
(Cn = Dn || (Dn = {}))[Cn.OK = 0] = "OK", Cn[Cn.CANCELLED = 1] = "CANCELLED", Cn[Cn.UNKNOWN = 2] = "UNKNOWN", Cn[Cn.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", Cn[Cn.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", Cn[Cn.NOT_FOUND = 5] = "NOT_FOUND", Cn[Cn.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", Cn[Cn.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", Cn[Cn.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", Cn[Cn.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", Cn[Cn.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", Cn[Cn.ABORTED = 10] = "ABORTED", Cn[Cn.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", Cn[Cn.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", Cn[Cn.INTERNAL = 13] = "INTERNAL", Cn[Cn.UNAVAILABLE = 14] = "UNAVAILABLE", Cn[Cn.DATA_LOSS = 15] = "DATA_LOSS";
class kn {
    constructor(t222, e){
        this.mapKeyFn = t222, this.equalsFn = e, this.inner = {}, this.innerSize = 0;
    }
    get(t223) {
        const e = this.mapKeyFn(t223), n = this.inner[e];
        if (n !== void 0) {
            for (const [e2, s] of n)if (this.equalsFn(e2, t223)) return s;
        }
    }
    has(t224) {
        return this.get(t224) !== void 0;
    }
    set(t225, e) {
        const n = this.mapKeyFn(t225), s = this.inner[n];
        if (s === void 0) return this.inner[n] = [
            [
                t225,
                e
            ]
        ], void this.innerSize++;
        for(let n2 = 0; n2 < s.length; n2++)if (this.equalsFn(s[n2][0], t225)) return void (s[n2] = [
            t225,
            e
        ]);
        s.push([
            t225,
            e
        ]), this.innerSize++;
    }
    delete(t226) {
        const e = this.mapKeyFn(t226), n = this.inner[e];
        if (n === void 0) return false;
        for(let s = 0; s < n.length; s++)if (this.equalsFn(n[s][0], t226)) return n.length === 1 ? delete this.inner[e] : n.splice(s, 1), this.innerSize--, true;
        return false;
    }
    forEach(t227) {
        lt(this.inner, (e, n)=>{
            for (const [e2, s] of n)t227(e2, s);
        });
    }
    isEmpty() {
        return ft(this.inner);
    }
    size() {
        return this.innerSize;
    }
}
class Mn {
    constructor(t228, e){
        this.comparator = t228, this.root = e || Fn.EMPTY;
    }
    insert(t229, e) {
        return new Mn(this.comparator, this.root.insert(t229, e, this.comparator).copy(null, null, Fn.BLACK, null, null));
    }
    remove(t230) {
        return new Mn(this.comparator, this.root.remove(t230, this.comparator).copy(null, null, Fn.BLACK, null, null));
    }
    get(t231) {
        let e = this.root;
        for(; !e.isEmpty();){
            const n = this.comparator(t231, e.key);
            if (n === 0) return e.value;
            n < 0 ? e = e.left : n > 0 && (e = e.right);
        }
        return null;
    }
    indexOf(t232) {
        let e = 0, n = this.root;
        for(; !n.isEmpty();){
            const s = this.comparator(t232, n.key);
            if (s === 0) return e + n.left.size;
            s < 0 ? n = n.left : (e += n.left.size + 1, n = n.right);
        }
        return -1;
    }
    isEmpty() {
        return this.root.isEmpty();
    }
    get size() {
        return this.root.size;
    }
    minKey() {
        return this.root.minKey();
    }
    maxKey() {
        return this.root.maxKey();
    }
    inorderTraversal(t233) {
        return this.root.inorderTraversal(t233);
    }
    forEach(t234) {
        this.inorderTraversal((e, n)=>(t234(e, n), false)
        );
    }
    toString() {
        const t235 = [];
        return this.inorderTraversal((e, n)=>(t235.push(`${e}:${n}`), false)
        ), `{${t235.join(", ")}}`;
    }
    reverseTraversal(t236) {
        return this.root.reverseTraversal(t236);
    }
    getIterator() {
        return new On(this.root, null, this.comparator, false);
    }
    getIteratorFrom(t237) {
        return new On(this.root, t237, this.comparator, false);
    }
    getReverseIterator() {
        return new On(this.root, null, this.comparator, true);
    }
    getReverseIteratorFrom(t238) {
        return new On(this.root, t238, this.comparator, true);
    }
}
class On {
    constructor(t239, e, n, s){
        this.isReverse = s, this.nodeStack = [];
        let i = 1;
        for(; !t239.isEmpty();)if (i = e ? n(t239.key, e) : 1, e && s && (i *= -1), i < 0) t239 = this.isReverse ? t239.left : t239.right;
        else {
            if (i === 0) {
                this.nodeStack.push(t239);
                break;
            }
            this.nodeStack.push(t239), t239 = this.isReverse ? t239.right : t239.left;
        }
    }
    getNext() {
        let t240 = this.nodeStack.pop();
        const e = {
            key: t240.key,
            value: t240.value
        };
        if (this.isReverse) for(t240 = t240.left; !t240.isEmpty();)this.nodeStack.push(t240), t240 = t240.right;
        else for(t240 = t240.right; !t240.isEmpty();)this.nodeStack.push(t240), t240 = t240.left;
        return e;
    }
    hasNext() {
        return this.nodeStack.length > 0;
    }
    peek() {
        if (this.nodeStack.length === 0) return null;
        const t241 = this.nodeStack[this.nodeStack.length - 1];
        return {
            key: t241.key,
            value: t241.value
        };
    }
}
class Fn {
    constructor(t242, e, n, s, i){
        this.key = t242, this.value = e, this.color = n != null ? n : Fn.RED, this.left = s != null ? s : Fn.EMPTY, this.right = i != null ? i : Fn.EMPTY, this.size = this.left.size + 1 + this.right.size;
    }
    copy(t243, e, n, s, i) {
        return new Fn(t243 != null ? t243 : this.key, e != null ? e : this.value, n != null ? n : this.color, s != null ? s : this.left, i != null ? i : this.right);
    }
    isEmpty() {
        return false;
    }
    inorderTraversal(t244) {
        return this.left.inorderTraversal(t244) || t244(this.key, this.value) || this.right.inorderTraversal(t244);
    }
    reverseTraversal(t245) {
        return this.right.reverseTraversal(t245) || t245(this.key, this.value) || this.left.reverseTraversal(t245);
    }
    min() {
        return this.left.isEmpty() ? this : this.left.min();
    }
    minKey() {
        return this.min().key;
    }
    maxKey() {
        return this.right.isEmpty() ? this.key : this.right.maxKey();
    }
    insert(t246, e, n) {
        let s = this;
        const i = n(t246, s.key);
        return s = i < 0 ? s.copy(null, null, null, s.left.insert(t246, e, n), null) : i === 0 ? s.copy(null, e, null, null, null) : s.copy(null, null, null, null, s.right.insert(t246, e, n)), s.fixUp();
    }
    removeMin() {
        if (this.left.isEmpty()) return Fn.EMPTY;
        let t247 = this;
        return t247.left.isRed() || t247.left.left.isRed() || (t247 = t247.moveRedLeft()), t247 = t247.copy(null, null, null, t247.left.removeMin(), null), t247.fixUp();
    }
    remove(t248, e) {
        let n, s = this;
        if (e(t248, s.key) < 0) s.left.isEmpty() || s.left.isRed() || s.left.left.isRed() || (s = s.moveRedLeft()), s = s.copy(null, null, null, s.left.remove(t248, e), null);
        else {
            if (s.left.isRed() && (s = s.rotateRight()), s.right.isEmpty() || s.right.isRed() || s.right.left.isRed() || (s = s.moveRedRight()), e(t248, s.key) === 0) {
                if (s.right.isEmpty()) return Fn.EMPTY;
                n = s.right.min(), s = s.copy(n.key, n.value, null, null, s.right.removeMin());
            }
            s = s.copy(null, null, null, null, s.right.remove(t248, e));
        }
        return s.fixUp();
    }
    isRed() {
        return this.color;
    }
    fixUp() {
        let t249 = this;
        return t249.right.isRed() && !t249.left.isRed() && (t249 = t249.rotateLeft()), t249.left.isRed() && t249.left.left.isRed() && (t249 = t249.rotateRight()), t249.left.isRed() && t249.right.isRed() && (t249 = t249.colorFlip()), t249;
    }
    moveRedLeft() {
        let t250 = this.colorFlip();
        return t250.right.left.isRed() && (t250 = t250.copy(null, null, null, null, t250.right.rotateRight()), t250 = t250.rotateLeft(), t250 = t250.colorFlip()), t250;
    }
    moveRedRight() {
        let t251 = this.colorFlip();
        return t251.left.left.isRed() && (t251 = t251.rotateRight(), t251 = t251.colorFlip()), t251;
    }
    rotateLeft() {
        const t252 = this.copy(null, null, Fn.RED, null, this.right.left);
        return this.right.copy(null, null, this.color, t252, null);
    }
    rotateRight() {
        const t253 = this.copy(null, null, Fn.RED, this.left.right, null);
        return this.left.copy(null, null, this.color, null, t253);
    }
    colorFlip() {
        const t254 = this.left.copy(null, null, !this.left.color, null, null), e = this.right.copy(null, null, !this.right.color, null, null);
        return this.copy(null, null, !this.color, t254, e);
    }
    checkMaxDepth() {
        const t255 = this.check();
        return Math.pow(2, t255) <= this.size + 1;
    }
    check() {
        if (this.isRed() && this.left.isRed()) throw L1();
        if (this.right.isRed()) throw L1();
        const t256 = this.left.check();
        if (t256 !== this.right.check()) throw L1();
        return t256 + (this.isRed() ? 0 : 1);
    }
}
Fn.EMPTY = null, Fn.RED = true, Fn.BLACK = false;
Fn.EMPTY = new class {
    constructor(){
        this.size = 0;
    }
    get key() {
        throw L1();
    }
    get value() {
        throw L1();
    }
    get color() {
        throw L1();
    }
    get left() {
        throw L1();
    }
    get right() {
        throw L1();
    }
    copy(t, e, n, s, i) {
        return this;
    }
    insert(t257, e, n) {
        return new Fn(t257, e);
    }
    remove(t, e) {
        return this;
    }
    isEmpty() {
        return true;
    }
    inorderTraversal(t) {
        return false;
    }
    reverseTraversal(t) {
        return false;
    }
    minKey() {
        return null;
    }
    maxKey() {
        return null;
    }
    isRed() {
        return false;
    }
    checkMaxDepth() {
        return true;
    }
    check() {
        return 0;
    }
}();
class $n {
    constructor(t258){
        this.comparator = t258, this.data = new Mn(this.comparator);
    }
    has(t259) {
        return this.data.get(t259) !== null;
    }
    first() {
        return this.data.minKey();
    }
    last() {
        return this.data.maxKey();
    }
    get size() {
        return this.data.size;
    }
    indexOf(t260) {
        return this.data.indexOf(t260);
    }
    forEach(t261) {
        this.data.inorderTraversal((e, n)=>(t261(e), false)
        );
    }
    forEachInRange(t262, e) {
        const n = this.data.getIteratorFrom(t262[0]);
        for(; n.hasNext();){
            const s = n.getNext();
            if (this.comparator(s.key, t262[1]) >= 0) return;
            e(s.key);
        }
    }
    forEachWhile(t263, e) {
        let n;
        for(n = e !== void 0 ? this.data.getIteratorFrom(e) : this.data.getIterator(); n.hasNext();){
            if (!t263(n.getNext().key)) return;
        }
    }
    firstAfterOrEqual(t264) {
        const e = this.data.getIteratorFrom(t264);
        return e.hasNext() ? e.getNext().key : null;
    }
    getIterator() {
        return new Bn(this.data.getIterator());
    }
    getIteratorFrom(t265) {
        return new Bn(this.data.getIteratorFrom(t265));
    }
    add(t266) {
        return this.copy(this.data.remove(t266).insert(t266, true));
    }
    delete(t267) {
        return this.has(t267) ? this.copy(this.data.remove(t267)) : this;
    }
    isEmpty() {
        return this.data.isEmpty();
    }
    unionWith(t268) {
        let e = this;
        return e.size < t268.size && (e = t268, t268 = this), t268.forEach((t2)=>{
            e = e.add(t2);
        }), e;
    }
    isEqual(t269) {
        if (!(t269 instanceof $n)) return false;
        if (this.size !== t269.size) return false;
        const e = this.data.getIterator(), n = t269.data.getIterator();
        for(; e.hasNext();){
            const t2 = e.getNext().key, s = n.getNext().key;
            if (this.comparator(t2, s) !== 0) return false;
        }
        return true;
    }
    toArray() {
        const t270 = [];
        return this.forEach((e)=>{
            t270.push(e);
        }), t270;
    }
    toString() {
        const t271 = [];
        return this.forEach((e)=>t271.push(e)
        ), "SortedSet(" + t271.toString() + ")";
    }
    copy(t272) {
        const e = new $n(this.comparator);
        return e.data = t272, e;
    }
}
class Bn {
    constructor(t273){
        this.iter = t273;
    }
    getNext() {
        return this.iter.getNext().key;
    }
    hasNext() {
        return this.iter.hasNext();
    }
}
function Ln(t274) {
    return t274.hasNext() ? t274.getNext() : void 0;
}
const Un = new Mn(xt.comparator);
function qn() {
    return Un;
}
const Gn = new Mn(xt.comparator);
function Kn() {
    return Gn;
}
function Qn() {
    return new kn((t275)=>t275.toString()
    , (t276, e)=>t276.isEqual(e)
    );
}
const jn = new Mn(xt.comparator);
const Wn = new $n(xt.comparator);
function zn(...t277) {
    let e = Wn;
    for (const n of t277)e = e.add(n);
    return e;
}
const Hn = new $n(rt);
function Jn() {
    return Hn;
}
class Yn {
    constructor(t278, e, n, s, i){
        this.snapshotVersion = t278, this.targetChanges = e, this.targetMismatches = n, this.documentUpdates = s, this.resolvedLimboDocuments = i;
    }
    static createSynthesizedRemoteEventForCurrentChange(t279, e) {
        const n = new Map();
        return n.set(t279, Xn.createSynthesizedTargetChangeForCurrentChange(t279, e)), new Yn(ct.min(), n, Jn(), qn(), zn());
    }
}
class Xn {
    constructor(t280, e, n, s, i){
        this.resumeToken = t280, this.current = e, this.addedDocuments = n, this.modifiedDocuments = s, this.removedDocuments = i;
    }
    static createSynthesizedTargetChangeForCurrentChange(t, e) {
        return new Xn(pt.EMPTY_BYTE_STRING, e, zn(), zn(), zn());
    }
}
class Zn {
    constructor(t281, e, n, s){
        this.O = t281, this.removedTargetIds = e, this.key = n, this.F = s;
    }
}
class ts {
    constructor(t282, e){
        this.targetId = t282, this.$ = e;
    }
}
class es {
    constructor(t283, e, n = pt.EMPTY_BYTE_STRING, s = null){
        this.state = t283, this.targetIds = e, this.resumeToken = n, this.cause = s;
    }
}
class ns {
    constructor(){
        this.B = 0, this.L = rs(), this.U = pt.EMPTY_BYTE_STRING, this.q = false, this.G = true;
    }
    get current() {
        return this.q;
    }
    get resumeToken() {
        return this.U;
    }
    get K() {
        return this.B !== 0;
    }
    get j() {
        return this.G;
    }
    W(t284) {
        t284.approximateByteSize() > 0 && (this.G = true, this.U = t284);
    }
    H() {
        let t285 = zn(), e = zn(), n = zn();
        return this.L.forEach((s, i)=>{
            switch(i){
                case 0:
                    t285 = t285.add(s);
                    break;
                case 2:
                    e = e.add(s);
                    break;
                case 1:
                    n = n.add(s);
                    break;
                default:
                    L1();
            }
        }), new Xn(this.U, this.q, t285, e, n);
    }
    J() {
        this.G = false, this.L = rs();
    }
    Y(t286, e) {
        this.G = true, this.L = this.L.insert(t286, e);
    }
    X(t287) {
        this.G = true, this.L = this.L.remove(t287);
    }
    Z() {
        this.B += 1;
    }
    tt() {
        this.B -= 1;
    }
    et() {
        this.G = true, this.q = true;
    }
}
class ss {
    constructor(t288){
        this.nt = t288, this.st = new Map(), this.it = qn(), this.rt = is(), this.ot = new $n(rt);
    }
    ut(t289) {
        for (const e of t289.O)t289.F && t289.F.isFoundDocument() ? this.at(e, t289.F) : this.ct(e, t289.key, t289.F);
        for (const e1 of t289.removedTargetIds)this.ct(e1, t289.key, t289.F);
    }
    ht(t290) {
        this.forEachTarget(t290, (e)=>{
            const n = this.lt(e);
            switch(t290.state){
                case 0:
                    this.ft(e) && n.W(t290.resumeToken);
                    break;
                case 1:
                    n.tt(), n.K || n.J(), n.W(t290.resumeToken);
                    break;
                case 2:
                    n.tt(), n.K || this.removeTarget(e);
                    break;
                case 3:
                    this.ft(e) && (n.et(), n.W(t290.resumeToken));
                    break;
                case 4:
                    this.ft(e) && (this.dt(e), n.W(t290.resumeToken));
                    break;
                default:
                    L1();
            }
        });
    }
    forEachTarget(t291, e) {
        t291.targetIds.length > 0 ? t291.targetIds.forEach(e) : this.st.forEach((t2, n)=>{
            this.ft(n) && e(n);
        });
    }
    _t(t292) {
        const e = t292.targetId, n = t292.$.count, s = this.wt(e);
        if (s) {
            const t2 = s.target;
            if (we(t2)) if (n === 0) {
                const n2 = new xt(t2.path);
                this.ct(e, n2, te.newNoDocument(n2, ct.min()));
            } else U1(n === 1);
            else {
                this.gt(e) !== n && (this.dt(e), this.ot = this.ot.add(e));
            }
        }
    }
    yt(t293) {
        const e = new Map();
        this.st.forEach((n2, s2)=>{
            const i = this.wt(s2);
            if (i) {
                if (n2.current && we(i.target)) {
                    const e2 = new xt(i.target.path);
                    this.it.get(e2) !== null || this.It(s2, e2) || this.ct(s2, e2, te.newNoDocument(e2, t293));
                }
                n2.j && (e.set(s2, n2.H()), n2.J());
            }
        });
        let n = zn();
        this.rt.forEach((t2, e2)=>{
            let s2 = true;
            e2.forEachWhile((t3)=>{
                const e3 = this.wt(t3);
                return !e3 || e3.purpose === 2 || (s2 = false, false);
            }), s2 && (n = n.add(t2));
        }), this.it.forEach((e2, n2)=>n2.setReadTime(t293)
        );
        const s = new Yn(t293, e, this.ot, this.it, n);
        return this.it = qn(), this.rt = is(), this.ot = new $n(rt), s;
    }
    at(t294, e) {
        if (!this.ft(t294)) return;
        const n = this.It(t294, e.key) ? 2 : 0;
        this.lt(t294).Y(e.key, n), this.it = this.it.insert(e.key, e), this.rt = this.rt.insert(e.key, this.Tt(e.key).add(t294));
    }
    ct(t295, e, n) {
        if (!this.ft(t295)) return;
        const s = this.lt(t295);
        this.It(t295, e) ? s.Y(e, 1) : s.X(e), this.rt = this.rt.insert(e, this.Tt(e).delete(t295)), n && (this.it = this.it.insert(e, n));
    }
    removeTarget(t296) {
        this.st.delete(t296);
    }
    gt(t297) {
        const e = this.lt(t297).H();
        return this.nt.getRemoteKeysForTarget(t297).size + e.addedDocuments.size - e.removedDocuments.size;
    }
    Z(t298) {
        this.lt(t298).Z();
    }
    lt(t299) {
        let e = this.st.get(t299);
        return e || (e = new ns(), this.st.set(t299, e)), e;
    }
    Tt(t300) {
        let e = this.rt.get(t300);
        return e || (e = new $n(rt), this.rt = this.rt.insert(t300, e)), e;
    }
    ft(t301) {
        const e = this.wt(t301) !== null;
        return e || O1("WatchChangeAggregator", "Detected inactive target", t301), e;
    }
    wt(t302) {
        const e = this.st.get(t302);
        return e && e.K ? null : this.nt.Et(t302);
    }
    dt(t303) {
        this.st.set(t303, new ns());
        this.nt.getRemoteKeysForTarget(t303).forEach((e)=>{
            this.ct(t303, e, null);
        });
    }
    It(t304, e) {
        return this.nt.getRemoteKeysForTarget(t304).has(e);
    }
}
function is() {
    return new Mn(xt.comparator);
}
function rs() {
    return new Mn(xt.comparator);
}
const os = (()=>{
    const t305 = {
        asc: "ASCENDING",
        desc: "DESCENDING"
    };
    return t305;
})(), us = (()=>{
    const t306 = {
        "<": "LESS_THAN",
        "<=": "LESS_THAN_OR_EQUAL",
        ">": "GREATER_THAN",
        ">=": "GREATER_THAN_OR_EQUAL",
        "==": "EQUAL",
        "!=": "NOT_EQUAL",
        "array-contains": "ARRAY_CONTAINS",
        in: "IN",
        "not-in": "NOT_IN",
        "array-contains-any": "ARRAY_CONTAINS_ANY"
    };
    return t306;
})();
class as {
    constructor(t307, e){
        this.databaseId = t307, this.N = e;
    }
}
function cs(t308, e) {
    if (t308.N) {
        return `${new Date(1000 * e.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + e.nanoseconds).slice(-9)}Z`;
    }
    return {
        seconds: "" + e.seconds,
        nanos: e.nanoseconds
    };
}
function hs(t309, e) {
    return t309.N ? e.toBase64() : e.toUint8Array();
}
function ls(t310, e) {
    return cs(t310, e.toTimestamp());
}
function fs(t311) {
    return U1(!!t311), ct.fromTimestamp(function(t2) {
        const e = Tt(t2);
        return new at(e.seconds, e.nanos);
    }(t311));
}
function ds(t312, e) {
    return (function(t2) {
        return new _t([
            "projects",
            t2.projectId,
            "databases",
            t2.database
        ]);
    })(t312).child("documents").child(e).canonicalString();
}
function _s(t313) {
    const e = _t.fromString(t313);
    return U1(Ls(e)), e;
}
function ws(t314, e) {
    return ds(t314.databaseId, e.path);
}
function ms(t315, e) {
    const n = _s(e);
    if (n.get(1) !== t315.databaseId.projectId) throw new Q1(K1.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + n.get(1) + " vs " + t315.databaseId.projectId);
    if (n.get(3) !== t315.databaseId.database) throw new Q1(K1.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + n.get(3) + " vs " + t315.databaseId.database);
    return new xt(Is(n));
}
function gs(t316, e) {
    return ds(t316.databaseId, e);
}
function ys(t317) {
    const e = _s(t317);
    return e.length === 4 ? _t.emptyPath() : Is(e);
}
function ps(t318) {
    return new _t([
        "projects",
        t318.databaseId.projectId,
        "databases",
        t318.databaseId.database
    ]).canonicalString();
}
function Is(t319) {
    return U1(t319.length > 4 && t319.get(4) === "documents"), t319.popFirst(5);
}
function Ts(t320, e, n) {
    return {
        name: ws(t320, e),
        fields: n.value.mapValue.fields
    };
}
function Es(t321, e, n) {
    const s = ms(t321, e.name), i = fs(e.updateTime), r = new Xt({
        mapValue: {
            fields: e.fields
        }
    }), o = te.newFoundDocument(s, i, r);
    return n && o.setHasCommittedMutations(), n ? o.setHasCommittedMutations() : o;
}
function Rs(t322, e) {
    let n;
    if ("targetChange" in e) {
        e.targetChange;
        const s = function(t2) {
            return t2 === "NO_CHANGE" ? 0 : t2 === "ADD" ? 1 : t2 === "REMOVE" ? 2 : t2 === "CURRENT" ? 3 : t2 === "RESET" ? 4 : L1();
        }(e.targetChange.targetChangeType || "NO_CHANGE"), i = e.targetChange.targetIds || [], r = function(t2, e2) {
            return t2.N ? (U1(e2 === void 0 || typeof e2 == "string"), pt.fromBase64String(e2 || "")) : (U1(e2 === void 0 || e2 instanceof Uint8Array), pt.fromUint8Array(e2 || new Uint8Array()));
        }(t322, e.targetChange.resumeToken), o = e.targetChange.cause, u = o && function(t2) {
            const e2 = t2.code === void 0 ? K1.UNKNOWN : Nn(t2.code);
            return new Q1(e2, t2.message || "");
        }(o);
        n = new es(s, i, r, u || null);
    } else if ("documentChange" in e) {
        e.documentChange;
        const s = e.documentChange;
        s.document, s.document.name, s.document.updateTime;
        const i = ms(t322, s.document.name), r = fs(s.document.updateTime), o = new Xt({
            mapValue: {
                fields: s.document.fields
            }
        }), u = te.newFoundDocument(i, r, o), a = s.targetIds || [], c = s.removedTargetIds || [];
        n = new Zn(a, c, u.key, u);
    } else if ("documentDelete" in e) {
        e.documentDelete;
        const s = e.documentDelete;
        s.document;
        const i = ms(t322, s.document), r = s.readTime ? fs(s.readTime) : ct.min(), o = te.newNoDocument(i, r), u = s.removedTargetIds || [];
        n = new Zn([], u, o.key, o);
    } else if ("documentRemove" in e) {
        e.documentRemove;
        const s = e.documentRemove;
        s.document;
        const i = ms(t322, s.document), r = s.removedTargetIds || [];
        n = new Zn([], r, i, null);
    } else {
        if (!("filter" in e)) return L1();
        {
            e.filter;
            const t2 = e.filter;
            t2.targetId;
            const s = t2.count || 0, i = new Sn(s), r = t2.targetId;
            n = new ts(r, i);
        }
    }
    return n;
}
function bs(t323, e) {
    let n;
    if (e instanceof En) n = {
        update: Ts(t323, e.key, e.value)
    };
    else if (e instanceof Vn) n = {
        delete: ws(t323, e.key)
    };
    else if (e instanceof An) n = {
        update: Ts(t323, e.key, e.data),
        updateMask: Bs(e.fieldMask)
    };
    else {
        if (!(e instanceof vn)) return L1();
        n = {
            verify: ws(t323, e.key)
        };
    }
    return e.fieldTransforms.length > 0 && (n.updateTransforms = e.fieldTransforms.map((t2)=>(function(t3, e2) {
            const n2 = e2.transform;
            if (n2 instanceof nn) return {
                fieldPath: e2.field.canonicalString(),
                setToServerValue: "REQUEST_TIME"
            };
            if (n2 instanceof sn) return {
                fieldPath: e2.field.canonicalString(),
                appendMissingElements: {
                    values: n2.elements
                }
            };
            if (n2 instanceof on$1) return {
                fieldPath: e2.field.canonicalString(),
                removeAllFromArray: {
                    values: n2.elements
                }
            };
            if (n2 instanceof an) return {
                fieldPath: e2.field.canonicalString(),
                increment: n2.k
            };
            throw L1();
        })(0, t2)
    )), e.precondition.isNone || (n.currentDocument = (function(t2, e2) {
        return e2.updateTime !== void 0 ? {
            updateTime: ls(t2, e2.updateTime)
        } : e2.exists !== void 0 ? {
            exists: e2.exists
        } : L1();
    })(t323, e.precondition)), n;
}
function Ps(t324, e) {
    const n = e.currentDocument ? function(t2) {
        return t2.updateTime !== void 0 ? _n.updateTime(fs(t2.updateTime)) : t2.exists !== void 0 ? _n.exists(t2.exists) : _n.none();
    }(e.currentDocument) : _n.none(), s = e.updateTransforms ? e.updateTransforms.map((e2)=>(function(t2, e3) {
            let n2 = null;
            if ("setToServerValue" in e3) U1(e3.setToServerValue === "REQUEST_TIME"), n2 = new nn();
            else if ("appendMissingElements" in e3) {
                const t3 = e3.appendMissingElements.values || [];
                n2 = new sn(t3);
            } else if ("removeAllFromArray" in e3) {
                const t3 = e3.removeAllFromArray.values || [];
                n2 = new on$1(t3);
            } else "increment" in e3 ? n2 = new an(t2, e3.increment) : L1();
            const s2 = mt.fromServerFormat(e3.fieldPath);
            return new ln(s2, n2);
        })(t324, e2)
    ) : [];
    if (e.update) {
        e.update.name;
        const i = ms(t324, e.update.name), r = new Xt({
            mapValue: {
                fields: e.update.fields
            }
        });
        if (e.updateMask) {
            const t2 = function(t3) {
                const e2 = t3.fieldPaths || [];
                return new gt(e2.map((t4)=>mt.fromServerFormat(t4)
                ));
            }(e.updateMask);
            return new An(i, r, t2, n, s);
        }
        return new En(i, r, n, s);
    }
    if (e.delete) {
        const s2 = ms(t324, e.delete);
        return new Vn(s2, n);
    }
    if (e.verify) {
        const s2 = ms(t324, e.verify);
        return new vn(s2, n);
    }
    return L1();
}
function Vs(t325, e) {
    return t325 && t325.length > 0 ? (U1(e !== void 0), t325.map((t2)=>(function(t3, e2) {
            let n = t3.updateTime ? fs(t3.updateTime) : fs(e2);
            return n.isEqual(ct.min()) && (n = fs(e2)), new dn(n, t3.transformResults || []);
        })(t2, e)
    )) : [];
}
function vs(t326, e) {
    return {
        documents: [
            gs(t326, e.path)
        ]
    };
}
function Ss(t327, e) {
    const n = {
        structuredQuery: {}
    }, s = e.path;
    e.collectionGroup !== null ? (n.parent = gs(t327, s), n.structuredQuery.from = [
        {
            collectionId: e.collectionGroup,
            allDescendants: true
        }
    ]) : (n.parent = gs(t327, s.popLast()), n.structuredQuery.from = [
        {
            collectionId: s.lastSegment()
        }
    ]);
    const i = function(t2) {
        if (t2.length === 0) return;
        const e2 = t2.map((t3)=>(function(t4) {
                if (t4.op === "==") {
                    if (jt(t4.value)) return {
                        unaryFilter: {
                            field: Ms(t4.field),
                            op: "IS_NAN"
                        }
                    };
                    if (Qt(t4.value)) return {
                        unaryFilter: {
                            field: Ms(t4.field),
                            op: "IS_NULL"
                        }
                    };
                } else if (t4.op === "!=") {
                    if (jt(t4.value)) return {
                        unaryFilter: {
                            field: Ms(t4.field),
                            op: "IS_NOT_NAN"
                        }
                    };
                    if (Qt(t4.value)) return {
                        unaryFilter: {
                            field: Ms(t4.field),
                            op: "IS_NOT_NULL"
                        }
                    };
                }
                return {
                    fieldFilter: {
                        field: Ms(t4.field),
                        op: ks(t4.op),
                        value: t4.value
                    }
                };
            })(t3)
        );
        if (e2.length === 1) return e2[0];
        return {
            compositeFilter: {
                op: "AND",
                filters: e2
            }
        };
    }(e.filters);
    i && (n.structuredQuery.where = i);
    const r = function(t2) {
        if (t2.length === 0) return;
        return t2.map((t3)=>(function(t4) {
                return {
                    field: Ms(t4.field),
                    direction: Ns(t4.dir)
                };
            })(t3)
        );
    }(e.orderBy);
    r && (n.structuredQuery.orderBy = r);
    const o = function(t2, e2) {
        return t2.N || St(e2) ? e2 : {
            value: e2
        };
    }(t327, e.limit);
    var u;
    return o !== null && (n.structuredQuery.limit = o), e.startAt && (n.structuredQuery.startAt = {
        before: (u = e.startAt).inclusive,
        values: u.position
    }), e.endAt && (n.structuredQuery.endAt = (function(t2) {
        return {
            before: !t2.inclusive,
            values: t2.position
        };
    })(e.endAt)), n;
}
function Ds(t328) {
    let e = ys(t328.parent);
    const n = t328.structuredQuery, s = n.from ? n.from.length : 0;
    let i = null;
    if (s > 0) {
        U1(s === 1);
        const t2 = n.from[0];
        t2.allDescendants ? i = t2.collectionId : e = e.child(t2.collectionId);
    }
    let r = [];
    n.where && (r = xs(n.where));
    let o = [];
    n.orderBy && (o = n.orderBy.map((t2)=>(function(t3) {
            return new Ve(Os(t3.field), function(t4) {
                switch(t4){
                    case "ASCENDING":
                        return "asc";
                    case "DESCENDING":
                        return "desc";
                    default:
                        return;
                }
            }(t3.direction));
        })(t2)
    ));
    let u = null;
    n.limit && (u = (function(t2) {
        let e2;
        return e2 = typeof t2 == "object" ? t2.value : t2, St(e2) ? null : e2;
    })(n.limit));
    let a = null;
    n.startAt && (a = (function(t2) {
        const e2 = !!t2.before, n2 = t2.values || [];
        return new Pe(n2, e2);
    })(n.startAt));
    let c = null;
    return n.endAt && (c = (function(t2) {
        const e2 = !t2.before, n2 = t2.values || [];
        return new Pe(n2, e2);
    })(n.endAt)), xe(e, i, o, r, u, "F", a, c);
}
function Cs(t, e) {
    const n = function(t2, e2) {
        switch(e2){
            case 0:
                return null;
            case 1:
                return "existence-filter-mismatch";
            case 2:
                return "limbo-document";
            default:
                return L1();
        }
    }(0, e.purpose);
    return n == null ? null : {
        "goog-listen-tags": n
    };
}
function xs(t329) {
    return t329 ? t329.unaryFilter !== void 0 ? [
        $s(t329)
    ] : t329.fieldFilter !== void 0 ? [
        Fs(t329)
    ] : t329.compositeFilter !== void 0 ? t329.compositeFilter.filters.map((t2)=>xs(t2)
    ).reduce((t2, e)=>t2.concat(e)
    ) : L1() : [];
}
function Ns(t330) {
    return os[t330];
}
function ks(t331) {
    return us[t331];
}
function Ms(t332) {
    return {
        fieldPath: t332.canonicalString()
    };
}
function Os(t333) {
    return mt.fromServerFormat(t333.fieldPath);
}
function Fs(t334) {
    return ge.create(Os(t334.fieldFilter.field), function(t2) {
        switch(t2){
            case "EQUAL":
                return "==";
            case "NOT_EQUAL":
                return "!=";
            case "GREATER_THAN":
                return ">";
            case "GREATER_THAN_OR_EQUAL":
                return ">=";
            case "LESS_THAN":
                return "<";
            case "LESS_THAN_OR_EQUAL":
                return "<=";
            case "ARRAY_CONTAINS":
                return "array-contains";
            case "IN":
                return "in";
            case "NOT_IN":
                return "not-in";
            case "ARRAY_CONTAINS_ANY":
                return "array-contains-any";
            default:
                return L1();
        }
    }(t334.fieldFilter.op), t334.fieldFilter.value);
}
function $s(t335) {
    switch(t335.unaryFilter.op){
        case "IS_NAN":
            const e = Os(t335.unaryFilter.field);
            return ge.create(e, "==", {
                doubleValue: NaN
            });
        case "IS_NULL":
            const n = Os(t335.unaryFilter.field);
            return ge.create(n, "==", {
                nullValue: "NULL_VALUE"
            });
        case "IS_NOT_NAN":
            const s = Os(t335.unaryFilter.field);
            return ge.create(s, "!=", {
                doubleValue: NaN
            });
        case "IS_NOT_NULL":
            const i = Os(t335.unaryFilter.field);
            return ge.create(i, "!=", {
                nullValue: "NULL_VALUE"
            });
        default:
            return L1();
    }
}
function Bs(t336) {
    const e = [];
    return t336.fields.forEach((t2)=>e.push(t2.canonicalString())
    ), {
        fieldPaths: e
    };
}
function Ls(t337) {
    return t337.length >= 4 && t337.get(0) === "projects" && t337.get(2) === "databases";
}
function Us(t338) {
    let e = "";
    for(let n = 0; n < t338.length; n++)e.length > 0 && (e = Gs(e)), e = qs(t338.get(n), e);
    return Gs(e);
}
function qs(t339, e) {
    let n = e;
    const s = t339.length;
    for(let e2 = 0; e2 < s; e2++){
        const s2 = t339.charAt(e2);
        switch(s2){
            case "\0":
                n += "";
                break;
            case "":
                n += "";
                break;
            default:
                n += s2;
        }
    }
    return n;
}
function Gs(t340) {
    return t340 + "";
}
function Ks(t341) {
    const e = t341.length;
    if (U1(e >= 2), e === 2) return U1(t341.charAt(0) === "" && t341.charAt(1) === ""), _t.emptyPath();
    const n = e - 2, s = [];
    let i = "";
    for(let r = 0; r < e;){
        const e2 = t341.indexOf("", r);
        (e2 < 0 || e2 > n) && L1();
        switch(t341.charAt(e2 + 1)){
            case "":
                const n2 = t341.substring(r, e2);
                let o;
                i.length === 0 ? o = n2 : (i += n2, o = i, i = ""), s.push(o);
                break;
            case "":
                i += t341.substring(r, e2), i += "\0";
                break;
            case "":
                i += t341.substring(r, e2 + 1);
                break;
            default:
                L1();
        }
        r = e2 + 2;
    }
    return new _t(s);
}
const Qs = [
    "userId",
    "batchId"
];
function js(t342, e) {
    return [
        t342,
        Us(e)
    ];
}
function Ws(t343, e, n) {
    return [
        t343,
        Us(e),
        n
    ];
}
const zs = {}, Hs = [
    "prefixPath",
    "collectionGroup",
    "readTime",
    "documentId"
], Js = [
    "prefixPath",
    "collectionGroup",
    "documentId"
], Ys = [
    "collectionGroup",
    "readTime",
    "prefixPath",
    "documentId"
], Xs = [
    "canonicalId",
    "targetId"
], Zs = [
    "targetId",
    "path"
], ti = [
    "path",
    "targetId"
], ei = [
    "collectionId",
    "parent"
], ni = [
    "indexId",
    "uid"
], si = [
    "uid",
    "sequenceNumber"
], ii = [
    "indexId",
    "uid",
    "arrayValue",
    "directionalValue",
    "documentKey"
], ri = [
    "indexId",
    "uid",
    "documentKey"
], oi = [
    "userId",
    "collectionPath",
    "documentId"
], ui = [
    "userId",
    "collectionPath",
    "largestBatchId"
], ai = [
    "userId",
    "collectionGroup",
    "largestBatchId"
], ci = [
    ...[
        ...[
            ...[
                ...[
                    "mutationQueues",
                    "mutations",
                    "documentMutations",
                    "remoteDocuments",
                    "targets",
                    "owner",
                    "targetGlobal",
                    "targetDocuments"
                ],
                "clientMetadata"
            ],
            "remoteDocumentGlobal"
        ],
        "collectionParents"
    ],
    "bundles",
    "namedQueries"
], hi = [
    ...ci,
    "documentOverlays"
], li = [
    "mutationQueues",
    "mutations",
    "documentMutations",
    "remoteDocumentsV14",
    "targets",
    "owner",
    "targetGlobal",
    "targetDocuments",
    "clientMetadata",
    "remoteDocumentGlobal",
    "collectionParents",
    "bundles",
    "namedQueries",
    "documentOverlays"
], fi = [
    ...li,
    "indexConfiguration",
    "indexState",
    "indexEntries"
];
const di = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";
class _i {
    constructor(){
        this.onCommittedListeners = [];
    }
    addOnCommittedListener(t344) {
        this.onCommittedListeners.push(t344);
    }
    raiseOnCommittedEvent() {
        this.onCommittedListeners.forEach((t345)=>t345()
        );
    }
}
class wi {
    constructor(t346){
        this.nextCallback = null, this.catchCallback = null, this.result = void 0, this.error = void 0, this.isDone = false, this.callbackAttached = false, t346((t2)=>{
            this.isDone = true, this.result = t2, this.nextCallback && this.nextCallback(t2);
        }, (t2)=>{
            this.isDone = true, this.error = t2, this.catchCallback && this.catchCallback(t2);
        });
    }
    catch(t347) {
        return this.next(void 0, t347);
    }
    next(t348, e) {
        return this.callbackAttached && L1(), this.callbackAttached = true, this.isDone ? this.error ? this.wrapFailure(e, this.error) : this.wrapSuccess(t348, this.result) : new wi((n, s)=>{
            this.nextCallback = (e2)=>{
                this.wrapSuccess(t348, e2).next(n, s);
            }, this.catchCallback = (t2)=>{
                this.wrapFailure(e, t2).next(n, s);
            };
        });
    }
    toPromise() {
        return new Promise((t349, e)=>{
            this.next(t349, e);
        });
    }
    wrapUserFunction(t350) {
        try {
            const e = t350();
            return e instanceof wi ? e : wi.resolve(e);
        } catch (t2) {
            return wi.reject(t2);
        }
    }
    wrapSuccess(t351, e) {
        return t351 ? this.wrapUserFunction(()=>t351(e)
        ) : wi.resolve(e);
    }
    wrapFailure(t352, e) {
        return t352 ? this.wrapUserFunction(()=>t352(e)
        ) : wi.reject(e);
    }
    static resolve(t353) {
        return new wi((e, n)=>{
            e(t353);
        });
    }
    static reject(t354) {
        return new wi((e, n)=>{
            n(t354);
        });
    }
    static waitFor(t355) {
        return new wi((e, n)=>{
            let s = 0, i = 0, r = false;
            t355.forEach((t2)=>{
                ++s, t2.next(()=>{
                    ++i, r && i === s && e();
                }, (t3)=>n(t3)
                );
            }), r = true, i === s && e();
        });
    }
    static or(t356) {
        let e = wi.resolve(false);
        for (const n of t356)e = e.next((t2)=>t2 ? wi.resolve(t2) : n()
        );
        return e;
    }
    static forEach(t357, e) {
        const n = [];
        return t357.forEach((t2, s)=>{
            n.push(e.call(this, t2, s));
        }), this.waitFor(n);
    }
}
class mi {
    constructor(t358, e){
        this.action = t358, this.transaction = e, this.aborted = false, this.At = new j(), this.transaction.oncomplete = ()=>{
            this.At.resolve();
        }, this.transaction.onabort = ()=>{
            e.error ? this.At.reject(new pi(t358, e.error)) : this.At.resolve();
        }, this.transaction.onerror = (e2)=>{
            const n = Ri(e2.target.error);
            this.At.reject(new pi(t358, n));
        };
    }
    static open(t359, e, n, s) {
        try {
            return new mi(e, t359.transaction(s, n));
        } catch (t2) {
            throw new pi(e, t2);
        }
    }
    get Rt() {
        return this.At.promise;
    }
    abort(t360) {
        t360 && this.At.reject(t360), this.aborted || (O1("SimpleDb", "Aborting transaction:", t360 ? t360.message : "Client-initiated abort"), this.aborted = true, this.transaction.abort());
    }
    bt() {
        const t361 = this.transaction;
        this.aborted || typeof t361.commit != "function" || t361.commit();
    }
    store(t362) {
        const e = this.transaction.objectStore(t362);
        return new Ti(e);
    }
}
class gi {
    constructor(t363, e, n){
        this.name = t363, this.version = e, this.Pt = n;
        gi.Vt(getUA()) === 12.2 && F1("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.");
    }
    static delete(t364) {
        return O1("SimpleDb", "Removing database:", t364), Ei(window.indexedDB.deleteDatabase(t364)).toPromise();
    }
    static vt() {
        if (!isIndexedDBAvailable()) return false;
        if (gi.St()) return true;
        const t365 = getUA(), e = gi.Vt(t365), n = 0 < e && e < 10, s = gi.Dt(t365), i = 0 < s && s < 4.5;
        return !(t365.indexOf("MSIE ") > 0 || t365.indexOf("Trident/") > 0 || t365.indexOf("Edge/") > 0 || n || i);
    }
    static St() {
        var t366;
        return typeof process != "undefined" && ((t366 = process.env) === null || t366 === void 0 ? void 0 : t366.Ct) === "YES";
    }
    static xt(t367, e) {
        return t367.store(e);
    }
    static Vt(t368) {
        const e = t368.match(/i(?:phone|pad|pod) os ([\d_]+)/i), n = e ? e[1].split("_").slice(0, 2).join(".") : "-1";
        return Number(n);
    }
    static Dt(t369) {
        const e = t369.match(/Android ([\d.]+)/i), n = e ? e[1].split(".").slice(0, 2).join(".") : "-1";
        return Number(n);
    }
    async Nt(t370) {
        return this.db || (O1("SimpleDb", "Opening database:", this.name), this.db = await new Promise((e, n)=>{
            const s = indexedDB.open(this.name, this.version);
            s.onsuccess = (t2)=>{
                const n2 = t2.target.result;
                e(n2);
            }, s.onblocked = ()=>{
                n(new pi(t370, "Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."));
            }, s.onerror = (e2)=>{
                const s2 = e2.target.error;
                s2.name === "VersionError" ? n(new Q1(K1.FAILED_PRECONDITION, "A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")) : s2.name === "InvalidStateError" ? n(new Q1(K1.FAILED_PRECONDITION, "Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: " + s2)) : n(new pi(t370, s2));
            }, s.onupgradeneeded = (t2)=>{
                O1("SimpleDb", 'Database "' + this.name + '" requires upgrade from version:', t2.oldVersion);
                const e2 = t2.target.result;
                this.Pt.kt(e2, s.transaction, t2.oldVersion, this.version).next(()=>{
                    O1("SimpleDb", "Database upgrade to version " + this.version + " complete");
                });
            };
        })), this.Mt && (this.db.onversionchange = (t2)=>this.Mt(t2)
        ), this.db;
    }
    Ot(t371) {
        this.Mt = t371, this.db && (this.db.onversionchange = (e)=>t371(e)
        );
    }
    async runTransaction(t372, e, n, s) {
        const i = e === "readonly";
        let r = 0;
        for(;;){
            ++r;
            try {
                this.db = await this.Nt(t372);
                const e2 = mi.open(this.db, t372, i ? "readonly" : "readwrite", n), r2 = s(e2).next((t2)=>(e2.bt(), t2)
                ).catch((t2)=>(e2.abort(t2), wi.reject(t2))
                ).toPromise();
                return r2.catch(()=>{}), await e2.Rt, r2;
            } catch (t2) {
                const e2 = t2.name !== "FirebaseError" && r < 3;
                if (O1("SimpleDb", "Transaction failed with error:", t2.message, "Retrying:", e2), this.close(), !e2) return Promise.reject(t2);
            }
        }
    }
    close() {
        this.db && this.db.close(), this.db = void 0;
    }
}
class yi {
    constructor(t373){
        this.Ft = t373, this.$t = false, this.Bt = null;
    }
    get isDone() {
        return this.$t;
    }
    get Lt() {
        return this.Bt;
    }
    set cursor(t374) {
        this.Ft = t374;
    }
    done() {
        this.$t = true;
    }
    Ut(t375) {
        this.Bt = t375;
    }
    delete() {
        return Ei(this.Ft.delete());
    }
}
class pi extends Q1 {
    constructor(t376, e){
        super(K1.UNAVAILABLE, `IndexedDB transaction '${t376}' failed: ${e}`), this.name = "IndexedDbTransactionError";
    }
}
function Ii(t377) {
    return t377.name === "IndexedDbTransactionError";
}
class Ti {
    constructor(t378){
        this.store = t378;
    }
    put(t379, e) {
        let n;
        return e !== void 0 ? (O1("SimpleDb", "PUT", this.store.name, t379, e), n = this.store.put(e, t379)) : (O1("SimpleDb", "PUT", this.store.name, "<auto-key>", t379), n = this.store.put(t379)), Ei(n);
    }
    add(t380) {
        O1("SimpleDb", "ADD", this.store.name, t380, t380);
        return Ei(this.store.add(t380));
    }
    get(t381) {
        return Ei(this.store.get(t381)).next((e)=>(e === void 0 && (e = null), O1("SimpleDb", "GET", this.store.name, t381, e), e)
        );
    }
    delete(t382) {
        O1("SimpleDb", "DELETE", this.store.name, t382);
        return Ei(this.store.delete(t382));
    }
    count() {
        O1("SimpleDb", "COUNT", this.store.name);
        return Ei(this.store.count());
    }
    qt(t383, e) {
        const n = this.options(t383, e);
        if (n.index || typeof this.store.getAll != "function") {
            const t2 = this.cursor(n), e2 = [];
            return this.Gt(t2, (t3, n2)=>{
                e2.push(n2);
            }).next(()=>e2
            );
        }
        {
            const t2 = this.store.getAll(n.range);
            return new wi((e2, n2)=>{
                t2.onerror = (t3)=>{
                    n2(t3.target.error);
                }, t2.onsuccess = (t3)=>{
                    e2(t3.target.result);
                };
            });
        }
    }
    Kt(t384, e) {
        const n = this.store.getAll(t384, e === null ? void 0 : e);
        return new wi((t2, e2)=>{
            n.onerror = (t3)=>{
                e2(t3.target.error);
            }, n.onsuccess = (e3)=>{
                t2(e3.target.result);
            };
        });
    }
    Qt(t385, e) {
        O1("SimpleDb", "DELETE ALL", this.store.name);
        const n = this.options(t385, e);
        n.jt = false;
        const s = this.cursor(n);
        return this.Gt(s, (t2, e2, n2)=>n2.delete()
        );
    }
    Wt(t386, e) {
        let n;
        e ? n = t386 : (n = {}, e = t386);
        const s = this.cursor(n);
        return this.Gt(s, e);
    }
    zt(t387) {
        const e = this.cursor({});
        return new wi((n, s)=>{
            e.onerror = (t2)=>{
                const e2 = Ri(t2.target.error);
                s(e2);
            }, e.onsuccess = (e2)=>{
                const s2 = e2.target.result;
                s2 ? t387(s2.primaryKey, s2.value).next((t2)=>{
                    t2 ? s2.continue() : n();
                }) : n();
            };
        });
    }
    Gt(t388, e) {
        const n = [];
        return new wi((s, i)=>{
            t388.onerror = (t2)=>{
                i(t2.target.error);
            }, t388.onsuccess = (t2)=>{
                const i2 = t2.target.result;
                if (!i2) return void s();
                const r = new yi(i2), o = e(i2.primaryKey, i2.value, r);
                if (o instanceof wi) {
                    const t3 = o.catch((t4)=>(r.done(), wi.reject(t4))
                    );
                    n.push(t3);
                }
                r.isDone ? s() : r.Lt === null ? i2.continue() : i2.continue(r.Lt);
            };
        }).next(()=>wi.waitFor(n)
        );
    }
    options(t389, e) {
        let n;
        return t389 !== void 0 && (typeof t389 == "string" ? n = t389 : e = t389), {
            index: n,
            range: e
        };
    }
    cursor(t390) {
        let e = "next";
        if (t390.reverse && (e = "prev"), t390.index) {
            const n = this.store.index(t390.index);
            return t390.jt ? n.openKeyCursor(t390.range, e) : n.openCursor(t390.range, e);
        }
        return this.store.openCursor(t390.range, e);
    }
}
function Ei(t391) {
    return new wi((e, n)=>{
        t391.onsuccess = (t2)=>{
            const n2 = t2.target.result;
            e(n2);
        }, t391.onerror = (t2)=>{
            const e2 = Ri(t2.target.error);
            n(e2);
        };
    });
}
let Ai = false;
function Ri(t392) {
    const e = gi.Vt(getUA());
    if (e >= 12.2 && e < 13) {
        const e2 = "An internal error was encountered in the Indexed Database server";
        if (t392.message.indexOf(e2) >= 0) {
            const t2 = new Q1("internal", `IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${e2}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);
            return Ai || (Ai = true, setTimeout(()=>{
                throw t2;
            }, 0)), t2;
        }
    }
    return t392;
}
class bi extends _i {
    constructor(t393, e){
        super(), this.Ht = t393, this.currentSequenceNumber = e;
    }
}
function Pi(t394, e) {
    const n = G(t394);
    return gi.xt(n.Ht, e);
}
class Vi {
    constructor(t395, e, n, s){
        this.batchId = t395, this.localWriteTime = e, this.baseMutations = n, this.mutations = s;
    }
    applyToRemoteDocument(t396, e) {
        const n = e.mutationResults;
        for(let e2 = 0; e2 < this.mutations.length; e2++){
            const s = this.mutations[e2];
            if (s.key.isEqual(t396.key)) {
                gn(s, t396, n[e2]);
            }
        }
    }
    applyToLocalView(t397) {
        for (const e of this.baseMutations)e.key.isEqual(t397.key) && yn(e, t397, this.localWriteTime);
        for (const e2 of this.mutations)e2.key.isEqual(t397.key) && yn(e2, t397, this.localWriteTime);
    }
    applyToLocalDocumentSet(t398) {
        this.mutations.forEach((e)=>{
            const n = t398.get(e.key), s = n;
            this.applyToLocalView(s), n.isValidDocument() || s.convertToNoDocument(ct.min());
        });
    }
    keys() {
        return this.mutations.reduce((t399, e)=>t399.add(e.key)
        , zn());
    }
    isEqual(t400) {
        return this.batchId === t400.batchId && ot(this.mutations, t400.mutations, (t2, e)=>In(t2, e)
        ) && ot(this.baseMutations, t400.baseMutations, (t2, e)=>In(t2, e)
        );
    }
}
class vi {
    constructor(t401, e, n, s){
        this.batch = t401, this.commitVersion = e, this.mutationResults = n, this.docVersions = s;
    }
    static from(t402, e, n) {
        U1(t402.mutations.length === n.length);
        let s = jn;
        const i = t402.mutations;
        for(let t2 = 0; t2 < i.length; t2++)s = s.insert(i[t2].key, n[t2].version);
        return new vi(t402, e, n, s);
    }
}
class Si {
    constructor(t403, e){
        this.largestBatchId = t403, this.mutation = e;
    }
    getKey() {
        return this.mutation.key;
    }
    isEqual(t404) {
        return t404 !== null && this.mutation === t404.mutation;
    }
    toString() {
        return `Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`;
    }
}
class Di {
    constructor(t405, e, n, s, i = ct.min(), r = ct.min(), o = pt.EMPTY_BYTE_STRING){
        this.target = t405, this.targetId = e, this.purpose = n, this.sequenceNumber = s, this.snapshotVersion = i, this.lastLimboFreeSnapshotVersion = r, this.resumeToken = o;
    }
    withSequenceNumber(t406) {
        return new Di(this.target, this.targetId, this.purpose, t406, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken);
    }
    withResumeToken(t407, e) {
        return new Di(this.target, this.targetId, this.purpose, this.sequenceNumber, e, this.lastLimboFreeSnapshotVersion, t407);
    }
    withLastLimboFreeSnapshotVersion(t408) {
        return new Di(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, t408, this.resumeToken);
    }
}
class Ci {
    constructor(t409){
        this.Jt = t409;
    }
}
function xi(t410, e) {
    let n;
    if (e.document) n = Es(t410.Jt, e.document, !!e.hasCommittedMutations);
    else if (e.noDocument) {
        const t2 = xt.fromSegments(e.noDocument.path), s = Oi(e.noDocument.readTime);
        n = te.newNoDocument(t2, s), e.hasCommittedMutations && n.setHasCommittedMutations();
    } else {
        if (!e.unknownDocument) return L1();
        {
            const t2 = xt.fromSegments(e.unknownDocument.path), s = Oi(e.unknownDocument.version);
            n = te.newUnknownDocument(t2, s);
        }
    }
    return e.readTime && n.setReadTime(function(t2) {
        const e2 = new at(t2[0], t2[1]);
        return ct.fromTimestamp(e2);
    }(e.readTime)), n;
}
function Ni(t411, e) {
    const n = e.key, s = {
        prefixPath: n.getCollectionPath().popLast().toArray(),
        collectionGroup: n.collectionGroup,
        documentId: n.path.lastSegment(),
        readTime: ki(e.readTime),
        hasCommittedMutations: e.hasCommittedMutations
    };
    if (e.isFoundDocument()) s.document = (function(t2, e2) {
        return {
            name: ws(t2, e2.key),
            fields: e2.data.value.mapValue.fields,
            updateTime: cs(t2, e2.version.toTimestamp())
        };
    })(t411.Jt, e);
    else if (e.isNoDocument()) s.noDocument = {
        path: n.path.toArray(),
        readTime: Mi(e.version)
    };
    else {
        if (!e.isUnknownDocument()) return L1();
        s.unknownDocument = {
            path: n.path.toArray(),
            version: Mi(e.version)
        };
    }
    return s;
}
function ki(t412) {
    const e = t412.toTimestamp();
    return [
        e.seconds,
        e.nanoseconds
    ];
}
function Mi(t413) {
    const e = t413.toTimestamp();
    return {
        seconds: e.seconds,
        nanoseconds: e.nanoseconds
    };
}
function Oi(t414) {
    const e = new at(t414.seconds, t414.nanoseconds);
    return ct.fromTimestamp(e);
}
function Fi(t415, e) {
    const n = (e.baseMutations || []).map((e2)=>Ps(t415.Jt, e2)
    );
    for(let t2 = 0; t2 < e.mutations.length - 1; ++t2){
        const n2 = e.mutations[t2];
        if (t2 + 1 < e.mutations.length && e.mutations[t2 + 1].transform !== void 0) {
            const s2 = e.mutations[t2 + 1];
            n2.updateTransforms = s2.transform.fieldTransforms, e.mutations.splice(t2 + 1, 1), ++t2;
        }
    }
    const s = e.mutations.map((e2)=>Ps(t415.Jt, e2)
    ), i = at.fromMillis(e.localWriteTimeMs);
    return new Vi(e.batchId, i, n, s);
}
function $i(t416) {
    const e = Oi(t416.readTime), n = t416.lastLimboFreeSnapshotVersion !== void 0 ? Oi(t416.lastLimboFreeSnapshotVersion) : ct.min();
    let s;
    var i;
    return t416.query.documents !== void 0 ? (U1((i = t416.query).documents.length === 1), s = Le(Ne(ys(i.documents[0])))) : s = (function(t2) {
        return Le(Ds(t2));
    })(t416.query), new Di(s, t416.targetId, 0, t416.lastListenSequenceNumber, e, n, pt.fromBase64String(t416.resumeToken));
}
function Bi(t417, e) {
    const n = Mi(e.snapshotVersion), s = Mi(e.lastLimboFreeSnapshotVersion);
    let i;
    i = we(e.target) ? vs(t417.Jt, e.target) : Ss(t417.Jt, e.target);
    const r = e.resumeToken.toBase64();
    return {
        targetId: e.targetId,
        canonicalId: fe(e.target),
        readTime: n,
        resumeToken: r,
        lastListenSequenceNumber: e.sequenceNumber,
        lastLimboFreeSnapshotVersion: s,
        query: i
    };
}
function Li(t418) {
    const e = Ds({
        parent: t418.parent,
        structuredQuery: t418.structuredQuery
    });
    return t418.limitType === "LAST" ? Ue(e, e.limit, "L") : e;
}
function Ui(t419, e) {
    return new Si(e.largestBatchId, Ps(t419.Jt, e.overlayMutation));
}
function qi(t420, e) {
    const n = e.path.lastSegment();
    return [
        t420,
        Us(e.path.popLast()),
        n
    ];
}
class Gi {
    getBundleMetadata(t421, e) {
        return Ki(t421).get(e).next((t2)=>{
            if (t2) return {
                id: (e2 = t2).bundleId,
                createTime: Oi(e2.createTime),
                version: e2.version
            };
            var e2;
        });
    }
    saveBundleMetadata(t422, e) {
        return Ki(t422).put({
            bundleId: (n = e).id,
            createTime: Mi(fs(n.createTime)),
            version: n.version
        });
        var n;
    }
    getNamedQuery(t423, e) {
        return Qi(t423).get(e).next((t2)=>{
            if (t2) return {
                name: (e2 = t2).name,
                query: Li(e2.bundledQuery),
                readTime: Oi(e2.readTime)
            };
            var e2;
        });
    }
    saveNamedQuery(t424, e) {
        return Qi(t424).put(function(t2) {
            return {
                name: t2.name,
                readTime: Mi(fs(t2.readTime)),
                bundledQuery: t2.bundledQuery
            };
        }(e));
    }
}
function Ki(t425) {
    return Pi(t425, "bundles");
}
function Qi(t426) {
    return Pi(t426, "namedQueries");
}
class ji {
    constructor(t427, e){
        this.M = t427, this.userId = e;
    }
    static Yt(t428, e) {
        const n = e.uid || "";
        return new ji(t428, n);
    }
    getOverlay(t429, e) {
        return Wi(t429).get(qi(this.userId, e)).next((t2)=>t2 ? Ui(this.M, t2) : null
        );
    }
    saveOverlays(t430, e, n) {
        const s = [];
        return n.forEach((n2, i)=>{
            const r = new Si(e, i);
            s.push(this.Xt(t430, r));
        }), wi.waitFor(s);
    }
    removeOverlaysForBatchId(t431, e, n) {
        const s = new Set();
        e.forEach((t2)=>s.add(Us(t2.getCollectionPath()))
        );
        const i = [];
        return s.forEach((e2)=>{
            const s2 = IDBKeyRange.bound([
                this.userId,
                e2,
                n
            ], [
                this.userId,
                e2,
                n + 1
            ], false, true);
            i.push(Wi(t431).Qt("collectionPathOverlayIndex", s2));
        }), wi.waitFor(i);
    }
    getOverlaysForCollection(t432, e, n) {
        const s = Qn(), i = Us(e), r = IDBKeyRange.bound([
            this.userId,
            i,
            n
        ], [
            this.userId,
            i,
            Number.POSITIVE_INFINITY
        ], true);
        return Wi(t432).qt("collectionPathOverlayIndex", r).next((t2)=>{
            for (const e2 of t2){
                const t3 = Ui(this.M, e2);
                s.set(t3.getKey(), t3);
            }
            return s;
        });
    }
    getOverlaysForCollectionGroup(t433, e, n, s) {
        const i = Qn();
        let r;
        const o = IDBKeyRange.bound([
            this.userId,
            e,
            n
        ], [
            this.userId,
            e,
            Number.POSITIVE_INFINITY
        ], true);
        return Wi(t433).Wt({
            index: "collectionGroupOverlayIndex",
            range: o
        }, (t2, e2, n2)=>{
            const o2 = Ui(this.M, e2);
            i.size() < s || o2.largestBatchId === r ? (i.set(o2.getKey(), o2), r = o2.largestBatchId) : n2.done();
        }).next(()=>i
        );
    }
    Xt(t434, e) {
        return Wi(t434).put(function(t2, e2, n) {
            const [s, i, r] = qi(e2, n.mutation.key);
            return {
                userId: e2,
                collectionPath: i,
                documentId: r,
                collectionGroup: n.mutation.key.getCollectionGroup(),
                largestBatchId: n.largestBatchId,
                overlayMutation: bs(t2.Jt, n.mutation)
            };
        }(this.M, this.userId, e));
    }
}
function Wi(t435) {
    return Pi(t435, "documentOverlays");
}
class zi {
    constructor(){}
    Zt(t436, e) {
        this.te(t436, e), e.ee();
    }
    te(t437, e) {
        if ("nullValue" in t437) this.ne(e, 5);
        else if ("booleanValue" in t437) this.ne(e, 10), e.se(t437.booleanValue ? 1 : 0);
        else if ("integerValue" in t437) this.ne(e, 15), e.se(Et(t437.integerValue));
        else if ("doubleValue" in t437) {
            const n = Et(t437.doubleValue);
            isNaN(n) ? this.ne(e, 13) : (this.ne(e, 15), Dt(n) ? e.se(0) : e.se(n));
        } else if ("timestampValue" in t437) {
            const n = t437.timestampValue;
            this.ne(e, 20), typeof n == "string" ? e.ie(n) : (e.ie(`${n.seconds || ""}`), e.se(n.nanos || 0));
        } else if ("stringValue" in t437) this.re(t437.stringValue, e), this.oe(e);
        else if ("bytesValue" in t437) this.ne(e, 30), e.ue(At(t437.bytesValue)), this.oe(e);
        else if ("referenceValue" in t437) this.ae(t437.referenceValue, e);
        else if ("geoPointValue" in t437) {
            const n = t437.geoPointValue;
            this.ne(e, 45), e.se(n.latitude || 0), e.se(n.longitude || 0);
        } else "mapValue" in t437 ? Ht(t437) ? this.ne(e, Number.MAX_SAFE_INTEGER) : (this.ce(t437.mapValue, e), this.oe(e)) : "arrayValue" in t437 ? (this.he(t437.arrayValue, e), this.oe(e)) : L1();
    }
    re(t438, e) {
        this.ne(e, 25), this.le(t438, e);
    }
    le(t439, e) {
        e.ie(t439);
    }
    ce(t440, e) {
        const n = t440.fields || {};
        this.ne(e, 55);
        for (const t2 of Object.keys(n))this.re(t2, e), this.te(n[t2], e);
    }
    he(t441, e) {
        const n = t441.values || [];
        this.ne(e, 50);
        for (const t2 of n)this.te(t2, e);
    }
    ae(t442, e) {
        this.ne(e, 37);
        xt.fromName(t442).path.forEach((t2)=>{
            this.ne(e, 60), this.le(t2, e);
        });
    }
    ne(t443, e) {
        t443.se(e);
    }
    oe(t444) {
        t444.se(2);
    }
}
zi.fe = new zi();
function Hi(t445) {
    if (t445 === 0) return 8;
    let e = 0;
    return t445 >> 4 == 0 && (e += 4, t445 <<= 4), t445 >> 6 == 0 && (e += 2, t445 <<= 2), t445 >> 7 == 0 && (e += 1), e;
}
function Ji(t446) {
    const e = 64 - function(t2) {
        let e2 = 0;
        for(let n = 0; n < 8; ++n){
            const s = Hi(255 & t2[n]);
            if (e2 += s, s !== 8) break;
        }
        return e2;
    }(t446);
    return Math.ceil(e / 8);
}
class Yi {
    constructor(){
        this.buffer = new Uint8Array(1024), this.position = 0;
    }
    de(t447) {
        const e = t447[Symbol.iterator]();
        let n = e.next();
        for(; !n.done;)this._e(n.value), n = e.next();
        this.we();
    }
    me(t448) {
        const e = t448[Symbol.iterator]();
        let n = e.next();
        for(; !n.done;)this.ge(n.value), n = e.next();
        this.ye();
    }
    pe(t449) {
        for (const e of t449){
            const t2 = e.charCodeAt(0);
            if (t2 < 128) this._e(t2);
            else if (t2 < 2048) this._e(960 | t2 >>> 6), this._e(128 | 63 & t2);
            else if (e < "\uD800" || "\uDBFF" < e) this._e(480 | t2 >>> 12), this._e(128 | 63 & t2 >>> 6), this._e(128 | 63 & t2);
            else {
                const t3 = e.codePointAt(0);
                this._e(240 | t3 >>> 18), this._e(128 | 63 & t3 >>> 12), this._e(128 | 63 & t3 >>> 6), this._e(128 | 63 & t3);
            }
        }
        this.we();
    }
    Ie(t450) {
        for (const e of t450){
            const t2 = e.charCodeAt(0);
            if (t2 < 128) this.ge(t2);
            else if (t2 < 2048) this.ge(960 | t2 >>> 6), this.ge(128 | 63 & t2);
            else if (e < "\uD800" || "\uDBFF" < e) this.ge(480 | t2 >>> 12), this.ge(128 | 63 & t2 >>> 6), this.ge(128 | 63 & t2);
            else {
                const t3 = e.codePointAt(0);
                this.ge(240 | t3 >>> 18), this.ge(128 | 63 & t3 >>> 12), this.ge(128 | 63 & t3 >>> 6), this.ge(128 | 63 & t3);
            }
        }
        this.ye();
    }
    Te(t451) {
        const e = this.Ee(t451), n = Ji(e);
        this.Ae(1 + n), this.buffer[this.position++] = 255 & n;
        for(let t2 = e.length - n; t2 < e.length; ++t2)this.buffer[this.position++] = 255 & e[t2];
    }
    Re(t452) {
        const e = this.Ee(t452), n = Ji(e);
        this.Ae(1 + n), this.buffer[this.position++] = ~(255 & n);
        for(let t2 = e.length - n; t2 < e.length; ++t2)this.buffer[this.position++] = ~(255 & e[t2]);
    }
    be() {
        this.Pe(255), this.Pe(255);
    }
    Ve() {
        this.ve(255), this.ve(255);
    }
    reset() {
        this.position = 0;
    }
    seed(t453) {
        this.Ae(t453.length), this.buffer.set(t453, this.position), this.position += t453.length;
    }
    Se() {
        return this.buffer.slice(0, this.position);
    }
    Ee(t454) {
        const e = function(t2) {
            const e2 = new DataView(new ArrayBuffer(8));
            return e2.setFloat64(0, t2, false), new Uint8Array(e2.buffer);
        }(t454), n = (128 & e[0]) != 0;
        e[0] ^= n ? 255 : 128;
        for(let t21 = 1; t21 < e.length; ++t21)e[t21] ^= n ? 255 : 0;
        return e;
    }
    _e(t455) {
        const e = 255 & t455;
        e === 0 ? (this.Pe(0), this.Pe(255)) : e === 255 ? (this.Pe(255), this.Pe(0)) : this.Pe(e);
    }
    ge(t456) {
        const e = 255 & t456;
        e === 0 ? (this.ve(0), this.ve(255)) : e === 255 ? (this.ve(255), this.ve(0)) : this.ve(t456);
    }
    we() {
        this.Pe(0), this.Pe(1);
    }
    ye() {
        this.ve(0), this.ve(1);
    }
    Pe(t457) {
        this.Ae(1), this.buffer[this.position++] = t457;
    }
    ve(t458) {
        this.Ae(1), this.buffer[this.position++] = ~t458;
    }
    Ae(t459) {
        const e = t459 + this.position;
        if (e <= this.buffer.length) return;
        let n = 2 * this.buffer.length;
        n < e && (n = e);
        const s = new Uint8Array(n);
        s.set(this.buffer), this.buffer = s;
    }
}
class Xi {
    constructor(t460){
        this.De = t460;
    }
    ue(t461) {
        this.De.de(t461);
    }
    ie(t462) {
        this.De.pe(t462);
    }
    se(t463) {
        this.De.Te(t463);
    }
    ee() {
        this.De.be();
    }
}
class Zi {
    constructor(t464){
        this.De = t464;
    }
    ue(t465) {
        this.De.me(t465);
    }
    ie(t466) {
        this.De.Ie(t466);
    }
    se(t467) {
        this.De.Re(t467);
    }
    ee() {
        this.De.Ve();
    }
}
class tr {
    constructor(){
        this.De = new Yi(), this.Ce = new Xi(this.De), this.xe = new Zi(this.De);
    }
    seed(t468) {
        this.De.seed(t468);
    }
    Ne(t469) {
        return t469 === 0 ? this.Ce : this.xe;
    }
    Se() {
        return this.De.Se();
    }
    reset() {
        this.De.reset();
    }
}
class er {
    constructor(t470, e, n, s){
        this.indexId = t470, this.documentKey = e, this.arrayValue = n, this.directionalValue = s;
    }
    ke() {
        const t471 = this.directionalValue.length, e = t471 === 0 || this.directionalValue[t471 - 1] === 255 ? t471 + 1 : t471, n = new Uint8Array(e);
        return n.set(this.directionalValue, 0), e !== t471 ? n.set([
            0
        ], this.directionalValue.length) : ++n[n.length - 1], new er(this.indexId, this.documentKey, this.arrayValue, n);
    }
}
function nr(t472, e) {
    let n = t472.indexId - e.indexId;
    return n !== 0 ? n : (n = sr(t472.arrayValue, e.arrayValue), n !== 0 ? n : (n = sr(t472.directionalValue, e.directionalValue), n !== 0 ? n : xt.comparator(t472.documentKey, e.documentKey)));
}
function sr(t473, e) {
    for(let n = 0; n < t473.length && n < e.length; ++n){
        const s = t473[n] - e[n];
        if (s !== 0) return s;
    }
    return t473.length - e.length;
}
class ir {
    constructor(t474){
        this.collectionId = t474.collectionGroup != null ? t474.collectionGroup : t474.path.lastSegment(), this.Me = t474.orderBy, this.Oe = [];
        for (const e of t474.filters){
            const t2 = e;
            t2.S() ? this.Fe = t2 : this.Oe.push(t2);
        }
    }
    $e(t475) {
        const e = ne(t475);
        if (e !== void 0 && !this.Be(e)) return false;
        const n = se(t475);
        let s = 0, i = 0;
        for(; s < n.length && this.Be(n[s]); ++s);
        if (s === n.length) return true;
        if (this.Fe !== void 0) {
            const t2 = n[s];
            if (!this.Le(this.Fe, t2) || !this.Ue(this.Me[i++], t2)) return false;
            ++s;
        }
        for(; s < n.length; ++s){
            const t2 = n[s];
            if (i >= this.Me.length || !this.Ue(this.Me[i++], t2)) return false;
        }
        return true;
    }
    Be(t476) {
        for (const e of this.Oe)if (this.Le(e, t476)) return true;
        return false;
    }
    Le(t477, e) {
        if (t477 === void 0 || !t477.field.isEqual(e.fieldPath)) return false;
        const n = t477.op === "array-contains" || t477.op === "array-contains-any";
        return e.kind === 2 === n;
    }
    Ue(t478, e) {
        return !!t478.field.isEqual(e.fieldPath) && (e.kind === 0 && t478.dir === "asc" || e.kind === 1 && t478.dir === "desc");
    }
}
class rr {
    constructor(){
        this.qe = new or();
    }
    addToCollectionParentIndex(t, e) {
        return this.qe.add(e), wi.resolve();
    }
    getCollectionParents(t, e) {
        return wi.resolve(this.qe.getEntries(e));
    }
    addFieldIndex(t, e) {
        return wi.resolve();
    }
    deleteFieldIndex(t, e) {
        return wi.resolve();
    }
    getDocumentsMatchingTarget(t, e) {
        return wi.resolve(null);
    }
    getFieldIndex(t, e) {
        return wi.resolve(null);
    }
    getFieldIndexes(t, e) {
        return wi.resolve([]);
    }
    getNextCollectionGroupToUpdate(t) {
        return wi.resolve(null);
    }
    updateCollectionGroup(t, e, n) {
        return wi.resolve();
    }
    updateIndexEntries(t, e) {
        return wi.resolve();
    }
}
class or {
    constructor(){
        this.index = {};
    }
    add(t479) {
        const e = t479.lastSegment(), n = t479.popLast(), s = this.index[e] || new $n(_t.comparator), i = !s.has(n);
        return this.index[e] = s.add(n), i;
    }
    has(t480) {
        const e = t480.lastSegment(), n = t480.popLast(), s = this.index[e];
        return s && s.has(n);
    }
    getEntries(t481) {
        return (this.index[t481] || new $n(_t.comparator)).toArray();
    }
}
const ur = new Uint8Array(0);
class ar {
    constructor(t482){
        this.user = t482, this.Ge = new or(), this.Ke = new kn((t2)=>fe(t2)
        , (t2, e)=>_e(t2, e)
        ), this.uid = t482.uid || "";
    }
    addToCollectionParentIndex(t483, e) {
        if (!this.Ge.has(e)) {
            const n = e.lastSegment(), s = e.popLast();
            t483.addOnCommittedListener(()=>{
                this.Ge.add(e);
            });
            const i = {
                collectionId: n,
                parent: Us(s)
            };
            return cr(t483).put(i);
        }
        return wi.resolve();
    }
    getCollectionParents(t484, e) {
        const n = [], s = IDBKeyRange.bound([
            e,
            ""
        ], [
            ut(e),
            ""
        ], false, true);
        return cr(t484).qt(s).next((t2)=>{
            for (const s2 of t2){
                if (s2.collectionId !== e) break;
                n.push(Ks(s2.parent));
            }
            return n;
        });
    }
    addFieldIndex(t485, e) {
        const n = lr(t485), s = function(t2) {
            return {
                indexId: t2.indexId,
                collectionGroup: t2.collectionGroup,
                fields: t2.fields.map((t3)=>[
                        t3.fieldPath.canonicalString(),
                        t3.kind
                    ]
                )
            };
        }(e);
        return delete s.indexId, n.add(s).next();
    }
    deleteFieldIndex(t486, e) {
        const n = lr(t486), s = fr(t486), i = hr(t486);
        return n.delete(e.indexId).next(()=>s.delete(IDBKeyRange.bound([
                e.indexId
            ], [
                e.indexId + 1
            ], false, true))
        ).next(()=>i.delete(IDBKeyRange.bound([
                e.indexId
            ], [
                e.indexId + 1
            ], false, true))
        );
    }
    getDocumentsMatchingTarget(t487, e) {
        const n = hr(t487);
        let s = true;
        const i = new Map();
        return wi.forEach(this.Qe(e), (e2)=>this.getFieldIndex(t487, e2).next((t2)=>{
                s && (s = !!t2), i.set(e2, t2);
            })
        ).next(()=>{
            if (s) {
                let t2 = zn();
                return wi.forEach(i, (s2, i2)=>{
                    var r;
                    O1("IndexedDbIndexManager", `Using index ${(r = s2, `id=${r.indexId}|cg=${r.collectionGroup}|f=${r.fields.map((t3)=>`${t3.fieldPath}:${t3.kind}`
                    ).join(",")}`)} to execute ${fe(e)}`);
                    const o = function(t3, e2) {
                        const n2 = ne(e2);
                        if (n2 === void 0) return null;
                        for (const e3 of me(t3, n2.fieldPath))switch(e3.op){
                            case "array-contains-any":
                                return e3.value.arrayValue.values || [];
                            case "array-contains":
                                return [
                                    e3.value
                                ];
                        }
                        return null;
                    }(i2, s2), u = function(t3, e2) {
                        const n2 = new Map();
                        for (const s3 of se(e2))for (const e3 of me(t3, s3.fieldPath))switch(e3.op){
                            case "==":
                            case "in":
                                n2.set(s3.fieldPath.canonicalString(), e3.value);
                                break;
                            case "not-in":
                            case "!=":
                                return n2.set(s3.fieldPath.canonicalString(), e3.value), Array.from(n2.values());
                        }
                        return null;
                    }(i2, s2), a = function(t3, e2) {
                        const n2 = [];
                        let s3 = true;
                        for (const r2 of se(e2)){
                            let e3, o2 = true;
                            for (const n3 of me(t3, r2.fieldPath)){
                                let t4, s4 = true;
                                switch(n3.op){
                                    case "<":
                                    case "<=":
                                        t4 = "nullValue" in (i3 = n3.value) ? kt : "booleanValue" in i3 ? {
                                            booleanValue: false
                                        } : "integerValue" in i3 || "doubleValue" in i3 ? {
                                            doubleValue: NaN
                                        } : "timestampValue" in i3 ? {
                                            timestampValue: {
                                                seconds: Number.MIN_SAFE_INTEGER
                                            }
                                        } : "stringValue" in i3 ? {
                                            stringValue: ""
                                        } : "bytesValue" in i3 ? {
                                            bytesValue: ""
                                        } : "referenceValue" in i3 ? qt(vt.empty(), xt.empty()) : "geoPointValue" in i3 ? {
                                            geoPointValue: {
                                                latitude: -90,
                                                longitude: -180
                                            }
                                        } : "arrayValue" in i3 ? {
                                            arrayValue: {}
                                        } : "mapValue" in i3 ? {
                                            mapValue: {}
                                        } : L1();
                                        break;
                                    case "==":
                                    case "in":
                                    case ">=":
                                        t4 = n3.value;
                                        break;
                                    case ">":
                                        t4 = n3.value, s4 = false;
                                        break;
                                    case "!=":
                                    case "not-in":
                                        t4 = kt;
                                }
                                Jt(e3, t4) === t4 && (e3 = t4, o2 = s4);
                            }
                            if (t3.startAt !== null) {
                                for(let n3 = 0; n3 < t3.orderBy.length; ++n3)if (t3.orderBy[n3].field.isEqual(r2.fieldPath)) {
                                    const s4 = t3.startAt.position[n3];
                                    Jt(e3, s4) === s4 && (e3 = s4, o2 = t3.startAt.inclusive);
                                    break;
                                }
                            }
                            if (e3 === void 0) return null;
                            n2.push(e3), s3 && (s3 = o2);
                        }
                        var i3;
                        return new Pe(n2, s3);
                    }(i2, s2), c = function(t3, e2) {
                        const n2 = [];
                        let s3 = true;
                        for (const r2 of se(e2)){
                            let e3, o2 = true;
                            for (const n3 of me(t3, r2.fieldPath)){
                                let t4, s4 = true;
                                switch(n3.op){
                                    case ">=":
                                    case ">":
                                        t4 = "nullValue" in (i3 = n3.value) ? {
                                            booleanValue: false
                                        } : "booleanValue" in i3 ? {
                                            doubleValue: NaN
                                        } : "integerValue" in i3 || "doubleValue" in i3 ? {
                                            timestampValue: {
                                                seconds: Number.MIN_SAFE_INTEGER
                                            }
                                        } : "timestampValue" in i3 ? {
                                            stringValue: ""
                                        } : "stringValue" in i3 ? {
                                            bytesValue: ""
                                        } : "bytesValue" in i3 ? qt(vt.empty(), xt.empty()) : "referenceValue" in i3 ? {
                                            geoPointValue: {
                                                latitude: -90,
                                                longitude: -180
                                            }
                                        } : "geoPointValue" in i3 ? {
                                            arrayValue: {}
                                        } : "arrayValue" in i3 ? {
                                            mapValue: {}
                                        } : "mapValue" in i3 ? Nt : L1(), s4 = false;
                                        break;
                                    case "==":
                                    case "in":
                                    case "<=":
                                        t4 = n3.value;
                                        break;
                                    case "<":
                                        t4 = n3.value, s4 = false;
                                        break;
                                    case "!=":
                                    case "not-in":
                                        t4 = Nt;
                                }
                                Yt(e3, t4) === t4 && (e3 = t4, o2 = s4);
                            }
                            if (t3.endAt !== null) {
                                for(let n3 = 0; n3 < t3.orderBy.length; ++n3)if (t3.orderBy[n3].field.isEqual(r2.fieldPath)) {
                                    const s4 = t3.endAt.position[n3];
                                    Yt(e3, s4) === s4 && (e3 = s4, o2 = t3.endAt.inclusive);
                                    break;
                                }
                            }
                            if (e3 === void 0) return null;
                            n2.push(e3), s3 && (s3 = o2);
                        }
                        var i3;
                        return new Pe(n2, s3);
                    }(i2, s2), h = this.je(s2, i2, a), l1 = this.je(s2, i2, c), f = this.We(s2, i2, u), d = this.ze(s2.indexId, o, h, !!a && a.inclusive, l1, !!c && c.inclusive, f);
                    return wi.forEach(d, (s3)=>n.Kt(s3, e.limit).next((e2)=>{
                            e2.forEach((e3)=>{
                                t2 = t2.add(new xt(Ks(e3.documentKey)));
                            });
                        })
                    );
                }).next(()=>t2
                );
            }
            return wi.resolve(null);
        });
    }
    Qe(t488) {
        let e = this.Ke.get(t488);
        return e || (e = [
            t488
        ], this.Ke.set(t488, e), e);
    }
    ze(t489, e, n, s, i, r, o) {
        const u = (e != null ? e.length : 1) * Math.max(n != null ? n.length : 1, i != null ? i.length : 1), a = u / (e != null ? e.length : 1), c = [];
        for(let h = 0; h < u; ++h){
            const u2 = e ? this.He(e[h / a]) : ur, l2 = n ? this.Je(t489, u2, n[h % a], s) : this.Ye(t489), f = i ? this.Xe(t489, u2, i[h % a], r) : this.Ye(t489 + 1);
            c.push(...this.createRange(l2, f, o.map((e2)=>this.Je(t489, u2, e2, true)
            )));
        }
        return c;
    }
    Je(t490, e, n, s) {
        const i = new er(t490, xt.empty(), e, n);
        return s ? i : i.ke();
    }
    Xe(t491, e, n, s) {
        const i = new er(t491, xt.empty(), e, n);
        return s ? i.ke() : i;
    }
    Ye(t492) {
        return new er(t492, xt.empty(), ur, ur);
    }
    getFieldIndex(t493, e) {
        const n = new ir(e), s = e.collectionGroup != null ? e.collectionGroup : e.path.lastSegment();
        return this.getFieldIndexes(t493, s).next((t2)=>{
            const e2 = t2.filter((t3)=>n.$e(t3)
            );
            return e2.sort((t3, e3)=>e3.fields.length - t3.fields.length
            ), e2.length > 0 ? e2[0] : null;
        });
    }
    Ze(t494, e) {
        const n = new tr();
        for (const s of se(t494)){
            const t2 = e.data.field(s.fieldPath);
            if (t2 == null) return null;
            const i = n.Ne(s.kind);
            zi.fe.Zt(t2, i);
        }
        return n.Se();
    }
    He(t495) {
        const e = new tr();
        return zi.fe.Zt(t495, e.Ne(0)), e.Se();
    }
    We(t496, e, n) {
        if (n === null) return [];
        let s = [];
        s.push(new tr());
        let i = 0;
        for (const r of se(t496)){
            const t2 = n[i++];
            for (const n2 of s)if (this.tn(e, r.fieldPath) && Kt(t2)) s = this.en(s, r, t2);
            else {
                const e2 = n2.Ne(r.kind);
                zi.fe.Zt(t2, e2);
            }
        }
        return this.nn(s);
    }
    je(t497, e, n) {
        return n == null ? null : this.We(t497, e, n.position);
    }
    nn(t498) {
        const e = [];
        for(let n = 0; n < t498.length; ++n)e[n] = t498[n].Se();
        return e;
    }
    en(t499, e, n) {
        const s = [
            ...t499
        ], i = [];
        for (const t2 of n.arrayValue.values || [])for (const n2 of s){
            const s2 = new tr();
            s2.seed(n2.Se()), zi.fe.Zt(t2, s2.Ne(e.kind)), i.push(s2);
        }
        return i;
    }
    tn(t500, e) {
        return !!t500.filters.find((t2)=>t2 instanceof ge && t2.field.isEqual(e) && (t2.op === "in" || t2.op === "not-in")
        );
    }
    getFieldIndexes(t501, e) {
        const n = lr(t501), s = fr(t501);
        return (e ? n.qt("collectionGroupIndex", IDBKeyRange.bound(e, e)) : n.qt()).next((t2)=>{
            const e2 = [];
            return wi.forEach(t2, (t3)=>s.get([
                    t3.indexId,
                    this.uid
                ]).next((n2)=>{
                    e2.push(function(t4, e3) {
                        const n3 = e3 ? new re(e3.sequenceNumber, new ae(Oi(e3.readTime), new xt(Ks(e3.documentKey)), e3.largestBatchId)) : re.empty(), s2 = t4.fields.map(([t5, e4])=>new ie(mt.fromServerFormat(t5), e4)
                        );
                        return new ee(t4.indexId, t4.collectionGroup, s2, n3);
                    }(t3, n2));
                })
            ).next(()=>e2
            );
        });
    }
    getNextCollectionGroupToUpdate(t502) {
        return this.getFieldIndexes(t502).next((t2)=>t2.length === 0 ? null : (t2.sort((t3, e)=>{
                const n = t3.indexState.sequenceNumber - e.indexState.sequenceNumber;
                return n !== 0 ? n : rt(t3.collectionGroup, e.collectionGroup);
            }), t2[0].collectionGroup)
        );
    }
    updateCollectionGroup(t503, e, n) {
        const s = lr(t503), i = fr(t503);
        return this.sn(t503).next((t2)=>s.qt("collectionGroupIndex", IDBKeyRange.bound(e, e)).next((e2)=>wi.forEach(e2, (e3)=>i.put(function(t3, e4, n2, s2) {
                        return {
                            indexId: t3,
                            uid: e4.uid || "",
                            sequenceNumber: n2,
                            readTime: Mi(s2.readTime),
                            documentKey: Us(s2.documentKey.path),
                            largestBatchId: s2.largestBatchId
                        };
                    }(e3.indexId, this.user, t2, n))
                )
            )
        );
    }
    updateIndexEntries(t504, e) {
        const n = new Map();
        return wi.forEach(e, (e2, s)=>{
            const i = n.get(e2.collectionGroup);
            return (i ? wi.resolve(i) : this.getFieldIndexes(t504, e2.collectionGroup)).next((i2)=>(n.set(e2.collectionGroup, i2), wi.forEach(i2, (n2)=>this.rn(t504, e2, n2).next((e3)=>{
                        const i3 = this.on(s, n2);
                        return e3.isEqual(i3) ? wi.resolve() : this.un(t504, s, e3, i3);
                    })
                ))
            );
        });
    }
    an(t505, e, n) {
        return hr(t505).put({
            indexId: n.indexId,
            uid: this.uid,
            arrayValue: n.arrayValue,
            directionalValue: n.directionalValue,
            documentKey: Us(e.key.path)
        });
    }
    cn(t506, e, n) {
        return hr(t506).delete([
            n.indexId,
            this.uid,
            n.arrayValue,
            n.directionalValue,
            Us(e.key.path)
        ]);
    }
    rn(t507, e, n) {
        const s = hr(t507);
        let i = new $n(nr);
        return s.Wt({
            index: "documentKeyIndex",
            range: IDBKeyRange.only([
                n.indexId,
                this.uid,
                Us(e.path)
            ])
        }, (t2, s2)=>{
            i = i.add(new er(n.indexId, e, s2.arrayValue, s2.directionalValue));
        }).next(()=>i
        );
    }
    on(t508, e) {
        let n = new $n(nr);
        const s = this.Ze(e, t508);
        if (s == null) return n;
        const i = ne(e);
        if (i != null) {
            const r = t508.data.field(i.fieldPath);
            if (Kt(r)) for (const i2 of r.arrayValue.values || [])n = n.add(new er(e.indexId, t508.key, this.He(i2), s));
        } else n = n.add(new er(e.indexId, t508.key, ur, s));
        return n;
    }
    un(t509, e, n, s) {
        O1("IndexedDbIndexManager", "Updating index entries for document '%s'", e.key);
        const i = [];
        return (function(t2, e2, n2, s2, i2) {
            const r = t2.getIterator(), o = e2.getIterator();
            let u = Ln(r), a = Ln(o);
            for(; u || a;){
                let t3 = false, e3 = false;
                if (u && a) {
                    const s3 = n2(u, a);
                    s3 < 0 ? e3 = true : s3 > 0 && (t3 = true);
                } else u != null ? e3 = true : t3 = true;
                t3 ? (s2(a), a = Ln(o)) : e3 ? (i2(u), u = Ln(r)) : (u = Ln(r), a = Ln(o));
            }
        })(n, s, nr, (n2)=>{
            i.push(this.an(t509, e, n2));
        }, (n2)=>{
            i.push(this.cn(t509, e, n2));
        }), wi.waitFor(i);
    }
    sn(t510) {
        let e = 1;
        return fr(t510).Wt({
            index: "sequenceNumberIndex",
            reverse: true,
            range: IDBKeyRange.upperBound([
                this.uid,
                Number.MAX_SAFE_INTEGER
            ])
        }, (t2, n, s)=>{
            s.done(), e = n.sequenceNumber + 1;
        }).next(()=>e
        );
    }
    createRange(t511, e, n) {
        n = n.sort((t2, e2)=>nr(t2, e2)
        ).filter((t2, e2, n2)=>!e2 || nr(t2, n2[e2 - 1]) !== 0
        );
        const s = [];
        s.push(t511);
        for (const i2 of n){
            const n2 = nr(i2, t511), r = nr(i2, e);
            if (n2 === 0) s[0] = t511.ke();
            else if (n2 > 0 && r < 0) s.push(i2), s.push(i2.ke());
            else if (r > 0) break;
        }
        s.push(e);
        const i = [];
        for(let t22 = 0; t22 < s.length; t22 += 2)i.push(IDBKeyRange.bound([
            s[t22].indexId,
            this.uid,
            s[t22].arrayValue,
            s[t22].directionalValue,
            ""
        ], [
            s[t22 + 1].indexId,
            this.uid,
            s[t22 + 1].arrayValue,
            s[t22 + 1].directionalValue,
            ""
        ]));
        return i;
    }
}
function cr(t512) {
    return Pi(t512, "collectionParents");
}
function hr(t513) {
    return Pi(t513, "indexEntries");
}
function lr(t514) {
    return Pi(t514, "indexConfiguration");
}
function fr(t515) {
    return Pi(t515, "indexState");
}
const dr = {
    didRun: false,
    sequenceNumbersCollected: 0,
    targetsRemoved: 0,
    documentsRemoved: 0
};
class _r {
    constructor(t516, e, n){
        this.cacheSizeCollectionThreshold = t516, this.percentileToCollect = e, this.maximumSequenceNumbersToCollect = n;
    }
    static withCacheSize(t517) {
        return new _r(t517, _r.DEFAULT_COLLECTION_PERCENTILE, _r.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
    }
}
function wr(t518, e, n) {
    const s = t518.store("mutations"), i = t518.store("documentMutations"), r = [], o = IDBKeyRange.only(n.batchId);
    let u = 0;
    const a = s.Wt({
        range: o
    }, (t2, e2, n2)=>(u++, n2.delete())
    );
    r.push(a.next(()=>{
        U1(u === 1);
    }));
    const c = [];
    for (const t2 of n.mutations){
        const s2 = Ws(e, t2.key.path, n.batchId);
        r.push(i.delete(s2)), c.push(t2.key);
    }
    return wi.waitFor(r).next(()=>c
    );
}
function mr(t519) {
    if (!t519) return 0;
    let e;
    if (t519.document) e = t519.document;
    else if (t519.unknownDocument) e = t519.unknownDocument;
    else {
        if (!t519.noDocument) throw L1();
        e = t519.noDocument;
    }
    return JSON.stringify(e).length;
}
_r.DEFAULT_COLLECTION_PERCENTILE = 10, _r.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1000, _r.DEFAULT = new _r(41943040, _r.DEFAULT_COLLECTION_PERCENTILE, _r.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), _r.DISABLED = new _r(-1, 0, 0);
class gr {
    constructor(t520, e, n, s){
        this.userId = t520, this.M = e, this.indexManager = n, this.referenceDelegate = s, this.hn = {};
    }
    static Yt(t521, e, n, s) {
        U1(t521.uid !== "");
        const i = t521.isAuthenticated() ? t521.uid : "";
        return new gr(i, e, n, s);
    }
    checkEmpty(t522) {
        let e = true;
        const n = IDBKeyRange.bound([
            this.userId,
            Number.NEGATIVE_INFINITY
        ], [
            this.userId,
            Number.POSITIVE_INFINITY
        ]);
        return pr(t522).Wt({
            index: "userMutationsIndex",
            range: n
        }, (t2, n2, s)=>{
            e = false, s.done();
        }).next(()=>e
        );
    }
    addMutationBatch(t523, e, n, s) {
        const i = Ir(t523), r = pr(t523);
        return r.add({}).next((o)=>{
            U1(typeof o == "number");
            const u = new Vi(o, e, n, s), a = function(t2, e2, n2) {
                const s2 = n2.baseMutations.map((e3)=>bs(t2.Jt, e3)
                ), i2 = n2.mutations.map((e3)=>bs(t2.Jt, e3)
                );
                return {
                    userId: e2,
                    batchId: n2.batchId,
                    localWriteTimeMs: n2.localWriteTime.toMillis(),
                    baseMutations: s2,
                    mutations: i2
                };
            }(this.M, this.userId, u), c = [];
            let h = new $n((t2, e2)=>rt(t2.canonicalString(), e2.canonicalString())
            );
            for (const t23 of s){
                const e2 = Ws(this.userId, t23.key.path, o);
                h = h.add(t23.key.path.popLast()), c.push(r.put(a)), c.push(i.put(e2, zs));
            }
            return h.forEach((e2)=>{
                c.push(this.indexManager.addToCollectionParentIndex(t523, e2));
            }), t523.addOnCommittedListener(()=>{
                this.hn[o] = u.keys();
            }), wi.waitFor(c).next(()=>u
            );
        });
    }
    lookupMutationBatch(t524, e) {
        return pr(t524).get(e).next((t2)=>t2 ? (U1(t2.userId === this.userId), Fi(this.M, t2)) : null
        );
    }
    ln(t525, e) {
        return this.hn[e] ? wi.resolve(this.hn[e]) : this.lookupMutationBatch(t525, e).next((t2)=>{
            if (t2) {
                const n = t2.keys();
                return this.hn[e] = n, n;
            }
            return null;
        });
    }
    getNextMutationBatchAfterBatchId(t526, e) {
        const n = e + 1, s = IDBKeyRange.lowerBound([
            this.userId,
            n
        ]);
        let i = null;
        return pr(t526).Wt({
            index: "userMutationsIndex",
            range: s
        }, (t2, e2, s2)=>{
            e2.userId === this.userId && (U1(e2.batchId >= n), i = Fi(this.M, e2)), s2.done();
        }).next(()=>i
        );
    }
    getHighestUnacknowledgedBatchId(t527) {
        const e = IDBKeyRange.upperBound([
            this.userId,
            Number.POSITIVE_INFINITY
        ]);
        let n = -1;
        return pr(t527).Wt({
            index: "userMutationsIndex",
            range: e,
            reverse: true
        }, (t2, e2, s)=>{
            n = e2.batchId, s.done();
        }).next(()=>n
        );
    }
    getAllMutationBatches(t528) {
        const e = IDBKeyRange.bound([
            this.userId,
            -1
        ], [
            this.userId,
            Number.POSITIVE_INFINITY
        ]);
        return pr(t528).qt("userMutationsIndex", e).next((t2)=>t2.map((t3)=>Fi(this.M, t3)
            )
        );
    }
    getAllMutationBatchesAffectingDocumentKey(t529, e) {
        const n = js(this.userId, e.path), s = IDBKeyRange.lowerBound(n), i = [];
        return Ir(t529).Wt({
            range: s
        }, (n2, s2, r)=>{
            const [o, u, a] = n2, c = Ks(u);
            if (o === this.userId && e.path.isEqual(c)) return pr(t529).get(a).next((t2)=>{
                if (!t2) throw L1();
                U1(t2.userId === this.userId), i.push(Fi(this.M, t2));
            });
            r.done();
        }).next(()=>i
        );
    }
    getAllMutationBatchesAffectingDocumentKeys(t530, e) {
        let n = new $n(rt);
        const s = [];
        return e.forEach((e2)=>{
            const i = js(this.userId, e2.path), r = IDBKeyRange.lowerBound(i), o = Ir(t530).Wt({
                range: r
            }, (t2, s2, i2)=>{
                const [r2, o2, u] = t2, a = Ks(o2);
                r2 === this.userId && e2.path.isEqual(a) ? n = n.add(u) : i2.done();
            });
            s.push(o);
        }), wi.waitFor(s).next(()=>this.fn(t530, n)
        );
    }
    getAllMutationBatchesAffectingQuery(t531, e) {
        const n = e.path, s = n.length + 1, i = js(this.userId, n), r = IDBKeyRange.lowerBound(i);
        let o = new $n(rt);
        return Ir(t531).Wt({
            range: r
        }, (t2, e2, i2)=>{
            const [r2, u, a] = t2, c = Ks(u);
            r2 === this.userId && n.isPrefixOf(c) ? c.length === s && (o = o.add(a)) : i2.done();
        }).next(()=>this.fn(t531, o)
        );
    }
    fn(t532, e) {
        const n = [], s = [];
        return e.forEach((e2)=>{
            s.push(pr(t532).get(e2).next((t2)=>{
                if (t2 === null) throw L1();
                U1(t2.userId === this.userId), n.push(Fi(this.M, t2));
            }));
        }), wi.waitFor(s).next(()=>n
        );
    }
    removeMutationBatch(t533, e) {
        return wr(t533.Ht, this.userId, e).next((n)=>(t533.addOnCommittedListener(()=>{
                this.dn(e.batchId);
            }), wi.forEach(n, (e2)=>this.referenceDelegate.markPotentiallyOrphaned(t533, e2)
            ))
        );
    }
    dn(t534) {
        delete this.hn[t534];
    }
    performConsistencyCheck(t535) {
        return this.checkEmpty(t535).next((e)=>{
            if (!e) return wi.resolve();
            const n = IDBKeyRange.lowerBound([
                this.userId
            ]);
            const s = [];
            return Ir(t535).Wt({
                range: n
            }, (t2, e2, n2)=>{
                if (t2[0] === this.userId) {
                    const e3 = Ks(t2[1]);
                    s.push(e3);
                } else n2.done();
            }).next(()=>{
                U1(s.length === 0);
            });
        });
    }
    containsKey(t536, e) {
        return yr(t536, this.userId, e);
    }
    _n(t537) {
        return Tr(t537).get(this.userId).next((t2)=>t2 || {
                userId: this.userId,
                lastAcknowledgedBatchId: -1,
                lastStreamToken: ""
            }
        );
    }
}
function yr(t538, e, n) {
    const s = js(e, n.path), i = s[1], r = IDBKeyRange.lowerBound(s);
    let o = false;
    return Ir(t538).Wt({
        range: r,
        jt: true
    }, (t2, n2, s2)=>{
        const [r2, u, a] = t2;
        r2 === e && u === i && (o = true), s2.done();
    }).next(()=>o
    );
}
function pr(t539) {
    return Pi(t539, "mutations");
}
function Ir(t540) {
    return Pi(t540, "documentMutations");
}
function Tr(t541) {
    return Pi(t541, "mutationQueues");
}
class Er {
    constructor(t542){
        this.wn = t542;
    }
    next() {
        return this.wn += 2, this.wn;
    }
    static mn() {
        return new Er(0);
    }
    static gn() {
        return new Er(-1);
    }
}
class Ar {
    constructor(t543, e){
        this.referenceDelegate = t543, this.M = e;
    }
    allocateTargetId(t544) {
        return this.yn(t544).next((e)=>{
            const n = new Er(e.highestTargetId);
            return e.highestTargetId = n.next(), this.pn(t544, e).next(()=>e.highestTargetId
            );
        });
    }
    getLastRemoteSnapshotVersion(t545) {
        return this.yn(t545).next((t2)=>ct.fromTimestamp(new at(t2.lastRemoteSnapshotVersion.seconds, t2.lastRemoteSnapshotVersion.nanoseconds))
        );
    }
    getHighestSequenceNumber(t546) {
        return this.yn(t546).next((t2)=>t2.highestListenSequenceNumber
        );
    }
    setTargetsMetadata(t547, e, n) {
        return this.yn(t547).next((s)=>(s.highestListenSequenceNumber = e, n && (s.lastRemoteSnapshotVersion = n.toTimestamp()), e > s.highestListenSequenceNumber && (s.highestListenSequenceNumber = e), this.pn(t547, s))
        );
    }
    addTargetData(t548, e) {
        return this.In(t548, e).next(()=>this.yn(t548).next((n)=>(n.targetCount += 1, this.Tn(e, n), this.pn(t548, n))
            )
        );
    }
    updateTargetData(t549, e) {
        return this.In(t549, e);
    }
    removeTargetData(t550, e) {
        return this.removeMatchingKeysForTargetId(t550, e.targetId).next(()=>Rr(t550).delete(e.targetId)
        ).next(()=>this.yn(t550)
        ).next((e2)=>(U1(e2.targetCount > 0), e2.targetCount -= 1, this.pn(t550, e2))
        );
    }
    removeTargets(t551, e, n) {
        let s = 0;
        const i = [];
        return Rr(t551).Wt((r, o)=>{
            const u = $i(o);
            u.sequenceNumber <= e && n.get(u.targetId) === null && (s++, i.push(this.removeTargetData(t551, u)));
        }).next(()=>wi.waitFor(i)
        ).next(()=>s
        );
    }
    forEachTarget(t552, e) {
        return Rr(t552).Wt((t2, n)=>{
            const s = $i(n);
            e(s);
        });
    }
    yn(t553) {
        return br(t553).get("targetGlobalKey").next((t2)=>(U1(t2 !== null), t2)
        );
    }
    pn(t554, e) {
        return br(t554).put("targetGlobalKey", e);
    }
    In(t555, e) {
        return Rr(t555).put(Bi(this.M, e));
    }
    Tn(t556, e) {
        let n = false;
        return t556.targetId > e.highestTargetId && (e.highestTargetId = t556.targetId, n = true), t556.sequenceNumber > e.highestListenSequenceNumber && (e.highestListenSequenceNumber = t556.sequenceNumber, n = true), n;
    }
    getTargetCount(t557) {
        return this.yn(t557).next((t2)=>t2.targetCount
        );
    }
    getTargetData(t558, e) {
        const n = fe(e), s = IDBKeyRange.bound([
            n,
            Number.NEGATIVE_INFINITY
        ], [
            n,
            Number.POSITIVE_INFINITY
        ]);
        let i = null;
        return Rr(t558).Wt({
            range: s,
            index: "queryTargetsIndex"
        }, (t2, n2, s2)=>{
            const r = $i(n2);
            _e(e, r.target) && (i = r, s2.done());
        }).next(()=>i
        );
    }
    addMatchingKeys(t559, e, n) {
        const s = [], i = Pr(t559);
        return e.forEach((e2)=>{
            const r = Us(e2.path);
            s.push(i.put({
                targetId: n,
                path: r
            })), s.push(this.referenceDelegate.addReference(t559, n, e2));
        }), wi.waitFor(s);
    }
    removeMatchingKeys(t560, e, n) {
        const s = Pr(t560);
        return wi.forEach(e, (e2)=>{
            const i = Us(e2.path);
            return wi.waitFor([
                s.delete([
                    n,
                    i
                ]),
                this.referenceDelegate.removeReference(t560, n, e2)
            ]);
        });
    }
    removeMatchingKeysForTargetId(t561, e) {
        const n = Pr(t561), s = IDBKeyRange.bound([
            e
        ], [
            e + 1
        ], false, true);
        return n.delete(s);
    }
    getMatchingKeysForTargetId(t562, e) {
        const n = IDBKeyRange.bound([
            e
        ], [
            e + 1
        ], false, true), s = Pr(t562);
        let i = zn();
        return s.Wt({
            range: n,
            jt: true
        }, (t2, e2, n2)=>{
            const s2 = Ks(t2[1]), r = new xt(s2);
            i = i.add(r);
        }).next(()=>i
        );
    }
    containsKey(t563, e) {
        const n = Us(e.path), s = IDBKeyRange.bound([
            n
        ], [
            ut(n)
        ], false, true);
        let i = 0;
        return Pr(t563).Wt({
            index: "documentTargetsIndex",
            jt: true,
            range: s
        }, ([t2, e2], n2, s2)=>{
            t2 !== 0 && (i++, s2.done());
        }).next(()=>i > 0
        );
    }
    Et(t564, e) {
        return Rr(t564).get(e).next((t2)=>t2 ? $i(t2) : null
        );
    }
}
function Rr(t565) {
    return Pi(t565, "targets");
}
function br(t566) {
    return Pi(t566, "targetGlobal");
}
function Pr(t567) {
    return Pi(t567, "targetDocuments");
}
async function Vr(t568) {
    if (t568.code !== K1.FAILED_PRECONDITION || t568.message !== di) throw t568;
    O1("LocalStore", "Unexpectedly lost primary lease");
}
function vr([t569, e], [n, s]) {
    const i = rt(t569, n);
    return i === 0 ? rt(e, s) : i;
}
class Sr {
    constructor(t570){
        this.En = t570, this.buffer = new $n(vr), this.An = 0;
    }
    Rn() {
        return ++this.An;
    }
    bn(t571) {
        const e = [
            t571,
            this.Rn()
        ];
        if (this.buffer.size < this.En) this.buffer = this.buffer.add(e);
        else {
            const t2 = this.buffer.last();
            vr(e, t2) < 0 && (this.buffer = this.buffer.delete(t2).add(e));
        }
    }
    get maxValue() {
        return this.buffer.last()[0];
    }
}
class Cr {
    constructor(t572, e){
        this.Sn = t572, this.params = e;
    }
    calculateTargetCount(t573, e) {
        return this.Sn.Dn(t573).next((t2)=>Math.floor(e / 100 * t2)
        );
    }
    nthSequenceNumber(t574, e) {
        if (e === 0) return wi.resolve(nt.A);
        const n = new Sr(e);
        return this.Sn.forEachTarget(t574, (t2)=>n.bn(t2.sequenceNumber)
        ).next(()=>this.Sn.Cn(t574, (t2)=>n.bn(t2)
            )
        ).next(()=>n.maxValue
        );
    }
    removeTargets(t575, e, n) {
        return this.Sn.removeTargets(t575, e, n);
    }
    removeOrphanedDocuments(t576, e) {
        return this.Sn.removeOrphanedDocuments(t576, e);
    }
    collect(t577, e) {
        return this.params.cacheSizeCollectionThreshold === -1 ? (O1("LruGarbageCollector", "Garbage collection skipped; disabled"), wi.resolve(dr)) : this.getCacheSize(t577).next((n)=>n < this.params.cacheSizeCollectionThreshold ? (O1("LruGarbageCollector", `Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`), dr) : this.xn(t577, e)
        );
    }
    getCacheSize(t578) {
        return this.Sn.getCacheSize(t578);
    }
    xn(t579, e) {
        let n, s, i, r, o, a, c;
        const h = Date.now();
        return this.calculateTargetCount(t579, this.params.percentileToCollect).next((e2)=>(e2 > this.params.maximumSequenceNumbersToCollect ? (O1("LruGarbageCollector", `Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${e2}`), s = this.params.maximumSequenceNumbersToCollect) : s = e2, r = Date.now(), this.nthSequenceNumber(t579, s))
        ).next((s2)=>(n = s2, o = Date.now(), this.removeTargets(t579, n, e))
        ).next((e2)=>(i = e2, a = Date.now(), this.removeOrphanedDocuments(t579, n))
        ).next((t2)=>{
            if (c = Date.now(), k1() <= LogLevel.DEBUG) {
                O1("LruGarbageCollector", `LRU Garbage Collection
	Counted targets in ${r - h}ms
	Determined least recently used ${s} in ` + (o - r) + `ms
	Removed ${i} targets in ` + (a - o) + `ms
	Removed ${t2} documents in ` + (c - a) + `ms
Total Duration: ${c - h}ms`);
            }
            return wi.resolve({
                didRun: true,
                sequenceNumbersCollected: s,
                targetsRemoved: i,
                documentsRemoved: t2
            });
        });
    }
}
class xr {
    constructor(t580, e){
        this.db = t580, this.garbageCollector = (function(t2, e2) {
            return new Cr(t2, e2);
        })(this, e);
    }
    Dn(t581) {
        const e = this.Nn(t581);
        return this.db.getTargetCache().getTargetCount(t581).next((t2)=>e.next((e2)=>t2 + e2
            )
        );
    }
    Nn(t582) {
        let e = 0;
        return this.Cn(t582, (t2)=>{
            e++;
        }).next(()=>e
        );
    }
    forEachTarget(t583, e) {
        return this.db.getTargetCache().forEachTarget(t583, e);
    }
    Cn(t584, e) {
        return this.kn(t584, (t2, n)=>e(n)
        );
    }
    addReference(t585, e, n) {
        return Nr(t585, n);
    }
    removeReference(t586, e, n) {
        return Nr(t586, n);
    }
    removeTargets(t587, e, n) {
        return this.db.getTargetCache().removeTargets(t587, e, n);
    }
    markPotentiallyOrphaned(t588, e) {
        return Nr(t588, e);
    }
    Mn(t589, e) {
        return (function(t2, e2) {
            let n = false;
            return Tr(t2).zt((s)=>yr(t2, s, e2).next((t3)=>(t3 && (n = true), wi.resolve(!t3))
                )
            ).next(()=>n
            );
        })(t589, e);
    }
    removeOrphanedDocuments(t590, e) {
        const n = this.db.getRemoteDocumentCache().newChangeBuffer(), s = [];
        let i = 0;
        return this.kn(t590, (r, o)=>{
            if (o <= e) {
                const e2 = this.Mn(t590, r).next((e3)=>{
                    if (!e3) return i++, n.getEntry(t590, r).next(()=>(n.removeEntry(r, ct.min()), Pr(t590).delete([
                            0,
                            Us(r.path)
                        ]))
                    );
                });
                s.push(e2);
            }
        }).next(()=>wi.waitFor(s)
        ).next(()=>n.apply(t590)
        ).next(()=>i
        );
    }
    removeTarget(t591, e) {
        const n = e.withSequenceNumber(t591.currentSequenceNumber);
        return this.db.getTargetCache().updateTargetData(t591, n);
    }
    updateLimboDocument(t592, e) {
        return Nr(t592, e);
    }
    kn(t593, e) {
        const n = Pr(t593);
        let s, i = nt.A;
        return n.Wt({
            index: "documentTargetsIndex"
        }, ([t2, n2], { path: r , sequenceNumber: o  })=>{
            t2 === 0 ? (i !== nt.A && e(new xt(Ks(s)), i), i = o, s = r) : i = nt.A;
        }).next(()=>{
            i !== nt.A && e(new xt(Ks(s)), i);
        });
    }
    getCacheSize(t594) {
        return this.db.getRemoteDocumentCache().getSize(t594);
    }
}
function Nr(t595, e) {
    return Pr(t595).put(function(t2, e2) {
        return {
            targetId: 0,
            path: Us(t2.path),
            sequenceNumber: e2
        };
    }(e, t595.currentSequenceNumber));
}
class kr {
    constructor(){
        this.changes = new kn((t596)=>t596.toString()
        , (t597, e)=>t597.isEqual(e)
        ), this.changesApplied = false;
    }
    addEntry(t598) {
        this.assertNotApplied(), this.changes.set(t598.key, t598);
    }
    removeEntry(t599, e) {
        this.assertNotApplied(), this.changes.set(t599, te.newInvalidDocument(t599).setReadTime(e));
    }
    getEntry(t600, e) {
        this.assertNotApplied();
        const n = this.changes.get(e);
        return n !== void 0 ? wi.resolve(n) : this.getFromCache(t600, e);
    }
    getEntries(t601, e) {
        return this.getAllFromCache(t601, e);
    }
    apply(t602) {
        return this.assertNotApplied(), this.changesApplied = true, this.applyChanges(t602);
    }
    assertNotApplied() {}
}
class Mr {
    constructor(t603){
        this.M = t603;
    }
    setIndexManager(t604) {
        this.indexManager = t604;
    }
    addEntry(t605, e, n) {
        return $r(t605).put(n);
    }
    removeEntry(t606, e, n) {
        return $r(t606).delete(function(t2, e2) {
            const n2 = t2.path.toArray();
            return [
                n2.slice(0, n2.length - 2),
                n2[n2.length - 2],
                ki(e2),
                n2[n2.length - 1]
            ];
        }(e, n));
    }
    updateMetadata(t607, e) {
        return this.getMetadata(t607).next((n)=>(n.byteSize += e, this.On(t607, n))
        );
    }
    getEntry(t608, e) {
        let n = te.newInvalidDocument(e);
        return $r(t608).Wt({
            index: "documentKeyIndex",
            range: IDBKeyRange.only(Br(e))
        }, (t2, s)=>{
            n = this.Fn(e, s);
        }).next(()=>n
        );
    }
    $n(t609, e) {
        let n = {
            size: 0,
            document: te.newInvalidDocument(e)
        };
        return $r(t609).Wt({
            index: "documentKeyIndex",
            range: IDBKeyRange.only(Br(e))
        }, (t2, s)=>{
            n = {
                document: this.Fn(e, s),
                size: mr(s)
            };
        }).next(()=>n
        );
    }
    getEntries(t610, e) {
        let n = qn();
        return this.Bn(t610, e, (t2, e2)=>{
            const s = this.Fn(t2, e2);
            n = n.insert(t2, s);
        }).next(()=>n
        );
    }
    Ln(t611, e) {
        let n = qn(), s = new Mn(xt.comparator);
        return this.Bn(t611, e, (t2, e2)=>{
            const i = this.Fn(t2, e2);
            n = n.insert(t2, i), s = s.insert(t2, mr(e2));
        }).next(()=>({
                documents: n,
                Un: s
            })
        );
    }
    Bn(t612, e, n) {
        if (e.isEmpty()) return wi.resolve();
        let s = new $n(Ur);
        e.forEach((t2)=>s = s.add(t2)
        );
        const i = IDBKeyRange.bound(Br(s.first()), Br(s.last())), r = s.getIterator();
        let o = r.getNext();
        return $r(t612).Wt({
            index: "documentKeyIndex",
            range: i
        }, (t2, e2, s2)=>{
            const i2 = xt.fromSegments([
                ...e2.prefixPath,
                e2.collectionGroup,
                e2.documentId
            ]);
            for(; o && Ur(o, i2) < 0;)n(o, null), o = r.getNext();
            o && o.isEqual(i2) && (n(o, e2), o = r.hasNext() ? r.getNext() : null), o ? s2.Ut(Br(o)) : s2.done();
        }).next(()=>{
            for(; o;)n(o, null), o = r.hasNext() ? r.getNext() : null;
        });
    }
    getAllFromCollection(t613, e, n) {
        const s = [
            e.popLast().toArray(),
            e.lastSegment(),
            ki(n.readTime),
            n.documentKey.path.isEmpty() ? "" : n.documentKey.path.lastSegment()
        ], i = [
            e.popLast().toArray(),
            e.lastSegment(),
            [
                Number.MAX_SAFE_INTEGER,
                Number.MAX_SAFE_INTEGER
            ],
            ""
        ];
        return $r(t613).qt(IDBKeyRange.bound(s, i, true)).next((t2)=>{
            let e2 = qn();
            for (const n2 of t2){
                const t3 = this.Fn(xt.fromSegments(n2.prefixPath.concat(n2.collectionGroup, n2.documentId)), n2);
                e2 = e2.insert(t3.key, t3);
            }
            return e2;
        });
    }
    getAllFromCollectionGroup(t614, e, n, s) {
        let i = qn();
        const r = Lr(e, n), o = Lr(e, ae.max());
        return $r(t614).Wt({
            index: "collectionGroupIndex",
            range: IDBKeyRange.bound(r, o, true)
        }, (t2, e2, n2)=>{
            const r2 = this.Fn(xt.fromSegments(e2.prefixPath.concat(e2.collectionGroup, e2.documentId)), e2);
            i = i.insert(r2.key, r2), i.size === s && n2.done();
        }).next(()=>i
        );
    }
    newChangeBuffer(t615) {
        return new Or(this, !!t615 && t615.trackRemovals);
    }
    getSize(t616) {
        return this.getMetadata(t616).next((t2)=>t2.byteSize
        );
    }
    getMetadata(t617) {
        return Fr(t617).get("remoteDocumentGlobalKey").next((t2)=>(U1(!!t2), t2)
        );
    }
    On(t618, e) {
        return Fr(t618).put("remoteDocumentGlobalKey", e);
    }
    Fn(t619, e) {
        if (e) {
            const t2 = xi(this.M, e);
            if (!(t2.isNoDocument() && t2.version.isEqual(ct.min()))) return t2;
        }
        return te.newInvalidDocument(t619);
    }
}
class Or extends kr {
    constructor(t620, e){
        super(), this.qn = t620, this.trackRemovals = e, this.Gn = new kn((t2)=>t2.toString()
        , (t2, e2)=>t2.isEqual(e2)
        );
    }
    applyChanges(t621) {
        const e = [];
        let n = 0, s = new $n((t2, e2)=>rt(t2.canonicalString(), e2.canonicalString())
        );
        return this.changes.forEach((i, r)=>{
            const o = this.Gn.get(i);
            if (e.push(this.qn.removeEntry(t621, i, o.readTime)), r.isValidDocument()) {
                const u = Ni(this.qn.M, r);
                s = s.add(i.path.popLast());
                const a = mr(u);
                n += a - o.size, e.push(this.qn.addEntry(t621, i, u));
            } else if (n -= o.size, this.trackRemovals) {
                const n2 = Ni(this.qn.M, r.convertToNoDocument(ct.min()));
                e.push(this.qn.addEntry(t621, i, n2));
            }
        }), s.forEach((n2)=>{
            e.push(this.qn.indexManager.addToCollectionParentIndex(t621, n2));
        }), e.push(this.qn.updateMetadata(t621, n)), wi.waitFor(e);
    }
    getFromCache(t622, e) {
        return this.qn.$n(t622, e).next((t2)=>(this.Gn.set(e, {
                size: t2.size,
                readTime: t2.document.readTime
            }), t2.document)
        );
    }
    getAllFromCache(t623, e) {
        return this.qn.Ln(t623, e).next(({ documents: t2 , Un: e2  })=>(e2.forEach((e3, n)=>{
                this.Gn.set(e3, {
                    size: n,
                    readTime: t2.get(e3).readTime
                });
            }), t2)
        );
    }
}
function Fr(t624) {
    return Pi(t624, "remoteDocumentGlobal");
}
function $r(t625) {
    return Pi(t625, "remoteDocumentsV14");
}
function Br(t626) {
    const e = t626.path.toArray();
    return [
        e.slice(0, e.length - 2),
        e[e.length - 2],
        e[e.length - 1]
    ];
}
function Lr(t627, e) {
    const n = e.documentKey.path.toArray();
    return [
        t627,
        ki(e.readTime),
        n.slice(0, n.length - 2),
        n.length > 0 ? n[n.length - 1] : ""
    ];
}
function Ur(t628, e) {
    const n = t628.path.length - e.path.length;
    return n !== 0 ? n : xt.comparator(t628, e);
}
class qr {
    constructor(t629){
        this.M = t629;
    }
    kt(t630, e, n, s) {
        const i = new mi("createOrUpgrade", e);
        n < 1 && s >= 1 && ((function(t2) {
            t2.createObjectStore("owner");
        })(t630), (function(t2) {
            t2.createObjectStore("mutationQueues", {
                keyPath: "userId"
            });
            t2.createObjectStore("mutations", {
                keyPath: "batchId",
                autoIncrement: true
            }).createIndex("userMutationsIndex", Qs, {
                unique: true
            }), t2.createObjectStore("documentMutations");
        })(t630), Gr(t630), (function(t2) {
            t2.createObjectStore("remoteDocuments");
        })(t630));
        let r = wi.resolve();
        return n < 3 && s >= 3 && (n !== 0 && (!function(t2) {
            t2.deleteObjectStore("targetDocuments"), t2.deleteObjectStore("targets"), t2.deleteObjectStore("targetGlobal");
        }(t630), Gr(t630)), r = r.next(()=>(function(t2) {
                const e2 = t2.store("targetGlobal"), n2 = {
                    highestTargetId: 0,
                    highestListenSequenceNumber: 0,
                    lastRemoteSnapshotVersion: ct.min().toTimestamp(),
                    targetCount: 0
                };
                return e2.put("targetGlobalKey", n2);
            })(i)
        )), n < 4 && s >= 4 && (n !== 0 && (r = r.next(()=>(function(t2, e2) {
                return e2.store("mutations").qt().next((n2)=>{
                    t2.deleteObjectStore("mutations");
                    t2.createObjectStore("mutations", {
                        keyPath: "batchId",
                        autoIncrement: true
                    }).createIndex("userMutationsIndex", Qs, {
                        unique: true
                    });
                    const s2 = e2.store("mutations"), i2 = n2.map((t3)=>s2.put(t3)
                    );
                    return wi.waitFor(i2);
                });
            })(t630, i)
        )), r = r.next(()=>{
            !function(t2) {
                t2.createObjectStore("clientMetadata", {
                    keyPath: "clientId"
                });
            }(t630);
        })), n < 5 && s >= 5 && (r = r.next(()=>this.Kn(i)
        )), n < 6 && s >= 6 && (r = r.next(()=>((function(t2) {
                t2.createObjectStore("remoteDocumentGlobal");
            })(t630), this.Qn(i))
        )), n < 7 && s >= 7 && (r = r.next(()=>this.jn(i)
        )), n < 8 && s >= 8 && (r = r.next(()=>this.Wn(t630, i)
        )), n < 9 && s >= 9 && (r = r.next(()=>{
            !function(t2) {
                t2.objectStoreNames.contains("remoteDocumentChanges") && t2.deleteObjectStore("remoteDocumentChanges");
            }(t630);
        })), n < 10 && s >= 10 && (r = r.next(()=>this.zn(i)
        )), n < 11 && s >= 11 && (r = r.next(()=>{
            !function(t2) {
                t2.createObjectStore("bundles", {
                    keyPath: "bundleId"
                });
            }(t630), (function(t2) {
                t2.createObjectStore("namedQueries", {
                    keyPath: "name"
                });
            })(t630);
        })), n < 12 && s >= 12 && (r = r.next(()=>{
            !function(t2) {
                const e2 = t2.createObjectStore("documentOverlays", {
                    keyPath: oi
                });
                e2.createIndex("collectionPathOverlayIndex", ui, {
                    unique: false
                }), e2.createIndex("collectionGroupOverlayIndex", ai, {
                    unique: false
                });
            }(t630);
        })), n < 13 && s >= 13 && (r = r.next(()=>(function(t2) {
                const e2 = t2.createObjectStore("remoteDocumentsV14", {
                    keyPath: Hs
                });
                e2.createIndex("documentKeyIndex", Js), e2.createIndex("collectionGroupIndex", Ys);
            })(t630)
        ).next(()=>this.Hn(t630, i)
        ).next(()=>t630.deleteObjectStore("remoteDocuments")
        )), n < 14 && s >= 14 && (r = r.next(()=>{
            !function(t2) {
                t2.createObjectStore("indexConfiguration", {
                    keyPath: "indexId",
                    autoIncrement: true
                }).createIndex("collectionGroupIndex", "collectionGroup", {
                    unique: false
                });
                t2.createObjectStore("indexState", {
                    keyPath: ni
                }).createIndex("sequenceNumberIndex", si, {
                    unique: false
                });
                t2.createObjectStore("indexEntries", {
                    keyPath: ii
                }).createIndex("documentKeyIndex", ri, {
                    unique: false
                });
            }(t630);
        })), r;
    }
    Qn(t631) {
        let e = 0;
        return t631.store("remoteDocuments").Wt((t2, n)=>{
            e += mr(n);
        }).next(()=>{
            const n = {
                byteSize: e
            };
            return t631.store("remoteDocumentGlobal").put("remoteDocumentGlobalKey", n);
        });
    }
    Kn(t632) {
        const e = t632.store("mutationQueues"), n = t632.store("mutations");
        return e.qt().next((e2)=>wi.forEach(e2, (e3)=>{
                const s = IDBKeyRange.bound([
                    e3.userId,
                    -1
                ], [
                    e3.userId,
                    e3.lastAcknowledgedBatchId
                ]);
                return n.qt("userMutationsIndex", s).next((n2)=>wi.forEach(n2, (n3)=>{
                        U1(n3.userId === e3.userId);
                        const s2 = Fi(this.M, n3);
                        return wr(t632, e3.userId, s2).next(()=>{});
                    })
                );
            })
        );
    }
    jn(t633) {
        const e = t633.store("targetDocuments"), n = t633.store("remoteDocuments");
        return t633.store("targetGlobal").get("targetGlobalKey").next((t2)=>{
            const s = [];
            return n.Wt((n2, i)=>{
                const r = new _t(n2), o = function(t3) {
                    return [
                        0,
                        Us(t3)
                    ];
                }(r);
                s.push(e.get(o).next((n3)=>n3 ? wi.resolve() : ((n4)=>e.put({
                            targetId: 0,
                            path: Us(n4),
                            sequenceNumber: t2.highestListenSequenceNumber
                        })
                    )(r)
                ));
            }).next(()=>wi.waitFor(s)
            );
        });
    }
    Wn(t634, e) {
        t634.createObjectStore("collectionParents", {
            keyPath: ei
        });
        const n = e.store("collectionParents"), s = new or(), i = (t2)=>{
            if (s.add(t2)) {
                const e2 = t2.lastSegment(), s2 = t2.popLast();
                return n.put({
                    collectionId: e2,
                    parent: Us(s2)
                });
            }
        };
        return e.store("remoteDocuments").Wt({
            jt: true
        }, (t2, e2)=>{
            const n2 = new _t(t2);
            return i(n2.popLast());
        }).next(()=>e.store("documentMutations").Wt({
                jt: true
            }, ([t2, e2, n2], s2)=>{
                const r = Ks(e2);
                return i(r.popLast());
            })
        );
    }
    zn(t635) {
        const e = t635.store("targets");
        return e.Wt((t2, n)=>{
            const s = $i(n), i = Bi(this.M, s);
            return e.put(i);
        });
    }
    Hn(t, e) {
        const n = e.store("remoteDocuments"), s = [];
        return n.Wt((t2, n2)=>{
            const i = e.store("remoteDocumentsV14"), r = (o = n2, o.document ? new xt(_t.fromString(o.document.name).popFirst(5)) : o.noDocument ? xt.fromSegments(o.noDocument.path) : o.unknownDocument ? xt.fromSegments(o.unknownDocument.path) : L1()).path.toArray();
            var o;
            const u = {
                prefixPath: r.slice(0, r.length - 2),
                collectionGroup: r[r.length - 2],
                documentId: r[r.length - 1],
                readTime: n2.readTime || [
                    0,
                    0
                ],
                unknownDocument: n2.unknownDocument,
                noDocument: n2.noDocument,
                document: n2.document,
                hasCommittedMutations: !!n2.hasCommittedMutations
            };
            s.push(i.put(u));
        }).next(()=>wi.waitFor(s)
        );
    }
}
function Gr(t636) {
    t636.createObjectStore("targetDocuments", {
        keyPath: Zs
    }).createIndex("documentTargetsIndex", ti, {
        unique: true
    });
    t636.createObjectStore("targets", {
        keyPath: "targetId"
    }).createIndex("queryTargetsIndex", Xs, {
        unique: true
    }), t636.createObjectStore("targetGlobal");
}
const Kr = "Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";
class Qr {
    constructor(t637, e, n, s, i, r, o, u, a, c, h = 13){
        if (this.allowTabSynchronization = t637, this.persistenceKey = e, this.clientId = n, this.Jn = i, this.window = r, this.document = o, this.Yn = a, this.Xn = c, this.Zn = h, this.ts = null, this.es = false, this.isPrimary = false, this.networkEnabled = true, this.ns = null, this.inForeground = false, this.ss = null, this.rs = null, this.os = Number.NEGATIVE_INFINITY, this.us = (t2)=>Promise.resolve()
        , !Qr.vt()) throw new Q1(K1.UNIMPLEMENTED, "This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");
        this.referenceDelegate = new xr(this, s), this.cs = e + "main", this.M = new Ci(u), this.hs = new gi(this.cs, this.Zn, new qr(this.M)), this.ls = new Ar(this.referenceDelegate, this.M), this.fs = (function(t2) {
            return new Mr(t2);
        })(this.M), this.ds = new Gi(), this.window && this.window.localStorage ? this._s = this.window.localStorage : (this._s = null, c === false && F1("IndexedDbPersistence", "LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."));
    }
    start() {
        return this.ws().then(()=>{
            if (!this.isPrimary && !this.allowTabSynchronization) throw new Q1(K1.FAILED_PRECONDITION, Kr);
            return this.gs(), this.ys(), this.ps(), this.runTransaction("getHighestListenSequenceNumber", "readonly", (t638)=>this.ls.getHighestSequenceNumber(t638)
            );
        }).then((t639)=>{
            this.ts = new nt(t639, this.Yn);
        }).then(()=>{
            this.es = true;
        }).catch((t640)=>(this.hs && this.hs.close(), Promise.reject(t640))
        );
    }
    Is(t641) {
        return this.us = async (e)=>{
            if (this.started) return t641(e);
        }, t641(this.isPrimary);
    }
    setDatabaseDeletedListener(t642) {
        this.hs.Ot(async (e)=>{
            e.newVersion === null && await t642();
        });
    }
    setNetworkEnabled(t643) {
        this.networkEnabled !== t643 && (this.networkEnabled = t643, this.Jn.enqueueAndForget(async ()=>{
            this.started && await this.ws();
        }));
    }
    ws() {
        return this.runTransaction("updateClientMetadataAndTryBecomePrimary", "readwrite", (t644)=>Wr(t644).put({
                clientId: this.clientId,
                updateTimeMs: Date.now(),
                networkEnabled: this.networkEnabled,
                inForeground: this.inForeground
            }).next(()=>{
                if (this.isPrimary) return this.Ts(t644).next((t2)=>{
                    t2 || (this.isPrimary = false, this.Jn.enqueueRetryable(()=>this.us(false)
                    ));
                });
            }).next(()=>this.Es(t644)
            ).next((e)=>this.isPrimary && !e ? this.As(t644).next(()=>false
                ) : !!e && this.Rs(t644).next(()=>true
                )
            )
        ).catch((t645)=>{
            if (Ii(t645)) return O1("IndexedDbPersistence", "Failed to extend owner lease: ", t645), this.isPrimary;
            if (!this.allowTabSynchronization) throw t645;
            return O1("IndexedDbPersistence", "Releasing owner lease after error during lease refresh", t645), false;
        }).then((t646)=>{
            this.isPrimary !== t646 && this.Jn.enqueueRetryable(()=>this.us(t646)
            ), this.isPrimary = t646;
        });
    }
    Ts(t647) {
        return jr(t647).get("owner").next((t2)=>wi.resolve(this.bs(t2))
        );
    }
    Ps(t648) {
        return Wr(t648).delete(this.clientId);
    }
    async Vs() {
        if (this.isPrimary && !this.vs(this.os, 1800000)) {
            this.os = Date.now();
            const t649 = await this.runTransaction("maybeGarbageCollectMultiClientState", "readwrite-primary", (t2)=>{
                const e = Pi(t2, "clientMetadata");
                return e.qt().next((t3)=>{
                    const n = this.Ss(t3, 1800000), s = t3.filter((t4)=>n.indexOf(t4) === -1
                    );
                    return wi.forEach(s, (t4)=>e.delete(t4.clientId)
                    ).next(()=>s
                    );
                });
            }).catch(()=>[]
            );
            if (this._s) for (const e3 of t649)this._s.removeItem(this.Ds(e3.clientId));
        }
    }
    ps() {
        this.rs = this.Jn.enqueueAfterDelay("client_metadata_refresh", 4000, ()=>this.ws().then(()=>this.Vs()
            ).then(()=>this.ps()
            )
        );
    }
    bs(t650) {
        return !!t650 && t650.ownerId === this.clientId;
    }
    Es(t651) {
        if (this.Xn) return wi.resolve(true);
        return jr(t651).get("owner").next((e)=>{
            if (e !== null && this.vs(e.leaseTimestampMs, 5000) && !this.Cs(e.ownerId)) {
                if (this.bs(e) && this.networkEnabled) return true;
                if (!this.bs(e)) {
                    if (!e.allowTabSynchronization) throw new Q1(K1.FAILED_PRECONDITION, Kr);
                    return false;
                }
            }
            return !(!this.networkEnabled || !this.inForeground) || Wr(t651).qt().next((t2)=>this.Ss(t2, 5000).find((t3)=>{
                    if (this.clientId !== t3.clientId) {
                        const e2 = !this.networkEnabled && t3.networkEnabled, n = !this.inForeground && t3.inForeground, s = this.networkEnabled === t3.networkEnabled;
                        if (e2 || n && s) return true;
                    }
                    return false;
                }) === void 0
            );
        }).next((t2)=>(this.isPrimary !== t2 && O1("IndexedDbPersistence", `Client ${t2 ? "is" : "is not"} eligible for a primary lease.`), t2)
        );
    }
    async shutdown() {
        this.es = false, this.xs(), this.rs && (this.rs.cancel(), this.rs = null), this.Ns(), this.ks(), await this.hs.runTransaction("shutdown", "readwrite", [
            "owner",
            "clientMetadata"
        ], (t652)=>{
            const e = new bi(t652, nt.A);
            return this.As(e).next(()=>this.Ps(e)
            );
        }), this.hs.close(), this.Ms();
    }
    Ss(t653, e) {
        return t653.filter((t2)=>this.vs(t2.updateTimeMs, e) && !this.Cs(t2.clientId)
        );
    }
    Os() {
        return this.runTransaction("getActiveClients", "readonly", (t654)=>Wr(t654).qt().next((t2)=>this.Ss(t2, 1800000).map((t3)=>t3.clientId
                )
            )
        );
    }
    get started() {
        return this.es;
    }
    getMutationQueue(t655, e) {
        return gr.Yt(t655, this.M, e, this.referenceDelegate);
    }
    getTargetCache() {
        return this.ls;
    }
    getRemoteDocumentCache() {
        return this.fs;
    }
    getIndexManager(t656) {
        return new ar(t656);
    }
    getDocumentOverlayCache(t657) {
        return ji.Yt(this.M, t657);
    }
    getBundleCache() {
        return this.ds;
    }
    runTransaction(t658, e, n) {
        O1("IndexedDbPersistence", "Starting transaction:", t658);
        const s = e === "readonly" ? "readonly" : "readwrite", i = (r = this.Zn) === 14 ? fi : r === 13 ? li : r === 12 ? hi : r === 11 ? ci : void L1();
        var r;
        let o;
        return this.hs.runTransaction(t658, s, i, (s2)=>(o = new bi(s2, this.ts ? this.ts.next() : nt.A), e === "readwrite-primary" ? this.Ts(o).next((t2)=>!!t2 || this.Es(o)
            ).next((e2)=>{
                if (!e2) throw F1(`Failed to obtain primary lease for action '${t658}'.`), this.isPrimary = false, this.Jn.enqueueRetryable(()=>this.us(false)
                ), new Q1(K1.FAILED_PRECONDITION, di);
                return n(o);
            }).next((t2)=>this.Rs(o).next(()=>t2
                )
            ) : this.Fs(o).next(()=>n(o)
            ))
        ).then((t2)=>(o.raiseOnCommittedEvent(), t2)
        );
    }
    Fs(t659) {
        return jr(t659).get("owner").next((t2)=>{
            if (t2 !== null && this.vs(t2.leaseTimestampMs, 5000) && !this.Cs(t2.ownerId) && !this.bs(t2) && !(this.Xn || this.allowTabSynchronization && t2.allowTabSynchronization)) throw new Q1(K1.FAILED_PRECONDITION, Kr);
        });
    }
    Rs(t660) {
        const e = {
            ownerId: this.clientId,
            allowTabSynchronization: this.allowTabSynchronization,
            leaseTimestampMs: Date.now()
        };
        return jr(t660).put("owner", e);
    }
    static vt() {
        return gi.vt();
    }
    As(t661) {
        const e = jr(t661);
        return e.get("owner").next((t2)=>this.bs(t2) ? (O1("IndexedDbPersistence", "Releasing primary lease."), e.delete("owner")) : wi.resolve()
        );
    }
    vs(t662, e) {
        const n = Date.now();
        return !(t662 < n - e) && (!(t662 > n) || (F1(`Detected an update time that is in the future: ${t662} > ${n}`), false));
    }
    gs() {
        this.document !== null && typeof this.document.addEventListener == "function" && (this.ss = ()=>{
            this.Jn.enqueueAndForget(()=>(this.inForeground = this.document.visibilityState === "visible", this.ws())
            );
        }, this.document.addEventListener("visibilitychange", this.ss), this.inForeground = this.document.visibilityState === "visible");
    }
    Ns() {
        this.ss && (this.document.removeEventListener("visibilitychange", this.ss), this.ss = null);
    }
    ys() {
        var t663;
        typeof ((t663 = this.window) === null || t663 === void 0 ? void 0 : t663.addEventListener) == "function" && (this.ns = ()=>{
            this.xs(), isSafari() && navigator.appVersion.match(/Version\/1[45]/) && this.Jn.enterRestrictedMode(true), this.Jn.enqueueAndForget(()=>this.shutdown()
            );
        }, this.window.addEventListener("pagehide", this.ns));
    }
    ks() {
        this.ns && (this.window.removeEventListener("pagehide", this.ns), this.ns = null);
    }
    Cs(t664) {
        var e;
        try {
            const n = ((e = this._s) === null || e === void 0 ? void 0 : e.getItem(this.Ds(t664))) !== null;
            return O1("IndexedDbPersistence", `Client '${t664}' ${n ? "is" : "is not"} zombied in LocalStorage`), n;
        } catch (t2) {
            return F1("IndexedDbPersistence", "Failed to get zombied client id.", t2), false;
        }
    }
    xs() {
        if (this._s) try {
            this._s.setItem(this.Ds(this.clientId), String(Date.now()));
        } catch (t665) {
            F1("Failed to set zombie client id.", t665);
        }
    }
    Ms() {
        if (this._s) try {
            this._s.removeItem(this.Ds(this.clientId));
        } catch (t) {}
    }
    Ds(t666) {
        return `firestore_zombie_${this.persistenceKey}_${t666}`;
    }
}
function jr(t667) {
    return Pi(t667, "owner");
}
function Wr(t668) {
    return Pi(t668, "clientMetadata");
}
class Hr {
    constructor(t669, e, n){
        this.fs = t669, this.$s = e, this.indexManager = n;
    }
    Bs(t670, e) {
        return this.$s.getAllMutationBatchesAffectingDocumentKey(t670, e).next((n)=>this.Ls(t670, e, n)
        );
    }
    Ls(t671, e, n) {
        return this.fs.getEntry(t671, e).next((t2)=>{
            for (const e2 of n)e2.applyToLocalView(t2);
            return t2;
        });
    }
    Us(t672, e) {
        t672.forEach((t2, n)=>{
            for (const t3 of e)t3.applyToLocalView(n);
        });
    }
    qs(t673, e) {
        return this.fs.getEntries(t673, e).next((e2)=>this.Gs(t673, e2).next(()=>e2
            )
        );
    }
    Gs(t674, e) {
        return this.$s.getAllMutationBatchesAffectingDocumentKeys(t674, e).next((t2)=>this.Us(e, t2)
        );
    }
    Ks(t675, e, n) {
        return (function(t2) {
            return xt.isDocumentKey(t2.path) && t2.collectionGroup === null && t2.filters.length === 0;
        })(e) ? this.Qs(t675, e.path) : $e(e) ? this.js(t675, e, n) : this.Ws(t675, e, n);
    }
    Qs(t676, e) {
        return this.Bs(t676, new xt(e)).next((t2)=>{
            let e2 = Kn();
            return t2.isFoundDocument() && (e2 = e2.insert(t2.key, t2)), e2;
        });
    }
    js(t677, e, n) {
        const s = e.collectionGroup;
        let i = Kn();
        return this.indexManager.getCollectionParents(t677, s).next((r)=>wi.forEach(r, (r2)=>{
                const o = function(t2, e2) {
                    return new Ce(e2, null, t2.explicitOrderBy.slice(), t2.filters.slice(), t2.limit, t2.limitType, t2.startAt, t2.endAt);
                }(e, r2.child(s));
                return this.Ws(t677, o, n).next((t2)=>{
                    t2.forEach((t3, e2)=>{
                        i = i.insert(t3, e2);
                    });
                });
            }).next(()=>i
            )
        );
    }
    Ws(t678, e, n) {
        let s;
        return this.fs.getAllFromCollection(t678, e.path, n).next((n2)=>(s = n2, this.$s.getAllMutationBatchesAffectingQuery(t678, e))
        ).next((t2)=>{
            for (const e2 of t2)for (const t3 of e2.mutations){
                const n2 = t3.key;
                let i = s.get(n2);
                i == null && (i = te.newInvalidDocument(n2), s = s.insert(n2, i)), yn(t3, i, e2.localWriteTime), i.isFoundDocument() || (s = s.remove(n2));
            }
        }).next(()=>(s.forEach((t2, n2)=>{
                Qe(e, n2) || (s = s.remove(t2));
            }), s)
        );
    }
}
class Jr {
    constructor(t679, e, n, s){
        this.targetId = t679, this.fromCache = e, this.zs = n, this.Hs = s;
    }
    static Js(t680, e) {
        let n = zn(), s = zn();
        for (const t2 of e.docChanges)switch(t2.type){
            case 0:
                n = n.add(t2.doc.key);
                break;
            case 1:
                s = s.add(t2.doc.key);
        }
        return new Jr(t680, e.fromCache, n, s);
    }
}
class Yr {
    Ys(t681) {
        this.Xs = t681;
    }
    Ks(t682, e, n, s) {
        return (function(t2) {
            return t2.filters.length === 0 && t2.limit === null && t2.startAt == null && t2.endAt == null && (t2.explicitOrderBy.length === 0 || t2.explicitOrderBy.length === 1 && t2.explicitOrderBy[0].field.isKeyField());
        })(e) || n.isEqual(ct.min()) ? this.Zs(t682, e) : this.Xs.qs(t682, s).next((i)=>{
            const r = this.ti(e, i);
            return (ke(e) || Me(e)) && this.ei(e.limitType, r, s, n) ? this.Zs(t682, e) : (k1() <= LogLevel.DEBUG && O1("QueryEngine", "Re-using previous result from %s to execute query: %s", n.toString(), Ke(e)), this.Xs.Ks(t682, e, oe(n, -1)).next((t2)=>(r.forEach((e2)=>{
                    t2 = t2.insert(e2.key, e2);
                }), t2)
            ));
        });
    }
    ti(t683, e) {
        let n = new $n(We(t683));
        return e.forEach((e2, s)=>{
            Qe(t683, s) && (n = n.add(s));
        }), n;
    }
    ei(t684, e, n, s) {
        if (n.size !== e.size) return true;
        const i = t684 === "F" ? e.last() : e.first();
        return !!i && (i.hasPendingWrites || i.version.compareTo(s) > 0);
    }
    Zs(t685, e) {
        return k1() <= LogLevel.DEBUG && O1("QueryEngine", "Using full collection scan to execute query:", Ke(e)), this.Xs.Ks(t685, e, ae.min());
    }
}
class Xr {
    constructor(t686, e, n, s){
        this.persistence = t686, this.ni = e, this.M = s, this.si = new Mn(rt), this.ii = new kn((t2)=>fe(t2)
        , _e), this.ri = new Map(), this.oi = t686.getRemoteDocumentCache(), this.ls = t686.getTargetCache(), this.ds = t686.getBundleCache(), this.ui(n);
    }
    ui(t687) {
        this.indexManager = this.persistence.getIndexManager(t687), this.$s = this.persistence.getMutationQueue(t687, this.indexManager), this.ai = new Hr(this.oi, this.$s, this.indexManager), this.oi.setIndexManager(this.indexManager), this.ni.Ys(this.ai);
    }
    collectGarbage(t688) {
        return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (e)=>t688.collect(e, this.si)
        );
    }
}
function Zr(t689, e, n, s) {
    return new Xr(t689, e, n, s);
}
async function to(t690, e) {
    const n = G(t690);
    return await n.persistence.runTransaction("Handle user change", "readonly", (t2)=>{
        let s;
        return n.$s.getAllMutationBatches(t2).next((i)=>(s = i, n.ui(e), n.$s.getAllMutationBatches(t2))
        ).next((e2)=>{
            const i = [], r = [];
            let o = zn();
            for (const t32 of s){
                i.push(t32.batchId);
                for (const e3 of t32.mutations)o = o.add(e3.key);
            }
            for (const t31 of e2){
                r.push(t31.batchId);
                for (const e3 of t31.mutations)o = o.add(e3.key);
            }
            return n.ai.qs(t2, o).next((t3)=>({
                    ci: t3,
                    removedBatchIds: i,
                    addedBatchIds: r
                })
            );
        });
    });
}
function eo(t691, e) {
    const n = G(t691);
    return n.persistence.runTransaction("Acknowledge batch", "readwrite-primary", (t2)=>{
        const s = e.batch.keys(), i = n.oi.newChangeBuffer({
            trackRemovals: true
        });
        return (function(t3, e2, n2, s2) {
            const i2 = n2.batch, r = i2.keys();
            let o = wi.resolve();
            return r.forEach((t4)=>{
                o = o.next(()=>s2.getEntry(e2, t4)
                ).next((e3)=>{
                    const r2 = n2.docVersions.get(t4);
                    U1(r2 !== null), e3.version.compareTo(r2) < 0 && (i2.applyToRemoteDocument(e3, n2), e3.isValidDocument() && (e3.setReadTime(n2.commitVersion), s2.addEntry(e3)));
                });
            }), o.next(()=>t3.$s.removeMutationBatch(e2, i2)
            );
        })(n, t2, e, i).next(()=>i.apply(t2)
        ).next(()=>n.$s.performConsistencyCheck(t2)
        ).next(()=>n.ai.qs(t2, s)
        );
    });
}
function no(t692) {
    const e = G(t692);
    return e.persistence.runTransaction("Get last remote snapshot version", "readonly", (t2)=>e.ls.getLastRemoteSnapshotVersion(t2)
    );
}
function so(t693, e) {
    const n = G(t693), s = e.snapshotVersion;
    let i = n.si;
    return n.persistence.runTransaction("Apply remote event", "readwrite-primary", (t2)=>{
        const r = n.oi.newChangeBuffer({
            trackRemovals: true
        });
        i = n.si;
        const o = [];
        e.targetChanges.forEach((r2, u2)=>{
            const a = i.get(u2);
            if (!a) return;
            o.push(n.ls.removeMatchingKeys(t2, r2.removedDocuments, u2).next(()=>n.ls.addMatchingKeys(t2, r2.addedDocuments, u2)
            ));
            let c = a.withSequenceNumber(t2.currentSequenceNumber);
            e.targetMismatches.has(u2) ? c = c.withResumeToken(pt.EMPTY_BYTE_STRING, ct.min()).withLastLimboFreeSnapshotVersion(ct.min()) : r2.resumeToken.approximateByteSize() > 0 && (c = c.withResumeToken(r2.resumeToken, s)), i = i.insert(u2, c), (function(t3, e2, n2) {
                if (t3.resumeToken.approximateByteSize() === 0) return true;
                if (e2.snapshotVersion.toMicroseconds() - t3.snapshotVersion.toMicroseconds() >= 300000000) return true;
                return n2.addedDocuments.size + n2.modifiedDocuments.size + n2.removedDocuments.size > 0;
            })(a, c, r2) && o.push(n.ls.updateTargetData(t2, c));
        });
        let u = qn();
        if (e.documentUpdates.forEach((s2)=>{
            e.resolvedLimboDocuments.has(s2) && o.push(n.persistence.referenceDelegate.updateLimboDocument(t2, s2));
        }), o.push(io(t2, r, e.documentUpdates).next((t3)=>{
            u = t3;
        })), !s.isEqual(ct.min())) {
            const e2 = n.ls.getLastRemoteSnapshotVersion(t2).next((e3)=>n.ls.setTargetsMetadata(t2, t2.currentSequenceNumber, s)
            );
            o.push(e2);
        }
        return wi.waitFor(o).next(()=>r.apply(t2)
        ).next(()=>n.ai.Gs(t2, u)
        ).next(()=>u
        );
    }).then((t2)=>(n.si = i, t2)
    );
}
function io(t694, e, n) {
    let s = zn();
    return n.forEach((t2)=>s = s.add(t2)
    ), e.getEntries(t694, s).next((t2)=>{
        let s2 = qn();
        return n.forEach((n2, i)=>{
            const r = t2.get(n2);
            i.isNoDocument() && i.version.isEqual(ct.min()) ? (e.removeEntry(n2, i.readTime), s2 = s2.insert(n2, i)) : !r.isValidDocument() || i.version.compareTo(r.version) > 0 || i.version.compareTo(r.version) === 0 && r.hasPendingWrites ? (e.addEntry(i), s2 = s2.insert(n2, i)) : O1("LocalStore", "Ignoring outdated watch update for ", n2, ". Current version:", r.version, " Watch version:", i.version);
        }), s2;
    });
}
function ro(t695, e) {
    const n = G(t695);
    return n.persistence.runTransaction("Get next mutation batch", "readonly", (t2)=>(e === void 0 && (e = -1), n.$s.getNextMutationBatchAfterBatchId(t2, e))
    );
}
function oo(t696, e) {
    const n = G(t696);
    return n.persistence.runTransaction("Allocate target", "readwrite", (t2)=>{
        let s;
        return n.ls.getTargetData(t2, e).next((i)=>i ? (s = i, wi.resolve(s)) : n.ls.allocateTargetId(t2).next((i2)=>(s = new Di(e, i2, 0, t2.currentSequenceNumber), n.ls.addTargetData(t2, s).next(()=>s
                ))
            )
        );
    }).then((t2)=>{
        const s = n.si.get(t2.targetId);
        return (s === null || t2.snapshotVersion.compareTo(s.snapshotVersion) > 0) && (n.si = n.si.insert(t2.targetId, t2), n.ii.set(e, t2.targetId)), t2;
    });
}
async function uo(t697, e, n) {
    const s = G(t697), i = s.si.get(e), r = n ? "readwrite" : "readwrite-primary";
    try {
        n || await s.persistence.runTransaction("Release target", r, (t2)=>s.persistence.referenceDelegate.removeTarget(t2, i)
        );
    } catch (t2) {
        if (!Ii(t2)) throw t2;
        O1("LocalStore", `Failed to update sequence numbers for target ${e}: ${t2}`);
    }
    s.si = s.si.remove(e), s.ii.delete(i.target);
}
function ao(t698, e, n) {
    const s = G(t698);
    let i = ct.min(), r = zn();
    return s.persistence.runTransaction("Execute query", "readonly", (t2)=>(function(t3, e2, n2) {
            const s2 = G(t3), i2 = s2.ii.get(n2);
            return i2 !== void 0 ? wi.resolve(s2.si.get(i2)) : s2.ls.getTargetData(e2, n2);
        })(s, t2, Le(e)).next((e2)=>{
            if (e2) return i = e2.lastLimboFreeSnapshotVersion, s.ls.getMatchingKeysForTargetId(t2, e2.targetId).next((t3)=>{
                r = t3;
            });
        }).next(()=>s.ni.Ks(t2, e, n ? i : ct.min(), n ? r : zn())
        ).next((t3)=>(lo(s, je(e), t3), {
                documents: t3,
                hi: r
            })
        )
    );
}
function lo(t699, e, n) {
    let s = ct.min();
    n.forEach((t2, e2)=>{
        e2.readTime.compareTo(s) > 0 && (s = e2.readTime);
    }), t699.ri.set(e, s);
}
class wo {
    constructor(t700){
        this.M = t700, this._i = new Map(), this.wi = new Map();
    }
    getBundleMetadata(t, e) {
        return wi.resolve(this._i.get(e));
    }
    saveBundleMetadata(t, e) {
        var n;
        return this._i.set(e.id, {
            id: (n = e).id,
            version: n.version,
            createTime: fs(n.createTime)
        }), wi.resolve();
    }
    getNamedQuery(t, e) {
        return wi.resolve(this.wi.get(e));
    }
    saveNamedQuery(t, e) {
        return this.wi.set(e.name, function(t2) {
            return {
                name: t2.name,
                query: Li(t2.bundledQuery),
                readTime: fs(t2.readTime)
            };
        }(e)), wi.resolve();
    }
}
class mo {
    constructor(){
        this.overlays = new Mn(xt.comparator), this.mi = new Map();
    }
    getOverlay(t, e) {
        return wi.resolve(this.overlays.get(e));
    }
    saveOverlays(t701, e, n) {
        return n.forEach((n2, s)=>{
            this.Xt(t701, e, s);
        }), wi.resolve();
    }
    removeOverlaysForBatchId(t, e, n) {
        const s = this.mi.get(n);
        return s !== void 0 && (s.forEach((t2)=>this.overlays = this.overlays.remove(t2)
        ), this.mi.delete(n)), wi.resolve();
    }
    getOverlaysForCollection(t, e, n) {
        const s = Qn(), i = e.length + 1, r = new xt(e.child("")), o = this.overlays.getIteratorFrom(r);
        for(; o.hasNext();){
            const t2 = o.getNext().value, r2 = t2.getKey();
            if (!e.isPrefixOf(r2.path)) break;
            r2.path.length === i && t2.largestBatchId > n && s.set(t2.getKey(), t2);
        }
        return wi.resolve(s);
    }
    getOverlaysForCollectionGroup(t, e, n, s) {
        let i = new Mn((t2, e2)=>t2 - e2
        );
        const r = this.overlays.getIterator();
        for(; r.hasNext();){
            const t2 = r.getNext().value;
            if (t2.getKey().getCollectionGroup() === e && t2.largestBatchId > n) {
                let e2 = i.get(t2.largestBatchId);
                e2 === null && (e2 = Qn(), i = i.insert(t2.largestBatchId, e2)), e2.set(t2.getKey(), t2);
            }
        }
        const o = Qn(), u = i.getIterator();
        for(; u.hasNext();){
            if (u.getNext().value.forEach((t2, e2)=>o.set(t2, e2)
            ), o.size() >= s) break;
        }
        return wi.resolve(o);
    }
    Xt(t, e, n) {
        if (n === null) return;
        const s = this.overlays.get(n.key);
        if (s !== null) {
            const t2 = this.mi.get(s.largestBatchId).delete(n.key);
            this.mi.set(s.largestBatchId, t2);
        }
        this.overlays = this.overlays.insert(n.key, new Si(e, n));
        let i = this.mi.get(e);
        i === void 0 && (i = zn(), this.mi.set(e, i)), this.mi.set(e, i.add(n.key));
    }
}
class go {
    constructor(){
        this.gi = new $n(yo.yi), this.pi = new $n(yo.Ii);
    }
    isEmpty() {
        return this.gi.isEmpty();
    }
    addReference(t702, e) {
        const n = new yo(t702, e);
        this.gi = this.gi.add(n), this.pi = this.pi.add(n);
    }
    Ti(t703, e) {
        t703.forEach((t2)=>this.addReference(t2, e)
        );
    }
    removeReference(t704, e) {
        this.Ei(new yo(t704, e));
    }
    Ai(t705, e) {
        t705.forEach((t2)=>this.removeReference(t2, e)
        );
    }
    Ri(t706) {
        const e = new xt(new _t([])), n = new yo(e, t706), s = new yo(e, t706 + 1), i = [];
        return this.pi.forEachInRange([
            n,
            s
        ], (t2)=>{
            this.Ei(t2), i.push(t2.key);
        }), i;
    }
    bi() {
        this.gi.forEach((t707)=>this.Ei(t707)
        );
    }
    Ei(t708) {
        this.gi = this.gi.delete(t708), this.pi = this.pi.delete(t708);
    }
    Pi(t709) {
        const e = new xt(new _t([])), n = new yo(e, t709), s = new yo(e, t709 + 1);
        let i = zn();
        return this.pi.forEachInRange([
            n,
            s
        ], (t2)=>{
            i = i.add(t2.key);
        }), i;
    }
    containsKey(t710) {
        const e = new yo(t710, 0), n = this.gi.firstAfterOrEqual(e);
        return n !== null && t710.isEqual(n.key);
    }
}
class yo {
    constructor(t711, e){
        this.key = t711, this.Vi = e;
    }
    static yi(t712, e) {
        return xt.comparator(t712.key, e.key) || rt(t712.Vi, e.Vi);
    }
    static Ii(t713, e) {
        return rt(t713.Vi, e.Vi) || xt.comparator(t713.key, e.key);
    }
}
class po {
    constructor(t714, e){
        this.indexManager = t714, this.referenceDelegate = e, this.$s = [], this.vi = 1, this.Si = new $n(yo.yi);
    }
    checkEmpty(t) {
        return wi.resolve(this.$s.length === 0);
    }
    addMutationBatch(t715, e, n, s) {
        const i = this.vi;
        this.vi++, this.$s.length > 0 && this.$s[this.$s.length - 1];
        const r = new Vi(i, e, n, s);
        this.$s.push(r);
        for (const e2 of s)this.Si = this.Si.add(new yo(e2.key, i)), this.indexManager.addToCollectionParentIndex(t715, e2.key.path.popLast());
        return wi.resolve(r);
    }
    lookupMutationBatch(t, e) {
        return wi.resolve(this.Di(e));
    }
    getNextMutationBatchAfterBatchId(t, e) {
        const n = e + 1, s = this.Ci(n), i = s < 0 ? 0 : s;
        return wi.resolve(this.$s.length > i ? this.$s[i] : null);
    }
    getHighestUnacknowledgedBatchId() {
        return wi.resolve(this.$s.length === 0 ? -1 : this.vi - 1);
    }
    getAllMutationBatches(t) {
        return wi.resolve(this.$s.slice());
    }
    getAllMutationBatchesAffectingDocumentKey(t, e) {
        const n = new yo(e, 0), s = new yo(e, Number.POSITIVE_INFINITY), i = [];
        return this.Si.forEachInRange([
            n,
            s
        ], (t2)=>{
            const e2 = this.Di(t2.Vi);
            i.push(e2);
        }), wi.resolve(i);
    }
    getAllMutationBatchesAffectingDocumentKeys(t, e) {
        let n = new $n(rt);
        return e.forEach((t2)=>{
            const e2 = new yo(t2, 0), s = new yo(t2, Number.POSITIVE_INFINITY);
            this.Si.forEachInRange([
                e2,
                s
            ], (t3)=>{
                n = n.add(t3.Vi);
            });
        }), wi.resolve(this.xi(n));
    }
    getAllMutationBatchesAffectingQuery(t, e) {
        const n = e.path, s = n.length + 1;
        let i = n;
        xt.isDocumentKey(i) || (i = i.child(""));
        const r = new yo(new xt(i), 0);
        let o = new $n(rt);
        return this.Si.forEachWhile((t2)=>{
            const e2 = t2.key.path;
            return !!n.isPrefixOf(e2) && (e2.length === s && (o = o.add(t2.Vi)), true);
        }, r), wi.resolve(this.xi(o));
    }
    xi(t716) {
        const e = [];
        return t716.forEach((t2)=>{
            const n = this.Di(t2);
            n !== null && e.push(n);
        }), e;
    }
    removeMutationBatch(t717, e) {
        U1(this.Ni(e.batchId, "removed") === 0), this.$s.shift();
        let n = this.Si;
        return wi.forEach(e.mutations, (s)=>{
            const i = new yo(s.key, e.batchId);
            return n = n.delete(i), this.referenceDelegate.markPotentiallyOrphaned(t717, s.key);
        }).next(()=>{
            this.Si = n;
        });
    }
    dn(t) {}
    containsKey(t, e) {
        const n = new yo(e, 0), s = this.Si.firstAfterOrEqual(n);
        return wi.resolve(e.isEqual(s && s.key));
    }
    performConsistencyCheck(t) {
        return this.$s.length, wi.resolve();
    }
    Ni(t718, e) {
        return this.Ci(t718);
    }
    Ci(t719) {
        if (this.$s.length === 0) return 0;
        return t719 - this.$s[0].batchId;
    }
    Di(t720) {
        const e = this.Ci(t720);
        if (e < 0 || e >= this.$s.length) return null;
        return this.$s[e];
    }
}
class Io {
    constructor(t721){
        this.ki = t721, this.docs = new Mn(xt.comparator), this.size = 0;
    }
    setIndexManager(t722) {
        this.indexManager = t722;
    }
    addEntry(t723, e) {
        const n = e.key, s = this.docs.get(n), i = s ? s.size : 0, r = this.ki(e);
        return this.docs = this.docs.insert(n, {
            document: e.mutableCopy(),
            size: r
        }), this.size += r - i, this.indexManager.addToCollectionParentIndex(t723, n.path.popLast());
    }
    removeEntry(t724) {
        const e = this.docs.get(t724);
        e && (this.docs = this.docs.remove(t724), this.size -= e.size);
    }
    getEntry(t, e) {
        const n = this.docs.get(e);
        return wi.resolve(n ? n.document.mutableCopy() : te.newInvalidDocument(e));
    }
    getEntries(t, e) {
        let n = qn();
        return e.forEach((t2)=>{
            const e2 = this.docs.get(t2);
            n = n.insert(t2, e2 ? e2.document.mutableCopy() : te.newInvalidDocument(t2));
        }), wi.resolve(n);
    }
    getAllFromCollection(t, e, n) {
        let s = qn();
        const i = new xt(e.child("")), r = this.docs.getIteratorFrom(i);
        for(; r.hasNext();){
            const { key: t2 , value: { document: i2  }  } = r.getNext();
            if (!e.isPrefixOf(t2.path)) break;
            t2.path.length > e.length + 1 || ce(ue(i2), n) <= 0 || (s = s.insert(i2.key, i2.mutableCopy()));
        }
        return wi.resolve(s);
    }
    getAllFromCollectionGroup(t, e, n, s) {
        L1();
    }
    Mi(t, e) {
        return wi.forEach(this.docs, (t2)=>e(t2)
        );
    }
    newChangeBuffer(t) {
        return new To(this);
    }
    getSize(t) {
        return wi.resolve(this.size);
    }
}
class To extends kr {
    constructor(t725){
        super(), this.qn = t725;
    }
    applyChanges(t726) {
        const e = [];
        return this.changes.forEach((n, s)=>{
            s.isValidDocument() ? e.push(this.qn.addEntry(t726, s)) : this.qn.removeEntry(n);
        }), wi.waitFor(e);
    }
    getFromCache(t727, e) {
        return this.qn.getEntry(t727, e);
    }
    getAllFromCache(t728, e) {
        return this.qn.getEntries(t728, e);
    }
}
class Eo {
    constructor(t729){
        this.persistence = t729, this.Oi = new kn((t2)=>fe(t2)
        , _e), this.lastRemoteSnapshotVersion = ct.min(), this.highestTargetId = 0, this.Fi = 0, this.$i = new go(), this.targetCount = 0, this.Bi = Er.mn();
    }
    forEachTarget(t, e) {
        return this.Oi.forEach((t2, n)=>e(n)
        ), wi.resolve();
    }
    getLastRemoteSnapshotVersion(t) {
        return wi.resolve(this.lastRemoteSnapshotVersion);
    }
    getHighestSequenceNumber(t) {
        return wi.resolve(this.Fi);
    }
    allocateTargetId(t) {
        return this.highestTargetId = this.Bi.next(), wi.resolve(this.highestTargetId);
    }
    setTargetsMetadata(t, e, n) {
        return n && (this.lastRemoteSnapshotVersion = n), e > this.Fi && (this.Fi = e), wi.resolve();
    }
    In(t730) {
        this.Oi.set(t730.target, t730);
        const e = t730.targetId;
        e > this.highestTargetId && (this.Bi = new Er(e), this.highestTargetId = e), t730.sequenceNumber > this.Fi && (this.Fi = t730.sequenceNumber);
    }
    addTargetData(t, e) {
        return this.In(e), this.targetCount += 1, wi.resolve();
    }
    updateTargetData(t, e) {
        return this.In(e), wi.resolve();
    }
    removeTargetData(t, e) {
        return this.Oi.delete(e.target), this.$i.Ri(e.targetId), this.targetCount -= 1, wi.resolve();
    }
    removeTargets(t731, e, n) {
        let s = 0;
        const i = [];
        return this.Oi.forEach((r, o)=>{
            o.sequenceNumber <= e && n.get(o.targetId) === null && (this.Oi.delete(r), i.push(this.removeMatchingKeysForTargetId(t731, o.targetId)), s++);
        }), wi.waitFor(i).next(()=>s
        );
    }
    getTargetCount(t) {
        return wi.resolve(this.targetCount);
    }
    getTargetData(t, e) {
        const n = this.Oi.get(e) || null;
        return wi.resolve(n);
    }
    addMatchingKeys(t, e, n) {
        return this.$i.Ti(e, n), wi.resolve();
    }
    removeMatchingKeys(t732, e, n) {
        this.$i.Ai(e, n);
        const s = this.persistence.referenceDelegate, i = [];
        return s && e.forEach((e2)=>{
            i.push(s.markPotentiallyOrphaned(t732, e2));
        }), wi.waitFor(i);
    }
    removeMatchingKeysForTargetId(t, e) {
        return this.$i.Ri(e), wi.resolve();
    }
    getMatchingKeysForTargetId(t, e) {
        const n = this.$i.Pi(e);
        return wi.resolve(n);
    }
    containsKey(t, e) {
        return wi.resolve(this.$i.containsKey(e));
    }
}
class Ao {
    constructor(t733, e){
        this.Li = {}, this.overlays = {}, this.ts = new nt(0), this.es = false, this.es = true, this.referenceDelegate = t733(this), this.ls = new Eo(this);
        this.indexManager = new rr(), this.fs = (function(t2) {
            return new Io(t2);
        })((t2)=>this.referenceDelegate.Ui(t2)
        ), this.M = new Ci(e), this.ds = new wo(this.M);
    }
    start() {
        return Promise.resolve();
    }
    shutdown() {
        return this.es = false, Promise.resolve();
    }
    get started() {
        return this.es;
    }
    setDatabaseDeletedListener() {}
    setNetworkEnabled() {}
    getIndexManager(t) {
        return this.indexManager;
    }
    getDocumentOverlayCache(t734) {
        let e = this.overlays[t734.toKey()];
        return e || (e = new mo(), this.overlays[t734.toKey()] = e), e;
    }
    getMutationQueue(t735, e) {
        let n = this.Li[t735.toKey()];
        return n || (n = new po(e, this.referenceDelegate), this.Li[t735.toKey()] = n), n;
    }
    getTargetCache() {
        return this.ls;
    }
    getRemoteDocumentCache() {
        return this.fs;
    }
    getBundleCache() {
        return this.ds;
    }
    runTransaction(t736, e, n) {
        O1("MemoryPersistence", "Starting transaction:", t736);
        const s = new Ro(this.ts.next());
        return this.referenceDelegate.qi(), n(s).next((t2)=>this.referenceDelegate.Gi(s).next(()=>t2
            )
        ).toPromise().then((t2)=>(s.raiseOnCommittedEvent(), t2)
        );
    }
    Ki(t737, e) {
        return wi.or(Object.values(this.Li).map((n)=>()=>n.containsKey(t737, e)
        ));
    }
}
class Ro extends _i {
    constructor(t738){
        super(), this.currentSequenceNumber = t738;
    }
}
class bo {
    constructor(t739){
        this.persistence = t739, this.Qi = new go(), this.ji = null;
    }
    static Wi(t740) {
        return new bo(t740);
    }
    get zi() {
        if (this.ji) return this.ji;
        throw L1();
    }
    addReference(t, e, n) {
        return this.Qi.addReference(n, e), this.zi.delete(n.toString()), wi.resolve();
    }
    removeReference(t, e, n) {
        return this.Qi.removeReference(n, e), this.zi.add(n.toString()), wi.resolve();
    }
    markPotentiallyOrphaned(t, e) {
        return this.zi.add(e.toString()), wi.resolve();
    }
    removeTarget(t741, e) {
        this.Qi.Ri(e.targetId).forEach((t2)=>this.zi.add(t2.toString())
        );
        const n = this.persistence.getTargetCache();
        return n.getMatchingKeysForTargetId(t741, e.targetId).next((t2)=>{
            t2.forEach((t3)=>this.zi.add(t3.toString())
            );
        }).next(()=>n.removeTargetData(t741, e)
        );
    }
    qi() {
        this.ji = new Set();
    }
    Gi(t742) {
        const e = this.persistence.getRemoteDocumentCache().newChangeBuffer();
        return wi.forEach(this.zi, (n)=>{
            const s = xt.fromPath(n);
            return this.Hi(t742, s).next((t2)=>{
                t2 || e.removeEntry(s, ct.min());
            });
        }).next(()=>(this.ji = null, e.apply(t742))
        );
    }
    updateLimboDocument(t743, e) {
        return this.Hi(t743, e).next((t2)=>{
            t2 ? this.zi.delete(e.toString()) : this.zi.add(e.toString());
        });
    }
    Ui(t) {
        return 0;
    }
    Hi(t744, e) {
        return wi.or([
            ()=>wi.resolve(this.Qi.containsKey(e))
            ,
            ()=>this.persistence.getTargetCache().containsKey(t744, e)
            ,
            ()=>this.persistence.Ki(t744, e)
        ]);
    }
}
class So {
    constructor(t745, e, n, s){
        this.user = t745, this.batchId = e, this.state = n, this.error = s;
    }
    static Ji(t746, e, n) {
        const s = JSON.parse(n);
        let i, r = typeof s == "object" && [
            "pending",
            "acknowledged",
            "rejected"
        ].indexOf(s.state) !== -1 && (s.error === void 0 || typeof s.error == "object");
        return r && s.error && (r = typeof s.error.message == "string" && typeof s.error.code == "string", r && (i = new Q1(s.error.code, s.error.message))), r ? new So(t746, e, s.state, i) : (F1("SharedClientState", `Failed to parse mutation state for ID '${e}': ${n}`), null);
    }
    Yi() {
        const t747 = {
            state: this.state,
            updateTimeMs: Date.now()
        };
        return this.error && (t747.error = {
            code: this.error.code,
            message: this.error.message
        }), JSON.stringify(t747);
    }
}
class Do {
    constructor(t748, e, n){
        this.targetId = t748, this.state = e, this.error = n;
    }
    static Ji(t749, e) {
        const n = JSON.parse(e);
        let s, i = typeof n == "object" && [
            "not-current",
            "current",
            "rejected"
        ].indexOf(n.state) !== -1 && (n.error === void 0 || typeof n.error == "object");
        return i && n.error && (i = typeof n.error.message == "string" && typeof n.error.code == "string", i && (s = new Q1(n.error.code, n.error.message))), i ? new Do(t749, n.state, s) : (F1("SharedClientState", `Failed to parse target state for ID '${t749}': ${e}`), null);
    }
    Yi() {
        const t750 = {
            state: this.state,
            updateTimeMs: Date.now()
        };
        return this.error && (t750.error = {
            code: this.error.code,
            message: this.error.message
        }), JSON.stringify(t750);
    }
}
class Co {
    constructor(t751, e){
        this.clientId = t751, this.activeTargetIds = e;
    }
    static Ji(t752, e) {
        const n = JSON.parse(e);
        let s = typeof n == "object" && n.activeTargetIds instanceof Array, i = Jn();
        for(let t2 = 0; s && t2 < n.activeTargetIds.length; ++t2)s = Ct(n.activeTargetIds[t2]), i = i.add(n.activeTargetIds[t2]);
        return s ? new Co(t752, i) : (F1("SharedClientState", `Failed to parse client data for instance '${t752}': ${e}`), null);
    }
}
class xo {
    constructor(t753, e){
        this.clientId = t753, this.onlineState = e;
    }
    static Ji(t754) {
        const e = JSON.parse(t754);
        return typeof e == "object" && [
            "Unknown",
            "Online",
            "Offline"
        ].indexOf(e.onlineState) !== -1 && typeof e.clientId == "string" ? new xo(e.clientId, e.onlineState) : (F1("SharedClientState", `Failed to parse online state: ${t754}`), null);
    }
}
class No {
    constructor(){
        this.activeTargetIds = Jn();
    }
    Xi(t755) {
        this.activeTargetIds = this.activeTargetIds.add(t755);
    }
    Zi(t756) {
        this.activeTargetIds = this.activeTargetIds.delete(t756);
    }
    Yi() {
        const t757 = {
            activeTargetIds: this.activeTargetIds.toArray(),
            updateTimeMs: Date.now()
        };
        return JSON.stringify(t757);
    }
}
class Mo {
    constructor(){
        this.Fr = new No(), this.$r = {}, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
    }
    addPendingMutation(t) {}
    updateMutationState(t, e, n) {}
    addLocalQueryTarget(t758) {
        return this.Fr.Xi(t758), this.$r[t758] || "not-current";
    }
    updateQueryState(t759, e, n) {
        this.$r[t759] = e;
    }
    removeLocalQueryTarget(t760) {
        this.Fr.Zi(t760);
    }
    isLocalQueryTarget(t761) {
        return this.Fr.activeTargetIds.has(t761);
    }
    clearQueryState(t762) {
        delete this.$r[t762];
    }
    getAllActiveQueryTargets() {
        return this.Fr.activeTargetIds;
    }
    isActiveQueryTarget(t763) {
        return this.Fr.activeTargetIds.has(t763);
    }
    start() {
        return this.Fr = new No(), Promise.resolve();
    }
    handleUserChange(t, e, n) {}
    setOnlineState(t) {}
    shutdown() {}
    writeSequenceNumber(t) {}
    notifyBundleLoaded(t) {}
}
class Oo {
    Br(t) {}
    shutdown() {}
}
class Fo {
    constructor(){
        this.Lr = ()=>this.Ur()
        , this.qr = ()=>this.Gr()
        , this.Kr = [], this.Qr();
    }
    Br(t764) {
        this.Kr.push(t764);
    }
    shutdown() {
        window.removeEventListener("online", this.Lr), window.removeEventListener("offline", this.qr);
    }
    Qr() {
        window.addEventListener("online", this.Lr), window.addEventListener("offline", this.qr);
    }
    Ur() {
        O1("ConnectivityMonitor", "Network connectivity changed: AVAILABLE");
        for (const t765 of this.Kr)t765(0);
    }
    Gr() {
        O1("ConnectivityMonitor", "Network connectivity changed: UNAVAILABLE");
        for (const t766 of this.Kr)t766(1);
    }
    static vt() {
        return typeof window != "undefined" && window.addEventListener !== void 0 && window.removeEventListener !== void 0;
    }
}
const $o = {
    BatchGetDocuments: "batchGet",
    Commit: "commit",
    RunQuery: "runQuery"
};
class Bo {
    constructor(t767){
        this.jr = t767.jr, this.Wr = t767.Wr;
    }
    zr(t768) {
        this.Hr = t768;
    }
    Jr(t769) {
        this.Yr = t769;
    }
    onMessage(t770) {
        this.Xr = t770;
    }
    close() {
        this.Wr();
    }
    send(t771) {
        this.jr(t771);
    }
    Zr() {
        this.Hr();
    }
    eo(t772) {
        this.Yr(t772);
    }
    no(t773) {
        this.Xr(t773);
    }
}
class Lo extends class {
    constructor(t777){
        this.databaseInfo = t777, this.databaseId = t777.databaseId;
        const e = t777.ssl ? "https" : "http";
        this.so = e + "://" + t777.host, this.io = "projects/" + this.databaseId.projectId + "/databases/" + this.databaseId.database + "/documents";
    }
    ro(t778, e, n, s, i) {
        const r = this.oo(t778, e);
        O1("RestConnection", "Sending: ", r, n);
        const o = {};
        return this.uo(o, s, i), this.ao(t778, r, o, n).then((t2)=>(O1("RestConnection", "Received: ", t2), t2)
        , (e2)=>{
            throw $("RestConnection", `${t778} failed with error: `, e2, "url: ", r, "request:", n), e2;
        });
    }
    co(t779, e, n, s, i) {
        return this.ro(t779, e, n, s, i);
    }
    uo(t780, e, n) {
        t780["X-Goog-Api-Client"] = "gl-js/ fire/" + x1, t780["Content-Type"] = "text/plain", this.databaseInfo.appId && (t780["X-Firebase-GMPID"] = this.databaseInfo.appId), e && e.headers.forEach((e2, n2)=>t780[n2] = e2
        ), n && n.headers.forEach((e2, n2)=>t780[n2] = e2
        );
    }
    oo(t781, e) {
        const n = $o[t781];
        return `${this.so}/v1/${e}:${n}`;
    }
} {
    constructor(t774){
        super(t774), this.forceLongPolling = t774.forceLongPolling, this.autoDetectLongPolling = t774.autoDetectLongPolling, this.useFetchStreams = t774.useFetchStreams;
    }
    ao(t775, e, n, s) {
        return new Promise((i, r)=>{
            const o = new XhrIo();
            o.listenOnce(EventType.COMPLETE, ()=>{
                try {
                    switch(o.getLastErrorCode()){
                        case ErrorCode.NO_ERROR:
                            const e2 = o.getResponseJson();
                            O1("Connection", "XHR received:", JSON.stringify(e2)), i(e2);
                            break;
                        case ErrorCode.TIMEOUT:
                            O1("Connection", 'RPC "' + t775 + '" timed out'), r(new Q1(K1.DEADLINE_EXCEEDED, "Request time out"));
                            break;
                        case ErrorCode.HTTP_ERROR:
                            const n2 = o.getStatus();
                            if (O1("Connection", 'RPC "' + t775 + '" failed with status:', n2, "response text:", o.getResponseText()), n2 > 0) {
                                const t2 = o.getResponseJson().error;
                                if (t2 && t2.status && t2.message) {
                                    const e3 = function(t3) {
                                        const e4 = t3.toLowerCase().replace(/_/g, "-");
                                        return Object.values(K1).indexOf(e4) >= 0 ? e4 : K1.UNKNOWN;
                                    }(t2.status);
                                    r(new Q1(e3, t2.message));
                                } else r(new Q1(K1.UNKNOWN, "Server responded with status " + o.getStatus()));
                            } else r(new Q1(K1.UNAVAILABLE, "Connection failed."));
                            break;
                        default:
                            L1();
                    }
                } finally{
                    O1("Connection", 'RPC "' + t775 + '" completed.');
                }
            });
            const u = JSON.stringify(s);
            o.send(e, "POST", u, n, 15);
        });
    }
    ho(t776, e, n) {
        const s = [
            this.so,
            "/",
            "google.firestore.v1.Firestore",
            "/",
            t776,
            "/channel"
        ], i = createWebChannelTransport(), r = getStatEventTarget(), o = {
            httpSessionIdParam: "gsessionid",
            initMessageHeaders: {},
            messageUrlParams: {
                database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`
            },
            sendRawJson: true,
            supportsCrossDomainXhr: true,
            internalChannelParams: {
                forwardChannelRequestTimeoutMs: 600000
            },
            forceLongPolling: this.forceLongPolling,
            detectBufferingProxy: this.autoDetectLongPolling
        };
        this.useFetchStreams && (o.xmlHttpFactory = new FetchXmlHttpFactory({})), this.uo(o.initMessageHeaders, e, n), isMobileCordova() || isReactNative() || isElectron() || isIE() || isUWP() || isBrowserExtension() || (o.httpHeadersOverwriteParam = "$httpHeaders");
        const u = s.join("");
        O1("Connection", "Creating WebChannel: " + u, o);
        const a = i.createWebChannel(u, o);
        let c = false, h = false;
        const l3 = new Bo({
            jr: (t2)=>{
                h ? O1("Connection", "Not sending because WebChannel is closed:", t2) : (c || (O1("Connection", "Opening WebChannel transport."), a.open(), c = true), O1("Connection", "WebChannel sending:", t2), a.send(t2));
            },
            Wr: ()=>a.close()
        }), y1 = (t2, e2, n2)=>{
            t2.listen(e2, (t3)=>{
                try {
                    n2(t3);
                } catch (t4) {
                    setTimeout(()=>{
                        throw t4;
                    }, 0);
                }
            });
        };
        return y1(a, WebChannel.EventType.OPEN, ()=>{
            h || O1("Connection", "WebChannel transport opened.");
        }), y1(a, WebChannel.EventType.CLOSE, ()=>{
            h || (h = true, O1("Connection", "WebChannel transport closed"), l3.eo());
        }), y1(a, WebChannel.EventType.ERROR, (t2)=>{
            h || (h = true, $("Connection", "WebChannel transport errored:", t2), l3.eo(new Q1(K1.UNAVAILABLE, "The operation could not be completed")));
        }), y1(a, WebChannel.EventType.MESSAGE, (t2)=>{
            var e2;
            if (!h) {
                const n2 = t2.data[0];
                U1(!!n2);
                const s2 = n2, i2 = s2.error || ((e2 = s2[0]) === null || e2 === void 0 ? void 0 : e2.error);
                if (i2) {
                    O1("Connection", "WebChannel received error:", i2);
                    const t3 = i2.status;
                    let e3 = function(t4) {
                        const e4 = Dn[t4];
                        if (e4 !== void 0) return Nn(e4);
                    }(t3), n3 = i2.message;
                    e3 === void 0 && (e3 = K1.INTERNAL, n3 = "Unknown error status: " + t3 + " with message " + i2.message), h = true, l3.eo(new Q1(e3, n3)), a.close();
                } else O1("Connection", "WebChannel received:", n2), l3.no(n2);
            }
        }), y1(r, Event.STAT_EVENT, (t2)=>{
            t2.stat === Stat.PROXY ? O1("Connection", "Detected buffering proxy") : t2.stat === Stat.NOPROXY && O1("Connection", "Detected no buffering proxy");
        }), setTimeout(()=>{
            l3.Zr();
        }, 0), l3;
    }
}
function qo() {
    return typeof document != "undefined" ? document : null;
}
function Go(t782) {
    return new as(t782, true);
}
class Ko {
    constructor(t783, e, n = 1000, s = 1.5, i = 60000){
        this.Jn = t783, this.timerId = e, this.lo = n, this.fo = s, this._o = i, this.wo = 0, this.mo = null, this.yo = Date.now(), this.reset();
    }
    reset() {
        this.wo = 0;
    }
    po() {
        this.wo = this._o;
    }
    Io(t784) {
        this.cancel();
        const e = Math.floor(this.wo + this.To()), n = Math.max(0, Date.now() - this.yo), s = Math.max(0, e - n);
        s > 0 && O1("ExponentialBackoff", `Backing off for ${s} ms (base delay: ${this.wo} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`), this.mo = this.Jn.enqueueAfterDelay(this.timerId, s, ()=>(this.yo = Date.now(), t784())
        ), this.wo *= this.fo, this.wo < this.lo && (this.wo = this.lo), this.wo > this._o && (this.wo = this._o);
    }
    Eo() {
        this.mo !== null && (this.mo.skipDelay(), this.mo = null);
    }
    cancel() {
        this.mo !== null && (this.mo.cancel(), this.mo = null);
    }
    To() {
        return (Math.random() - 0.5) * this.wo;
    }
}
class Qo {
    constructor(t785, e, n, s, i, r, o, u){
        this.Jn = t785, this.Ao = n, this.Ro = s, this.bo = i, this.authCredentialsProvider = r, this.appCheckCredentialsProvider = o, this.listener = u, this.state = 0, this.Po = 0, this.Vo = null, this.vo = null, this.stream = null, this.So = new Ko(t785, e);
    }
    Do() {
        return this.state === 1 || this.state === 5 || this.Co();
    }
    Co() {
        return this.state === 2 || this.state === 3;
    }
    start() {
        this.state !== 4 ? this.auth() : this.xo();
    }
    async stop() {
        this.Do() && await this.close(0);
    }
    No() {
        this.state = 0, this.So.reset();
    }
    ko() {
        this.Co() && this.Vo === null && (this.Vo = this.Jn.enqueueAfterDelay(this.Ao, 60000, ()=>this.Mo()
        ));
    }
    Oo(t786) {
        this.Fo(), this.stream.send(t786);
    }
    async Mo() {
        if (this.Co()) return this.close(0);
    }
    Fo() {
        this.Vo && (this.Vo.cancel(), this.Vo = null);
    }
    $o() {
        this.vo && (this.vo.cancel(), this.vo = null);
    }
    async close(t787, e) {
        this.Fo(), this.$o(), this.So.cancel(), this.Po++, t787 !== 4 ? this.So.reset() : e && e.code === K1.RESOURCE_EXHAUSTED ? (F1(e.toString()), F1("Using maximum backoff delay to prevent overloading the backend."), this.So.po()) : e && e.code === K1.UNAUTHENTICATED && this.state !== 3 && (this.authCredentialsProvider.invalidateToken(), this.appCheckCredentialsProvider.invalidateToken()), this.stream !== null && (this.Bo(), this.stream.close(), this.stream = null), this.state = t787, await this.listener.Jr(e);
    }
    Bo() {}
    auth() {
        this.state = 1;
        const t788 = this.Lo(this.Po), e = this.Po;
        Promise.all([
            this.authCredentialsProvider.getToken(),
            this.appCheckCredentialsProvider.getToken()
        ]).then(([t2, n])=>{
            this.Po === e && this.Uo(t2, n);
        }, (e2)=>{
            t788(()=>{
                const t2 = new Q1(K1.UNKNOWN, "Fetching auth token failed: " + e2.message);
                return this.qo(t2);
            });
        });
    }
    Uo(t789, e) {
        const n = this.Lo(this.Po);
        this.stream = this.Go(t789, e), this.stream.zr(()=>{
            n(()=>(this.state = 2, this.vo = this.Jn.enqueueAfterDelay(this.Ro, 10000, ()=>(this.Co() && (this.state = 3), Promise.resolve())
                ), this.listener.zr())
            );
        }), this.stream.Jr((t2)=>{
            n(()=>this.qo(t2)
            );
        }), this.stream.onMessage((t2)=>{
            n(()=>this.onMessage(t2)
            );
        });
    }
    xo() {
        this.state = 5, this.So.Io(async ()=>{
            this.state = 0, this.start();
        });
    }
    qo(t790) {
        return O1("PersistentStream", `close with error: ${t790}`), this.stream = null, this.close(4, t790);
    }
    Lo(t791) {
        return (e)=>{
            this.Jn.enqueueAndForget(()=>this.Po === t791 ? e() : (O1("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve())
            );
        };
    }
}
class jo extends Qo {
    constructor(t792, e, n, s, i, r){
        super(t792, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", e, n, s, r), this.M = i;
    }
    Go(t793, e) {
        return this.bo.ho("Listen", t793, e);
    }
    onMessage(t794) {
        this.So.reset();
        const e = Rs(this.M, t794), n = function(t2) {
            if (!("targetChange" in t2)) return ct.min();
            const e2 = t2.targetChange;
            return e2.targetIds && e2.targetIds.length ? ct.min() : e2.readTime ? fs(e2.readTime) : ct.min();
        }(t794);
        return this.listener.Ko(e, n);
    }
    Qo(t795) {
        const e = {};
        e.database = ps(this.M), e.addTarget = (function(t2, e2) {
            let n2;
            const s = e2.target;
            return n2 = we(s) ? {
                documents: vs(t2, s)
            } : {
                query: Ss(t2, s)
            }, n2.targetId = e2.targetId, e2.resumeToken.approximateByteSize() > 0 ? n2.resumeToken = hs(t2, e2.resumeToken) : e2.snapshotVersion.compareTo(ct.min()) > 0 && (n2.readTime = cs(t2, e2.snapshotVersion.toTimestamp())), n2;
        })(this.M, t795);
        const n = Cs(this.M, t795);
        n && (e.labels = n), this.Oo(e);
    }
    jo(t796) {
        const e = {};
        e.database = ps(this.M), e.removeTarget = t796, this.Oo(e);
    }
}
class Wo extends Qo {
    constructor(t797, e, n, s, i, r){
        super(t797, "write_stream_connection_backoff", "write_stream_idle", "health_check_timeout", e, n, s, r), this.M = i, this.Wo = false;
    }
    get zo() {
        return this.Wo;
    }
    start() {
        this.Wo = false, this.lastStreamToken = void 0, super.start();
    }
    Bo() {
        this.Wo && this.Ho([]);
    }
    Go(t798, e) {
        return this.bo.ho("Write", t798, e);
    }
    onMessage(t799) {
        if (U1(!!t799.streamToken), this.lastStreamToken = t799.streamToken, this.Wo) {
            this.So.reset();
            const e = Vs(t799.writeResults, t799.commitTime), n = fs(t799.commitTime);
            return this.listener.Jo(n, e);
        }
        return U1(!t799.writeResults || t799.writeResults.length === 0), this.Wo = true, this.listener.Yo();
    }
    Xo() {
        const t800 = {};
        t800.database = ps(this.M), this.Oo(t800);
    }
    Ho(t801) {
        const e = {
            streamToken: this.lastStreamToken,
            writes: t801.map((t2)=>bs(this.M, t2)
            )
        };
        this.Oo(e);
    }
}
class zo extends class {
} {
    constructor(t802, e, n, s){
        super(), this.authCredentials = t802, this.appCheckCredentials = e, this.bo = n, this.M = s, this.Zo = false;
    }
    tu() {
        if (this.Zo) throw new Q1(K1.FAILED_PRECONDITION, "The client has already been terminated.");
    }
    ro(t803, e, n) {
        return this.tu(), Promise.all([
            this.authCredentials.getToken(),
            this.appCheckCredentials.getToken()
        ]).then(([s, i])=>this.bo.ro(t803, e, n, s, i)
        ).catch((t2)=>{
            throw t2.name === "FirebaseError" ? (t2.code === K1.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), t2) : new Q1(K1.UNKNOWN, t2.toString());
        });
    }
    co(t804, e, n) {
        return this.tu(), Promise.all([
            this.authCredentials.getToken(),
            this.appCheckCredentials.getToken()
        ]).then(([s, i])=>this.bo.co(t804, e, n, s, i)
        ).catch((t2)=>{
            throw t2.name === "FirebaseError" ? (t2.code === K1.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), t2) : new Q1(K1.UNKNOWN, t2.toString());
        });
    }
    terminate() {
        this.Zo = true;
    }
}
class Ho {
    constructor(t805, e){
        this.asyncQueue = t805, this.onlineStateHandler = e, this.state = "Unknown", this.eu = 0, this.nu = null, this.su = true;
    }
    iu() {
        this.eu === 0 && (this.ru("Unknown"), this.nu = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 10000, ()=>(this.nu = null, this.ou("Backend didn't respond within 10 seconds."), this.ru("Offline"), Promise.resolve())
        ));
    }
    uu(t806) {
        this.state === "Online" ? this.ru("Unknown") : (this.eu++, this.eu >= 1 && (this.au(), this.ou(`Connection failed 1 times. Most recent error: ${t806.toString()}`), this.ru("Offline")));
    }
    set(t807) {
        this.au(), this.eu = 0, t807 === "Online" && (this.su = false), this.ru(t807);
    }
    ru(t808) {
        t808 !== this.state && (this.state = t808, this.onlineStateHandler(t808));
    }
    ou(t809) {
        const e = `Could not reach Cloud Firestore backend. ${t809}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
        this.su ? (F1(e), this.su = false) : O1("OnlineStateTracker", e);
    }
    au() {
        this.nu !== null && (this.nu.cancel(), this.nu = null);
    }
}
class Jo {
    constructor(t810, e, n, s, i){
        this.localStore = t810, this.datastore = e, this.asyncQueue = n, this.remoteSyncer = {}, this.cu = [], this.hu = new Map(), this.lu = new Set(), this.fu = [], this.du = i, this.du.Br((t2)=>{
            n.enqueueAndForget(async ()=>{
                ru(this) && (O1("RemoteStore", "Restarting streams for network reachability change."), await async function(t3) {
                    const e2 = G(t3);
                    e2.lu.add(4), await Xo(e2), e2._u.set("Unknown"), e2.lu.delete(4), await Yo(e2);
                }(this));
            });
        }), this._u = new Ho(n, s);
    }
}
async function Yo(t811) {
    if (ru(t811)) for (const e of t811.fu)await e(true);
}
async function Xo(t812) {
    for (const e of t812.fu)await e(false);
}
function Zo(t813, e) {
    const n = G(t813);
    n.hu.has(e.targetId) || (n.hu.set(e.targetId, e), iu(n) ? su(n) : Au(n).Co() && eu(n, e));
}
function tu(t814, e) {
    const n = G(t814), s = Au(n);
    n.hu.delete(e), s.Co() && nu(n, e), n.hu.size === 0 && (s.Co() ? s.ko() : ru(n) && n._u.set("Unknown"));
}
function eu(t815, e) {
    t815.wu.Z(e.targetId), Au(t815).Qo(e);
}
function nu(t816, e) {
    t816.wu.Z(e), Au(t816).jo(e);
}
function su(t817) {
    t817.wu = new ss({
        getRemoteKeysForTarget: (e)=>t817.remoteSyncer.getRemoteKeysForTarget(e)
        ,
        Et: (e)=>t817.hu.get(e) || null
    }), Au(t817).start(), t817._u.iu();
}
function iu(t818) {
    return ru(t818) && !Au(t818).Do() && t818.hu.size > 0;
}
function ru(t819) {
    return G(t819).lu.size === 0;
}
function ou(t820) {
    t820.wu = void 0;
}
async function uu(t821) {
    t821.hu.forEach((e, n)=>{
        eu(t821, e);
    });
}
async function au(t822, e) {
    ou(t822), iu(t822) ? (t822._u.uu(e), su(t822)) : t822._u.set("Unknown");
}
async function cu(t823, e, n) {
    if (t823._u.set("Online"), e instanceof es && e.state === 2 && e.cause) try {
        await async function(t2, e2) {
            const n2 = e2.cause;
            for (const s of e2.targetIds)t2.hu.has(s) && (await t2.remoteSyncer.rejectListen(s, n2), t2.hu.delete(s), t2.wu.removeTarget(s));
        }(t823, e);
    } catch (n21) {
        O1("RemoteStore", "Failed to remove targets %s: %s ", e.targetIds.join(","), n21), await hu(t823, n21);
    }
    else if (e instanceof Zn ? t823.wu.ut(e) : e instanceof ts ? t823.wu._t(e) : t823.wu.ht(e), !n.isEqual(ct.min())) try {
        const e2 = await no(t823.localStore);
        n.compareTo(e2) >= 0 && await function(t2, e3) {
            const n2 = t2.wu.yt(e3);
            return n2.targetChanges.forEach((n3, s)=>{
                if (n3.resumeToken.approximateByteSize() > 0) {
                    const i = t2.hu.get(s);
                    i && t2.hu.set(s, i.withResumeToken(n3.resumeToken, e3));
                }
            }), n2.targetMismatches.forEach((e4)=>{
                const n3 = t2.hu.get(e4);
                if (!n3) return;
                t2.hu.set(e4, n3.withResumeToken(pt.EMPTY_BYTE_STRING, n3.snapshotVersion)), nu(t2, e4);
                const s = new Di(n3.target, e4, 1, n3.sequenceNumber);
                eu(t2, s);
            }), t2.remoteSyncer.applyRemoteEvent(n2);
        }(t823, n);
    } catch (e2) {
        O1("RemoteStore", "Failed to raise snapshot:", e2), await hu(t823, e2);
    }
}
async function hu(t824, e, n) {
    if (!Ii(e)) throw e;
    t824.lu.add(1), await Xo(t824), t824._u.set("Offline"), n || (n = ()=>no(t824.localStore)
    ), t824.asyncQueue.enqueueRetryable(async ()=>{
        O1("RemoteStore", "Retrying IndexedDB access"), await n(), t824.lu.delete(1), await Yo(t824);
    });
}
function lu(t825, e) {
    return e().catch((n)=>hu(t825, n, e)
    );
}
async function fu(t826) {
    const e = G(t826), n = Ru(e);
    let s = e.cu.length > 0 ? e.cu[e.cu.length - 1].batchId : -1;
    for(; du(e);)try {
        const t2 = await ro(e.localStore, s);
        if (t2 === null) {
            e.cu.length === 0 && n.ko();
            break;
        }
        s = t2.batchId, _u(e, t2);
    } catch (t2) {
        await hu(e, t2);
    }
    wu(e) && mu(e);
}
function du(t827) {
    return ru(t827) && t827.cu.length < 10;
}
function _u(t828, e) {
    t828.cu.push(e);
    const n = Ru(t828);
    n.Co() && n.zo && n.Ho(e.mutations);
}
function wu(t829) {
    return ru(t829) && !Ru(t829).Do() && t829.cu.length > 0;
}
function mu(t830) {
    Ru(t830).start();
}
async function gu(t831) {
    Ru(t831).Xo();
}
async function yu(t832) {
    const e = Ru(t832);
    for (const n of t832.cu)e.Ho(n.mutations);
}
async function pu(t833, e, n) {
    const s = t833.cu.shift(), i = vi.from(s, e, n);
    await lu(t833, ()=>t833.remoteSyncer.applySuccessfulWrite(i)
    ), await fu(t833);
}
async function Iu(t834, e) {
    e && Ru(t834).zo && await async function(t2, e2) {
        if (n = e2.code, xn(n) && n !== K1.ABORTED) {
            const n2 = t2.cu.shift();
            Ru(t2).No(), await lu(t2, ()=>t2.remoteSyncer.rejectFailedWrite(n2.batchId, e2)
            ), await fu(t2);
        }
        var n;
    }(t834, e), wu(t834) && mu(t834);
}
async function Tu(t835, e) {
    const n = G(t835);
    n.asyncQueue.verifyOperationInProgress(), O1("RemoteStore", "RemoteStore received new credentials");
    const s = ru(n);
    n.lu.add(3), await Xo(n), s && n._u.set("Unknown"), await n.remoteSyncer.handleCredentialChange(e), n.lu.delete(3), await Yo(n);
}
async function Eu(t836, e) {
    const n = G(t836);
    e ? (n.lu.delete(2), await Yo(n)) : e || (n.lu.add(2), await Xo(n), n._u.set("Unknown"));
}
function Au(t837) {
    return t837.mu || (t837.mu = (function(t2, e, n) {
        const s = G(t2);
        return s.tu(), new jo(e, s.bo, s.authCredentials, s.appCheckCredentials, s.M, n);
    })(t837.datastore, t837.asyncQueue, {
        zr: uu.bind(null, t837),
        Jr: au.bind(null, t837),
        Ko: cu.bind(null, t837)
    }), t837.fu.push(async (e)=>{
        e ? (t837.mu.No(), iu(t837) ? su(t837) : t837._u.set("Unknown")) : (await t837.mu.stop(), ou(t837));
    })), t837.mu;
}
function Ru(t838) {
    return t838.gu || (t838.gu = (function(t2, e, n) {
        const s = G(t2);
        return s.tu(), new Wo(e, s.bo, s.authCredentials, s.appCheckCredentials, s.M, n);
    })(t838.datastore, t838.asyncQueue, {
        zr: gu.bind(null, t838),
        Jr: Iu.bind(null, t838),
        Yo: yu.bind(null, t838),
        Jo: pu.bind(null, t838)
    }), t838.fu.push(async (e)=>{
        e ? (t838.gu.No(), await fu(t838)) : (await t838.gu.stop(), t838.cu.length > 0 && (O1("RemoteStore", `Stopping write stream with ${t838.cu.length} pending writes`), t838.cu = []));
    })), t838.gu;
}
class bu {
    constructor(t839, e, n, s, i){
        this.asyncQueue = t839, this.timerId = e, this.targetTimeMs = n, this.op = s, this.removalCallback = i, this.deferred = new j(), this.then = this.deferred.promise.then.bind(this.deferred.promise), this.deferred.promise.catch((t2)=>{});
    }
    static createAndSchedule(t840, e, n, s, i) {
        const r = Date.now() + n, o = new bu(t840, e, r, s, i);
        return o.start(n), o;
    }
    start(t841) {
        this.timerHandle = setTimeout(()=>this.handleDelayElapsed()
        , t841);
    }
    skipDelay() {
        return this.handleDelayElapsed();
    }
    cancel(t842) {
        this.timerHandle !== null && (this.clearTimeout(), this.deferred.reject(new Q1(K1.CANCELLED, "Operation cancelled" + (t842 ? ": " + t842 : ""))));
    }
    handleDelayElapsed() {
        this.asyncQueue.enqueueAndForget(()=>this.timerHandle !== null ? (this.clearTimeout(), this.op().then((t843)=>this.deferred.resolve(t843)
            )) : Promise.resolve()
        );
    }
    clearTimeout() {
        this.timerHandle !== null && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
    }
}
function Pu(t844, e) {
    if (F1("AsyncQueue", `${e}: ${t844}`), Ii(t844)) return new Q1(K1.UNAVAILABLE, `${e}: ${t844}`);
    throw t844;
}
class Vu {
    constructor(t845){
        this.comparator = t845 ? (e, n)=>t845(e, n) || xt.comparator(e.key, n.key)
         : (t2, e)=>xt.comparator(t2.key, e.key)
        , this.keyedMap = Kn(), this.sortedSet = new Mn(this.comparator);
    }
    static emptySet(t846) {
        return new Vu(t846.comparator);
    }
    has(t847) {
        return this.keyedMap.get(t847) != null;
    }
    get(t848) {
        return this.keyedMap.get(t848);
    }
    first() {
        return this.sortedSet.minKey();
    }
    last() {
        return this.sortedSet.maxKey();
    }
    isEmpty() {
        return this.sortedSet.isEmpty();
    }
    indexOf(t849) {
        const e = this.keyedMap.get(t849);
        return e ? this.sortedSet.indexOf(e) : -1;
    }
    get size() {
        return this.sortedSet.size;
    }
    forEach(t850) {
        this.sortedSet.inorderTraversal((e, n)=>(t850(e), false)
        );
    }
    add(t851) {
        const e = this.delete(t851.key);
        return e.copy(e.keyedMap.insert(t851.key, t851), e.sortedSet.insert(t851, null));
    }
    delete(t852) {
        const e = this.get(t852);
        return e ? this.copy(this.keyedMap.remove(t852), this.sortedSet.remove(e)) : this;
    }
    isEqual(t853) {
        if (!(t853 instanceof Vu)) return false;
        if (this.size !== t853.size) return false;
        const e = this.sortedSet.getIterator(), n = t853.sortedSet.getIterator();
        for(; e.hasNext();){
            const t2 = e.getNext().key, s = n.getNext().key;
            if (!t2.isEqual(s)) return false;
        }
        return true;
    }
    toString() {
        const t854 = [];
        return this.forEach((e)=>{
            t854.push(e.toString());
        }), t854.length === 0 ? "DocumentSet ()" : "DocumentSet (\n  " + t854.join("  \n") + "\n)";
    }
    copy(t855, e) {
        const n = new Vu();
        return n.comparator = this.comparator, n.keyedMap = t855, n.sortedSet = e, n;
    }
}
class vu {
    constructor(){
        this.yu = new Mn(xt.comparator);
    }
    track(t856) {
        const e = t856.doc.key, n = this.yu.get(e);
        n ? t856.type !== 0 && n.type === 3 ? this.yu = this.yu.insert(e, t856) : t856.type === 3 && n.type !== 1 ? this.yu = this.yu.insert(e, {
            type: n.type,
            doc: t856.doc
        }) : t856.type === 2 && n.type === 2 ? this.yu = this.yu.insert(e, {
            type: 2,
            doc: t856.doc
        }) : t856.type === 2 && n.type === 0 ? this.yu = this.yu.insert(e, {
            type: 0,
            doc: t856.doc
        }) : t856.type === 1 && n.type === 0 ? this.yu = this.yu.remove(e) : t856.type === 1 && n.type === 2 ? this.yu = this.yu.insert(e, {
            type: 1,
            doc: n.doc
        }) : t856.type === 0 && n.type === 1 ? this.yu = this.yu.insert(e, {
            type: 2,
            doc: t856.doc
        }) : L1() : this.yu = this.yu.insert(e, t856);
    }
    pu() {
        const t857 = [];
        return this.yu.inorderTraversal((e, n)=>{
            t857.push(n);
        }), t857;
    }
}
class Su {
    constructor(t858, e, n, s, i, r, o, u){
        this.query = t858, this.docs = e, this.oldDocs = n, this.docChanges = s, this.mutatedKeys = i, this.fromCache = r, this.syncStateChanged = o, this.excludesMetadataChanges = u;
    }
    static fromInitialDocuments(t859, e, n, s) {
        const i = [];
        return e.forEach((t2)=>{
            i.push({
                type: 0,
                doc: t2
            });
        }), new Su(t859, e, Vu.emptySet(e), i, n, s, true, false);
    }
    get hasPendingWrites() {
        return !this.mutatedKeys.isEmpty();
    }
    isEqual(t860) {
        if (!(this.fromCache === t860.fromCache && this.syncStateChanged === t860.syncStateChanged && this.mutatedKeys.isEqual(t860.mutatedKeys) && qe(this.query, t860.query) && this.docs.isEqual(t860.docs) && this.oldDocs.isEqual(t860.oldDocs))) return false;
        const e = this.docChanges, n = t860.docChanges;
        if (e.length !== n.length) return false;
        for(let t2 = 0; t2 < e.length; t2++)if (e[t2].type !== n[t2].type || !e[t2].doc.isEqual(n[t2].doc)) return false;
        return true;
    }
}
class Du {
    constructor(){
        this.Iu = void 0, this.listeners = [];
    }
}
class Cu {
    constructor(){
        this.queries = new kn((t861)=>Ge(t861)
        , qe), this.onlineState = "Unknown", this.Tu = new Set();
    }
}
async function xu(t862, e) {
    const n = G(t862), s = e.query;
    let i = false, r = n.queries.get(s);
    if (r || (i = true, r = new Du()), i) try {
        r.Iu = await n.onListen(s);
    } catch (t2) {
        const n2 = Pu(t2, `Initialization of query '${Ke(e.query)}' failed`);
        return void e.onError(n2);
    }
    if (n.queries.set(s, r), r.listeners.push(e), e.Eu(n.onlineState), r.Iu) {
        e.Au(r.Iu) && Ou(n);
    }
}
async function Nu(t863, e) {
    const n = G(t863), s = e.query;
    let i = false;
    const r = n.queries.get(s);
    if (r) {
        const t2 = r.listeners.indexOf(e);
        t2 >= 0 && (r.listeners.splice(t2, 1), i = r.listeners.length === 0);
    }
    if (i) return n.queries.delete(s), n.onUnlisten(s);
}
function ku(t864, e) {
    const n = G(t864);
    let s = false;
    for (const t2 of e){
        const e2 = t2.query, i = n.queries.get(e2);
        if (i) {
            for (const e3 of i.listeners)e3.Au(t2) && (s = true);
            i.Iu = t2;
        }
    }
    s && Ou(n);
}
function Mu(t865, e, n) {
    const s = G(t865), i = s.queries.get(e);
    if (i) for (const t2 of i.listeners)t2.onError(n);
    s.queries.delete(e);
}
function Ou(t866) {
    t866.Tu.forEach((t2)=>{
        t2.next();
    });
}
class Fu {
    constructor(t867, e, n){
        this.query = t867, this.Ru = e, this.bu = false, this.Pu = null, this.onlineState = "Unknown", this.options = n || {};
    }
    Au(t868) {
        if (!this.options.includeMetadataChanges) {
            const e2 = [];
            for (const n of t868.docChanges)n.type !== 3 && e2.push(n);
            t868 = new Su(t868.query, t868.docs, t868.oldDocs, e2, t868.mutatedKeys, t868.fromCache, t868.syncStateChanged, true);
        }
        let e = false;
        return this.bu ? this.Vu(t868) && (this.Ru.next(t868), e = true) : this.vu(t868, this.onlineState) && (this.Su(t868), e = true), this.Pu = t868, e;
    }
    onError(t869) {
        this.Ru.error(t869);
    }
    Eu(t870) {
        this.onlineState = t870;
        let e = false;
        return this.Pu && !this.bu && this.vu(this.Pu, t870) && (this.Su(this.Pu), e = true), e;
    }
    vu(t871, e) {
        if (!t871.fromCache) return true;
        const n = e !== "Offline";
        return (!this.options.Du || !n) && (!t871.docs.isEmpty() || e === "Offline");
    }
    Vu(t872) {
        if (t872.docChanges.length > 0) return true;
        const e = this.Pu && this.Pu.hasPendingWrites !== t872.hasPendingWrites;
        return !(!t872.syncStateChanged && !e) && this.options.includeMetadataChanges === true;
    }
    Su(t873) {
        t873 = Su.fromInitialDocuments(t873.query, t873.docs, t873.mutatedKeys, t873.fromCache), this.bu = true, this.Ru.next(t873);
    }
}
class qu {
    constructor(t874){
        this.key = t874;
    }
}
class Gu {
    constructor(t875){
        this.key = t875;
    }
}
class Ku {
    constructor(t876, e){
        this.query = t876, this.Fu = e, this.$u = null, this.current = false, this.Bu = zn(), this.mutatedKeys = zn(), this.Lu = We(t876), this.Uu = new Vu(this.Lu);
    }
    get qu() {
        return this.Fu;
    }
    Gu(t877, e) {
        const n = e ? e.Ku : new vu(), s = e ? e.Uu : this.Uu;
        let i = e ? e.mutatedKeys : this.mutatedKeys, r = s, o = false;
        const u = ke(this.query) && s.size === this.query.limit ? s.last() : null, a = Me(this.query) && s.size === this.query.limit ? s.first() : null;
        if (t877.inorderTraversal((t2, e2)=>{
            const c = s.get(t2), h = Qe(this.query, e2) ? e2 : null, l4 = !!c && this.mutatedKeys.has(c.key), f = !!h && (h.hasLocalMutations || this.mutatedKeys.has(h.key) && h.hasCommittedMutations);
            let d = false;
            if (c && h) {
                c.data.isEqual(h.data) ? l4 !== f && (n.track({
                    type: 3,
                    doc: h
                }), d = true) : this.Qu(c, h) || (n.track({
                    type: 2,
                    doc: h
                }), d = true, (u && this.Lu(h, u) > 0 || a && this.Lu(h, a) < 0) && (o = true));
            } else !c && h ? (n.track({
                type: 0,
                doc: h
            }), d = true) : c && !h && (n.track({
                type: 1,
                doc: c
            }), d = true, (u || a) && (o = true));
            d && (h ? (r = r.add(h), i = f ? i.add(t2) : i.delete(t2)) : (r = r.delete(t2), i = i.delete(t2)));
        }), ke(this.query) || Me(this.query)) for(; r.size > this.query.limit;){
            const t2 = ke(this.query) ? r.last() : r.first();
            r = r.delete(t2.key), i = i.delete(t2.key), n.track({
                type: 1,
                doc: t2
            });
        }
        return {
            Uu: r,
            Ku: n,
            ei: o,
            mutatedKeys: i
        };
    }
    Qu(t878, e) {
        return t878.hasLocalMutations && e.hasCommittedMutations && !e.hasLocalMutations;
    }
    applyChanges(t879, e, n) {
        const s = this.Uu;
        this.Uu = t879.Uu, this.mutatedKeys = t879.mutatedKeys;
        const i = t879.Ku.pu();
        i.sort((t2, e2)=>(function(t3, e3) {
                const n2 = (t4)=>{
                    switch(t4){
                        case 0:
                            return 1;
                        case 2:
                        case 3:
                            return 2;
                        case 1:
                            return 0;
                        default:
                            return L1();
                    }
                };
                return n2(t3) - n2(e3);
            })(t2.type, e2.type) || this.Lu(t2.doc, e2.doc)
        ), this.ju(n);
        const r = e ? this.Wu() : [], o = this.Bu.size === 0 && this.current ? 1 : 0, u = o !== this.$u;
        if (this.$u = o, i.length !== 0 || u) {
            return {
                snapshot: new Su(this.query, t879.Uu, s, i, t879.mutatedKeys, o === 0, u, false),
                zu: r
            };
        }
        return {
            zu: r
        };
    }
    Eu(t880) {
        return this.current && t880 === "Offline" ? (this.current = false, this.applyChanges({
            Uu: this.Uu,
            Ku: new vu(),
            mutatedKeys: this.mutatedKeys,
            ei: false
        }, false)) : {
            zu: []
        };
    }
    Hu(t881) {
        return !this.Fu.has(t881) && !!this.Uu.has(t881) && !this.Uu.get(t881).hasLocalMutations;
    }
    ju(t882) {
        t882 && (t882.addedDocuments.forEach((t2)=>this.Fu = this.Fu.add(t2)
        ), t882.modifiedDocuments.forEach((t2)=>{}), t882.removedDocuments.forEach((t2)=>this.Fu = this.Fu.delete(t2)
        ), this.current = t882.current);
    }
    Wu() {
        if (!this.current) return [];
        const t883 = this.Bu;
        this.Bu = zn(), this.Uu.forEach((t2)=>{
            this.Hu(t2.key) && (this.Bu = this.Bu.add(t2.key));
        });
        const e = [];
        return t883.forEach((t2)=>{
            this.Bu.has(t2) || e.push(new Gu(t2));
        }), this.Bu.forEach((n)=>{
            t883.has(n) || e.push(new qu(n));
        }), e;
    }
    Ju(t884) {
        this.Fu = t884.hi, this.Bu = zn();
        const e = this.Gu(t884.documents);
        return this.applyChanges(e, true);
    }
    Yu() {
        return Su.fromInitialDocuments(this.query, this.Uu, this.mutatedKeys, this.$u === 0);
    }
}
class Qu {
    constructor(t885, e, n){
        this.query = t885, this.targetId = e, this.view = n;
    }
}
class ju {
    constructor(t886){
        this.key = t886, this.Xu = false;
    }
}
class Wu {
    constructor(t887, e, n, s, i, r){
        this.localStore = t887, this.remoteStore = e, this.eventManager = n, this.sharedClientState = s, this.currentUser = i, this.maxConcurrentLimboResolutions = r, this.Zu = {}, this.ta = new kn((t2)=>Ge(t2)
        , qe), this.ea = new Map(), this.na = new Set(), this.sa = new Mn(xt.comparator), this.ia = new Map(), this.ra = new go(), this.oa = {}, this.ua = new Map(), this.aa = Er.gn(), this.onlineState = "Unknown", this.ca = void 0;
    }
    get isPrimaryClient() {
        return this.ca === true;
    }
}
async function zu(t888, e) {
    const n = Aa1(t888);
    let s, i;
    const r = n.ta.get(e);
    if (r) s = r.targetId, n.sharedClientState.addLocalQueryTarget(s), i = r.view.Yu();
    else {
        const t2 = await oo(n.localStore, Le(e));
        n.isPrimaryClient && Zo(n.remoteStore, t2);
        const r2 = n.sharedClientState.addLocalQueryTarget(t2.targetId);
        s = t2.targetId, i = await Hu(n, e, s, r2 === "current");
    }
    return i;
}
async function Hu(t889, e, n, s) {
    t889.ha = (e2, n2, s2)=>(async function(t2, e3, n3, s3) {
            let i2 = e3.view.Gu(n3);
            i2.ei && (i2 = await ao(t2.localStore, e3.query, false).then(({ documents: t3  })=>e3.view.Gu(t3, i2)
            ));
            const r2 = s3 && s3.targetChanges.get(e3.targetId), o2 = e3.view.applyChanges(i2, t2.isPrimaryClient, r2);
            return aa1(t2, e3.targetId, o2.zu), o2.snapshot;
        })(t889, e2, n2, s2)
    ;
    const i = await ao(t889.localStore, e, true), r = new Ku(e, i.hi), o = r.Gu(i.documents), u = Xn.createSynthesizedTargetChangeForCurrentChange(n, s && t889.onlineState !== "Offline"), a = r.applyChanges(o, t889.isPrimaryClient, u);
    aa1(t889, n, a.zu);
    const c = new Qu(e, n, r);
    return t889.ta.set(e, c), t889.ea.has(n) ? t889.ea.get(n).push(e) : t889.ea.set(n, [
        e
    ]), a.snapshot;
}
async function Ju(t890, e) {
    const n = G(t890), s = n.ta.get(e), i = n.ea.get(s.targetId);
    if (i.length > 1) return n.ea.set(s.targetId, i.filter((t2)=>!qe(t2, e)
    )), void n.ta.delete(e);
    if (n.isPrimaryClient) {
        n.sharedClientState.removeLocalQueryTarget(s.targetId);
        n.sharedClientState.isActiveQueryTarget(s.targetId) || await uo(n.localStore, s.targetId, false).then(()=>{
            n.sharedClientState.clearQueryState(s.targetId), tu(n.remoteStore, s.targetId), oa1(n, s.targetId);
        }).catch(Vr);
    } else oa1(n, s.targetId), await uo(n.localStore, s.targetId, true);
}
async function Yu(t891, e, n) {
    const s = Ra1(t891);
    try {
        const t2 = await function(t3, e2) {
            const n2 = G(t3), s2 = at.now(), i = e2.reduce((t4, e3)=>t4.add(e3.key)
            , zn());
            let r;
            return n2.persistence.runTransaction("Locally write mutations", "readwrite", (t4)=>n2.ai.qs(t4, i).next((i2)=>{
                    r = i2;
                    const o = [];
                    for (const t5 of e2){
                        const e3 = pn(t5, r.get(t5.key));
                        e3 != null && o.push(new An(t5.key, e3, Zt(e3.value.mapValue), _n.exists(true)));
                    }
                    return n2.$s.addMutationBatch(t4, s2, o, e2);
                })
            ).then((t4)=>(t4.applyToLocalDocumentSet(r), {
                    batchId: t4.batchId,
                    changes: r
                })
            );
        }(s.localStore, e);
        s.sharedClientState.addPendingMutation(t2.batchId), (function(t3, e2, n2) {
            let s2 = t3.oa[t3.currentUser.toKey()];
            s2 || (s2 = new Mn(rt));
            s2 = s2.insert(e2, n2), t3.oa[t3.currentUser.toKey()] = s2;
        })(s, t2.batchId, n), await la(s, t2.changes), await fu(s.remoteStore);
    } catch (t2) {
        const e2 = Pu(t2, "Failed to persist write");
        n.reject(e2);
    }
}
async function Xu(t892, e) {
    const n = G(t892);
    try {
        const t2 = await so(n.localStore, e);
        e.targetChanges.forEach((t3, e2)=>{
            const s = n.ia.get(e2);
            s && (U1(t3.addedDocuments.size + t3.modifiedDocuments.size + t3.removedDocuments.size <= 1), t3.addedDocuments.size > 0 ? s.Xu = true : t3.modifiedDocuments.size > 0 ? U1(s.Xu) : t3.removedDocuments.size > 0 && (U1(s.Xu), s.Xu = false));
        }), await la(n, t2, e);
    } catch (t2) {
        await Vr(t2);
    }
}
function Zu(t893, e, n) {
    const s = G(t893);
    if (s.isPrimaryClient && n === 0 || !s.isPrimaryClient && n === 1) {
        const t2 = [];
        s.ta.forEach((n2, s2)=>{
            const i = s2.view.Eu(e);
            i.snapshot && t2.push(i.snapshot);
        }), (function(t3, e2) {
            const n2 = G(t3);
            n2.onlineState = e2;
            let s2 = false;
            n2.queries.forEach((t4, n3)=>{
                for (const t5 of n3.listeners)t5.Eu(e2) && (s2 = true);
            }), s2 && Ou(n2);
        })(s.eventManager, e), t2.length && s.Zu.Ko(t2), s.onlineState = e, s.isPrimaryClient && s.sharedClientState.setOnlineState(e);
    }
}
async function ta1(t894, e, n) {
    const s = G(t894);
    s.sharedClientState.updateQueryState(e, "rejected", n);
    const i = s.ia.get(e), r = i && i.key;
    if (r) {
        let t2 = new Mn(xt.comparator);
        t2 = t2.insert(r, te.newNoDocument(r, ct.min()));
        const n2 = zn().add(r), i2 = new Yn(ct.min(), new Map(), new $n(rt), t2, n2);
        await Xu(s, i2), s.sa = s.sa.remove(r), s.ia.delete(e), ha1(s);
    } else await uo(s.localStore, e, false).then(()=>oa1(s, e, n)
    ).catch(Vr);
}
async function ea1(t895, e) {
    const n = G(t895), s = e.batch.batchId;
    try {
        const t2 = await eo(n.localStore, e);
        ra1(n, s, null), ia1(n, s), n.sharedClientState.updateMutationState(s, "acknowledged"), await la(n, t2);
    } catch (t2) {
        await Vr(t2);
    }
}
async function na1(t896, e, n) {
    const s = G(t896);
    try {
        const t2 = await function(t3, e2) {
            const n2 = G(t3);
            return n2.persistence.runTransaction("Reject batch", "readwrite-primary", (t4)=>{
                let s2;
                return n2.$s.lookupMutationBatch(t4, e2).next((e3)=>(U1(e3 !== null), s2 = e3.keys(), n2.$s.removeMutationBatch(t4, e3))
                ).next(()=>n2.$s.performConsistencyCheck(t4)
                ).next(()=>n2.ai.qs(t4, s2)
                );
            });
        }(s.localStore, e);
        ra1(s, e, n), ia1(s, e), s.sharedClientState.updateMutationState(e, "rejected", n), await la(s, t2);
    } catch (n2) {
        await Vr(n2);
    }
}
function ia1(t897, e) {
    (t897.ua.get(e) || []).forEach((t2)=>{
        t2.resolve();
    }), t897.ua.delete(e);
}
function ra1(t898, e, n) {
    const s = G(t898);
    let i = s.oa[s.currentUser.toKey()];
    if (i) {
        const t2 = i.get(e);
        t2 && (n ? t2.reject(n) : t2.resolve(), i = i.remove(e)), s.oa[s.currentUser.toKey()] = i;
    }
}
function oa1(t899, e, n = null) {
    t899.sharedClientState.removeLocalQueryTarget(e);
    for (const s of t899.ea.get(e))t899.ta.delete(s), n && t899.Zu.la(s, n);
    if (t899.ea.delete(e), t899.isPrimaryClient) {
        t899.ra.Ri(e).forEach((e2)=>{
            t899.ra.containsKey(e2) || ua1(t899, e2);
        });
    }
}
function ua1(t900, e) {
    t900.na.delete(e.path.canonicalString());
    const n = t900.sa.get(e);
    n !== null && (tu(t900.remoteStore, n), t900.sa = t900.sa.remove(e), t900.ia.delete(n), ha1(t900));
}
function aa1(t901, e, n) {
    for (const s of n)if (s instanceof qu) t901.ra.addReference(s.key, e), ca(t901, s);
    else if (s instanceof Gu) {
        O1("SyncEngine", "Document no longer in limbo: " + s.key), t901.ra.removeReference(s.key, e);
        t901.ra.containsKey(s.key) || ua1(t901, s.key);
    } else L1();
}
function ca(t902, e) {
    const n = e.key, s = n.path.canonicalString();
    t902.sa.get(n) || t902.na.has(s) || (O1("SyncEngine", "New document in limbo: " + n), t902.na.add(s), ha1(t902));
}
function ha1(t903) {
    for(; t903.na.size > 0 && t903.sa.size < t903.maxConcurrentLimboResolutions;){
        const e = t903.na.values().next().value;
        t903.na.delete(e);
        const n = new xt(_t.fromString(e)), s = t903.aa.next();
        t903.ia.set(s, new ju(n)), t903.sa = t903.sa.insert(n, s), Zo(t903.remoteStore, new Di(Le(Ne(n.path)), s, 2, nt.A));
    }
}
async function la(t904, e, n) {
    const s = G(t904), i = [], r = [], o = [];
    s.ta.isEmpty() || (s.ta.forEach((t2, u)=>{
        o.push(s.ha(u, e, n).then((t3)=>{
            if (t3) {
                s.isPrimaryClient && s.sharedClientState.updateQueryState(u.targetId, t3.fromCache ? "not-current" : "current"), i.push(t3);
                const e2 = Jr.Js(u.targetId, t3);
                r.push(e2);
            }
        }));
    }), await Promise.all(o), s.Zu.Ko(i), await async function(t2, e2) {
        const n2 = G(t2);
        try {
            await n2.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (t3)=>wi.forEach(e2, (e3)=>wi.forEach(e3.zs, (s2)=>n2.persistence.referenceDelegate.addReference(t3, e3.targetId, s2)
                    ).next(()=>wi.forEach(e3.Hs, (s2)=>n2.persistence.referenceDelegate.removeReference(t3, e3.targetId, s2)
                        )
                    )
                )
            );
        } catch (t3) {
            if (!Ii(t3)) throw t3;
            O1("LocalStore", "Failed to update sequence numbers: " + t3);
        }
        for (const t33 of e2){
            const e3 = t33.targetId;
            if (!t33.fromCache) {
                const t4 = n2.si.get(e3), s2 = t4.snapshotVersion, i2 = t4.withLastLimboFreeSnapshotVersion(s2);
                n2.si = n2.si.insert(e3, i2);
            }
        }
    }(s.localStore, r));
}
async function fa1(t905, e) {
    const n = G(t905);
    if (!n.currentUser.isEqual(e)) {
        O1("SyncEngine", "User change. New user:", e.toKey());
        const t2 = await to(n.localStore, e);
        n.currentUser = e, (function(t3, e2) {
            t3.ua.forEach((t4)=>{
                t4.forEach((t5)=>{
                    t5.reject(new Q1(K1.CANCELLED, e2));
                });
            }), t3.ua.clear();
        })(n, "'waitForPendingWrites' promise is rejected due to a user change."), n.sharedClientState.handleUserChange(e, t2.removedBatchIds, t2.addedBatchIds), await la(n, t2.ci);
    }
}
function da1(t906, e) {
    const n = G(t906), s = n.ia.get(e);
    if (s && s.Xu) return zn().add(s.key);
    {
        let t2 = zn();
        const s2 = n.ea.get(e);
        if (!s2) return t2;
        for (const e2 of s2){
            const s3 = n.ta.get(e2);
            t2 = t2.unionWith(s3.view.qu);
        }
        return t2;
    }
}
function Aa1(t907) {
    const e = G(t907);
    return e.remoteStore.remoteSyncer.applyRemoteEvent = Xu.bind(null, e), e.remoteStore.remoteSyncer.getRemoteKeysForTarget = da1.bind(null, e), e.remoteStore.remoteSyncer.rejectListen = ta1.bind(null, e), e.Zu.Ko = ku.bind(null, e.eventManager), e.Zu.la = Mu.bind(null, e.eventManager), e;
}
function Ra1(t908) {
    const e = G(t908);
    return e.remoteStore.remoteSyncer.applySuccessfulWrite = ea1.bind(null, e), e.remoteStore.remoteSyncer.rejectFailedWrite = na1.bind(null, e), e;
}
class Pa1 {
    constructor(){
        this.synchronizeTabs = false;
    }
    async initialize(t909) {
        this.M = Go(t909.databaseInfo.databaseId), this.sharedClientState = this.da(t909), this.persistence = this._a(t909), await this.persistence.start(), this.gcScheduler = this.wa(t909), this.localStore = this.ma(t909);
    }
    wa(t) {
        return null;
    }
    ma(t910) {
        return Zr(this.persistence, new Yr(), t910.initialUser, this.M);
    }
    _a(t) {
        return new Ao(bo.Wi, this.M);
    }
    da(t) {
        return new Mo();
    }
    async terminate() {
        this.gcScheduler && this.gcScheduler.stop(), await this.sharedClientState.shutdown(), await this.persistence.shutdown();
    }
}
class Sa1 {
    async initialize(t911, e) {
        this.localStore || (this.localStore = t911.localStore, this.sharedClientState = t911.sharedClientState, this.datastore = this.createDatastore(e), this.remoteStore = this.createRemoteStore(e), this.eventManager = this.createEventManager(e), this.syncEngine = this.createSyncEngine(e, !t911.synchronizeTabs), this.sharedClientState.onlineStateHandler = (t2)=>Zu(this.syncEngine, t2, 1)
        , this.remoteStore.remoteSyncer.handleCredentialChange = fa1.bind(null, this.syncEngine), await Eu(this.remoteStore, this.syncEngine.isPrimaryClient));
    }
    createEventManager(t) {
        return new Cu();
    }
    createDatastore(t912) {
        const e = Go(t912.databaseInfo.databaseId), n = (s = t912.databaseInfo, new Lo(s));
        var s;
        return (function(t2, e2, n2, s2) {
            return new zo(t2, e2, n2, s2);
        })(t912.authCredentials, t912.appCheckCredentials, n, e);
    }
    createRemoteStore(t913) {
        return e = this.localStore, n = this.datastore, s = t913.asyncQueue, i = (t2)=>Zu(this.syncEngine, t2, 0)
        , r = Fo.vt() ? new Fo() : new Oo(), new Jo(e, n, s, i, r);
        var e, n, s, i, r;
    }
    createSyncEngine(t914, e) {
        return (function(t2, e2, n, s, i, r, o) {
            const u = new Wu(t2, e2, n, s, i, r);
            return o && (u.ca = true), u;
        })(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, t914.initialUser, t914.maxConcurrentLimboResolutions, e);
    }
    terminate() {
        return (async function(t915) {
            const e = G(t915);
            O1("RemoteStore", "RemoteStore shutting down."), e.lu.add(5), await Xo(e), e.du.shutdown(), e._u.set("Unknown");
        })(this.remoteStore);
    }
}
class Ca1 {
    constructor(t916){
        this.observer = t916, this.muted = false;
    }
    next(t917) {
        this.observer.next && this.ya(this.observer.next, t917);
    }
    error(t918) {
        this.observer.error ? this.ya(this.observer.error, t918) : console.error("Uncaught Error in snapshot listener:", t918);
    }
    pa() {
        this.muted = true;
    }
    ya(t919, e) {
        this.muted || setTimeout(()=>{
            this.muted || t919(e);
        }, 0);
    }
}
class Ma1 {
    constructor(t920, e, n, s){
        this.authCredentials = t920, this.appCheckCredentials = e, this.asyncQueue = n, this.databaseInfo = s, this.user = C1.UNAUTHENTICATED, this.clientId = it.R(), this.authCredentialListener = ()=>Promise.resolve()
        , this.appCheckCredentialListener = ()=>Promise.resolve()
        , this.authCredentials.start(n, async (t2)=>{
            O1("FirestoreClient", "Received user=", t2.uid), await this.authCredentialListener(t2), this.user = t2;
        }), this.appCheckCredentials.start(n, (t2)=>(O1("FirestoreClient", "Received new app check token=", t2), this.appCheckCredentialListener(t2, this.user))
        );
    }
    async getConfiguration() {
        return {
            asyncQueue: this.asyncQueue,
            databaseInfo: this.databaseInfo,
            clientId: this.clientId,
            authCredentials: this.authCredentials,
            appCheckCredentials: this.appCheckCredentials,
            initialUser: this.user,
            maxConcurrentLimboResolutions: 100
        };
    }
    setCredentialChangeListener(t921) {
        this.authCredentialListener = t921;
    }
    setAppCheckTokenChangeListener(t922) {
        this.appCheckCredentialListener = t922;
    }
    verifyNotTerminated() {
        if (this.asyncQueue.isShuttingDown) throw new Q1(K1.FAILED_PRECONDITION, "The client has already been terminated.");
    }
    terminate() {
        this.asyncQueue.enterRestrictedMode();
        const t923 = new j();
        return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async ()=>{
            try {
                this.onlineComponents && await this.onlineComponents.terminate(), this.offlineComponents && await this.offlineComponents.terminate(), this.authCredentials.shutdown(), this.appCheckCredentials.shutdown(), t923.resolve();
            } catch (e) {
                const n = Pu(e, "Failed to shutdown persistence");
                t923.reject(n);
            }
        }), t923.promise;
    }
}
async function Oa1(t924, e) {
    t924.asyncQueue.verifyOperationInProgress(), O1("FirestoreClient", "Initializing OfflineComponentProvider");
    const n = await t924.getConfiguration();
    await e.initialize(n);
    let s = n.initialUser;
    t924.setCredentialChangeListener(async (t2)=>{
        s.isEqual(t2) || (await to(e.localStore, t2), s = t2);
    }), e.persistence.setDatabaseDeletedListener(()=>t924.terminate()
    ), t924.offlineComponents = e;
}
async function Fa1(t925, e) {
    t925.asyncQueue.verifyOperationInProgress();
    const n = await $a1(t925);
    O1("FirestoreClient", "Initializing OnlineComponentProvider");
    const s = await t925.getConfiguration();
    await e.initialize(n, s), t925.setCredentialChangeListener((t2)=>Tu(e.remoteStore, t2)
    ), t925.setAppCheckTokenChangeListener((t2, n2)=>Tu(e.remoteStore, n2)
    ), t925.onlineComponents = e;
}
async function $a1(t926) {
    return t926.offlineComponents || (O1("FirestoreClient", "Using default OfflineComponentProvider"), await Oa1(t926, new Pa1())), t926.offlineComponents;
}
async function Ba(t927) {
    return t927.onlineComponents || (O1("FirestoreClient", "Using default OnlineComponentProvider"), await Fa1(t927, new Sa1())), t927.onlineComponents;
}
function Ga1(t928) {
    return Ba(t928).then((t2)=>t2.syncEngine
    );
}
async function Ka1(t929) {
    const e = await Ba(t929), n = e.eventManager;
    return n.onListen = zu.bind(null, e.syncEngine), n.onUnlisten = Ju.bind(null, e.syncEngine), n;
}
function za1(t930, e, n = {}) {
    const s = new j();
    return t930.asyncQueue.enqueueAndForget(async ()=>(function(t2, e2, n2, s2, i) {
            const r = new Ca1({
                next: (r2)=>{
                    e2.enqueueAndForget(()=>Nu(t2, o)
                    );
                    const u = r2.docs.has(n2);
                    !u && r2.fromCache ? i.reject(new Q1(K1.UNAVAILABLE, "Failed to get document because the client is offline.")) : u && r2.fromCache && s2 && s2.source === "server" ? i.reject(new Q1(K1.UNAVAILABLE, 'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')) : i.resolve(r2);
                },
                error: (t3)=>i.reject(t3)
            }), o = new Fu(Ne(n2.path), r, {
                includeMetadataChanges: true,
                Du: true
            });
            return xu(t2, o);
        })(await Ka1(t930), t930.asyncQueue, e, n, s)
    ), s.promise;
}
const ec1 = new Map();
function nc1(t931, e, n) {
    if (!n) throw new Q1(K1.INVALID_ARGUMENT, `Function ${t931}() cannot be called with an empty ${e}.`);
}
function sc1(t932, e, n, s) {
    if (e === true && s === true) throw new Q1(K1.INVALID_ARGUMENT, `${t932} and ${n} cannot be used together.`);
}
function ic1(t933) {
    if (!xt.isDocumentKey(t933)) throw new Q1(K1.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${t933} has ${t933.length}.`);
}
function oc1(t934) {
    if (t934 === void 0) return "undefined";
    if (t934 === null) return "null";
    if (typeof t934 == "string") return t934.length > 20 && (t934 = `${t934.substring(0, 20)}...`), JSON.stringify(t934);
    if (typeof t934 == "number" || typeof t934 == "boolean") return "" + t934;
    if (typeof t934 == "object") {
        if (t934 instanceof Array) return "an array";
        {
            const e = function(t2) {
                if (t2.constructor) return t2.constructor.name;
                return null;
            }(t934);
            return e ? `a custom ${e} object` : "an object";
        }
    }
    return typeof t934 == "function" ? "a function" : L1();
}
function uc1(t935, e) {
    if ("_delegate" in t935 && (t935 = t935._delegate), !(t935 instanceof e)) {
        if (e.name === t935.constructor.name) throw new Q1(K1.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
        {
            const n = oc1(t935);
            throw new Q1(K1.INVALID_ARGUMENT, `Expected type '${e.name}', but it was: ${n}`);
        }
    }
    return t935;
}
class cc1 {
    constructor(t936){
        var e;
        if (t936.host === void 0) {
            if (t936.ssl !== void 0) throw new Q1(K1.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
            this.host = "firestore.googleapis.com", this.ssl = true;
        } else this.host = t936.host, this.ssl = (e = t936.ssl) === null || e === void 0 || e;
        if (this.credentials = t936.credentials, this.ignoreUndefinedProperties = !!t936.ignoreUndefinedProperties, t936.cacheSizeBytes === void 0) this.cacheSizeBytes = 41943040;
        else {
            if (t936.cacheSizeBytes !== -1 && t936.cacheSizeBytes < 1048576) throw new Q1(K1.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
            this.cacheSizeBytes = t936.cacheSizeBytes;
        }
        this.experimentalForceLongPolling = !!t936.experimentalForceLongPolling, this.experimentalAutoDetectLongPolling = !!t936.experimentalAutoDetectLongPolling, this.useFetchStreams = !!t936.useFetchStreams, sc1("experimentalForceLongPolling", t936.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", t936.experimentalAutoDetectLongPolling);
    }
    isEqual(t937) {
        return this.host === t937.host && this.ssl === t937.ssl && this.credentials === t937.credentials && this.cacheSizeBytes === t937.cacheSizeBytes && this.experimentalForceLongPolling === t937.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === t937.experimentalAutoDetectLongPolling && this.ignoreUndefinedProperties === t937.ignoreUndefinedProperties && this.useFetchStreams === t937.useFetchStreams;
    }
}
class hc1 {
    constructor(t938, e, n){
        this._authCredentials = e, this._appCheckCredentials = n, this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new cc1({}), this._settingsFrozen = false, t938 instanceof vt ? this._databaseId = t938 : (this._app = t938, this._databaseId = (function(t2) {
            if (!Object.prototype.hasOwnProperty.apply(t2.options, [
                "projectId"
            ])) throw new Q1(K1.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
            return new vt(t2.options.projectId);
        })(t938));
    }
    get app() {
        if (!this._app) throw new Q1(K1.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
        return this._app;
    }
    get _initialized() {
        return this._settingsFrozen;
    }
    get _terminated() {
        return this._terminateTask !== void 0;
    }
    _setSettings(t939) {
        if (this._settingsFrozen) throw new Q1(K1.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
        this._settings = new cc1(t939), t939.credentials !== void 0 && (this._authCredentials = (function(t2) {
            if (!t2) return new z1();
            switch(t2.type){
                case "gapi":
                    const e = t2.client;
                    return U1(!(typeof e != "object" || e === null || !e.auth || !e.auth.getAuthHeaderValueForFirstParty)), new X1(e, t2.sessionIndex || "0", t2.iamToken || null);
                case "provider":
                    return t2.client;
                default:
                    throw new Q1(K1.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
            }
        })(t939.credentials));
    }
    _getSettings() {
        return this._settings;
    }
    _freezeSettings() {
        return this._settingsFrozen = true, this._settings;
    }
    _delete() {
        return this._terminateTask || (this._terminateTask = this._terminate()), this._terminateTask;
    }
    toJSON() {
        return {
            app: this._app,
            databaseId: this._databaseId,
            settings: this._settings
        };
    }
    _terminate() {
        return (function(t940) {
            const e = ec1.get(t940);
            e && (O1("ComponentProvider", "Removing Datastore"), ec1.delete(t940), e.terminate());
        })(this), Promise.resolve();
    }
}
class fc1 {
    constructor(t941, e, n){
        this.converter = e, this._key = n, this.type = "document", this.firestore = t941;
    }
    get _path() {
        return this._key.path;
    }
    get id() {
        return this._key.path.lastSegment();
    }
    get path() {
        return this._key.path.canonicalString();
    }
    get parent() {
        return new _c(this.firestore, this.converter, this._key.path.popLast());
    }
    withConverter(t942) {
        return new fc1(this.firestore, t942, this._key);
    }
}
class dc1 {
    constructor(t943, e, n){
        this.converter = e, this._query = n, this.type = "query", this.firestore = t943;
    }
    withConverter(t944) {
        return new dc1(this.firestore, t944, this._query);
    }
}
class _c extends dc1 {
    constructor(t945, e, n){
        super(t945, e, Ne(n)), this._path = n, this.type = "collection";
    }
    get id() {
        return this._query.path.lastSegment();
    }
    get path() {
        return this._query.path.canonicalString();
    }
    get parent() {
        const t946 = this._path.popLast();
        return t946.isEmpty() ? null : new fc1(this.firestore, null, new xt(t946));
    }
    withConverter(t947) {
        return new _c(this.firestore, t947, this._path);
    }
}
function gc1(t948, e, ...n) {
    if (t948 = getModularInstance(t948), arguments.length === 1 && (e = it.R()), nc1("doc", "path", e), t948 instanceof hc1) {
        const s = _t.fromString(e, ...n);
        return ic1(s), new fc1(t948, null, new xt(s));
    }
    {
        if (!(t948 instanceof fc1 || t948 instanceof _c)) throw new Q1(K1.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
        const s = t948._path.child(_t.fromString(e, ...n));
        return ic1(s), new fc1(t948.firestore, t948 instanceof _c ? t948.converter : null, new xt(s));
    }
}
class Ic1 {
    constructor(){
        this.Na = Promise.resolve(), this.ka = [], this.Ma = false, this.Oa = [], this.Fa = null, this.$a = false, this.Ba = false, this.La = [], this.So = new Ko(this, "async_queue_retry"), this.Ua = ()=>{
            const t2 = qo();
            t2 && O1("AsyncQueue", "Visibility state changed to " + t2.visibilityState), this.So.Eo();
        };
        const t949 = qo();
        t949 && typeof t949.addEventListener == "function" && t949.addEventListener("visibilitychange", this.Ua);
    }
    get isShuttingDown() {
        return this.Ma;
    }
    enqueueAndForget(t950) {
        this.enqueue(t950);
    }
    enqueueAndForgetEvenWhileRestricted(t951) {
        this.qa(), this.Ga(t951);
    }
    enterRestrictedMode(t952) {
        if (!this.Ma) {
            this.Ma = true, this.Ba = t952 || false;
            const e = qo();
            e && typeof e.removeEventListener == "function" && e.removeEventListener("visibilitychange", this.Ua);
        }
    }
    enqueue(t953) {
        if (this.qa(), this.Ma) return new Promise(()=>{});
        const e = new j();
        return this.Ga(()=>this.Ma && this.Ba ? Promise.resolve() : (t953().then(e.resolve, e.reject), e.promise)
        ).then(()=>e.promise
        );
    }
    enqueueRetryable(t954) {
        this.enqueueAndForget(()=>(this.ka.push(t954), this.Ka())
        );
    }
    async Ka() {
        if (this.ka.length !== 0) {
            try {
                await this.ka[0](), this.ka.shift(), this.So.reset();
            } catch (t955) {
                if (!Ii(t955)) throw t955;
                O1("AsyncQueue", "Operation failed with retryable error: " + t955);
            }
            this.ka.length > 0 && this.So.Io(()=>this.Ka()
            );
        }
    }
    Ga(t956) {
        const e = this.Na.then(()=>(this.$a = true, t956().catch((t2)=>{
                this.Fa = t2, this.$a = false;
                const e2 = function(t3) {
                    let e3 = t3.message || "";
                    t3.stack && (e3 = t3.stack.includes(t3.message) ? t3.stack : t3.message + "\n" + t3.stack);
                    return e3;
                }(t2);
                throw F1("INTERNAL UNHANDLED ERROR: ", e2), t2;
            }).then((t2)=>(this.$a = false, t2)
            ))
        );
        return this.Na = e, e;
    }
    enqueueAfterDelay(t957, e, n) {
        this.qa(), this.La.indexOf(t957) > -1 && (e = 0);
        const s = bu.createAndSchedule(this, t957, e, n, (t2)=>this.Qa(t2)
        );
        return this.Oa.push(s), s;
    }
    qa() {
        this.Fa && L1();
    }
    verifyOperationInProgress() {}
    async ja() {
        let t958;
        do {
            t958 = this.Na, await t958;
        }while (t958 !== this.Na)
    }
    Wa(t959) {
        for (const e of this.Oa)if (e.timerId === t959) return true;
        return false;
    }
    za(t960) {
        return this.ja().then(()=>{
            this.Oa.sort((t2, e)=>t2.targetTimeMs - e.targetTimeMs
            );
            for (const e5 of this.Oa)if (e5.skipDelay(), t960 !== "all" && e5.timerId === t960) break;
            return this.ja();
        });
    }
    Ha(t961) {
        this.La.push(t961);
    }
    Qa(t962) {
        const e = this.Oa.indexOf(t962);
        this.Oa.splice(e, 1);
    }
}
function Tc1(t963) {
    return (function(t2, e) {
        if (typeof t2 != "object" || t2 === null) return false;
        const n = t2;
        for (const t3 of e)if (t3 in n && typeof n[t3] == "function") return true;
        return false;
    })(t963, [
        "next",
        "error",
        "complete"
    ]);
}
class Rc1 extends hc1 {
    constructor(t964, e, n){
        super(t964, e, n), this.type = "firestore", this._queue = new Ic1(), this._persistenceKey = "name" in t964 ? t964.name : "[DEFAULT]";
    }
    _terminate() {
        return this._firestoreClient || vc1(this), this._firestoreClient.terminate();
    }
}
function Pc1(e = getApp()) {
    return _getProvider(e, "firestore").getImmediate();
}
function Vc1(t965) {
    return t965._firestoreClient || vc1(t965), t965._firestoreClient.verifyNotTerminated(), t965._firestoreClient;
}
function vc1(t966) {
    var e;
    const n = t966._freezeSettings(), s = function(t2, e2, n2, s2) {
        return new Vt(t2, e2, n2, s2.host, s2.ssl, s2.experimentalForceLongPolling, s2.experimentalAutoDetectLongPolling, s2.useFetchStreams);
    }(t966._databaseId, ((e = t966._app) === null || e === void 0 ? void 0 : e.options.appId) || "", t966._persistenceKey, n);
    t966._firestoreClient = new Ma1(t966._authCredentials, t966._appCheckCredentials, t966._queue, s);
}
class Lc1 {
    constructor(...t967){
        for(let e = 0; e < t967.length; ++e)if (t967[e].length === 0) throw new Q1(K1.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
        this._internalPath = new mt(t967);
    }
    isEqual(t968) {
        return this._internalPath.isEqual(t968._internalPath);
    }
}
class qc1 {
    constructor(t969){
        this._byteString = t969;
    }
    static fromBase64String(t970) {
        try {
            return new qc1(pt.fromBase64String(t970));
        } catch (t2) {
            throw new Q1(K1.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + t2);
        }
    }
    static fromUint8Array(t971) {
        return new qc1(pt.fromUint8Array(t971));
    }
    toBase64() {
        return this._byteString.toBase64();
    }
    toUint8Array() {
        return this._byteString.toUint8Array();
    }
    toString() {
        return "Bytes(base64: " + this.toBase64() + ")";
    }
    isEqual(t972) {
        return this._byteString.isEqual(t972._byteString);
    }
}
class Gc1 {
    constructor(t973){
        this._methodName = t973;
    }
}
class Kc1 {
    constructor(t974, e){
        if (!isFinite(t974) || t974 < -90 || t974 > 90) throw new Q1(K1.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + t974);
        if (!isFinite(e) || e < -180 || e > 180) throw new Q1(K1.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + e);
        this._lat = t974, this._long = e;
    }
    get latitude() {
        return this._lat;
    }
    get longitude() {
        return this._long;
    }
    isEqual(t975) {
        return this._lat === t975._lat && this._long === t975._long;
    }
    toJSON() {
        return {
            latitude: this._lat,
            longitude: this._long
        };
    }
    _compareTo(t976) {
        return rt(this._lat, t976._lat) || rt(this._long, t976._long);
    }
}
const Qc1 = /^__.*__$/;
class jc1 {
    constructor(t977, e, n){
        this.data = t977, this.fieldMask = e, this.fieldTransforms = n;
    }
    toMutation(t978, e) {
        return this.fieldMask !== null ? new An(t978, this.data, this.fieldMask, e, this.fieldTransforms) : new En(t978, this.data, e, this.fieldTransforms);
    }
}
function zc1(t979) {
    switch(t979){
        case 0:
        case 2:
        case 1:
            return true;
        case 3:
        case 4:
            return false;
        default:
            throw L1();
    }
}
class Hc1 {
    constructor(t980, e, n, s, i, r){
        this.settings = t980, this.databaseId = e, this.M = n, this.ignoreUndefinedProperties = s, i === void 0 && this.Ja(), this.fieldTransforms = i || [], this.fieldMask = r || [];
    }
    get path() {
        return this.settings.path;
    }
    get Ya() {
        return this.settings.Ya;
    }
    Xa(t981) {
        return new Hc1(Object.assign(Object.assign({}, this.settings), t981), this.databaseId, this.M, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
    }
    Za(t982) {
        var e;
        const n = (e = this.path) === null || e === void 0 ? void 0 : e.child(t982), s = this.Xa({
            path: n,
            tc: false
        });
        return s.ec(t982), s;
    }
    nc(t983) {
        var e;
        const n = (e = this.path) === null || e === void 0 ? void 0 : e.child(t983), s = this.Xa({
            path: n,
            tc: false
        });
        return s.Ja(), s;
    }
    sc(t) {
        return this.Xa({
            path: void 0,
            tc: true
        });
    }
    ic(t984) {
        return wh(t984, this.settings.methodName, this.settings.rc || false, this.path, this.settings.oc);
    }
    contains(t985) {
        return this.fieldMask.find((e)=>t985.isPrefixOf(e)
        ) !== void 0 || this.fieldTransforms.find((e)=>t985.isPrefixOf(e.field)
        ) !== void 0;
    }
    Ja() {
        if (this.path) for(let t986 = 0; t986 < this.path.length; t986++)this.ec(this.path.get(t986));
    }
    ec(t987) {
        if (t987.length === 0) throw this.ic("Document fields must not be empty");
        if (zc1(this.Ya) && Qc1.test(t987)) throw this.ic('Document fields cannot begin and end with "__"');
    }
}
class Jc1 {
    constructor(t988, e, n){
        this.databaseId = t988, this.ignoreUndefinedProperties = e, this.M = n || Go(t988);
    }
    uc(t989, e, n, s = false) {
        return new Hc1({
            Ya: t989,
            methodName: e,
            oc: n,
            path: mt.emptyPath(),
            tc: false,
            rc: s
        }, this.databaseId, this.M, this.ignoreUndefinedProperties);
    }
}
function Yc1(t990) {
    const e = t990._freezeSettings(), n = Go(t990._databaseId);
    return new Jc1(t990._databaseId, !!e.ignoreUndefinedProperties, n);
}
function Xc1(t991, e, n, s, i, r = {}) {
    const o = t991.uc(r.merge || r.mergeFields ? 2 : 0, e, n, i);
    lh("Data must be an object, but it was:", o, s);
    const u = ch(s, o);
    let a, c;
    if (r.merge) a = new gt(o.fieldMask), c = o.fieldTransforms;
    else if (r.mergeFields) {
        const t2 = [];
        for (const s2 of r.mergeFields){
            const i2 = fh(e, s2, n);
            if (!o.contains(i2)) throw new Q1(K1.INVALID_ARGUMENT, `Field '${i2}' is specified in your field mask but missing from your input data.`);
            mh(t2, i2) || t2.push(i2);
        }
        a = new gt(t2), c = o.fieldTransforms.filter((t3)=>a.covers(t3.field)
        );
    } else a = null, c = o.fieldTransforms;
    return new jc1(new Xt(u), a, c);
}
class Zc1 extends Gc1 {
    _toFieldTransform(t992) {
        if (t992.Ya !== 2) throw t992.Ya === 1 ? t992.ic(`${this._methodName}() can only appear at the top level of your update data`) : t992.ic(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
        return t992.fieldMask.push(t992.path), null;
    }
    isEqual(t993) {
        return t993 instanceof Zc1;
    }
}
class eh extends Gc1 {
    _toFieldTransform(t994) {
        return new ln(t994.path, new nn());
    }
    isEqual(t995) {
        return t995 instanceof eh;
    }
}
function ah(t996, e) {
    if (hh(t996 = getModularInstance(t996))) return lh("Unsupported field value:", e, t996), ch(t996, e);
    if (t996 instanceof Gc1) return (function(t2, e2) {
        if (!zc1(e2.Ya)) throw e2.ic(`${t2._methodName}() can only be used with update() and set()`);
        if (!e2.path) throw e2.ic(`${t2._methodName}() is not currently supported inside arrays`);
        const n = t2._toFieldTransform(e2);
        n && e2.fieldTransforms.push(n);
    })(t996, e), null;
    if (t996 === void 0 && e.ignoreUndefinedProperties) return null;
    if (e.path && e.fieldMask.push(e.path), t996 instanceof Array) {
        if (e.settings.tc && e.Ya !== 4) throw e.ic("Nested arrays are not supported");
        return (function(t2, e2) {
            const n = [];
            let s = 0;
            for (const i of t2){
                let t3 = ah(i, e2.sc(s));
                t3 == null && (t3 = {
                    nullValue: "NULL_VALUE"
                }), n.push(t3), s++;
            }
            return {
                arrayValue: {
                    values: n
                }
            };
        })(t996, e);
    }
    return (function(t2, e2) {
        if ((t2 = getModularInstance(t2)) === null) return {
            nullValue: "NULL_VALUE"
        };
        if (typeof t2 == "number") return Ye(e2.M, t2);
        if (typeof t2 == "boolean") return {
            booleanValue: t2
        };
        if (typeof t2 == "string") return {
            stringValue: t2
        };
        if (t2 instanceof Date) {
            const n = at.fromDate(t2);
            return {
                timestampValue: cs(e2.M, n)
            };
        }
        if (t2 instanceof at) {
            const n = new at(t2.seconds, 1000 * Math.floor(t2.nanoseconds / 1000));
            return {
                timestampValue: cs(e2.M, n)
            };
        }
        if (t2 instanceof Kc1) return {
            geoPointValue: {
                latitude: t2.latitude,
                longitude: t2.longitude
            }
        };
        if (t2 instanceof qc1) return {
            bytesValue: hs(e2.M, t2._byteString)
        };
        if (t2 instanceof fc1) {
            const n = e2.databaseId, s = t2.firestore._databaseId;
            if (!s.isEqual(n)) throw e2.ic(`Document reference is for database ${s.projectId}/${s.database} but should be for database ${n.projectId}/${n.database}`);
            return {
                referenceValue: ds(t2.firestore._databaseId || e2.databaseId, t2._key.path)
            };
        }
        throw e2.ic(`Unsupported field value: ${oc1(t2)}`);
    })(t996, e);
}
function ch(t997, e) {
    const n = {};
    return ft(t997) ? e.path && e.path.length > 0 && e.fieldMask.push(e.path) : lt(t997, (t2, s)=>{
        const i = ah(s, e.Za(t2));
        i != null && (n[t2] = i);
    }), {
        mapValue: {
            fields: n
        }
    };
}
function hh(t998) {
    return !(typeof t998 != "object" || t998 === null || t998 instanceof Array || t998 instanceof Date || t998 instanceof at || t998 instanceof Kc1 || t998 instanceof qc1 || t998 instanceof fc1 || t998 instanceof Gc1);
}
function lh(t999, e, n) {
    if (!hh(n) || !function(t2) {
        return typeof t2 == "object" && t2 !== null && (Object.getPrototypeOf(t2) === Object.prototype || Object.getPrototypeOf(t2) === null);
    }(n)) {
        const s = oc1(n);
        throw s === "an object" ? e.ic(t999 + " a custom object") : e.ic(t999 + " " + s);
    }
}
function fh(t1000, e, n) {
    if ((e = getModularInstance(e)) instanceof Lc1) return e._internalPath;
    if (typeof e == "string") return _h(t1000, e);
    throw wh("Field path arguments must be of type string or ", t1000, false, void 0, n);
}
const dh = new RegExp("[~\\*/\\[\\]]");
function _h(t1001, e, n) {
    if (e.search(dh) >= 0) throw wh(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`, t1001, false, void 0, n);
    try {
        return new Lc1(...e.split("."))._internalPath;
    } catch (s) {
        throw wh(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, t1001, false, void 0, n);
    }
}
function wh(t1002, e, n, s, i) {
    const r = s && !s.isEmpty(), o = i !== void 0;
    let u = `Function ${e}() called with invalid data`;
    n && (u += " (via `toFirestore()`)"), u += ". ";
    let a = "";
    return (r || o) && (a += " (found", r && (a += ` in field ${s}`), o && (a += ` in document ${i}`), a += ")"), new Q1(K1.INVALID_ARGUMENT, u + t1002 + a);
}
function mh(t1003, e) {
    return t1003.some((t2)=>t2.isEqual(e)
    );
}
class gh {
    constructor(t1004, e, n, s, i){
        this._firestore = t1004, this._userDataWriter = e, this._key = n, this._document = s, this._converter = i;
    }
    get id() {
        return this._key.path.lastSegment();
    }
    get ref() {
        return new fc1(this._firestore, this._converter, this._key);
    }
    exists() {
        return this._document !== null;
    }
    data() {
        if (this._document) {
            if (this._converter) {
                const t1005 = new yh(this._firestore, this._userDataWriter, this._key, this._document, null);
                return this._converter.fromFirestore(t1005);
            }
            return this._userDataWriter.convertValue(this._document.data.value);
        }
    }
    get(t1006) {
        if (this._document) {
            const e = this._document.data.field(ph("DocumentSnapshot.get", t1006));
            if (e !== null) return this._userDataWriter.convertValue(e);
        }
    }
}
class yh extends gh {
    data() {
        return super.data();
    }
}
function ph(t1007, e) {
    return typeof e == "string" ? _h(t1007, e) : e instanceof Lc1 ? e._internalPath : e._delegate._internalPath;
}
class Ih {
    constructor(t1008, e){
        this.hasPendingWrites = t1008, this.fromCache = e;
    }
    isEqual(t1009) {
        return this.hasPendingWrites === t1009.hasPendingWrites && this.fromCache === t1009.fromCache;
    }
}
class Th extends gh {
    constructor(t1010, e, n, s, i, r){
        super(t1010, e, n, s, r), this._firestore = t1010, this._firestoreImpl = t1010, this.metadata = i;
    }
    exists() {
        return super.exists();
    }
    data(t1011 = {}) {
        if (this._document) {
            if (this._converter) {
                const e = new Eh(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, null);
                return this._converter.fromFirestore(e, t1011);
            }
            return this._userDataWriter.convertValue(this._document.data.value, t1011.serverTimestamps);
        }
    }
    get(t1012, e = {}) {
        if (this._document) {
            const n = this._document.data.field(ph("DocumentSnapshot.get", t1012));
            if (n !== null) return this._userDataWriter.convertValue(n, e.serverTimestamps);
        }
    }
}
class Eh extends Th {
    data(t1013 = {}) {
        return super.data(t1013);
    }
}
class Ah {
    constructor(t1014, e, n, s){
        this._firestore = t1014, this._userDataWriter = e, this._snapshot = s, this.metadata = new Ih(s.hasPendingWrites, s.fromCache), this.query = n;
    }
    get docs() {
        const t1015 = [];
        return this.forEach((e)=>t1015.push(e)
        ), t1015;
    }
    get size() {
        return this._snapshot.docs.size;
    }
    get empty() {
        return this.size === 0;
    }
    forEach(t1016, e) {
        this._snapshot.docs.forEach((n)=>{
            t1016.call(e, new Eh(this._firestore, this._userDataWriter, n.key, n, new Ih(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache), this.query.converter));
        });
    }
    docChanges(t1017 = {}) {
        const e = !!t1017.includeMetadataChanges;
        if (e && this._snapshot.excludesMetadataChanges) throw new Q1(K1.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
        return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === e || (this._cachedChanges = (function(t2, e2) {
            if (t2._snapshot.oldDocs.isEmpty()) {
                let e3 = 0;
                return t2._snapshot.docChanges.map((n)=>({
                        type: "added",
                        doc: new Eh(t2._firestore, t2._userDataWriter, n.doc.key, n.doc, new Ih(t2._snapshot.mutatedKeys.has(n.doc.key), t2._snapshot.fromCache), t2.query.converter),
                        oldIndex: -1,
                        newIndex: e3++
                    })
                );
            }
            {
                let n = t2._snapshot.oldDocs;
                return t2._snapshot.docChanges.filter((t3)=>e2 || t3.type !== 3
                ).map((e3)=>{
                    const s = new Eh(t2._firestore, t2._userDataWriter, e3.doc.key, e3.doc, new Ih(t2._snapshot.mutatedKeys.has(e3.doc.key), t2._snapshot.fromCache), t2.query.converter);
                    let i = -1, r = -1;
                    return e3.type !== 0 && (i = n.indexOf(e3.doc.key), n = n.delete(e3.doc.key)), e3.type !== 1 && (n = n.add(e3.doc), r = n.indexOf(e3.doc.key)), {
                        type: Rh(e3.type),
                        doc: s,
                        oldIndex: i,
                        newIndex: r
                    };
                });
            }
        })(this, e), this._cachedChangesIncludeMetadataChanges = e), this._cachedChanges;
    }
}
function Rh(t1018) {
    switch(t1018){
        case 0:
            return "added";
        case 2:
        case 3:
            return "modified";
        case 1:
            return "removed";
        default:
            return L1();
    }
}
function Ph(t1019) {
    if (Me(t1019) && t1019.explicitOrderBy.length === 0) throw new Q1(K1.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
}
class jh {
    convertValue(t1020, e = "none") {
        switch(Mt(t1020)){
            case 0:
                return null;
            case 1:
                return t1020.booleanValue;
            case 2:
                return Et(t1020.integerValue || t1020.doubleValue);
            case 3:
                return this.convertTimestamp(t1020.timestampValue);
            case 4:
                return this.convertServerTimestamp(t1020, e);
            case 5:
                return t1020.stringValue;
            case 6:
                return this.convertBytes(At(t1020.bytesValue));
            case 7:
                return this.convertReference(t1020.referenceValue);
            case 8:
                return this.convertGeoPoint(t1020.geoPointValue);
            case 9:
                return this.convertArray(t1020.arrayValue, e);
            case 10:
                return this.convertObject(t1020.mapValue, e);
            default:
                throw L1();
        }
    }
    convertObject(t1021, e) {
        const n = {};
        return lt(t1021.fields, (t2, s)=>{
            n[t2] = this.convertValue(s, e);
        }), n;
    }
    convertGeoPoint(t1022) {
        return new Kc1(Et(t1022.latitude), Et(t1022.longitude));
    }
    convertArray(t1023, e) {
        return (t1023.values || []).map((t2)=>this.convertValue(t2, e)
        );
    }
    convertServerTimestamp(t1024, e) {
        switch(e){
            case "previous":
                const n = bt(t1024);
                return n == null ? null : this.convertValue(n, e);
            case "estimate":
                return this.convertTimestamp(Pt(t1024));
            default:
                return null;
        }
    }
    convertTimestamp(t1025) {
        const e = Tt(t1025);
        return new at(e.seconds, e.nanos);
    }
    convertDocumentKey(t1026, e) {
        const n = _t.fromString(t1026);
        U1(Ls(n));
        const s = new vt(n.get(1), n.get(3)), i = new xt(n.popFirst(5));
        return s.isEqual(e) || F1(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`), i;
    }
}
function Wh(t1027, e, n) {
    let s;
    return s = t1027 ? n && (n.merge || n.mergeFields) ? t1027.toFirestore(e, n) : t1027.toFirestore(e) : e, s;
}
function Yh(t1028) {
    t1028 = uc1(t1028, fc1);
    const e = uc1(t1028.firestore, Rc1);
    return za1(Vc1(e), t1028._key).then((n)=>ll(e, t1028, n)
    );
}
class Xh extends jh {
    constructor(t1029){
        super(), this.firestore = t1029;
    }
    convertBytes(t1030) {
        return new qc1(t1030);
    }
    convertReference(t1031) {
        const e = this.convertDocumentKey(t1031, this.firestore._databaseId);
        return new fc1(this.firestore, null, e);
    }
}
function il(t1032, e, n) {
    t1032 = uc1(t1032, fc1);
    const s = uc1(t1032.firestore, Rc1), i = Wh(t1032.converter, e, n);
    return hl(s, [
        Xc1(Yc1(s), "setDoc", t1032._key, i, t1032.converter !== null, n).toMutation(t1032._key, _n.none())
    ]);
}
function al(t1033, ...e) {
    var n, s, i;
    t1033 = getModularInstance(t1033);
    let r = {
        includeMetadataChanges: false
    }, o = 0;
    typeof e[o] != "object" || Tc1(e[o]) || (r = e[o], o++);
    const u = {
        includeMetadataChanges: r.includeMetadataChanges
    };
    if (Tc1(e[o])) {
        const t2 = e[o];
        e[o] = (n = t2.next) === null || n === void 0 ? void 0 : n.bind(t2), e[o + 1] = (s = t2.error) === null || s === void 0 ? void 0 : s.bind(t2), e[o + 2] = (i = t2.complete) === null || i === void 0 ? void 0 : i.bind(t2);
    }
    let a, c, h;
    if (t1033 instanceof fc1) c = uc1(t1033.firestore, Rc1), h = Ne(t1033._key.path), a = {
        next: (n2)=>{
            e[o] && e[o](ll(c, t1033, n2));
        },
        error: e[o + 1],
        complete: e[o + 2]
    };
    else {
        const n2 = uc1(t1033, dc1);
        c = uc1(n2.firestore, Rc1), h = n2._query;
        const s2 = new Xh(c);
        a = {
            next: (t2)=>{
                e[o] && e[o](new Ah(c, s2, n2, t2));
            },
            error: e[o + 1],
            complete: e[o + 2]
        }, Ph(t1033._query);
    }
    return (function(t2, e2, n2, s2) {
        const i2 = new Ca1(s2), r2 = new Fu(e2, i2, n2);
        return t2.asyncQueue.enqueueAndForget(async ()=>xu(await Ka1(t2), r2)
        ), ()=>{
            i2.pa(), t2.asyncQueue.enqueueAndForget(async ()=>Nu(await Ka1(t2), r2)
            );
        };
    })(Vc1(c), h, u, a);
}
function hl(t1034, e) {
    return (function(t2, e2) {
        const n = new j();
        return t2.asyncQueue.enqueueAndForget(async ()=>Yu(await Ga1(t2), e2, n)
        ), n.promise;
    })(Vc1(t1034), e);
}
function ll(t1035, e, n) {
    const s = n.docs.get(e._key), i = new Xh(t1035);
    return new Th(t1035, i, e._key, s, new Ih(n.hasPendingWrites, n.fromCache), e.converter);
}
!function(t1036, e = true) {
    !function(t2) {
        x1 = t2;
    }(SDK_VERSION), _registerComponent(new Component("firestore", (t2, { options: n  })=>{
        const s = t2.getProvider("app").getImmediate(), i = new Rc1(s, new J1(t2.getProvider("auth-internal")), new tt(t2.getProvider("app-check-internal")));
        return n = Object.assign({
            useFetchStreams: e
        }, n), i._setSettings(n), i;
    }, "PUBLIC")), registerVersion(D1, "3.4.7", t1036), registerVersion(D1, "3.4.7", "esm2017");
}();
var commonjsGlobal1 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x2) {
    return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
function createCommonjsModule(fn3, basedir, module) {
    return module = {
        path: basedir,
        exports: {},
        require: function(path, base) {
            return commonjsRequire(path, base === void 0 || base === null ? module.path : base);
        }
    }, fn3(module, module.exports), module.exports;
}
function commonjsRequire() {
    throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
}
var tslib = createCommonjsModule(function(module) {
    var __extends2;
    var __assign2;
    var __rest2;
    var __decorate2;
    var __param2;
    var __metadata2;
    var __awaiter2;
    var __generator2;
    var __exportStar2;
    var __values2;
    var __read2;
    var __spread2;
    var __spreadArrays2;
    var __spreadArray2;
    var __await2;
    var __asyncGenerator2;
    var __asyncDelegator2;
    var __asyncValues2;
    var __makeTemplateObject2;
    var __importStar2;
    var __importDefault2;
    var __classPrivateFieldGet2;
    var __classPrivateFieldSet2;
    var __createBinding2;
    (function(factory) {
        var root = typeof commonjsGlobal1 === "object" ? commonjsGlobal1 : typeof self === "object" ? self : typeof this === "object" ? this : {};
        {
            factory(createExporter(root, createExporter(module.exports)));
        }
        function createExporter(exports, previous) {
            if (exports !== root) {
                if (typeof Object.create === "function") {
                    Object.defineProperty(exports, "__esModule", {
                        value: true
                    });
                } else {
                    exports.__esModule = true;
                }
            }
            return function(id1, v1) {
                return exports[id1] = previous ? previous(id1, v1) : v1;
            };
        }
    })(function(exporter) {
        var extendStatics = Object.setPrototypeOf || ({
            __proto__: []
        }) instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for(var p2 in b)if (Object.prototype.hasOwnProperty.call(b, p2)) d[p2] = b[p2];
        };
        __extends2 = function(d, b) {
            if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        __assign2 = Object.assign || function(t1037) {
            for(var s, i = 1, n = arguments.length; i < n; i++){
                s = arguments[i];
                for(var p3 in s)if (Object.prototype.hasOwnProperty.call(s, p3)) t1037[p3] = s[p3];
            }
            return t1037;
        };
        __rest2 = function(s, e) {
            var t1038 = {};
            for(var p4 in s)if (Object.prototype.hasOwnProperty.call(s, p4) && e.indexOf(p4) < 0) t1038[p4] = s[p4];
            if (s != null && typeof Object.getOwnPropertySymbols === "function") for(var i = 0, p4 = Object.getOwnPropertySymbols(s); i < p4.length; i++){
                if (e.indexOf(p4[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p4[i])) t1038[p4[i]] = s[p4[i]];
            }
            return t1038;
        };
        __decorate2 = function(decorators, target, key9, desc) {
            var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key9) : desc, d;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key9, desc);
            else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key9, r) : d(target, key9)) || r;
            return c > 3 && r && Object.defineProperty(target, key9, r), r;
        };
        __param2 = function(paramIndex, decorator) {
            return function(target, key10) {
                decorator(target, key10, paramIndex);
            };
        };
        __metadata2 = function(metadataKey, metadataValue) {
            if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
        };
        __awaiter2 = function(thisArg, _arguments, P1, generator) {
            function adopt(value) {
                return value instanceof P1 ? value : new P1(function(resolve) {
                    resolve(value);
                });
            }
            return new (P1 || (P1 = Promise))(function(resolve, reject) {
                function fulfilled(value) {
                    try {
                        step(generator.next(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function rejected(value) {
                    try {
                        step(generator["throw"](value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function step(result) {
                    result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
                }
                step((generator = generator.apply(thisArg, _arguments || [])).next());
            });
        };
        __generator2 = function(thisArg, body) {
            var _ = {
                label: 0,
                sent: function() {
                    if (t1039[0] & 1) throw t1039[1];
                    return t1039[1];
                },
                trys: [],
                ops: []
            }, f, y2, t1039, g;
            return g = {
                next: verb(0),
                throw: verb(1),
                return: verb(2)
            }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
                return this;
            }), g;
            function verb(n) {
                return function(v2) {
                    return step([
                        n,
                        v2
                    ]);
                };
            }
            function step(op) {
                if (f) throw new TypeError("Generator is already executing.");
                while(_)try {
                    if (f = 1, y2 && (t1039 = op[0] & 2 ? y2["return"] : op[0] ? y2["throw"] || ((t1039 = y2["return"]) && t1039.call(y2), 0) : y2.next) && !(t1039 = t1039.call(y2, op[1])).done) return t1039;
                    if (y2 = 0, t1039) op = [
                        op[0] & 2,
                        t1039.value
                    ];
                    switch(op[0]){
                        case 0:
                        case 1:
                            t1039 = op;
                            break;
                        case 4:
                            _.label++;
                            return {
                                value: op[1],
                                done: false
                            };
                        case 5:
                            _.label++;
                            y2 = op[1];
                            op = [
                                0
                            ];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t1039 = _.trys, t1039 = t1039.length > 0 && t1039[t1039.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t1039 || op[1] > t1039[0] && op[1] < t1039[3])) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t1039[1]) {
                                _.label = t1039[1];
                                t1039 = op;
                                break;
                            }
                            if (t1039 && _.label < t1039[2]) {
                                _.label = t1039[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t1039[2]) _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                } catch (e) {
                    op = [
                        6,
                        e
                    ];
                    y2 = 0;
                } finally{
                    f = t1039 = 0;
                }
                if (op[0] & 5) throw op[1];
                return {
                    value: op[0] ? op[1] : void 0,
                    done: true
                };
            }
        };
        __exportStar2 = function(m, o) {
            for(var p5 in m)if (p5 !== "default" && !Object.prototype.hasOwnProperty.call(o, p5)) __createBinding2(o, m, p5);
        };
        __createBinding2 = Object.create ? function(o, m, k3, k2) {
            if (k2 === void 0) k2 = k3;
            Object.defineProperty(o, k2, {
                enumerable: true,
                get: function() {
                    return m[k3];
                }
            });
        } : function(o, m, k4, k2) {
            if (k2 === void 0) k2 = k4;
            o[k2] = m[k4];
        };
        __values2 = function(o) {
            var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
            if (m) return m.call(o);
            if (o && typeof o.length === "number") return {
                next: function() {
                    if (o && i >= o.length) o = void 0;
                    return {
                        value: o && o[i++],
                        done: !o
                    };
                }
            };
            throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
        };
        __read2 = function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar1 = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar1.push(r.value);
            } catch (error6) {
                e = {
                    error: error6
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar1;
        };
        __spread2 = function() {
            for(var ar2 = [], i = 0; i < arguments.length; i++)ar2 = ar2.concat(__read2(arguments[i]));
            return ar2;
        };
        __spreadArrays2 = function() {
            for(var s = 0, i = 0, il1 = arguments.length; i < il1; i++)s += arguments[i].length;
            for(var r = Array(s), k5 = 0, i = 0; i < il1; i++)for(var a = arguments[i], j1 = 0, jl = a.length; j1 < jl; j1++, k5++)r[k5] = a[j1];
            return r;
        };
        __spreadArray2 = function(to1, from, pack) {
            if (pack || arguments.length === 2) for(var i = 0, l5 = from.length, ar3; i < l5; i++){
                if (ar3 || !(i in from)) {
                    if (!ar3) ar3 = Array.prototype.slice.call(from, 0, i);
                    ar3[i] = from[i];
                }
            }
            return to1.concat(ar3 || Array.prototype.slice.call(from));
        };
        __await2 = function(v3) {
            return this instanceof __await2 ? (this.v = v3, this) : new __await2(v3);
        };
        __asyncGenerator2 = function(thisArg, _arguments, generator) {
            if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
            var g = generator.apply(thisArg, _arguments || []), i, q1 = [];
            return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
                return this;
            }, i;
            function verb(n) {
                if (g[n]) i[n] = function(v4) {
                    return new Promise(function(a, b) {
                        q1.push([
                            n,
                            v4,
                            a,
                            b
                        ]) > 1 || resume(n, v4);
                    });
                };
            }
            function resume(n, v5) {
                try {
                    step(g[n](v5));
                } catch (e) {
                    settle(q1[0][3], e);
                }
            }
            function step(r) {
                r.value instanceof __await2 ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q1[0][2], r);
            }
            function fulfill(value) {
                resume("next", value);
            }
            function reject(value) {
                resume("throw", value);
            }
            function settle(f, v6) {
                if (f(v6), q1.shift(), q1.length) resume(q1[0][0], q1[0][1]);
            }
        };
        __asyncDelegator2 = function(o) {
            var i, p6;
            return i = {}, verb("next"), verb("throw", function(e) {
                throw e;
            }), verb("return"), i[Symbol.iterator] = function() {
                return this;
            }, i;
            function verb(n, f) {
                i[n] = o[n] ? function(v7) {
                    return (p6 = !p6) ? {
                        value: __await2(o[n](v7)),
                        done: n === "return"
                    } : f ? f(v7) : v7;
                } : f;
            }
        };
        __asyncValues2 = function(o) {
            if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
            var m = o[Symbol.asyncIterator], i;
            return m ? m.call(o) : (o = typeof __values2 === "function" ? __values2(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
                return this;
            }, i);
            function verb(n) {
                i[n] = o[n] && function(v8) {
                    return new Promise(function(resolve, reject) {
                        v8 = o[n](v8), settle(resolve, reject, v8.done, v8.value);
                    });
                };
            }
            function settle(resolve, reject, d, v9) {
                Promise.resolve(v9).then(function(v2) {
                    resolve({
                        value: v2,
                        done: d
                    });
                }, reject);
            }
        };
        __makeTemplateObject2 = function(cooked, raw) {
            if (Object.defineProperty) {
                Object.defineProperty(cooked, "raw", {
                    value: raw
                });
            } else {
                cooked.raw = raw;
            }
            return cooked;
        };
        var __setModuleDefault = Object.create ? function(o, v10) {
            Object.defineProperty(o, "default", {
                enumerable: true,
                value: v10
            });
        } : function(o, v11) {
            o["default"] = v11;
        };
        __importStar2 = function(mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null) {
                for(var k6 in mod)if (k6 !== "default" && Object.prototype.hasOwnProperty.call(mod, k6)) __createBinding2(result, mod, k6);
            }
            __setModuleDefault(result, mod);
            return result;
        };
        __importDefault2 = function(mod) {
            return mod && mod.__esModule ? mod : {
                default: mod
            };
        };
        __classPrivateFieldGet2 = function(receiver, state, kind, f) {
            if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
            if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
            return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
        };
        __classPrivateFieldSet2 = function(receiver, state, value, kind, f) {
            if (kind === "m") throw new TypeError("Private method is not writable");
            if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
            if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
            return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
        };
        exporter("__extends", __extends2);
        exporter("__assign", __assign2);
        exporter("__rest", __rest2);
        exporter("__decorate", __decorate2);
        exporter("__param", __param2);
        exporter("__metadata", __metadata2);
        exporter("__awaiter", __awaiter2);
        exporter("__generator", __generator2);
        exporter("__exportStar", __exportStar2);
        exporter("__createBinding", __createBinding2);
        exporter("__values", __values2);
        exporter("__read", __read2);
        exporter("__spread", __spread2);
        exporter("__spreadArrays", __spreadArrays2);
        exporter("__spreadArray", __spreadArray2);
        exporter("__await", __await2);
        exporter("__asyncGenerator", __asyncGenerator2);
        exporter("__asyncDelegator", __asyncDelegator2);
        exporter("__asyncValues", __asyncValues2);
        exporter("__makeTemplateObject", __makeTemplateObject2);
        exporter("__importStar", __importStar2);
        exporter("__importDefault", __importDefault2);
        exporter("__classPrivateFieldGet", __classPrivateFieldGet2);
        exporter("__classPrivateFieldSet", __classPrivateFieldSet2);
    });
});
var tslib$1 = getDefaultExportFromCjs(tslib);
const { __extends , __assign , __rest , __decorate , __param , __metadata , __awaiter , __generator , __exportStar , __createBinding , __values , __read , __spread , __spreadArrays , __spreadArray , __await , __asyncGenerator , __asyncDelegator , __asyncValues , __makeTemplateObject , __importStar , __importDefault , __classPrivateFieldGet , __classPrivateFieldSet  } = tslib$1;
function _prodErrorMap() {
    return {
        ["dependent-sdk-initialized-before-auth"]: "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."
    };
}
const prodErrorMap = _prodErrorMap;
const _DEFAULT_AUTH_ERROR_FACTORY = new ErrorFactory("auth", "Firebase", _prodErrorMap());
const AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY = {
    ADMIN_ONLY_OPERATION: "auth/admin-restricted-operation",
    ARGUMENT_ERROR: "auth/argument-error",
    APP_NOT_AUTHORIZED: "auth/app-not-authorized",
    APP_NOT_INSTALLED: "auth/app-not-installed",
    CAPTCHA_CHECK_FAILED: "auth/captcha-check-failed",
    CODE_EXPIRED: "auth/code-expired",
    CORDOVA_NOT_READY: "auth/cordova-not-ready",
    CORS_UNSUPPORTED: "auth/cors-unsupported",
    CREDENTIAL_ALREADY_IN_USE: "auth/credential-already-in-use",
    CREDENTIAL_MISMATCH: "auth/custom-token-mismatch",
    CREDENTIAL_TOO_OLD_LOGIN_AGAIN: "auth/requires-recent-login",
    DEPENDENT_SDK_INIT_BEFORE_AUTH: "auth/dependent-sdk-initialized-before-auth",
    DYNAMIC_LINK_NOT_ACTIVATED: "auth/dynamic-link-not-activated",
    EMAIL_CHANGE_NEEDS_VERIFICATION: "auth/email-change-needs-verification",
    EMAIL_EXISTS: "auth/email-already-in-use",
    EMULATOR_CONFIG_FAILED: "auth/emulator-config-failed",
    EXPIRED_OOB_CODE: "auth/expired-action-code",
    EXPIRED_POPUP_REQUEST: "auth/cancelled-popup-request",
    INTERNAL_ERROR: "auth/internal-error",
    INVALID_API_KEY: "auth/invalid-api-key",
    INVALID_APP_CREDENTIAL: "auth/invalid-app-credential",
    INVALID_APP_ID: "auth/invalid-app-id",
    INVALID_AUTH: "auth/invalid-user-token",
    INVALID_AUTH_EVENT: "auth/invalid-auth-event",
    INVALID_CERT_HASH: "auth/invalid-cert-hash",
    INVALID_CODE: "auth/invalid-verification-code",
    INVALID_CONTINUE_URI: "auth/invalid-continue-uri",
    INVALID_CORDOVA_CONFIGURATION: "auth/invalid-cordova-configuration",
    INVALID_CUSTOM_TOKEN: "auth/invalid-custom-token",
    INVALID_DYNAMIC_LINK_DOMAIN: "auth/invalid-dynamic-link-domain",
    INVALID_EMAIL: "auth/invalid-email",
    INVALID_EMULATOR_SCHEME: "auth/invalid-emulator-scheme",
    INVALID_IDP_RESPONSE: "auth/invalid-credential",
    INVALID_MESSAGE_PAYLOAD: "auth/invalid-message-payload",
    INVALID_MFA_SESSION: "auth/invalid-multi-factor-session",
    INVALID_OAUTH_CLIENT_ID: "auth/invalid-oauth-client-id",
    INVALID_OAUTH_PROVIDER: "auth/invalid-oauth-provider",
    INVALID_OOB_CODE: "auth/invalid-action-code",
    INVALID_ORIGIN: "auth/unauthorized-domain",
    INVALID_PASSWORD: "auth/wrong-password",
    INVALID_PERSISTENCE: "auth/invalid-persistence-type",
    INVALID_PHONE_NUMBER: "auth/invalid-phone-number",
    INVALID_PROVIDER_ID: "auth/invalid-provider-id",
    INVALID_RECIPIENT_EMAIL: "auth/invalid-recipient-email",
    INVALID_SENDER: "auth/invalid-sender",
    INVALID_SESSION_INFO: "auth/invalid-verification-id",
    INVALID_TENANT_ID: "auth/invalid-tenant-id",
    MFA_INFO_NOT_FOUND: "auth/multi-factor-info-not-found",
    MFA_REQUIRED: "auth/multi-factor-auth-required",
    MISSING_ANDROID_PACKAGE_NAME: "auth/missing-android-pkg-name",
    MISSING_APP_CREDENTIAL: "auth/missing-app-credential",
    MISSING_AUTH_DOMAIN: "auth/auth-domain-config-required",
    MISSING_CODE: "auth/missing-verification-code",
    MISSING_CONTINUE_URI: "auth/missing-continue-uri",
    MISSING_IFRAME_START: "auth/missing-iframe-start",
    MISSING_IOS_BUNDLE_ID: "auth/missing-ios-bundle-id",
    MISSING_OR_INVALID_NONCE: "auth/missing-or-invalid-nonce",
    MISSING_MFA_INFO: "auth/missing-multi-factor-info",
    MISSING_MFA_SESSION: "auth/missing-multi-factor-session",
    MISSING_PHONE_NUMBER: "auth/missing-phone-number",
    MISSING_SESSION_INFO: "auth/missing-verification-id",
    MODULE_DESTROYED: "auth/app-deleted",
    NEED_CONFIRMATION: "auth/account-exists-with-different-credential",
    NETWORK_REQUEST_FAILED: "auth/network-request-failed",
    NULL_USER: "auth/null-user",
    NO_AUTH_EVENT: "auth/no-auth-event",
    NO_SUCH_PROVIDER: "auth/no-such-provider",
    OPERATION_NOT_ALLOWED: "auth/operation-not-allowed",
    OPERATION_NOT_SUPPORTED: "auth/operation-not-supported-in-this-environment",
    POPUP_BLOCKED: "auth/popup-blocked",
    POPUP_CLOSED_BY_USER: "auth/popup-closed-by-user",
    PROVIDER_ALREADY_LINKED: "auth/provider-already-linked",
    QUOTA_EXCEEDED: "auth/quota-exceeded",
    REDIRECT_CANCELLED_BY_USER: "auth/redirect-cancelled-by-user",
    REDIRECT_OPERATION_PENDING: "auth/redirect-operation-pending",
    REJECTED_CREDENTIAL: "auth/rejected-credential",
    SECOND_FACTOR_ALREADY_ENROLLED: "auth/second-factor-already-in-use",
    SECOND_FACTOR_LIMIT_EXCEEDED: "auth/maximum-second-factor-count-exceeded",
    TENANT_ID_MISMATCH: "auth/tenant-id-mismatch",
    TIMEOUT: "auth/timeout",
    TOKEN_EXPIRED: "auth/user-token-expired",
    TOO_MANY_ATTEMPTS_TRY_LATER: "auth/too-many-requests",
    UNAUTHORIZED_DOMAIN: "auth/unauthorized-continue-uri",
    UNSUPPORTED_FIRST_FACTOR: "auth/unsupported-first-factor",
    UNSUPPORTED_PERSISTENCE: "auth/unsupported-persistence-type",
    UNSUPPORTED_TENANT_OPERATION: "auth/unsupported-tenant-operation",
    UNVERIFIED_EMAIL: "auth/unverified-email",
    USER_CANCELLED: "auth/user-cancelled",
    USER_DELETED: "auth/user-not-found",
    USER_DISABLED: "auth/user-disabled",
    USER_MISMATCH: "auth/user-mismatch",
    USER_SIGNED_OUT: "auth/user-signed-out",
    WEAK_PASSWORD: "auth/weak-password",
    WEB_STORAGE_UNSUPPORTED: "auth/web-storage-unsupported",
    ALREADY_INITIALIZED: "auth/already-initialized"
};
const logClient = new Logger("@firebase/auth");
function _logError(msg, ...args) {
    if (logClient.logLevel <= LogLevel.ERROR) {
        logClient.error(`Auth (${SDK_VERSION}): ${msg}`, ...args);
    }
}
function _fail(authOrCode, ...rest) {
    throw createErrorInternal(authOrCode, ...rest);
}
function _createError(authOrCode, ...rest) {
    return createErrorInternal(authOrCode, ...rest);
}
function _errorWithCustomMessage(auth1, code, message) {
    const errorMap = Object.assign(Object.assign({}, prodErrorMap()), {
        [code]: message
    });
    const factory = new ErrorFactory("auth", "Firebase", errorMap);
    return factory.create(code, {
        appName: auth1.name
    });
}
function createErrorInternal(authOrCode, ...rest) {
    if (typeof authOrCode !== "string") {
        const code = rest[0];
        const fullParams = [
            ...rest.slice(1)
        ];
        if (fullParams[0]) {
            fullParams[0].appName = authOrCode.name;
        }
        return authOrCode._errorFactory.create(code, ...fullParams);
    }
    return _DEFAULT_AUTH_ERROR_FACTORY.create(authOrCode, ...rest);
}
function _assert(assertion, authOrCode, ...rest) {
    if (!assertion) {
        throw createErrorInternal(authOrCode, ...rest);
    }
}
function debugFail(failure) {
    const message = `INTERNAL ASSERTION FAILED: ` + failure;
    _logError(message);
    throw new Error(message);
}
function debugAssert(assertion, message) {
    if (!assertion) {
        debugFail(message);
    }
}
const instanceCache = new Map();
function _getInstance(cls) {
    debugAssert(cls instanceof Function, "Expected a class definition");
    let instance = instanceCache.get(cls);
    if (instance) {
        debugAssert(instance instanceof cls, "Instance stored in cache mismatched with class");
        return instance;
    }
    instance = new cls();
    instanceCache.set(cls, instance);
    return instance;
}
function initializeAuth(app2, deps) {
    const provider = _getProvider(app2, "auth");
    if (provider.isInitialized()) {
        const auth2 = provider.getImmediate();
        const initialOptions = provider.getOptions();
        if (deepEqual(initialOptions, deps !== null && deps !== void 0 ? deps : {})) {
            return auth2;
        } else {
            _fail(auth2, "already-initialized");
        }
    }
    const auth2 = provider.initialize({
        options: deps
    });
    return auth2;
}
function _initializeAuthInstance(auth3, deps) {
    const persistence = (deps === null || deps === void 0 ? void 0 : deps.persistence) || [];
    const hierarchy = (Array.isArray(persistence) ? persistence : [
        persistence
    ]).map(_getInstance);
    if (deps === null || deps === void 0 ? void 0 : deps.errorMap) {
        auth3._updateErrorMap(deps.errorMap);
    }
    auth3._initializeWithPersistence(hierarchy, deps === null || deps === void 0 ? void 0 : deps.popupRedirectResolver);
}
function _getCurrentUrl() {
    var _a;
    return typeof self !== "undefined" && ((_a = self.location) === null || _a === void 0 ? void 0 : _a.href) || "";
}
function _isHttpOrHttps() {
    return _getCurrentScheme() === "http:" || _getCurrentScheme() === "https:";
}
function _getCurrentScheme() {
    var _a;
    return typeof self !== "undefined" && ((_a = self.location) === null || _a === void 0 ? void 0 : _a.protocol) || null;
}
function _isOnline() {
    if (typeof navigator !== "undefined" && navigator && "onLine" in navigator && typeof navigator.onLine === "boolean" && (_isHttpOrHttps() || isBrowserExtension() || "connection" in navigator)) {
        return navigator.onLine;
    }
    return true;
}
function _getUserLanguage() {
    if (typeof navigator === "undefined") {
        return null;
    }
    const navigatorLanguage = navigator;
    return navigatorLanguage.languages && navigatorLanguage.languages[0] || navigatorLanguage.language || null;
}
class Delay {
    constructor(shortDelay, longDelay){
        this.shortDelay = shortDelay;
        this.longDelay = longDelay;
        debugAssert(longDelay > shortDelay, "Short delay should be less than long delay!");
        this.isMobile = isMobileCordova() || isReactNative();
    }
    get() {
        if (!_isOnline()) {
            return Math.min(5000, this.shortDelay);
        }
        return this.isMobile ? this.longDelay : this.shortDelay;
    }
}
function _emulatorUrl(config3, path) {
    debugAssert(config3.emulator, "Emulator should always be set here");
    const { url  } = config3.emulator;
    if (!path) {
        return url;
    }
    return `${url}${path.startsWith("/") ? path.slice(1) : path}`;
}
class FetchProvider {
    static initialize(fetchImpl, headersImpl, responseImpl) {
        this.fetchImpl = fetchImpl;
        if (headersImpl) {
            this.headersImpl = headersImpl;
        }
        if (responseImpl) {
            this.responseImpl = responseImpl;
        }
    }
    static fetch() {
        if (this.fetchImpl) {
            return this.fetchImpl;
        }
        if (typeof self !== "undefined" && "fetch" in self) {
            return self.fetch;
        }
        debugFail("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
    }
    static headers() {
        if (this.headersImpl) {
            return this.headersImpl;
        }
        if (typeof self !== "undefined" && "Headers" in self) {
            return self.Headers;
        }
        debugFail("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
    }
    static response() {
        if (this.responseImpl) {
            return this.responseImpl;
        }
        if (typeof self !== "undefined" && "Response" in self) {
            return self.Response;
        }
        debugFail("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
    }
}
const SERVER_ERROR_MAP = {
    ["CREDENTIAL_MISMATCH"]: "custom-token-mismatch",
    ["MISSING_CUSTOM_TOKEN"]: "internal-error",
    ["INVALID_IDENTIFIER"]: "invalid-email",
    ["MISSING_CONTINUE_URI"]: "internal-error",
    ["INVALID_PASSWORD"]: "wrong-password",
    ["MISSING_PASSWORD"]: "internal-error",
    ["EMAIL_EXISTS"]: "email-already-in-use",
    ["PASSWORD_LOGIN_DISABLED"]: "operation-not-allowed",
    ["INVALID_IDP_RESPONSE"]: "invalid-credential",
    ["INVALID_PENDING_TOKEN"]: "invalid-credential",
    ["FEDERATED_USER_ID_ALREADY_LINKED"]: "credential-already-in-use",
    ["MISSING_REQ_TYPE"]: "internal-error",
    ["EMAIL_NOT_FOUND"]: "user-not-found",
    ["RESET_PASSWORD_EXCEED_LIMIT"]: "too-many-requests",
    ["EXPIRED_OOB_CODE"]: "expired-action-code",
    ["INVALID_OOB_CODE"]: "invalid-action-code",
    ["MISSING_OOB_CODE"]: "internal-error",
    ["CREDENTIAL_TOO_OLD_LOGIN_AGAIN"]: "requires-recent-login",
    ["INVALID_ID_TOKEN"]: "invalid-user-token",
    ["TOKEN_EXPIRED"]: "user-token-expired",
    ["USER_NOT_FOUND"]: "user-token-expired",
    ["TOO_MANY_ATTEMPTS_TRY_LATER"]: "too-many-requests",
    ["INVALID_CODE"]: "invalid-verification-code",
    ["INVALID_SESSION_INFO"]: "invalid-verification-id",
    ["INVALID_TEMPORARY_PROOF"]: "invalid-credential",
    ["MISSING_SESSION_INFO"]: "missing-verification-id",
    ["SESSION_EXPIRED"]: "code-expired",
    ["MISSING_ANDROID_PACKAGE_NAME"]: "missing-android-pkg-name",
    ["UNAUTHORIZED_DOMAIN"]: "unauthorized-continue-uri",
    ["INVALID_OAUTH_CLIENT_ID"]: "invalid-oauth-client-id",
    ["ADMIN_ONLY_OPERATION"]: "admin-restricted-operation",
    ["INVALID_MFA_PENDING_CREDENTIAL"]: "invalid-multi-factor-session",
    ["MFA_ENROLLMENT_NOT_FOUND"]: "multi-factor-info-not-found",
    ["MISSING_MFA_ENROLLMENT_ID"]: "missing-multi-factor-info",
    ["MISSING_MFA_PENDING_CREDENTIAL"]: "missing-multi-factor-session",
    ["SECOND_FACTOR_EXISTS"]: "second-factor-already-in-use",
    ["SECOND_FACTOR_LIMIT_EXCEEDED"]: "maximum-second-factor-count-exceeded",
    ["BLOCKING_FUNCTION_ERROR_RESPONSE"]: "internal-error"
};
const DEFAULT_API_TIMEOUT_MS = new Delay(30000, 60000);
function _addTidIfNecessary(auth4, request) {
    if (auth4.tenantId && !request.tenantId) {
        return Object.assign(Object.assign({}, request), {
            tenantId: auth4.tenantId
        });
    }
    return request;
}
async function _performApiRequest(auth5, method, path, request, customErrorMap = {}) {
    return _performFetchWithErrorHandling(auth5, customErrorMap, async ()=>{
        let body = {};
        let params = {};
        if (request) {
            if (method === "GET") {
                params = request;
            } else {
                body = {
                    body: JSON.stringify(request)
                };
            }
        }
        const query = querystring(Object.assign({
            key: auth5.config.apiKey
        }, params)).slice(1);
        const headers = await auth5._getAdditionalHeaders();
        headers["Content-Type"] = "application/json";
        if (auth5.languageCode) {
            headers["X-Firebase-Locale"] = auth5.languageCode;
        }
        return FetchProvider.fetch()(_getFinalTarget(auth5, auth5.config.apiHost, path, query), Object.assign({
            method,
            headers,
            referrerPolicy: "no-referrer"
        }, body));
    });
}
async function _performFetchWithErrorHandling(auth6, customErrorMap, fetchFn) {
    auth6._canInitEmulator = false;
    const errorMap = Object.assign(Object.assign({}, SERVER_ERROR_MAP), customErrorMap);
    try {
        const networkTimeout = new NetworkTimeout(auth6);
        const response = await Promise.race([
            fetchFn(),
            networkTimeout.promise
        ]);
        networkTimeout.clearNetworkTimeout();
        const json = await response.json();
        if ("needConfirmation" in json) {
            throw _makeTaggedError(auth6, "account-exists-with-different-credential", json);
        }
        if (response.ok && !("errorMessage" in json)) {
            return json;
        } else {
            const errorMessage = response.ok ? json.errorMessage : json.error.message;
            const [serverErrorCode, serverErrorMessage] = errorMessage.split(" : ");
            if (serverErrorCode === "FEDERATED_USER_ID_ALREADY_LINKED") {
                throw _makeTaggedError(auth6, "credential-already-in-use", json);
            } else if (serverErrorCode === "EMAIL_EXISTS") {
                throw _makeTaggedError(auth6, "email-already-in-use", json);
            }
            const authError = errorMap[serverErrorCode] || serverErrorCode.toLowerCase().replace(/[_\s]+/g, "-");
            if (serverErrorMessage) {
                throw _errorWithCustomMessage(auth6, authError, serverErrorMessage);
            } else {
                _fail(auth6, authError);
            }
        }
    } catch (e) {
        if (e instanceof FirebaseError) {
            throw e;
        }
        _fail(auth6, "network-request-failed");
    }
}
async function _performSignInRequest(auth7, method, path, request, customErrorMap = {}) {
    const serverResponse = await _performApiRequest(auth7, method, path, request, customErrorMap);
    if ("mfaPendingCredential" in serverResponse) {
        _fail(auth7, "multi-factor-auth-required", {
            _serverResponse: serverResponse
        });
    }
    return serverResponse;
}
function _getFinalTarget(auth8, host, path, query) {
    const base = `${host}${path}?${query}`;
    if (!auth8.config.emulator) {
        return `${auth8.config.apiScheme}://${base}`;
    }
    return _emulatorUrl(auth8.config, base);
}
class NetworkTimeout {
    constructor(auth9){
        this.auth = auth9;
        this.timer = null;
        this.promise = new Promise((_, reject)=>{
            this.timer = setTimeout(()=>{
                return reject(_createError(this.auth, "network-request-failed"));
            }, DEFAULT_API_TIMEOUT_MS.get());
        });
    }
    clearNetworkTimeout() {
        clearTimeout(this.timer);
    }
}
function _makeTaggedError(auth10, code, response) {
    const errorParams = {
        appName: auth10.name
    };
    if (response.email) {
        errorParams.email = response.email;
    }
    if (response.phoneNumber) {
        errorParams.phoneNumber = response.phoneNumber;
    }
    const error7 = _createError(auth10, code, errorParams);
    error7.customData._tokenResponse = response;
    return error7;
}
async function deleteAccount(auth11, request) {
    return _performApiRequest(auth11, "POST", "/v1/accounts:delete", request);
}
async function getAccountInfo(auth12, request) {
    return _performApiRequest(auth12, "POST", "/v1/accounts:lookup", request);
}
function utcTimestampToDateString(utcTimestamp) {
    if (!utcTimestamp) {
        return void 0;
    }
    try {
        const date = new Date(Number(utcTimestamp));
        if (!isNaN(date.getTime())) {
            return date.toUTCString();
        }
    } catch (e) {}
    return void 0;
}
async function getIdTokenResult(user, forceRefresh = false) {
    const userInternal = getModularInstance(user);
    const token = await userInternal.getIdToken(forceRefresh);
    const claims = _parseToken(token);
    _assert(claims && claims.exp && claims.auth_time && claims.iat, userInternal.auth, "internal-error");
    const firebase = typeof claims.firebase === "object" ? claims.firebase : void 0;
    const signInProvider = firebase === null || firebase === void 0 ? void 0 : firebase["sign_in_provider"];
    return {
        claims,
        token,
        authTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.auth_time)),
        issuedAtTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.iat)),
        expirationTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.exp)),
        signInProvider: signInProvider || null,
        signInSecondFactor: (firebase === null || firebase === void 0 ? void 0 : firebase["sign_in_second_factor"]) || null
    };
}
function secondsStringToMilliseconds(seconds) {
    return Number(seconds) * 1000;
}
function _parseToken(token) {
    const [algorithm, payload, signature] = token.split(".");
    if (algorithm === void 0 || payload === void 0 || signature === void 0) {
        _logError("JWT malformed, contained fewer than 3 sections");
        return null;
    }
    try {
        const decoded = base64Decode(payload);
        if (!decoded) {
            _logError("Failed to decode base64 JWT payload");
            return null;
        }
        return JSON.parse(decoded);
    } catch (e) {
        _logError("Caught error parsing JWT payload as JSON", e);
        return null;
    }
}
function _tokenExpiresIn(token) {
    const parsedToken = _parseToken(token);
    _assert(parsedToken, "internal-error");
    _assert(typeof parsedToken.exp !== "undefined", "internal-error");
    _assert(typeof parsedToken.iat !== "undefined", "internal-error");
    return Number(parsedToken.exp) - Number(parsedToken.iat);
}
async function _logoutIfInvalidated(user, promise, bypassAuthState = false) {
    if (bypassAuthState) {
        return promise;
    }
    try {
        return await promise;
    } catch (e) {
        if (e instanceof FirebaseError && isUserInvalidated(e)) {
            if (user.auth.currentUser === user) {
                await user.auth.signOut();
            }
        }
        throw e;
    }
}
function isUserInvalidated({ code  }) {
    return code === `auth/${"user-disabled"}` || code === `auth/${"user-token-expired"}`;
}
class ProactiveRefresh {
    constructor(user){
        this.user = user;
        this.isRunning = false;
        this.timerId = null;
        this.errorBackoff = 30000;
    }
    _start() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.schedule();
    }
    _stop() {
        if (!this.isRunning) {
            return;
        }
        this.isRunning = false;
        if (this.timerId !== null) {
            clearTimeout(this.timerId);
        }
    }
    getInterval(wasError) {
        var _a;
        if (wasError) {
            const interval = this.errorBackoff;
            this.errorBackoff = Math.min(this.errorBackoff * 2, 960000);
            return interval;
        } else {
            this.errorBackoff = 30000;
            const expTime = (_a = this.user.stsTokenManager.expirationTime) !== null && _a !== void 0 ? _a : 0;
            const interval = expTime - Date.now() - 300000;
            return Math.max(0, interval);
        }
    }
    schedule(wasError = false) {
        if (!this.isRunning) {
            return;
        }
        const interval = this.getInterval(wasError);
        this.timerId = setTimeout(async ()=>{
            await this.iteration();
        }, interval);
    }
    async iteration() {
        try {
            await this.user.getIdToken(true);
        } catch (e) {
            if (e.code === `auth/${"network-request-failed"}`) {
                this.schedule(true);
            }
            return;
        }
        this.schedule();
    }
}
class UserMetadata {
    constructor(createdAt, lastLoginAt){
        this.createdAt = createdAt;
        this.lastLoginAt = lastLoginAt;
        this._initializeTime();
    }
    _initializeTime() {
        this.lastSignInTime = utcTimestampToDateString(this.lastLoginAt);
        this.creationTime = utcTimestampToDateString(this.createdAt);
    }
    _copy(metadata) {
        this.createdAt = metadata.createdAt;
        this.lastLoginAt = metadata.lastLoginAt;
        this._initializeTime();
    }
    toJSON() {
        return {
            createdAt: this.createdAt,
            lastLoginAt: this.lastLoginAt
        };
    }
}
async function _reloadWithoutSaving(user) {
    var _a;
    const auth13 = user.auth;
    const idToken = await user.getIdToken();
    const response = await _logoutIfInvalidated(user, getAccountInfo(auth13, {
        idToken
    }));
    _assert(response === null || response === void 0 ? void 0 : response.users.length, auth13, "internal-error");
    const coreAccount = response.users[0];
    user._notifyReloadListener(coreAccount);
    const newProviderData = ((_a = coreAccount.providerUserInfo) === null || _a === void 0 ? void 0 : _a.length) ? extractProviderData(coreAccount.providerUserInfo) : [];
    const providerData = mergeProviderData(user.providerData, newProviderData);
    const oldIsAnonymous = user.isAnonymous;
    const newIsAnonymous = !(user.email && coreAccount.passwordHash) && !(providerData === null || providerData === void 0 ? void 0 : providerData.length);
    const isAnonymous = !oldIsAnonymous ? false : newIsAnonymous;
    const updates = {
        uid: coreAccount.localId,
        displayName: coreAccount.displayName || null,
        photoURL: coreAccount.photoUrl || null,
        email: coreAccount.email || null,
        emailVerified: coreAccount.emailVerified || false,
        phoneNumber: coreAccount.phoneNumber || null,
        tenantId: coreAccount.tenantId || null,
        providerData,
        metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
        isAnonymous
    };
    Object.assign(user, updates);
}
async function reload(user) {
    const userInternal = getModularInstance(user);
    await _reloadWithoutSaving(userInternal);
    await userInternal.auth._persistUserIfCurrent(userInternal);
    userInternal.auth._notifyListenersIfCurrent(userInternal);
}
function mergeProviderData(original, newData) {
    const deduped = original.filter((o)=>!newData.some((n)=>n.providerId === o.providerId
        )
    );
    return [
        ...deduped,
        ...newData
    ];
}
function extractProviderData(providers) {
    return providers.map((_a)=>{
        var { providerId  } = _a, provider = __rest(_a, [
            "providerId"
        ]);
        return {
            providerId,
            uid: provider.rawId || "",
            displayName: provider.displayName || null,
            email: provider.email || null,
            phoneNumber: provider.phoneNumber || null,
            photoURL: provider.photoUrl || null
        };
    });
}
async function requestStsToken(auth14, refreshToken) {
    const response = await _performFetchWithErrorHandling(auth14, {}, async ()=>{
        const body = querystring({
            grant_type: "refresh_token",
            refresh_token: refreshToken
        }).slice(1);
        const { tokenApiHost , apiKey  } = auth14.config;
        const url = _getFinalTarget(auth14, tokenApiHost, "/v1/token", `key=${apiKey}`);
        const headers = await auth14._getAdditionalHeaders();
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        return FetchProvider.fetch()(url, {
            method: "POST",
            headers,
            body
        });
    });
    return {
        accessToken: response.access_token,
        expiresIn: response.expires_in,
        refreshToken: response.refresh_token
    };
}
class StsTokenManager {
    constructor(){
        this.refreshToken = null;
        this.accessToken = null;
        this.expirationTime = null;
    }
    get isExpired() {
        return !this.expirationTime || Date.now() > this.expirationTime - 30000;
    }
    updateFromServerResponse(response) {
        _assert(response.idToken, "internal-error");
        _assert(typeof response.idToken !== "undefined", "internal-error");
        _assert(typeof response.refreshToken !== "undefined", "internal-error");
        const expiresIn = "expiresIn" in response && typeof response.expiresIn !== "undefined" ? Number(response.expiresIn) : _tokenExpiresIn(response.idToken);
        this.updateTokensAndExpiration(response.idToken, response.refreshToken, expiresIn);
    }
    async getToken(auth15, forceRefresh = false) {
        _assert(!this.accessToken || this.refreshToken, auth15, "user-token-expired");
        if (!forceRefresh && this.accessToken && !this.isExpired) {
            return this.accessToken;
        }
        if (this.refreshToken) {
            await this.refresh(auth15, this.refreshToken);
            return this.accessToken;
        }
        return null;
    }
    clearRefreshToken() {
        this.refreshToken = null;
    }
    async refresh(auth16, oldToken) {
        const { accessToken , refreshToken , expiresIn  } = await requestStsToken(auth16, oldToken);
        this.updateTokensAndExpiration(accessToken, refreshToken, Number(expiresIn));
    }
    updateTokensAndExpiration(accessToken, refreshToken, expiresInSec) {
        this.refreshToken = refreshToken || null;
        this.accessToken = accessToken || null;
        this.expirationTime = Date.now() + expiresInSec * 1000;
    }
    static fromJSON(appName, object) {
        const { refreshToken , accessToken , expirationTime  } = object;
        const manager = new StsTokenManager();
        if (refreshToken) {
            _assert(typeof refreshToken === "string", "internal-error", {
                appName
            });
            manager.refreshToken = refreshToken;
        }
        if (accessToken) {
            _assert(typeof accessToken === "string", "internal-error", {
                appName
            });
            manager.accessToken = accessToken;
        }
        if (expirationTime) {
            _assert(typeof expirationTime === "number", "internal-error", {
                appName
            });
            manager.expirationTime = expirationTime;
        }
        return manager;
    }
    toJSON() {
        return {
            refreshToken: this.refreshToken,
            accessToken: this.accessToken,
            expirationTime: this.expirationTime
        };
    }
    _assign(stsTokenManager) {
        this.accessToken = stsTokenManager.accessToken;
        this.refreshToken = stsTokenManager.refreshToken;
        this.expirationTime = stsTokenManager.expirationTime;
    }
    _clone() {
        return Object.assign(new StsTokenManager(), this.toJSON());
    }
    _performRefresh() {
        return debugFail("not implemented");
    }
}
function assertStringOrUndefined(assertion, appName) {
    _assert(typeof assertion === "string" || typeof assertion === "undefined", "internal-error", {
        appName
    });
}
class UserImpl {
    constructor(_a){
        var { uid , auth: auth17 , stsTokenManager  } = _a, opt = __rest(_a, [
            "uid",
            "auth",
            "stsTokenManager"
        ]);
        this.providerId = "firebase";
        this.proactiveRefresh = new ProactiveRefresh(this);
        this.reloadUserInfo = null;
        this.reloadListener = null;
        this.uid = uid;
        this.auth = auth17;
        this.stsTokenManager = stsTokenManager;
        this.accessToken = stsTokenManager.accessToken;
        this.displayName = opt.displayName || null;
        this.email = opt.email || null;
        this.emailVerified = opt.emailVerified || false;
        this.phoneNumber = opt.phoneNumber || null;
        this.photoURL = opt.photoURL || null;
        this.isAnonymous = opt.isAnonymous || false;
        this.tenantId = opt.tenantId || null;
        this.providerData = opt.providerData ? [
            ...opt.providerData
        ] : [];
        this.metadata = new UserMetadata(opt.createdAt || void 0, opt.lastLoginAt || void 0);
    }
    async getIdToken(forceRefresh) {
        const accessToken = await _logoutIfInvalidated(this, this.stsTokenManager.getToken(this.auth, forceRefresh));
        _assert(accessToken, this.auth, "internal-error");
        if (this.accessToken !== accessToken) {
            this.accessToken = accessToken;
            await this.auth._persistUserIfCurrent(this);
            this.auth._notifyListenersIfCurrent(this);
        }
        return accessToken;
    }
    getIdTokenResult(forceRefresh) {
        return getIdTokenResult(this, forceRefresh);
    }
    reload() {
        return reload(this);
    }
    _assign(user) {
        if (this === user) {
            return;
        }
        _assert(this.uid === user.uid, this.auth, "internal-error");
        this.displayName = user.displayName;
        this.photoURL = user.photoURL;
        this.email = user.email;
        this.emailVerified = user.emailVerified;
        this.phoneNumber = user.phoneNumber;
        this.isAnonymous = user.isAnonymous;
        this.tenantId = user.tenantId;
        this.providerData = user.providerData.map((userInfo)=>Object.assign({}, userInfo)
        );
        this.metadata._copy(user.metadata);
        this.stsTokenManager._assign(user.stsTokenManager);
    }
    _clone(auth18) {
        return new UserImpl(Object.assign(Object.assign({}, this), {
            auth: auth18,
            stsTokenManager: this.stsTokenManager._clone()
        }));
    }
    _onReload(callback) {
        _assert(!this.reloadListener, this.auth, "internal-error");
        this.reloadListener = callback;
        if (this.reloadUserInfo) {
            this._notifyReloadListener(this.reloadUserInfo);
            this.reloadUserInfo = null;
        }
    }
    _notifyReloadListener(userInfo) {
        if (this.reloadListener) {
            this.reloadListener(userInfo);
        } else {
            this.reloadUserInfo = userInfo;
        }
    }
    _startProactiveRefresh() {
        this.proactiveRefresh._start();
    }
    _stopProactiveRefresh() {
        this.proactiveRefresh._stop();
    }
    async _updateTokensIfNecessary(response, reload2 = false) {
        let tokensRefreshed = false;
        if (response.idToken && response.idToken !== this.stsTokenManager.accessToken) {
            this.stsTokenManager.updateFromServerResponse(response);
            tokensRefreshed = true;
        }
        if (reload2) {
            await _reloadWithoutSaving(this);
        }
        await this.auth._persistUserIfCurrent(this);
        if (tokensRefreshed) {
            this.auth._notifyListenersIfCurrent(this);
        }
    }
    async delete() {
        const idToken = await this.getIdToken();
        await _logoutIfInvalidated(this, deleteAccount(this.auth, {
            idToken
        }));
        this.stsTokenManager.clearRefreshToken();
        return this.auth.signOut();
    }
    toJSON() {
        return Object.assign(Object.assign({
            uid: this.uid,
            email: this.email || void 0,
            emailVerified: this.emailVerified,
            displayName: this.displayName || void 0,
            isAnonymous: this.isAnonymous,
            photoURL: this.photoURL || void 0,
            phoneNumber: this.phoneNumber || void 0,
            tenantId: this.tenantId || void 0,
            providerData: this.providerData.map((userInfo)=>Object.assign({}, userInfo)
            ),
            stsTokenManager: this.stsTokenManager.toJSON(),
            _redirectEventId: this._redirectEventId
        }, this.metadata.toJSON()), {
            apiKey: this.auth.config.apiKey,
            appName: this.auth.name
        });
    }
    get refreshToken() {
        return this.stsTokenManager.refreshToken || "";
    }
    static _fromJSON(auth19, object) {
        var _a, _b, _c1, _d, _e1, _f, _g, _h1;
        const displayName = (_a = object.displayName) !== null && _a !== void 0 ? _a : void 0;
        const email = (_b = object.email) !== null && _b !== void 0 ? _b : void 0;
        const phoneNumber = (_c1 = object.phoneNumber) !== null && _c1 !== void 0 ? _c1 : void 0;
        const photoURL = (_d = object.photoURL) !== null && _d !== void 0 ? _d : void 0;
        const tenantId = (_e1 = object.tenantId) !== null && _e1 !== void 0 ? _e1 : void 0;
        const _redirectEventId = (_f = object._redirectEventId) !== null && _f !== void 0 ? _f : void 0;
        const createdAt = (_g = object.createdAt) !== null && _g !== void 0 ? _g : void 0;
        const lastLoginAt = (_h1 = object.lastLoginAt) !== null && _h1 !== void 0 ? _h1 : void 0;
        const { uid , emailVerified , isAnonymous , providerData , stsTokenManager: plainObjectTokenManager  } = object;
        _assert(uid && plainObjectTokenManager, auth19, "internal-error");
        const stsTokenManager = StsTokenManager.fromJSON(this.name, plainObjectTokenManager);
        _assert(typeof uid === "string", auth19, "internal-error");
        assertStringOrUndefined(displayName, auth19.name);
        assertStringOrUndefined(email, auth19.name);
        _assert(typeof emailVerified === "boolean", auth19, "internal-error");
        _assert(typeof isAnonymous === "boolean", auth19, "internal-error");
        assertStringOrUndefined(phoneNumber, auth19.name);
        assertStringOrUndefined(photoURL, auth19.name);
        assertStringOrUndefined(tenantId, auth19.name);
        assertStringOrUndefined(_redirectEventId, auth19.name);
        assertStringOrUndefined(createdAt, auth19.name);
        assertStringOrUndefined(lastLoginAt, auth19.name);
        const user = new UserImpl({
            uid,
            auth: auth19,
            email,
            emailVerified,
            displayName,
            isAnonymous,
            photoURL,
            phoneNumber,
            tenantId,
            stsTokenManager,
            createdAt,
            lastLoginAt
        });
        if (providerData && Array.isArray(providerData)) {
            user.providerData = providerData.map((userInfo)=>Object.assign({}, userInfo)
            );
        }
        if (_redirectEventId) {
            user._redirectEventId = _redirectEventId;
        }
        return user;
    }
    static async _fromIdTokenResponse(auth20, idTokenResponse, isAnonymous = false) {
        const stsTokenManager = new StsTokenManager();
        stsTokenManager.updateFromServerResponse(idTokenResponse);
        const user = new UserImpl({
            uid: idTokenResponse.localId,
            auth: auth20,
            stsTokenManager,
            isAnonymous
        });
        await _reloadWithoutSaving(user);
        return user;
    }
}
class InMemoryPersistence {
    constructor(){
        this.type = "NONE";
        this.storage = {};
    }
    async _isAvailable() {
        return true;
    }
    async _set(key11, value) {
        this.storage[key11] = value;
    }
    async _get(key12) {
        const value = this.storage[key12];
        return value === void 0 ? null : value;
    }
    async _remove(key13) {
        delete this.storage[key13];
    }
    _addListener(_key, _listener) {
        return;
    }
    _removeListener(_key, _listener) {
        return;
    }
}
InMemoryPersistence.type = "NONE";
const inMemoryPersistence = InMemoryPersistence;
function _persistenceKeyName(key14, apiKey, appName) {
    return `${"firebase"}:${key14}:${apiKey}:${appName}`;
}
class PersistenceUserManager {
    constructor(persistence, auth21, userKey){
        this.persistence = persistence;
        this.auth = auth21;
        this.userKey = userKey;
        const { config: config4 , name: name2  } = this.auth;
        this.fullUserKey = _persistenceKeyName(this.userKey, config4.apiKey, name2);
        this.fullPersistenceKey = _persistenceKeyName("persistence", config4.apiKey, name2);
        this.boundEventHandler = auth21._onStorageEvent.bind(auth21);
        this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
    }
    setCurrentUser(user) {
        return this.persistence._set(this.fullUserKey, user.toJSON());
    }
    async getCurrentUser() {
        const blob = await this.persistence._get(this.fullUserKey);
        return blob ? UserImpl._fromJSON(this.auth, blob) : null;
    }
    removeCurrentUser() {
        return this.persistence._remove(this.fullUserKey);
    }
    savePersistenceForRedirect() {
        return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
    }
    async setPersistence(newPersistence) {
        if (this.persistence === newPersistence) {
            return;
        }
        const currentUser = await this.getCurrentUser();
        await this.removeCurrentUser();
        this.persistence = newPersistence;
        if (currentUser) {
            return this.setCurrentUser(currentUser);
        }
    }
    delete() {
        this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
    }
    static async create(auth22, persistenceHierarchy, userKey = "authUser") {
        if (!persistenceHierarchy.length) {
            return new PersistenceUserManager(_getInstance(inMemoryPersistence), auth22, userKey);
        }
        const availablePersistences = (await Promise.all(persistenceHierarchy.map(async (persistence)=>{
            if (await persistence._isAvailable()) {
                return persistence;
            }
            return void 0;
        }))).filter((persistence)=>persistence
        );
        let selectedPersistence = availablePersistences[0] || _getInstance(inMemoryPersistence);
        const key15 = _persistenceKeyName(userKey, auth22.config.apiKey, auth22.name);
        let userToMigrate = null;
        for (const persistence1 of persistenceHierarchy){
            try {
                const blob = await persistence1._get(key15);
                if (blob) {
                    const user = UserImpl._fromJSON(auth22, blob);
                    if (persistence1 !== selectedPersistence) {
                        userToMigrate = user;
                    }
                    selectedPersistence = persistence1;
                    break;
                }
            } catch (_a) {}
        }
        const migrationHierarchy = availablePersistences.filter((p7)=>p7._shouldAllowMigration
        );
        if (!selectedPersistence._shouldAllowMigration || !migrationHierarchy.length) {
            return new PersistenceUserManager(selectedPersistence, auth22, userKey);
        }
        selectedPersistence = migrationHierarchy[0];
        if (userToMigrate) {
            await selectedPersistence._set(key15, userToMigrate.toJSON());
        }
        await Promise.all(persistenceHierarchy.map(async (persistence)=>{
            if (persistence !== selectedPersistence) {
                try {
                    await persistence._remove(key15);
                } catch (_a) {}
            }
        }));
        return new PersistenceUserManager(selectedPersistence, auth22, userKey);
    }
}
function _getBrowserName(userAgent) {
    const ua3 = userAgent.toLowerCase();
    if (ua3.includes("opera/") || ua3.includes("opr/") || ua3.includes("opios/")) {
        return "Opera";
    } else if (_isIEMobile(ua3)) {
        return "IEMobile";
    } else if (ua3.includes("msie") || ua3.includes("trident/")) {
        return "IE";
    } else if (ua3.includes("edge/")) {
        return "Edge";
    } else if (_isFirefox(ua3)) {
        return "Firefox";
    } else if (ua3.includes("silk/")) {
        return "Silk";
    } else if (_isBlackBerry(ua3)) {
        return "Blackberry";
    } else if (_isWebOS(ua3)) {
        return "Webos";
    } else if (_isSafari(ua3)) {
        return "Safari";
    } else if ((ua3.includes("chrome/") || _isChromeIOS(ua3)) && !ua3.includes("edge/")) {
        return "Chrome";
    } else if (_isAndroid(ua3)) {
        return "Android";
    } else {
        const re1 = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/;
        const matches = userAgent.match(re1);
        if ((matches === null || matches === void 0 ? void 0 : matches.length) === 2) {
            return matches[1];
        }
    }
    return "Other";
}
function _isFirefox(ua4 = getUA()) {
    return /firefox\//i.test(ua4);
}
function _isSafari(userAgent = getUA()) {
    const ua5 = userAgent.toLowerCase();
    return ua5.includes("safari/") && !ua5.includes("chrome/") && !ua5.includes("crios/") && !ua5.includes("android");
}
function _isChromeIOS(ua6 = getUA()) {
    return /crios\//i.test(ua6);
}
function _isIEMobile(ua7 = getUA()) {
    return /iemobile/i.test(ua7);
}
function _isAndroid(ua8 = getUA()) {
    return /android/i.test(ua8);
}
function _isBlackBerry(ua9 = getUA()) {
    return /blackberry/i.test(ua9);
}
function _isWebOS(ua10 = getUA()) {
    return /webos/i.test(ua10);
}
function _isIOS(ua11 = getUA()) {
    return /iphone|ipad|ipod/i.test(ua11);
}
function _isIOSStandalone(ua12 = getUA()) {
    var _a;
    return _isIOS(ua12) && !!((_a = window.navigator) === null || _a === void 0 ? void 0 : _a.standalone);
}
function _isIE10() {
    return isIE() && document.documentMode === 10;
}
function _isMobileBrowser(ua13 = getUA()) {
    return _isIOS(ua13) || _isAndroid(ua13) || _isWebOS(ua13) || _isBlackBerry(ua13) || /windows phone/i.test(ua13) || _isIEMobile(ua13);
}
function _isIframe() {
    try {
        return !!(window && window !== window.top);
    } catch (e) {
        return false;
    }
}
function _getClientVersion(clientPlatform, frameworks = []) {
    let reportedPlatform;
    switch(clientPlatform){
        case "Browser":
            reportedPlatform = _getBrowserName(getUA());
            break;
        case "Worker":
            reportedPlatform = `${_getBrowserName(getUA())}-${clientPlatform}`;
            break;
        default:
            reportedPlatform = clientPlatform;
    }
    const reportedFrameworks = frameworks.length ? frameworks.join(",") : "FirebaseCore-web";
    return `${reportedPlatform}/${"JsCore"}/${SDK_VERSION}/${reportedFrameworks}`;
}
class AuthImpl {
    constructor(app2, heartbeatServiceProvider, config5){
        this.app = app2;
        this.heartbeatServiceProvider = heartbeatServiceProvider;
        this.config = config5;
        this.currentUser = null;
        this.emulatorConfig = null;
        this.operations = Promise.resolve();
        this.authStateSubscription = new Subscription(this);
        this.idTokenSubscription = new Subscription(this);
        this.redirectUser = null;
        this.isProactiveRefreshEnabled = false;
        this._canInitEmulator = true;
        this._isInitialized = false;
        this._deleted = false;
        this._initializationPromise = null;
        this._popupRedirectResolver = null;
        this._errorFactory = _DEFAULT_AUTH_ERROR_FACTORY;
        this.lastNotifiedUid = void 0;
        this.languageCode = null;
        this.tenantId = null;
        this.settings = {
            appVerificationDisabledForTesting: false
        };
        this.frameworks = [];
        this.name = app2.name;
        this.clientVersion = config5.sdkClientVersion;
    }
    _initializeWithPersistence(persistenceHierarchy, popupRedirectResolver) {
        if (popupRedirectResolver) {
            this._popupRedirectResolver = _getInstance(popupRedirectResolver);
        }
        this._initializationPromise = this.queue(async ()=>{
            var _a, _b;
            if (this._deleted) {
                return;
            }
            this.persistenceManager = await PersistenceUserManager.create(this, persistenceHierarchy);
            if (this._deleted) {
                return;
            }
            if ((_a = this._popupRedirectResolver) === null || _a === void 0 ? void 0 : _a._shouldInitProactively) {
                try {
                    await this._popupRedirectResolver._initialize(this);
                } catch (e) {}
            }
            await this.initializeCurrentUser(popupRedirectResolver);
            this.lastNotifiedUid = ((_b = this.currentUser) === null || _b === void 0 ? void 0 : _b.uid) || null;
            if (this._deleted) {
                return;
            }
            this._isInitialized = true;
        });
        return this._initializationPromise;
    }
    async _onStorageEvent() {
        if (this._deleted) {
            return;
        }
        const user = await this.assertedPersistence.getCurrentUser();
        if (!this.currentUser && !user) {
            return;
        }
        if (this.currentUser && user && this.currentUser.uid === user.uid) {
            this._currentUser._assign(user);
            await this.currentUser.getIdToken();
            return;
        }
        await this._updateCurrentUser(user);
    }
    async initializeCurrentUser(popupRedirectResolver) {
        var _a;
        let storedUser = await this.assertedPersistence.getCurrentUser();
        if (popupRedirectResolver && this.config.authDomain) {
            await this.getOrInitRedirectPersistenceManager();
            const redirectUserEventId = (_a = this.redirectUser) === null || _a === void 0 ? void 0 : _a._redirectEventId;
            const storedUserEventId = storedUser === null || storedUser === void 0 ? void 0 : storedUser._redirectEventId;
            const result = await this.tryRedirectSignIn(popupRedirectResolver);
            if ((!redirectUserEventId || redirectUserEventId === storedUserEventId) && (result === null || result === void 0 ? void 0 : result.user)) {
                storedUser = result.user;
            }
        }
        if (!storedUser) {
            return this.directlySetCurrentUser(null);
        }
        if (!storedUser._redirectEventId) {
            return this.reloadAndSetCurrentUserOrClear(storedUser);
        }
        _assert(this._popupRedirectResolver, this, "argument-error");
        await this.getOrInitRedirectPersistenceManager();
        if (this.redirectUser && this.redirectUser._redirectEventId === storedUser._redirectEventId) {
            return this.directlySetCurrentUser(storedUser);
        }
        return this.reloadAndSetCurrentUserOrClear(storedUser);
    }
    async tryRedirectSignIn(redirectResolver) {
        let result = null;
        try {
            result = await this._popupRedirectResolver._completeRedirectFn(this, redirectResolver, true);
        } catch (e) {
            await this._setRedirectUser(null);
        }
        return result;
    }
    async reloadAndSetCurrentUserOrClear(user) {
        try {
            await _reloadWithoutSaving(user);
        } catch (e) {
            if (e.code !== `auth/${"network-request-failed"}`) {
                return this.directlySetCurrentUser(null);
            }
        }
        return this.directlySetCurrentUser(user);
    }
    useDeviceLanguage() {
        this.languageCode = _getUserLanguage();
    }
    async _delete() {
        this._deleted = true;
    }
    async updateCurrentUser(userExtern) {
        const user = userExtern ? getModularInstance(userExtern) : null;
        if (user) {
            _assert(user.auth.config.apiKey === this.config.apiKey, this, "invalid-user-token");
        }
        return this._updateCurrentUser(user && user._clone(this));
    }
    async _updateCurrentUser(user) {
        if (this._deleted) {
            return;
        }
        if (user) {
            _assert(this.tenantId === user.tenantId, this, "tenant-id-mismatch");
        }
        return this.queue(async ()=>{
            await this.directlySetCurrentUser(user);
            this.notifyAuthListeners();
        });
    }
    async signOut() {
        if (this.redirectPersistenceManager || this._popupRedirectResolver) {
            await this._setRedirectUser(null);
        }
        return this._updateCurrentUser(null);
    }
    setPersistence(persistence) {
        return this.queue(async ()=>{
            await this.assertedPersistence.setPersistence(_getInstance(persistence));
        });
    }
    _getPersistence() {
        return this.assertedPersistence.persistence.type;
    }
    _updateErrorMap(errorMap) {
        this._errorFactory = new ErrorFactory("auth", "Firebase", errorMap());
    }
    onAuthStateChanged(nextOrObserver, error8, completed) {
        return this.registerStateListener(this.authStateSubscription, nextOrObserver, error8, completed);
    }
    onIdTokenChanged(nextOrObserver, error9, completed) {
        return this.registerStateListener(this.idTokenSubscription, nextOrObserver, error9, completed);
    }
    toJSON() {
        var _a;
        return {
            apiKey: this.config.apiKey,
            authDomain: this.config.authDomain,
            appName: this.name,
            currentUser: (_a = this._currentUser) === null || _a === void 0 ? void 0 : _a.toJSON()
        };
    }
    async _setRedirectUser(user, popupRedirectResolver) {
        const redirectManager = await this.getOrInitRedirectPersistenceManager(popupRedirectResolver);
        return user === null ? redirectManager.removeCurrentUser() : redirectManager.setCurrentUser(user);
    }
    async getOrInitRedirectPersistenceManager(popupRedirectResolver) {
        if (!this.redirectPersistenceManager) {
            const resolver = popupRedirectResolver && _getInstance(popupRedirectResolver) || this._popupRedirectResolver;
            _assert(resolver, this, "argument-error");
            this.redirectPersistenceManager = await PersistenceUserManager.create(this, [
                _getInstance(resolver._redirectPersistence)
            ], "redirectUser");
            this.redirectUser = await this.redirectPersistenceManager.getCurrentUser();
        }
        return this.redirectPersistenceManager;
    }
    async _redirectUserForId(id2) {
        var _a, _b;
        if (this._isInitialized) {
            await this.queue(async ()=>{});
        }
        if (((_a = this._currentUser) === null || _a === void 0 ? void 0 : _a._redirectEventId) === id2) {
            return this._currentUser;
        }
        if (((_b = this.redirectUser) === null || _b === void 0 ? void 0 : _b._redirectEventId) === id2) {
            return this.redirectUser;
        }
        return null;
    }
    async _persistUserIfCurrent(user) {
        if (user === this.currentUser) {
            return this.queue(async ()=>this.directlySetCurrentUser(user)
            );
        }
    }
    _notifyListenersIfCurrent(user) {
        if (user === this.currentUser) {
            this.notifyAuthListeners();
        }
    }
    _key() {
        return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
    }
    _startProactiveRefresh() {
        this.isProactiveRefreshEnabled = true;
        if (this.currentUser) {
            this._currentUser._startProactiveRefresh();
        }
    }
    _stopProactiveRefresh() {
        this.isProactiveRefreshEnabled = false;
        if (this.currentUser) {
            this._currentUser._stopProactiveRefresh();
        }
    }
    get _currentUser() {
        return this.currentUser;
    }
    notifyAuthListeners() {
        var _a, _b;
        if (!this._isInitialized) {
            return;
        }
        this.idTokenSubscription.next(this.currentUser);
        const currentUid = (_b = (_a = this.currentUser) === null || _a === void 0 ? void 0 : _a.uid) !== null && _b !== void 0 ? _b : null;
        if (this.lastNotifiedUid !== currentUid) {
            this.lastNotifiedUid = currentUid;
            this.authStateSubscription.next(this.currentUser);
        }
    }
    registerStateListener(subscription, nextOrObserver, error10, completed) {
        if (this._deleted) {
            return ()=>{};
        }
        const cb1 = typeof nextOrObserver === "function" ? nextOrObserver : nextOrObserver.next.bind(nextOrObserver);
        const promise = this._isInitialized ? Promise.resolve() : this._initializationPromise;
        _assert(promise, this, "internal-error");
        promise.then(()=>cb1(this.currentUser)
        );
        if (typeof nextOrObserver === "function") {
            return subscription.addObserver(nextOrObserver, error10, completed);
        } else {
            return subscription.addObserver(nextOrObserver);
        }
    }
    async directlySetCurrentUser(user) {
        if (this.currentUser && this.currentUser !== user) {
            this._currentUser._stopProactiveRefresh();
            if (user && this.isProactiveRefreshEnabled) {
                user._startProactiveRefresh();
            }
        }
        this.currentUser = user;
        if (user) {
            await this.assertedPersistence.setCurrentUser(user);
        } else {
            await this.assertedPersistence.removeCurrentUser();
        }
    }
    queue(action) {
        this.operations = this.operations.then(action, action);
        return this.operations;
    }
    get assertedPersistence() {
        _assert(this.persistenceManager, this, "internal-error");
        return this.persistenceManager;
    }
    _logFramework(framework) {
        if (!framework || this.frameworks.includes(framework)) {
            return;
        }
        this.frameworks.push(framework);
        this.frameworks.sort();
        this.clientVersion = _getClientVersion(this.config.clientPlatform, this._getFrameworks());
    }
    _getFrameworks() {
        return this.frameworks;
    }
    async _getAdditionalHeaders() {
        var _a;
        const headers = {
            ["X-Client-Version"]: this.clientVersion
        };
        if (this.app.options.appId) {
            headers["X-Firebase-gmpid"] = this.app.options.appId;
        }
        const heartbeatsHeader = await ((_a = this.heartbeatServiceProvider.getImmediate({
            optional: true
        })) === null || _a === void 0 ? void 0 : _a.getHeartbeatsHeader());
        if (heartbeatsHeader) {
            headers["X-Firebase-Client"] = heartbeatsHeader;
        }
        return headers;
    }
}
function _castAuth(auth23) {
    return getModularInstance(auth23);
}
class Subscription {
    constructor(auth24){
        this.auth = auth24;
        this.observer = null;
        this.addObserver = createSubscribe((observer)=>this.observer = observer
        );
    }
    get next() {
        _assert(this.observer, this.auth, "internal-error");
        return this.observer.next.bind(this.observer);
    }
}
class AuthCredential {
    constructor(providerId, signInMethod){
        this.providerId = providerId;
        this.signInMethod = signInMethod;
    }
    toJSON() {
        return debugFail("not implemented");
    }
    _getIdTokenResponse(_auth) {
        return debugFail("not implemented");
    }
    _linkToIdToken(_auth, _idToken) {
        return debugFail("not implemented");
    }
    _getReauthenticationResolver(_auth) {
        return debugFail("not implemented");
    }
}
async function updateEmailPassword(auth25, request) {
    return _performApiRequest(auth25, "POST", "/v1/accounts:update", request);
}
async function signInWithPassword(auth26, request) {
    return _performSignInRequest(auth26, "POST", "/v1/accounts:signInWithPassword", _addTidIfNecessary(auth26, request));
}
async function signInWithEmailLink$1(auth27, request) {
    return _performSignInRequest(auth27, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth27, request));
}
async function signInWithEmailLinkForLinking(auth28, request) {
    return _performSignInRequest(auth28, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth28, request));
}
class EmailAuthCredential extends AuthCredential {
    constructor(_email, _password, signInMethod, _tenantId = null){
        super("password", signInMethod);
        this._email = _email;
        this._password = _password;
        this._tenantId = _tenantId;
    }
    static _fromEmailAndPassword(email, password) {
        return new EmailAuthCredential(email, password, "password");
    }
    static _fromEmailAndCode(email, oobCode, tenantId = null) {
        return new EmailAuthCredential(email, oobCode, "emailLink", tenantId);
    }
    toJSON() {
        return {
            email: this._email,
            password: this._password,
            signInMethod: this.signInMethod,
            tenantId: this._tenantId
        };
    }
    static fromJSON(json) {
        const obj = typeof json === "string" ? JSON.parse(json) : json;
        if ((obj === null || obj === void 0 ? void 0 : obj.email) && (obj === null || obj === void 0 ? void 0 : obj.password)) {
            if (obj.signInMethod === "password") {
                return this._fromEmailAndPassword(obj.email, obj.password);
            } else if (obj.signInMethod === "emailLink") {
                return this._fromEmailAndCode(obj.email, obj.password, obj.tenantId);
            }
        }
        return null;
    }
    async _getIdTokenResponse(auth29) {
        switch(this.signInMethod){
            case "password":
                return signInWithPassword(auth29, {
                    returnSecureToken: true,
                    email: this._email,
                    password: this._password
                });
            case "emailLink":
                return signInWithEmailLink$1(auth29, {
                    email: this._email,
                    oobCode: this._password
                });
            default:
                _fail(auth29, "internal-error");
        }
    }
    async _linkToIdToken(auth30, idToken) {
        switch(this.signInMethod){
            case "password":
                return updateEmailPassword(auth30, {
                    idToken,
                    returnSecureToken: true,
                    email: this._email,
                    password: this._password
                });
            case "emailLink":
                return signInWithEmailLinkForLinking(auth30, {
                    idToken,
                    email: this._email,
                    oobCode: this._password
                });
            default:
                _fail(auth30, "internal-error");
        }
    }
    _getReauthenticationResolver(auth31) {
        return this._getIdTokenResponse(auth31);
    }
}
async function signInWithIdp(auth32, request) {
    return _performSignInRequest(auth32, "POST", "/v1/accounts:signInWithIdp", _addTidIfNecessary(auth32, request));
}
const IDP_REQUEST_URI$1 = "http://localhost";
class OAuthCredential extends AuthCredential {
    constructor(){
        super(...arguments);
        this.pendingToken = null;
    }
    static _fromParams(params) {
        const cred = new OAuthCredential(params.providerId, params.signInMethod);
        if (params.idToken || params.accessToken) {
            if (params.idToken) {
                cred.idToken = params.idToken;
            }
            if (params.accessToken) {
                cred.accessToken = params.accessToken;
            }
            if (params.nonce && !params.pendingToken) {
                cred.nonce = params.nonce;
            }
            if (params.pendingToken) {
                cred.pendingToken = params.pendingToken;
            }
        } else if (params.oauthToken && params.oauthTokenSecret) {
            cred.accessToken = params.oauthToken;
            cred.secret = params.oauthTokenSecret;
        } else {
            _fail("argument-error");
        }
        return cred;
    }
    toJSON() {
        return {
            idToken: this.idToken,
            accessToken: this.accessToken,
            secret: this.secret,
            nonce: this.nonce,
            pendingToken: this.pendingToken,
            providerId: this.providerId,
            signInMethod: this.signInMethod
        };
    }
    static fromJSON(json) {
        const obj = typeof json === "string" ? JSON.parse(json) : json;
        const { providerId , signInMethod  } = obj, rest = __rest(obj, [
            "providerId",
            "signInMethod"
        ]);
        if (!providerId || !signInMethod) {
            return null;
        }
        const cred = new OAuthCredential(providerId, signInMethod);
        cred.idToken = rest.idToken || void 0;
        cred.accessToken = rest.accessToken || void 0;
        cred.secret = rest.secret;
        cred.nonce = rest.nonce;
        cred.pendingToken = rest.pendingToken || null;
        return cred;
    }
    _getIdTokenResponse(auth33) {
        const request = this.buildRequest();
        return signInWithIdp(auth33, request);
    }
    _linkToIdToken(auth34, idToken) {
        const request = this.buildRequest();
        request.idToken = idToken;
        return signInWithIdp(auth34, request);
    }
    _getReauthenticationResolver(auth35) {
        const request = this.buildRequest();
        request.autoCreate = false;
        return signInWithIdp(auth35, request);
    }
    buildRequest() {
        const request = {
            requestUri: IDP_REQUEST_URI$1,
            returnSecureToken: true
        };
        if (this.pendingToken) {
            request.pendingToken = this.pendingToken;
        } else {
            const postBody = {};
            if (this.idToken) {
                postBody["id_token"] = this.idToken;
            }
            if (this.accessToken) {
                postBody["access_token"] = this.accessToken;
            }
            if (this.secret) {
                postBody["oauth_token_secret"] = this.secret;
            }
            postBody["providerId"] = this.providerId;
            if (this.nonce && !this.pendingToken) {
                postBody["nonce"] = this.nonce;
            }
            request.postBody = querystring(postBody);
        }
        return request;
    }
}
async function sendPhoneVerificationCode(auth36, request) {
    return _performApiRequest(auth36, "POST", "/v1/accounts:sendVerificationCode", _addTidIfNecessary(auth36, request));
}
async function signInWithPhoneNumber$1(auth37, request) {
    return _performSignInRequest(auth37, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth37, request));
}
async function linkWithPhoneNumber$1(auth38, request) {
    const response = await _performSignInRequest(auth38, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth38, request));
    if (response.temporaryProof) {
        throw _makeTaggedError(auth38, "account-exists-with-different-credential", response);
    }
    return response;
}
const VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_ = {
    ["USER_NOT_FOUND"]: "user-not-found"
};
async function verifyPhoneNumberForExisting(auth39, request) {
    const apiRequest = Object.assign(Object.assign({}, request), {
        operation: "REAUTH"
    });
    return _performSignInRequest(auth39, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth39, apiRequest), VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_);
}
class PhoneAuthCredential extends AuthCredential {
    constructor(params){
        super("phone", "phone");
        this.params = params;
    }
    static _fromVerification(verificationId, verificationCode) {
        return new PhoneAuthCredential({
            verificationId,
            verificationCode
        });
    }
    static _fromTokenResponse(phoneNumber, temporaryProof) {
        return new PhoneAuthCredential({
            phoneNumber,
            temporaryProof
        });
    }
    _getIdTokenResponse(auth40) {
        return signInWithPhoneNumber$1(auth40, this._makeVerificationRequest());
    }
    _linkToIdToken(auth41, idToken) {
        return linkWithPhoneNumber$1(auth41, Object.assign({
            idToken
        }, this._makeVerificationRequest()));
    }
    _getReauthenticationResolver(auth42) {
        return verifyPhoneNumberForExisting(auth42, this._makeVerificationRequest());
    }
    _makeVerificationRequest() {
        const { temporaryProof , phoneNumber , verificationId , verificationCode  } = this.params;
        if (temporaryProof && phoneNumber) {
            return {
                temporaryProof,
                phoneNumber
            };
        }
        return {
            sessionInfo: verificationId,
            code: verificationCode
        };
    }
    toJSON() {
        const obj = {
            providerId: this.providerId
        };
        if (this.params.phoneNumber) {
            obj.phoneNumber = this.params.phoneNumber;
        }
        if (this.params.temporaryProof) {
            obj.temporaryProof = this.params.temporaryProof;
        }
        if (this.params.verificationCode) {
            obj.verificationCode = this.params.verificationCode;
        }
        if (this.params.verificationId) {
            obj.verificationId = this.params.verificationId;
        }
        return obj;
    }
    static fromJSON(json) {
        if (typeof json === "string") {
            json = JSON.parse(json);
        }
        const { verificationId , verificationCode , phoneNumber , temporaryProof  } = json;
        if (!verificationCode && !verificationId && !phoneNumber && !temporaryProof) {
            return null;
        }
        return new PhoneAuthCredential({
            verificationId,
            verificationCode,
            phoneNumber,
            temporaryProof
        });
    }
}
function parseMode(mode) {
    switch(mode){
        case "recoverEmail":
            return "RECOVER_EMAIL";
        case "resetPassword":
            return "PASSWORD_RESET";
        case "signIn":
            return "EMAIL_SIGNIN";
        case "verifyEmail":
            return "VERIFY_EMAIL";
        case "verifyAndChangeEmail":
            return "VERIFY_AND_CHANGE_EMAIL";
        case "revertSecondFactorAddition":
            return "REVERT_SECOND_FACTOR_ADDITION";
        default:
            return null;
    }
}
function parseDeepLink(url) {
    const link = querystringDecode(extractQuerystring(url))["link"];
    const doubleDeepLink = link ? querystringDecode(extractQuerystring(link))["deep_link_id"] : null;
    const iOSDeepLink = querystringDecode(extractQuerystring(url))["deep_link_id"];
    const iOSDoubleDeepLink = iOSDeepLink ? querystringDecode(extractQuerystring(iOSDeepLink))["link"] : null;
    return iOSDoubleDeepLink || iOSDeepLink || doubleDeepLink || link || url;
}
class ActionCodeURL {
    constructor(actionLink){
        var _a, _b, _c2, _d, _e2, _f;
        const searchParams = querystringDecode(extractQuerystring(actionLink));
        const apiKey = (_a = searchParams["apiKey"]) !== null && _a !== void 0 ? _a : null;
        const code = (_b = searchParams["oobCode"]) !== null && _b !== void 0 ? _b : null;
        const operation = parseMode((_c2 = searchParams["mode"]) !== null && _c2 !== void 0 ? _c2 : null);
        _assert(apiKey && code && operation, "argument-error");
        this.apiKey = apiKey;
        this.operation = operation;
        this.code = code;
        this.continueUrl = (_d = searchParams["continueUrl"]) !== null && _d !== void 0 ? _d : null;
        this.languageCode = (_e2 = searchParams["languageCode"]) !== null && _e2 !== void 0 ? _e2 : null;
        this.tenantId = (_f = searchParams["tenantId"]) !== null && _f !== void 0 ? _f : null;
    }
    static parseLink(link) {
        const actionLink = parseDeepLink(link);
        try {
            return new ActionCodeURL(actionLink);
        } catch (_a) {
            return null;
        }
    }
}
class EmailAuthProvider {
    constructor(){
        this.providerId = EmailAuthProvider.PROVIDER_ID;
    }
    static credential(email, password) {
        return EmailAuthCredential._fromEmailAndPassword(email, password);
    }
    static credentialWithLink(email, emailLink) {
        const actionCodeUrl = ActionCodeURL.parseLink(emailLink);
        _assert(actionCodeUrl, "argument-error");
        return EmailAuthCredential._fromEmailAndCode(email, actionCodeUrl.code, actionCodeUrl.tenantId);
    }
}
EmailAuthProvider.PROVIDER_ID = "password";
EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD = "password";
EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD = "emailLink";
class FederatedAuthProvider {
    constructor(providerId){
        this.providerId = providerId;
        this.defaultLanguageCode = null;
        this.customParameters = {};
    }
    setDefaultLanguage(languageCode) {
        this.defaultLanguageCode = languageCode;
    }
    setCustomParameters(customOAuthParameters) {
        this.customParameters = customOAuthParameters;
        return this;
    }
    getCustomParameters() {
        return this.customParameters;
    }
}
class BaseOAuthProvider extends FederatedAuthProvider {
    constructor(){
        super(...arguments);
        this.scopes = [];
    }
    addScope(scope) {
        if (!this.scopes.includes(scope)) {
            this.scopes.push(scope);
        }
        return this;
    }
    getScopes() {
        return [
            ...this.scopes
        ];
    }
}
class OAuthProvider extends BaseOAuthProvider {
    static credentialFromJSON(json) {
        const obj = typeof json === "string" ? JSON.parse(json) : json;
        _assert("providerId" in obj && "signInMethod" in obj, "argument-error");
        return OAuthCredential._fromParams(obj);
    }
    credential(params) {
        return this._credential(Object.assign(Object.assign({}, params), {
            nonce: params.rawNonce
        }));
    }
    _credential(params) {
        _assert(params.idToken || params.accessToken, "argument-error");
        return OAuthCredential._fromParams(Object.assign(Object.assign({}, params), {
            providerId: this.providerId,
            signInMethod: this.providerId
        }));
    }
    static credentialFromResult(userCredential) {
        return OAuthProvider.oauthCredentialFromTaggedObject(userCredential);
    }
    static credentialFromError(error11) {
        return OAuthProvider.oauthCredentialFromTaggedObject(error11.customData || {});
    }
    static oauthCredentialFromTaggedObject({ _tokenResponse: tokenResponse  }) {
        if (!tokenResponse) {
            return null;
        }
        const { oauthIdToken , oauthAccessToken , oauthTokenSecret , pendingToken , nonce , providerId  } = tokenResponse;
        if (!oauthAccessToken && !oauthTokenSecret && !oauthIdToken && !pendingToken) {
            return null;
        }
        if (!providerId) {
            return null;
        }
        try {
            return new OAuthProvider(providerId)._credential({
                idToken: oauthIdToken,
                accessToken: oauthAccessToken,
                nonce,
                pendingToken
            });
        } catch (e) {
            return null;
        }
    }
}
class FacebookAuthProvider extends BaseOAuthProvider {
    constructor(){
        super("facebook.com");
    }
    static credential(accessToken) {
        return OAuthCredential._fromParams({
            providerId: FacebookAuthProvider.PROVIDER_ID,
            signInMethod: FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD,
            accessToken
        });
    }
    static credentialFromResult(userCredential) {
        return FacebookAuthProvider.credentialFromTaggedObject(userCredential);
    }
    static credentialFromError(error12) {
        return FacebookAuthProvider.credentialFromTaggedObject(error12.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse  }) {
        if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
            return null;
        }
        if (!tokenResponse.oauthAccessToken) {
            return null;
        }
        try {
            return FacebookAuthProvider.credential(tokenResponse.oauthAccessToken);
        } catch (_a) {
            return null;
        }
    }
}
FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD = "facebook.com";
FacebookAuthProvider.PROVIDER_ID = "facebook.com";
class GoogleAuthProvider extends BaseOAuthProvider {
    constructor(){
        super("google.com");
        this.addScope("profile");
    }
    static credential(idToken, accessToken) {
        return OAuthCredential._fromParams({
            providerId: GoogleAuthProvider.PROVIDER_ID,
            signInMethod: GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
            idToken,
            accessToken
        });
    }
    static credentialFromResult(userCredential) {
        return GoogleAuthProvider.credentialFromTaggedObject(userCredential);
    }
    static credentialFromError(error13) {
        return GoogleAuthProvider.credentialFromTaggedObject(error13.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse  }) {
        if (!tokenResponse) {
            return null;
        }
        const { oauthIdToken , oauthAccessToken  } = tokenResponse;
        if (!oauthIdToken && !oauthAccessToken) {
            return null;
        }
        try {
            return GoogleAuthProvider.credential(oauthIdToken, oauthAccessToken);
        } catch (_a) {
            return null;
        }
    }
}
GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD = "google.com";
GoogleAuthProvider.PROVIDER_ID = "google.com";
class GithubAuthProvider extends BaseOAuthProvider {
    constructor(){
        super("github.com");
    }
    static credential(accessToken) {
        return OAuthCredential._fromParams({
            providerId: GithubAuthProvider.PROVIDER_ID,
            signInMethod: GithubAuthProvider.GITHUB_SIGN_IN_METHOD,
            accessToken
        });
    }
    static credentialFromResult(userCredential) {
        return GithubAuthProvider.credentialFromTaggedObject(userCredential);
    }
    static credentialFromError(error14) {
        return GithubAuthProvider.credentialFromTaggedObject(error14.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse  }) {
        if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
            return null;
        }
        if (!tokenResponse.oauthAccessToken) {
            return null;
        }
        try {
            return GithubAuthProvider.credential(tokenResponse.oauthAccessToken);
        } catch (_a) {
            return null;
        }
    }
}
GithubAuthProvider.GITHUB_SIGN_IN_METHOD = "github.com";
GithubAuthProvider.PROVIDER_ID = "github.com";
const IDP_REQUEST_URI = "http://localhost";
class SAMLAuthCredential extends AuthCredential {
    constructor(providerId, pendingToken){
        super(providerId, providerId);
        this.pendingToken = pendingToken;
    }
    _getIdTokenResponse(auth43) {
        const request = this.buildRequest();
        return signInWithIdp(auth43, request);
    }
    _linkToIdToken(auth44, idToken) {
        const request = this.buildRequest();
        request.idToken = idToken;
        return signInWithIdp(auth44, request);
    }
    _getReauthenticationResolver(auth45) {
        const request = this.buildRequest();
        request.autoCreate = false;
        return signInWithIdp(auth45, request);
    }
    toJSON() {
        return {
            signInMethod: this.signInMethod,
            providerId: this.providerId,
            pendingToken: this.pendingToken
        };
    }
    static fromJSON(json) {
        const obj = typeof json === "string" ? JSON.parse(json) : json;
        const { providerId , signInMethod , pendingToken  } = obj;
        if (!providerId || !signInMethod || !pendingToken || providerId !== signInMethod) {
            return null;
        }
        return new SAMLAuthCredential(providerId, pendingToken);
    }
    static _create(providerId, pendingToken) {
        return new SAMLAuthCredential(providerId, pendingToken);
    }
    buildRequest() {
        return {
            requestUri: IDP_REQUEST_URI,
            returnSecureToken: true,
            pendingToken: this.pendingToken
        };
    }
}
const SAML_PROVIDER_PREFIX = "saml.";
class SAMLAuthProvider extends FederatedAuthProvider {
    constructor(providerId){
        _assert(providerId.startsWith(SAML_PROVIDER_PREFIX), "argument-error");
        super(providerId);
    }
    static credentialFromResult(userCredential) {
        return SAMLAuthProvider.samlCredentialFromTaggedObject(userCredential);
    }
    static credentialFromError(error15) {
        return SAMLAuthProvider.samlCredentialFromTaggedObject(error15.customData || {});
    }
    static credentialFromJSON(json) {
        const credential = SAMLAuthCredential.fromJSON(json);
        _assert(credential, "argument-error");
        return credential;
    }
    static samlCredentialFromTaggedObject({ _tokenResponse: tokenResponse  }) {
        if (!tokenResponse) {
            return null;
        }
        const { pendingToken , providerId  } = tokenResponse;
        if (!pendingToken || !providerId) {
            return null;
        }
        try {
            return SAMLAuthCredential._create(providerId, pendingToken);
        } catch (e) {
            return null;
        }
    }
}
class TwitterAuthProvider extends BaseOAuthProvider {
    constructor(){
        super("twitter.com");
    }
    static credential(token, secret) {
        return OAuthCredential._fromParams({
            providerId: TwitterAuthProvider.PROVIDER_ID,
            signInMethod: TwitterAuthProvider.TWITTER_SIGN_IN_METHOD,
            oauthToken: token,
            oauthTokenSecret: secret
        });
    }
    static credentialFromResult(userCredential) {
        return TwitterAuthProvider.credentialFromTaggedObject(userCredential);
    }
    static credentialFromError(error16) {
        return TwitterAuthProvider.credentialFromTaggedObject(error16.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse  }) {
        if (!tokenResponse) {
            return null;
        }
        const { oauthAccessToken , oauthTokenSecret  } = tokenResponse;
        if (!oauthAccessToken || !oauthTokenSecret) {
            return null;
        }
        try {
            return TwitterAuthProvider.credential(oauthAccessToken, oauthTokenSecret);
        } catch (_a) {
            return null;
        }
    }
}
TwitterAuthProvider.TWITTER_SIGN_IN_METHOD = "twitter.com";
TwitterAuthProvider.PROVIDER_ID = "twitter.com";
async function signUp(auth46, request) {
    return _performSignInRequest(auth46, "POST", "/v1/accounts:signUp", _addTidIfNecessary(auth46, request));
}
class UserCredentialImpl {
    constructor(params){
        this.user = params.user;
        this.providerId = params.providerId;
        this._tokenResponse = params._tokenResponse;
        this.operationType = params.operationType;
    }
    static async _fromIdTokenResponse(auth47, operationType, idTokenResponse, isAnonymous = false) {
        const user = await UserImpl._fromIdTokenResponse(auth47, idTokenResponse, isAnonymous);
        const providerId = providerIdForResponse(idTokenResponse);
        const userCred = new UserCredentialImpl({
            user,
            providerId,
            _tokenResponse: idTokenResponse,
            operationType
        });
        return userCred;
    }
    static async _forOperation(user, operationType, response) {
        await user._updateTokensIfNecessary(response, true);
        const providerId = providerIdForResponse(response);
        return new UserCredentialImpl({
            user,
            providerId,
            _tokenResponse: response,
            operationType
        });
    }
}
function providerIdForResponse(response) {
    if (response.providerId) {
        return response.providerId;
    }
    if ("phoneNumber" in response) {
        return "phone";
    }
    return null;
}
class MultiFactorError extends FirebaseError {
    constructor(auth48, error17, operationType, user){
        var _a;
        super(error17.code, error17.message);
        this.operationType = operationType;
        this.user = user;
        Object.setPrototypeOf(this, MultiFactorError.prototype);
        this.customData = {
            appName: auth48.name,
            tenantId: (_a = auth48.tenantId) !== null && _a !== void 0 ? _a : void 0,
            _serverResponse: error17.customData._serverResponse,
            operationType
        };
    }
    static _fromErrorAndOperation(auth49, error18, operationType, user) {
        return new MultiFactorError(auth49, error18, operationType, user);
    }
}
function _processCredentialSavingMfaContextIfNecessary(auth50, operationType, credential, user) {
    const idTokenProvider = operationType === "reauthenticate" ? credential._getReauthenticationResolver(auth50) : credential._getIdTokenResponse(auth50);
    return idTokenProvider.catch((error19)=>{
        if (error19.code === `auth/${"multi-factor-auth-required"}`) {
            throw MultiFactorError._fromErrorAndOperation(auth50, error19, operationType, user);
        }
        throw error19;
    });
}
async function _link$1(user, credential, bypassAuthState = false) {
    const response = await _logoutIfInvalidated(user, credential._linkToIdToken(user.auth, await user.getIdToken()), bypassAuthState);
    return UserCredentialImpl._forOperation(user, "link", response);
}
async function _reauthenticate(user, credential, bypassAuthState = false) {
    const { auth: auth51  } = user;
    const operationType = "reauthenticate";
    try {
        const response = await _logoutIfInvalidated(user, _processCredentialSavingMfaContextIfNecessary(auth51, operationType, credential, user), bypassAuthState);
        _assert(response.idToken, auth51, "internal-error");
        const parsed = _parseToken(response.idToken);
        _assert(parsed, auth51, "internal-error");
        const { sub: localId  } = parsed;
        _assert(user.uid === localId, auth51, "user-mismatch");
        return UserCredentialImpl._forOperation(user, operationType, response);
    } catch (e) {
        if ((e === null || e === void 0 ? void 0 : e.code) === `auth/${"user-not-found"}`) {
            _fail(auth51, "user-mismatch");
        }
        throw e;
    }
}
async function _signInWithCredential(auth52, credential, bypassAuthState = false) {
    const operationType = "signIn";
    const response = await _processCredentialSavingMfaContextIfNecessary(auth52, operationType, credential);
    const userCredential = await UserCredentialImpl._fromIdTokenResponse(auth52, operationType, response);
    if (!bypassAuthState) {
        await auth52._updateCurrentUser(userCredential.user);
    }
    return userCredential;
}
async function signInWithCredential(auth53, credential) {
    return _signInWithCredential(_castAuth(auth53), credential);
}
class MultiFactorInfoImpl {
    constructor(factorId, response){
        this.factorId = factorId;
        this.uid = response.mfaEnrollmentId;
        this.enrollmentTime = new Date(response.enrolledAt).toUTCString();
        this.displayName = response.displayName;
    }
    static _fromServerResponse(auth54, enrollment) {
        if ("phoneInfo" in enrollment) {
            return PhoneMultiFactorInfoImpl._fromServerResponse(auth54, enrollment);
        }
        return _fail(auth54, "internal-error");
    }
}
class PhoneMultiFactorInfoImpl extends MultiFactorInfoImpl {
    constructor(response){
        super("phone", response);
        this.phoneNumber = response.phoneInfo;
    }
    static _fromServerResponse(_auth, enrollment) {
        return new PhoneMultiFactorInfoImpl(enrollment);
    }
}
async function createUserWithEmailAndPassword(auth55, email, password) {
    const authInternal = _castAuth(auth55);
    const response = await signUp(authInternal, {
        returnSecureToken: true,
        email,
        password
    });
    const userCredential = await UserCredentialImpl._fromIdTokenResponse(authInternal, "signIn", response);
    await authInternal._updateCurrentUser(userCredential.user);
    return userCredential;
}
function signInWithEmailAndPassword(auth56, email, password) {
    return signInWithCredential(getModularInstance(auth56), EmailAuthProvider.credential(email, password));
}
function onAuthStateChanged(auth57, nextOrObserver, error20, completed) {
    return getModularInstance(auth57).onAuthStateChanged(nextOrObserver, error20, completed);
}
function signOut(auth58) {
    return getModularInstance(auth58).signOut();
}
class MultiFactorSessionImpl {
    constructor(type, credential){
        this.type = type;
        this.credential = credential;
    }
    static _fromIdtoken(idToken) {
        return new MultiFactorSessionImpl("enroll", idToken);
    }
    static _fromMfaPendingCredential(mfaPendingCredential) {
        return new MultiFactorSessionImpl("signin", mfaPendingCredential);
    }
    toJSON() {
        const key16 = this.type === "enroll" ? "idToken" : "pendingCredential";
        return {
            multiFactorSession: {
                [key16]: this.credential
            }
        };
    }
    static fromJSON(obj) {
        var _a, _b;
        if (obj === null || obj === void 0 ? void 0 : obj.multiFactorSession) {
            if ((_a = obj.multiFactorSession) === null || _a === void 0 ? void 0 : _a.pendingCredential) {
                return MultiFactorSessionImpl._fromMfaPendingCredential(obj.multiFactorSession.pendingCredential);
            } else if ((_b = obj.multiFactorSession) === null || _b === void 0 ? void 0 : _b.idToken) {
                return MultiFactorSessionImpl._fromIdtoken(obj.multiFactorSession.idToken);
            }
        }
        return null;
    }
}
class MultiFactorResolverImpl {
    constructor(session, hints, signInResolver){
        this.session = session;
        this.hints = hints;
        this.signInResolver = signInResolver;
    }
    static _fromError(authExtern, error21) {
        const auth59 = _castAuth(authExtern);
        const serverResponse = error21.customData._serverResponse;
        const hints = (serverResponse.mfaInfo || []).map((enrollment)=>MultiFactorInfoImpl._fromServerResponse(auth59, enrollment)
        );
        _assert(serverResponse.mfaPendingCredential, auth59, "internal-error");
        const session = MultiFactorSessionImpl._fromMfaPendingCredential(serverResponse.mfaPendingCredential);
        return new MultiFactorResolverImpl(session, hints, async (assertion)=>{
            const mfaResponse = await assertion._process(auth59, session);
            delete serverResponse.mfaInfo;
            delete serverResponse.mfaPendingCredential;
            const idTokenResponse = Object.assign(Object.assign({}, serverResponse), {
                idToken: mfaResponse.idToken,
                refreshToken: mfaResponse.refreshToken
            });
            switch(error21.operationType){
                case "signIn":
                    const userCredential = await UserCredentialImpl._fromIdTokenResponse(auth59, error21.operationType, idTokenResponse);
                    await auth59._updateCurrentUser(userCredential.user);
                    return userCredential;
                case "reauthenticate":
                    _assert(error21.user, auth59, "internal-error");
                    return UserCredentialImpl._forOperation(error21.user, error21.operationType, idTokenResponse);
                default:
                    _fail(auth59, "internal-error");
            }
        });
    }
    async resolveSignIn(assertionExtern) {
        const assertion = assertionExtern;
        return this.signInResolver(assertion);
    }
}
function startEnrollPhoneMfa(auth60, request) {
    return _performApiRequest(auth60, "POST", "/v2/accounts/mfaEnrollment:start", _addTidIfNecessary(auth60, request));
}
function finalizeEnrollPhoneMfa(auth61, request) {
    return _performApiRequest(auth61, "POST", "/v2/accounts/mfaEnrollment:finalize", _addTidIfNecessary(auth61, request));
}
function withdrawMfa(auth62, request) {
    return _performApiRequest(auth62, "POST", "/v2/accounts/mfaEnrollment:withdraw", _addTidIfNecessary(auth62, request));
}
class MultiFactorUserImpl {
    constructor(user){
        this.user = user;
        this.enrolledFactors = [];
        user._onReload((userInfo)=>{
            if (userInfo.mfaInfo) {
                this.enrolledFactors = userInfo.mfaInfo.map((enrollment)=>MultiFactorInfoImpl._fromServerResponse(user.auth, enrollment)
                );
            }
        });
    }
    static _fromUser(user) {
        return new MultiFactorUserImpl(user);
    }
    async getSession() {
        return MultiFactorSessionImpl._fromIdtoken(await this.user.getIdToken());
    }
    async enroll(assertionExtern, displayName) {
        const assertion = assertionExtern;
        const session = await this.getSession();
        const finalizeMfaResponse = await _logoutIfInvalidated(this.user, assertion._process(this.user.auth, session, displayName));
        await this.user._updateTokensIfNecessary(finalizeMfaResponse);
        return this.user.reload();
    }
    async unenroll(infoOrUid) {
        const mfaEnrollmentId = typeof infoOrUid === "string" ? infoOrUid : infoOrUid.uid;
        const idToken = await this.user.getIdToken();
        const idTokenResponse = await _logoutIfInvalidated(this.user, withdrawMfa(this.user.auth, {
            idToken,
            mfaEnrollmentId
        }));
        this.enrolledFactors = this.enrolledFactors.filter(({ uid  })=>uid !== mfaEnrollmentId
        );
        await this.user._updateTokensIfNecessary(idTokenResponse);
        try {
            await this.user.reload();
        } catch (e) {
            if (e.code !== `auth/${"user-token-expired"}`) {
                throw e;
            }
        }
    }
}
new WeakMap();
const STORAGE_AVAILABLE_KEY = "__sak";
class BrowserPersistenceClass {
    constructor(storageRetriever, type){
        this.storageRetriever = storageRetriever;
        this.type = type;
    }
    _isAvailable() {
        try {
            if (!this.storage) {
                return Promise.resolve(false);
            }
            this.storage.setItem(STORAGE_AVAILABLE_KEY, "1");
            this.storage.removeItem(STORAGE_AVAILABLE_KEY);
            return Promise.resolve(true);
        } catch (_a) {
            return Promise.resolve(false);
        }
    }
    _set(key17, value) {
        this.storage.setItem(key17, JSON.stringify(value));
        return Promise.resolve();
    }
    _get(key18) {
        const json = this.storage.getItem(key18);
        return Promise.resolve(json ? JSON.parse(json) : null);
    }
    _remove(key19) {
        this.storage.removeItem(key19);
        return Promise.resolve();
    }
    get storage() {
        return this.storageRetriever();
    }
}
function _iframeCannotSyncWebStorage() {
    const ua14 = getUA();
    return _isSafari(ua14) || _isIOS(ua14);
}
const _POLLING_INTERVAL_MS$1 = 1000;
class BrowserLocalPersistence extends BrowserPersistenceClass {
    constructor(){
        super(()=>window.localStorage
        , "LOCAL");
        this.boundEventHandler = (event, poll)=>this.onStorageEvent(event, poll)
        ;
        this.listeners = {};
        this.localCache = {};
        this.pollTimer = null;
        this.safariLocalStorageNotSynced = _iframeCannotSyncWebStorage() && _isIframe();
        this.fallbackToPolling = _isMobileBrowser();
        this._shouldAllowMigration = true;
    }
    forAllChangedKeys(cb2) {
        for (const key20 of Object.keys(this.listeners)){
            const newValue = this.storage.getItem(key20);
            const oldValue = this.localCache[key20];
            if (newValue !== oldValue) {
                cb2(key20, oldValue, newValue);
            }
        }
    }
    onStorageEvent(event, poll = false) {
        if (!event.key) {
            this.forAllChangedKeys((key2, _oldValue, newValue)=>{
                this.notifyListeners(key2, newValue);
            });
            return;
        }
        const key21 = event.key;
        if (poll) {
            this.detachListener();
        } else {
            this.stopPolling();
        }
        if (this.safariLocalStorageNotSynced) {
            const storedValue2 = this.storage.getItem(key21);
            if (event.newValue !== storedValue2) {
                if (event.newValue !== null) {
                    this.storage.setItem(key21, event.newValue);
                } else {
                    this.storage.removeItem(key21);
                }
            } else if (this.localCache[key21] === event.newValue && !poll) {
                return;
            }
        }
        const triggerListeners = ()=>{
            const storedValue2 = this.storage.getItem(key21);
            if (!poll && this.localCache[key21] === storedValue2) {
                return;
            }
            this.notifyListeners(key21, storedValue2);
        };
        const storedValue = this.storage.getItem(key21);
        if (_isIE10() && storedValue !== event.newValue && event.newValue !== event.oldValue) {
            setTimeout(triggerListeners, 10);
        } else {
            triggerListeners();
        }
    }
    notifyListeners(key22, value) {
        this.localCache[key22] = value;
        const listeners = this.listeners[key22];
        if (listeners) {
            for (const listener of Array.from(listeners)){
                listener(value ? JSON.parse(value) : value);
            }
        }
    }
    startPolling() {
        this.stopPolling();
        this.pollTimer = setInterval(()=>{
            this.forAllChangedKeys((key23, oldValue, newValue)=>{
                this.onStorageEvent(new StorageEvent("storage", {
                    key: key23,
                    oldValue,
                    newValue
                }), true);
            });
        }, _POLLING_INTERVAL_MS$1);
    }
    stopPolling() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
    }
    attachListener() {
        window.addEventListener("storage", this.boundEventHandler);
    }
    detachListener() {
        window.removeEventListener("storage", this.boundEventHandler);
    }
    _addListener(key24, listener) {
        if (Object.keys(this.listeners).length === 0) {
            if (this.fallbackToPolling) {
                this.startPolling();
            } else {
                this.attachListener();
            }
        }
        if (!this.listeners[key24]) {
            this.listeners[key24] = new Set();
            this.localCache[key24] = this.storage.getItem(key24);
        }
        this.listeners[key24].add(listener);
    }
    _removeListener(key25, listener) {
        if (this.listeners[key25]) {
            this.listeners[key25].delete(listener);
            if (this.listeners[key25].size === 0) {
                delete this.listeners[key25];
            }
        }
        if (Object.keys(this.listeners).length === 0) {
            this.detachListener();
            this.stopPolling();
        }
    }
    async _set(key26, value) {
        await super._set(key26, value);
        this.localCache[key26] = JSON.stringify(value);
    }
    async _get(key27) {
        const value = await super._get(key27);
        this.localCache[key27] = JSON.stringify(value);
        return value;
    }
    async _remove(key28) {
        await super._remove(key28);
        delete this.localCache[key28];
    }
}
BrowserLocalPersistence.type = "LOCAL";
const browserLocalPersistence = BrowserLocalPersistence;
class BrowserSessionPersistence extends BrowserPersistenceClass {
    constructor(){
        super(()=>window.sessionStorage
        , "SESSION");
    }
    _addListener(_key, _listener) {
        return;
    }
    _removeListener(_key, _listener) {
        return;
    }
}
BrowserSessionPersistence.type = "SESSION";
const browserSessionPersistence = BrowserSessionPersistence;
function _allSettled(promises) {
    return Promise.all(promises.map(async (promise)=>{
        try {
            const value = await promise;
            return {
                fulfilled: true,
                value
            };
        } catch (reason) {
            return {
                fulfilled: false,
                reason
            };
        }
    }));
}
class Receiver {
    constructor(eventTarget){
        this.eventTarget = eventTarget;
        this.handlersMap = {};
        this.boundEventHandler = this.handleEvent.bind(this);
    }
    static _getInstance(eventTarget) {
        const existingInstance = this.receivers.find((receiver)=>receiver.isListeningto(eventTarget)
        );
        if (existingInstance) {
            return existingInstance;
        }
        const newInstance = new Receiver(eventTarget);
        this.receivers.push(newInstance);
        return newInstance;
    }
    isListeningto(eventTarget) {
        return this.eventTarget === eventTarget;
    }
    async handleEvent(event) {
        const messageEvent = event;
        const { eventId , eventType , data  } = messageEvent.data;
        const handlers = this.handlersMap[eventType];
        if (!(handlers === null || handlers === void 0 ? void 0 : handlers.size)) {
            return;
        }
        messageEvent.ports[0].postMessage({
            status: "ack",
            eventId,
            eventType
        });
        const promises = Array.from(handlers).map(async (handler)=>handler(messageEvent.origin, data)
        );
        const response = await _allSettled(promises);
        messageEvent.ports[0].postMessage({
            status: "done",
            eventId,
            eventType,
            response
        });
    }
    _subscribe(eventType, eventHandler) {
        if (Object.keys(this.handlersMap).length === 0) {
            this.eventTarget.addEventListener("message", this.boundEventHandler);
        }
        if (!this.handlersMap[eventType]) {
            this.handlersMap[eventType] = new Set();
        }
        this.handlersMap[eventType].add(eventHandler);
    }
    _unsubscribe(eventType, eventHandler) {
        if (this.handlersMap[eventType] && eventHandler) {
            this.handlersMap[eventType].delete(eventHandler);
        }
        if (!eventHandler || this.handlersMap[eventType].size === 0) {
            delete this.handlersMap[eventType];
        }
        if (Object.keys(this.handlersMap).length === 0) {
            this.eventTarget.removeEventListener("message", this.boundEventHandler);
        }
    }
}
Receiver.receivers = [];
function _generateEventId(prefix = "", digits = 10) {
    let random = "";
    for(let i = 0; i < digits; i++){
        random += Math.floor(Math.random() * 10);
    }
    return prefix + random;
}
class Sender {
    constructor(target){
        this.target = target;
        this.handlers = new Set();
    }
    removeMessageHandler(handler) {
        if (handler.messageChannel) {
            handler.messageChannel.port1.removeEventListener("message", handler.onMessage);
            handler.messageChannel.port1.close();
        }
        this.handlers.delete(handler);
    }
    async _send(eventType, data, timeout = 50) {
        const messageChannel = typeof MessageChannel !== "undefined" ? new MessageChannel() : null;
        if (!messageChannel) {
            throw new Error("connection_unavailable");
        }
        let completionTimer;
        let handler;
        return new Promise((resolve, reject)=>{
            const eventId = _generateEventId("", 20);
            messageChannel.port1.start();
            const ackTimer = setTimeout(()=>{
                reject(new Error("unsupported_event"));
            }, timeout);
            handler = {
                messageChannel,
                onMessage (event) {
                    const messageEvent = event;
                    if (messageEvent.data.eventId !== eventId) {
                        return;
                    }
                    switch(messageEvent.data.status){
                        case "ack":
                            clearTimeout(ackTimer);
                            completionTimer = setTimeout(()=>{
                                reject(new Error("timeout"));
                            }, 3000);
                            break;
                        case "done":
                            clearTimeout(completionTimer);
                            resolve(messageEvent.data.response);
                            break;
                        default:
                            clearTimeout(ackTimer);
                            clearTimeout(completionTimer);
                            reject(new Error("invalid_response"));
                            break;
                    }
                }
            };
            this.handlers.add(handler);
            messageChannel.port1.addEventListener("message", handler.onMessage);
            this.target.postMessage({
                eventType,
                eventId,
                data
            }, [
                messageChannel.port2
            ]);
        }).finally(()=>{
            if (handler) {
                this.removeMessageHandler(handler);
            }
        });
    }
}
function _window() {
    return window;
}
function _setWindowLocation(url) {
    _window().location.href = url;
}
function _isWorker() {
    return typeof _window()["WorkerGlobalScope"] !== "undefined" && typeof _window()["importScripts"] === "function";
}
async function _getActiveServiceWorker() {
    if (!(navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker)) {
        return null;
    }
    try {
        const registration = await navigator.serviceWorker.ready;
        return registration.active;
    } catch (_a) {
        return null;
    }
}
function _getServiceWorkerController() {
    var _a;
    return ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker) === null || _a === void 0 ? void 0 : _a.controller) || null;
}
function _getWorkerGlobalScope() {
    return _isWorker() ? self : null;
}
const DB_NAME1 = "firebaseLocalStorageDb";
const DB_OBJECTSTORE_NAME = "firebaseLocalStorage";
const DB_DATA_KEYPATH = "fbase_key";
class DBPromise {
    constructor(request){
        this.request = request;
    }
    toPromise() {
        return new Promise((resolve, reject)=>{
            this.request.addEventListener("success", ()=>{
                resolve(this.request.result);
            });
            this.request.addEventListener("error", ()=>{
                reject(this.request.error);
            });
        });
    }
}
function getObjectStore(db5, isReadWrite) {
    return db5.transaction([
        DB_OBJECTSTORE_NAME
    ], isReadWrite ? "readwrite" : "readonly").objectStore(DB_OBJECTSTORE_NAME);
}
function _deleteDatabase() {
    const request = indexedDB.deleteDatabase(DB_NAME1);
    return new DBPromise(request).toPromise();
}
function _openDatabase() {
    const request = indexedDB.open(DB_NAME1, 1);
    return new Promise((resolve, reject)=>{
        request.addEventListener("error", ()=>{
            reject(request.error);
        });
        request.addEventListener("upgradeneeded", ()=>{
            const db6 = request.result;
            try {
                db6.createObjectStore(DB_OBJECTSTORE_NAME, {
                    keyPath: DB_DATA_KEYPATH
                });
            } catch (e) {
                reject(e);
            }
        });
        request.addEventListener("success", async ()=>{
            const db7 = request.result;
            if (!db7.objectStoreNames.contains(DB_OBJECTSTORE_NAME)) {
                db7.close();
                await _deleteDatabase();
                resolve(await _openDatabase());
            } else {
                resolve(db7);
            }
        });
    });
}
async function _putObject(db8, key29, value) {
    const request = getObjectStore(db8, true).put({
        [DB_DATA_KEYPATH]: key29,
        value
    });
    return new DBPromise(request).toPromise();
}
async function getObject(db9, key30) {
    const request = getObjectStore(db9, false).get(key30);
    const data = await new DBPromise(request).toPromise();
    return data === void 0 ? null : data.value;
}
function _deleteObject(db10, key31) {
    const request = getObjectStore(db10, true).delete(key31);
    return new DBPromise(request).toPromise();
}
const _POLLING_INTERVAL_MS = 800;
class IndexedDBLocalPersistence {
    constructor(){
        this.type = "LOCAL";
        this._shouldAllowMigration = true;
        this.listeners = {};
        this.localCache = {};
        this.pollTimer = null;
        this.pendingWrites = 0;
        this.receiver = null;
        this.sender = null;
        this.serviceWorkerReceiverAvailable = false;
        this.activeServiceWorker = null;
        this._workerInitializationPromise = this.initializeServiceWorkerMessaging().then(()=>{}, ()=>{});
    }
    async _openDb() {
        if (this.db) {
            return this.db;
        }
        this.db = await _openDatabase();
        return this.db;
    }
    async _withRetries(op) {
        let numAttempts = 0;
        while(true){
            try {
                const db11 = await this._openDb();
                return await op(db11);
            } catch (e) {
                if (numAttempts++ > 3) {
                    throw e;
                }
                if (this.db) {
                    this.db.close();
                    this.db = void 0;
                }
            }
        }
    }
    async initializeServiceWorkerMessaging() {
        return _isWorker() ? this.initializeReceiver() : this.initializeSender();
    }
    async initializeReceiver() {
        this.receiver = Receiver._getInstance(_getWorkerGlobalScope());
        this.receiver._subscribe("keyChanged", async (_origin, data)=>{
            const keys = await this._poll();
            return {
                keyProcessed: keys.includes(data.key)
            };
        });
        this.receiver._subscribe("ping", async (_origin, _data)=>{
            return [
                "keyChanged"
            ];
        });
    }
    async initializeSender() {
        var _a, _b;
        this.activeServiceWorker = await _getActiveServiceWorker();
        if (!this.activeServiceWorker) {
            return;
        }
        this.sender = new Sender(this.activeServiceWorker);
        const results = await this.sender._send("ping", {}, 800);
        if (!results) {
            return;
        }
        if (((_a = results[0]) === null || _a === void 0 ? void 0 : _a.fulfilled) && ((_b = results[0]) === null || _b === void 0 ? void 0 : _b.value.includes("keyChanged"))) {
            this.serviceWorkerReceiverAvailable = true;
        }
    }
    async notifyServiceWorker(key32) {
        if (!this.sender || !this.activeServiceWorker || _getServiceWorkerController() !== this.activeServiceWorker) {
            return;
        }
        try {
            await this.sender._send("keyChanged", {
                key: key32
            }, this.serviceWorkerReceiverAvailable ? 800 : 50);
        } catch (_a) {}
    }
    async _isAvailable() {
        try {
            if (!indexedDB) {
                return false;
            }
            const db12 = await _openDatabase();
            await _putObject(db12, STORAGE_AVAILABLE_KEY, "1");
            await _deleteObject(db12, STORAGE_AVAILABLE_KEY);
            return true;
        } catch (_a) {}
        return false;
    }
    async _withPendingWrite(write) {
        this.pendingWrites++;
        try {
            await write();
        } finally{
            this.pendingWrites--;
        }
    }
    async _set(key33, value) {
        return this._withPendingWrite(async ()=>{
            await this._withRetries((db13)=>_putObject(db13, key33, value)
            );
            this.localCache[key33] = value;
            return this.notifyServiceWorker(key33);
        });
    }
    async _get(key34) {
        const obj = await this._withRetries((db14)=>getObject(db14, key34)
        );
        this.localCache[key34] = obj;
        return obj;
    }
    async _remove(key35) {
        return this._withPendingWrite(async ()=>{
            await this._withRetries((db15)=>_deleteObject(db15, key35)
            );
            delete this.localCache[key35];
            return this.notifyServiceWorker(key35);
        });
    }
    async _poll() {
        const result = await this._withRetries((db16)=>{
            const getAllRequest = getObjectStore(db16, false).getAll();
            return new DBPromise(getAllRequest).toPromise();
        });
        if (!result) {
            return [];
        }
        if (this.pendingWrites !== 0) {
            return [];
        }
        const keys = [];
        const keysInResult = new Set();
        for (const { fbase_key: key36 , value  } of result){
            keysInResult.add(key36);
            if (JSON.stringify(this.localCache[key36]) !== JSON.stringify(value)) {
                this.notifyListeners(key36, value);
                keys.push(key36);
            }
        }
        for (const localKey of Object.keys(this.localCache)){
            if (this.localCache[localKey] && !keysInResult.has(localKey)) {
                this.notifyListeners(localKey, null);
                keys.push(localKey);
            }
        }
        return keys;
    }
    notifyListeners(key37, newValue) {
        this.localCache[key37] = newValue;
        const listeners = this.listeners[key37];
        if (listeners) {
            for (const listener of Array.from(listeners)){
                listener(newValue);
            }
        }
    }
    startPolling() {
        this.stopPolling();
        this.pollTimer = setInterval(async ()=>this._poll()
        , _POLLING_INTERVAL_MS);
    }
    stopPolling() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
    }
    _addListener(key38, listener) {
        if (Object.keys(this.listeners).length === 0) {
            this.startPolling();
        }
        if (!this.listeners[key38]) {
            this.listeners[key38] = new Set();
            void this._get(key38);
        }
        this.listeners[key38].add(listener);
    }
    _removeListener(key39, listener) {
        if (this.listeners[key39]) {
            this.listeners[key39].delete(listener);
            if (this.listeners[key39].size === 0) {
                delete this.listeners[key39];
            }
        }
        if (Object.keys(this.listeners).length === 0) {
            this.stopPolling();
        }
    }
}
IndexedDBLocalPersistence.type = "LOCAL";
const indexedDBLocalPersistence = IndexedDBLocalPersistence;
function startSignInPhoneMfa(auth63, request) {
    return _performApiRequest(auth63, "POST", "/v2/accounts/mfaSignIn:start", _addTidIfNecessary(auth63, request));
}
function finalizeSignInPhoneMfa(auth64, request) {
    return _performApiRequest(auth64, "POST", "/v2/accounts/mfaSignIn:finalize", _addTidIfNecessary(auth64, request));
}
function getScriptParentElement() {
    var _a, _b;
    return (_b = (_a = document.getElementsByTagName("head")) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : document;
}
function _loadJS(url) {
    return new Promise((resolve, reject)=>{
        const el = document.createElement("script");
        el.setAttribute("src", url);
        el.onload = resolve;
        el.onerror = (e)=>{
            const error22 = _createError("internal-error");
            error22.customData = e;
            reject(error22);
        };
        el.type = "text/javascript";
        el.charset = "UTF-8";
        getScriptParentElement().appendChild(el);
    });
}
function _generateCallbackName(prefix) {
    return `__${prefix}${Math.floor(Math.random() * 1000000)}`;
}
_generateCallbackName("rcb");
new Delay(30000, 60000);
const RECAPTCHA_VERIFIER_TYPE = "recaptcha";
async function _verifyPhoneNumber(auth65, options, verifier) {
    var _a;
    const recaptchaToken = await verifier.verify();
    try {
        _assert(typeof recaptchaToken === "string", auth65, "argument-error");
        _assert(verifier.type === RECAPTCHA_VERIFIER_TYPE, auth65, "argument-error");
        let phoneInfoOptions;
        if (typeof options === "string") {
            phoneInfoOptions = {
                phoneNumber: options
            };
        } else {
            phoneInfoOptions = options;
        }
        if ("session" in phoneInfoOptions) {
            const session = phoneInfoOptions.session;
            if ("phoneNumber" in phoneInfoOptions) {
                _assert(session.type === "enroll", auth65, "internal-error");
                const response = await startEnrollPhoneMfa(auth65, {
                    idToken: session.credential,
                    phoneEnrollmentInfo: {
                        phoneNumber: phoneInfoOptions.phoneNumber,
                        recaptchaToken
                    }
                });
                return response.phoneSessionInfo.sessionInfo;
            } else {
                _assert(session.type === "signin", auth65, "internal-error");
                const mfaEnrollmentId = ((_a = phoneInfoOptions.multiFactorHint) === null || _a === void 0 ? void 0 : _a.uid) || phoneInfoOptions.multiFactorUid;
                _assert(mfaEnrollmentId, auth65, "missing-multi-factor-info");
                const response = await startSignInPhoneMfa(auth65, {
                    mfaPendingCredential: session.credential,
                    mfaEnrollmentId,
                    phoneSignInInfo: {
                        recaptchaToken
                    }
                });
                return response.phoneResponseInfo.sessionInfo;
            }
        } else {
            const { sessionInfo  } = await sendPhoneVerificationCode(auth65, {
                phoneNumber: phoneInfoOptions.phoneNumber,
                recaptchaToken
            });
            return sessionInfo;
        }
    } finally{
        verifier._reset();
    }
}
class PhoneAuthProvider {
    constructor(auth66){
        this.providerId = PhoneAuthProvider.PROVIDER_ID;
        this.auth = _castAuth(auth66);
    }
    verifyPhoneNumber(phoneOptions, applicationVerifier) {
        return _verifyPhoneNumber(this.auth, phoneOptions, getModularInstance(applicationVerifier));
    }
    static credential(verificationId, verificationCode) {
        return PhoneAuthCredential._fromVerification(verificationId, verificationCode);
    }
    static credentialFromResult(userCredential) {
        const credential = userCredential;
        return PhoneAuthProvider.credentialFromTaggedObject(credential);
    }
    static credentialFromError(error23) {
        return PhoneAuthProvider.credentialFromTaggedObject(error23.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse  }) {
        if (!tokenResponse) {
            return null;
        }
        const { phoneNumber , temporaryProof  } = tokenResponse;
        if (phoneNumber && temporaryProof) {
            return PhoneAuthCredential._fromTokenResponse(phoneNumber, temporaryProof);
        }
        return null;
    }
}
PhoneAuthProvider.PROVIDER_ID = "phone";
PhoneAuthProvider.PHONE_SIGN_IN_METHOD = "phone";
function _withDefaultResolver(auth67, resolverOverride) {
    if (resolverOverride) {
        return _getInstance(resolverOverride);
    }
    _assert(auth67._popupRedirectResolver, auth67, "argument-error");
    return auth67._popupRedirectResolver;
}
class IdpCredential extends AuthCredential {
    constructor(params){
        super("custom", "custom");
        this.params = params;
    }
    _getIdTokenResponse(auth68) {
        return signInWithIdp(auth68, this._buildIdpRequest());
    }
    _linkToIdToken(auth69, idToken) {
        return signInWithIdp(auth69, this._buildIdpRequest(idToken));
    }
    _getReauthenticationResolver(auth70) {
        return signInWithIdp(auth70, this._buildIdpRequest());
    }
    _buildIdpRequest(idToken) {
        const request = {
            requestUri: this.params.requestUri,
            sessionId: this.params.sessionId,
            postBody: this.params.postBody,
            tenantId: this.params.tenantId,
            pendingToken: this.params.pendingToken,
            returnSecureToken: true,
            returnIdpCredential: true
        };
        if (idToken) {
            request.idToken = idToken;
        }
        return request;
    }
}
function _signIn(params) {
    return _signInWithCredential(params.auth, new IdpCredential(params), params.bypassAuthState);
}
function _reauth(params) {
    const { auth: auth71 , user  } = params;
    _assert(user, auth71, "internal-error");
    return _reauthenticate(user, new IdpCredential(params), params.bypassAuthState);
}
async function _link(params) {
    const { auth: auth72 , user  } = params;
    _assert(user, auth72, "internal-error");
    return _link$1(user, new IdpCredential(params), params.bypassAuthState);
}
class AbstractPopupRedirectOperation {
    constructor(auth73, filter, resolver, user, bypassAuthState = false){
        this.auth = auth73;
        this.resolver = resolver;
        this.user = user;
        this.bypassAuthState = bypassAuthState;
        this.pendingPromise = null;
        this.eventManager = null;
        this.filter = Array.isArray(filter) ? filter : [
            filter
        ];
    }
    execute() {
        return new Promise(async (resolve, reject)=>{
            this.pendingPromise = {
                resolve,
                reject
            };
            try {
                this.eventManager = await this.resolver._initialize(this.auth);
                await this.onExecution();
                this.eventManager.registerConsumer(this);
            } catch (e) {
                this.reject(e);
            }
        });
    }
    async onAuthEvent(event) {
        const { urlResponse , sessionId , postBody , tenantId , error: error24 , type  } = event;
        if (error24) {
            this.reject(error24);
            return;
        }
        const params = {
            auth: this.auth,
            requestUri: urlResponse,
            sessionId,
            tenantId: tenantId || void 0,
            postBody: postBody || void 0,
            user: this.user,
            bypassAuthState: this.bypassAuthState
        };
        try {
            this.resolve(await this.getIdpTask(type)(params));
        } catch (e) {
            this.reject(e);
        }
    }
    onError(error25) {
        this.reject(error25);
    }
    getIdpTask(type) {
        switch(type){
            case "signInViaPopup":
            case "signInViaRedirect":
                return _signIn;
            case "linkViaPopup":
            case "linkViaRedirect":
                return _link;
            case "reauthViaPopup":
            case "reauthViaRedirect":
                return _reauth;
            default:
                _fail(this.auth, "internal-error");
        }
    }
    resolve(cred) {
        debugAssert(this.pendingPromise, "Pending promise was never set");
        this.pendingPromise.resolve(cred);
        this.unregisterAndCleanUp();
    }
    reject(error26) {
        debugAssert(this.pendingPromise, "Pending promise was never set");
        this.pendingPromise.reject(error26);
        this.unregisterAndCleanUp();
    }
    unregisterAndCleanUp() {
        if (this.eventManager) {
            this.eventManager.unregisterConsumer(this);
        }
        this.pendingPromise = null;
        this.cleanUp();
    }
}
const _POLL_WINDOW_CLOSE_TIMEOUT = new Delay(2000, 10000);
class PopupOperation extends AbstractPopupRedirectOperation {
    constructor(auth74, filter, provider, resolver, user){
        super(auth74, filter, resolver, user);
        this.provider = provider;
        this.authWindow = null;
        this.pollId = null;
        if (PopupOperation.currentPopupAction) {
            PopupOperation.currentPopupAction.cancel();
        }
        PopupOperation.currentPopupAction = this;
    }
    async executeNotNull() {
        const result = await this.execute();
        _assert(result, this.auth, "internal-error");
        return result;
    }
    async onExecution() {
        debugAssert(this.filter.length === 1, "Popup operations only handle one event");
        const eventId = _generateEventId();
        this.authWindow = await this.resolver._openPopup(this.auth, this.provider, this.filter[0], eventId);
        this.authWindow.associatedEvent = eventId;
        this.resolver._originValidation(this.auth).catch((e)=>{
            this.reject(e);
        });
        this.resolver._isIframeWebStorageSupported(this.auth, (isSupported)=>{
            if (!isSupported) {
                this.reject(_createError(this.auth, "web-storage-unsupported"));
            }
        });
        this.pollUserCancellation();
    }
    get eventId() {
        var _a;
        return ((_a = this.authWindow) === null || _a === void 0 ? void 0 : _a.associatedEvent) || null;
    }
    cancel() {
        this.reject(_createError(this.auth, "cancelled-popup-request"));
    }
    cleanUp() {
        if (this.authWindow) {
            this.authWindow.close();
        }
        if (this.pollId) {
            window.clearTimeout(this.pollId);
        }
        this.authWindow = null;
        this.pollId = null;
        PopupOperation.currentPopupAction = null;
    }
    pollUserCancellation() {
        const poll = ()=>{
            var _a, _b;
            if ((_b = (_a = this.authWindow) === null || _a === void 0 ? void 0 : _a.window) === null || _b === void 0 ? void 0 : _b.closed) {
                this.pollId = window.setTimeout(()=>{
                    this.pollId = null;
                    this.reject(_createError(this.auth, "popup-closed-by-user"));
                }, 2000);
                return;
            }
            this.pollId = window.setTimeout(poll, _POLL_WINDOW_CLOSE_TIMEOUT.get());
        };
        poll();
    }
}
PopupOperation.currentPopupAction = null;
const PENDING_REDIRECT_KEY = "pendingRedirect";
const redirectOutcomeMap = new Map();
class RedirectAction extends AbstractPopupRedirectOperation {
    constructor(auth75, resolver, bypassAuthState = false){
        super(auth75, [
            "signInViaRedirect",
            "linkViaRedirect",
            "reauthViaRedirect",
            "unknown"
        ], resolver, void 0, bypassAuthState);
        this.eventId = null;
    }
    async execute() {
        let readyOutcome = redirectOutcomeMap.get(this.auth._key());
        if (!readyOutcome) {
            try {
                const hasPendingRedirect = await _getAndClearPendingRedirectStatus(this.resolver, this.auth);
                const result = hasPendingRedirect ? await super.execute() : null;
                readyOutcome = ()=>Promise.resolve(result)
                ;
            } catch (e) {
                readyOutcome = ()=>Promise.reject(e)
                ;
            }
            redirectOutcomeMap.set(this.auth._key(), readyOutcome);
        }
        if (!this.bypassAuthState) {
            redirectOutcomeMap.set(this.auth._key(), ()=>Promise.resolve(null)
            );
        }
        return readyOutcome();
    }
    async onAuthEvent(event) {
        if (event.type === "signInViaRedirect") {
            return super.onAuthEvent(event);
        } else if (event.type === "unknown") {
            this.resolve(null);
            return;
        }
        if (event.eventId) {
            const user = await this.auth._redirectUserForId(event.eventId);
            if (user) {
                this.user = user;
                return super.onAuthEvent(event);
            } else {
                this.resolve(null);
            }
        }
    }
    async onExecution() {}
    cleanUp() {}
}
async function _getAndClearPendingRedirectStatus(resolver, auth76) {
    const key40 = pendingRedirectKey(auth76);
    const persistence = resolverPersistence(resolver);
    if (!await persistence._isAvailable()) {
        return false;
    }
    const hasPendingRedirect = await persistence._get(key40) === "true";
    await persistence._remove(key40);
    return hasPendingRedirect;
}
function resolverPersistence(resolver) {
    return _getInstance(resolver._redirectPersistence);
}
function pendingRedirectKey(auth77) {
    return _persistenceKeyName(PENDING_REDIRECT_KEY, auth77.config.apiKey, auth77.name);
}
async function _getRedirectResult(auth78, resolverExtern, bypassAuthState = false) {
    const authInternal = _castAuth(auth78);
    const resolver = _withDefaultResolver(authInternal, resolverExtern);
    const action = new RedirectAction(authInternal, resolver, bypassAuthState);
    const result = await action.execute();
    if (result && !bypassAuthState) {
        delete result.user._redirectEventId;
        await authInternal._persistUserIfCurrent(result.user);
        await authInternal._setRedirectUser(null, resolverExtern);
    }
    return result;
}
const EVENT_DUPLICATION_CACHE_DURATION_MS = 10 * 60 * 1000;
class AuthEventManager {
    constructor(auth79){
        this.auth = auth79;
        this.cachedEventUids = new Set();
        this.consumers = new Set();
        this.queuedRedirectEvent = null;
        this.hasHandledPotentialRedirect = false;
        this.lastProcessedEventTime = Date.now();
    }
    registerConsumer(authEventConsumer) {
        this.consumers.add(authEventConsumer);
        if (this.queuedRedirectEvent && this.isEventForConsumer(this.queuedRedirectEvent, authEventConsumer)) {
            this.sendToConsumer(this.queuedRedirectEvent, authEventConsumer);
            this.saveEventToCache(this.queuedRedirectEvent);
            this.queuedRedirectEvent = null;
        }
    }
    unregisterConsumer(authEventConsumer) {
        this.consumers.delete(authEventConsumer);
    }
    onEvent(event) {
        if (this.hasEventBeenHandled(event)) {
            return false;
        }
        let handled = false;
        this.consumers.forEach((consumer)=>{
            if (this.isEventForConsumer(event, consumer)) {
                handled = true;
                this.sendToConsumer(event, consumer);
                this.saveEventToCache(event);
            }
        });
        if (this.hasHandledPotentialRedirect || !isRedirectEvent(event)) {
            return handled;
        }
        this.hasHandledPotentialRedirect = true;
        if (!handled) {
            this.queuedRedirectEvent = event;
            handled = true;
        }
        return handled;
    }
    sendToConsumer(event, consumer) {
        var _a;
        if (event.error && !isNullRedirectEvent(event)) {
            const code = ((_a = event.error.code) === null || _a === void 0 ? void 0 : _a.split("auth/")[1]) || "internal-error";
            consumer.onError(_createError(this.auth, code));
        } else {
            consumer.onAuthEvent(event);
        }
    }
    isEventForConsumer(event, consumer) {
        const eventIdMatches = consumer.eventId === null || !!event.eventId && event.eventId === consumer.eventId;
        return consumer.filter.includes(event.type) && eventIdMatches;
    }
    hasEventBeenHandled(event) {
        if (Date.now() - this.lastProcessedEventTime >= EVENT_DUPLICATION_CACHE_DURATION_MS) {
            this.cachedEventUids.clear();
        }
        return this.cachedEventUids.has(eventUid(event));
    }
    saveEventToCache(event) {
        this.cachedEventUids.add(eventUid(event));
        this.lastProcessedEventTime = Date.now();
    }
}
function eventUid(e) {
    return [
        e.type,
        e.eventId,
        e.sessionId,
        e.tenantId
    ].filter((v12)=>v12
    ).join("-");
}
function isNullRedirectEvent({ type , error: error27  }) {
    return type === "unknown" && (error27 === null || error27 === void 0 ? void 0 : error27.code) === `auth/${"no-auth-event"}`;
}
function isRedirectEvent(event) {
    switch(event.type){
        case "signInViaRedirect":
        case "linkViaRedirect":
        case "reauthViaRedirect":
            return true;
        case "unknown":
            return isNullRedirectEvent(event);
        default:
            return false;
    }
}
async function _getProjectConfig(auth80, request = {}) {
    return _performApiRequest(auth80, "GET", "/v1/projects", request);
}
const IP_ADDRESS_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
const HTTP_REGEX = /^https?/;
async function _validateOrigin(auth81) {
    if (auth81.config.emulator) {
        return;
    }
    const { authorizedDomains  } = await _getProjectConfig(auth81);
    for (const domain of authorizedDomains){
        try {
            if (matchDomain(domain)) {
                return;
            }
        } catch (_a) {}
    }
    _fail(auth81, "unauthorized-domain");
}
function matchDomain(expected) {
    const currentUrl = _getCurrentUrl();
    const { protocol , hostname  } = new URL(currentUrl);
    if (expected.startsWith("chrome-extension://")) {
        const ceUrl = new URL(expected);
        if (ceUrl.hostname === "" && hostname === "") {
            return protocol === "chrome-extension:" && expected.replace("chrome-extension://", "") === currentUrl.replace("chrome-extension://", "");
        }
        return protocol === "chrome-extension:" && ceUrl.hostname === hostname;
    }
    if (!HTTP_REGEX.test(protocol)) {
        return false;
    }
    if (IP_ADDRESS_REGEX.test(expected)) {
        return hostname === expected;
    }
    const escapedDomainPattern = expected.replace(/\./g, "\\.");
    const re2 = new RegExp("^(.+\\." + escapedDomainPattern + "|" + escapedDomainPattern + ")$", "i");
    return re2.test(hostname);
}
const NETWORK_TIMEOUT = new Delay(30000, 60000);
function resetUnloadedGapiModules() {
    const beacon = _window().___jsl;
    if (beacon === null || beacon === void 0 ? void 0 : beacon.H) {
        for (const hint of Object.keys(beacon.H)){
            beacon.H[hint].r = beacon.H[hint].r || [];
            beacon.H[hint].L = beacon.H[hint].L || [];
            beacon.H[hint].r = [
                ...beacon.H[hint].L
            ];
            if (beacon.CP) {
                for(let i = 0; i < beacon.CP.length; i++){
                    beacon.CP[i] = null;
                }
            }
        }
    }
}
function loadGapi(auth82) {
    return new Promise((resolve, reject)=>{
        var _a, _b, _c3;
        function loadGapiIframe() {
            resetUnloadedGapiModules();
            gapi.load("gapi.iframes", {
                callback: ()=>{
                    resolve(gapi.iframes.getContext());
                },
                ontimeout: ()=>{
                    resetUnloadedGapiModules();
                    reject(_createError(auth82, "network-request-failed"));
                },
                timeout: NETWORK_TIMEOUT.get()
            });
        }
        if ((_b = (_a = _window().gapi) === null || _a === void 0 ? void 0 : _a.iframes) === null || _b === void 0 ? void 0 : _b.Iframe) {
            resolve(gapi.iframes.getContext());
        } else if (!!((_c3 = _window().gapi) === null || _c3 === void 0 ? void 0 : _c3.load)) {
            loadGapiIframe();
        } else {
            const cbName = _generateCallbackName("iframefcb");
            _window()[cbName] = ()=>{
                if (!!gapi.load) {
                    loadGapiIframe();
                } else {
                    reject(_createError(auth82, "network-request-failed"));
                }
            };
            return _loadJS(`https://apis.google.com/js/api.js?onload=${cbName}`).catch((e)=>reject(e)
            );
        }
    }).catch((error28)=>{
        cachedGApiLoader = null;
        throw error28;
    });
}
let cachedGApiLoader = null;
function _loadGapi(auth83) {
    cachedGApiLoader = cachedGApiLoader || loadGapi(auth83);
    return cachedGApiLoader;
}
const PING_TIMEOUT = new Delay(5000, 15000);
const IFRAME_PATH = "__/auth/iframe";
const EMULATED_IFRAME_PATH = "emulator/auth/iframe";
const IFRAME_ATTRIBUTES = {
    style: {
        position: "absolute",
        top: "-100px",
        width: "1px",
        height: "1px"
    },
    "aria-hidden": "true",
    tabindex: "-1"
};
const EID_FROM_APIHOST = new Map([
    [
        "identitytoolkit.googleapis.com",
        "p"
    ],
    [
        "staging-identitytoolkit.sandbox.googleapis.com",
        "s"
    ],
    [
        "test-identitytoolkit.sandbox.googleapis.com",
        "t"
    ]
]);
function getIframeUrl(auth84) {
    const config6 = auth84.config;
    _assert(config6.authDomain, auth84, "auth-domain-config-required");
    const url = config6.emulator ? _emulatorUrl(config6, EMULATED_IFRAME_PATH) : `https://${auth84.config.authDomain}/${IFRAME_PATH}`;
    const params = {
        apiKey: config6.apiKey,
        appName: auth84.name,
        v: SDK_VERSION
    };
    const eid = EID_FROM_APIHOST.get(auth84.config.apiHost);
    if (eid) {
        params.eid = eid;
    }
    const frameworks = auth84._getFrameworks();
    if (frameworks.length) {
        params.fw = frameworks.join(",");
    }
    return `${url}?${querystring(params).slice(1)}`;
}
async function _openIframe(auth85) {
    const context = await _loadGapi(auth85);
    const gapi2 = _window().gapi;
    _assert(gapi2, auth85, "internal-error");
    return context.open({
        where: document.body,
        url: getIframeUrl(auth85),
        messageHandlersFilter: gapi2.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
        attributes: IFRAME_ATTRIBUTES,
        dontclear: true
    }, (iframe)=>new Promise(async (resolve, reject)=>{
            await iframe.restyle({
                setHideOnLeave: false
            });
            const networkError = _createError(auth85, "network-request-failed");
            const networkErrorTimer = _window().setTimeout(()=>{
                reject(networkError);
            }, PING_TIMEOUT.get());
            function clearTimerAndResolve() {
                _window().clearTimeout(networkErrorTimer);
                resolve(iframe);
            }
            iframe.ping(clearTimerAndResolve).then(clearTimerAndResolve, ()=>{
                reject(networkError);
            });
        })
    );
}
const BASE_POPUP_OPTIONS = {
    location: "yes",
    resizable: "yes",
    statusbar: "yes",
    toolbar: "no"
};
const TARGET_BLANK = "_blank";
const FIREFOX_EMPTY_URL = "http://localhost";
class AuthPopup {
    constructor(window2){
        this.window = window2;
        this.associatedEvent = null;
    }
    close() {
        if (this.window) {
            try {
                this.window.close();
            } catch (e) {}
        }
    }
}
function _open(auth86, url, name2, width = 500, height = 600) {
    const top = Math.max((window.screen.availHeight - height) / 2, 0).toString();
    const left = Math.max((window.screen.availWidth - width) / 2, 0).toString();
    let target = "";
    const options = Object.assign(Object.assign({}, BASE_POPUP_OPTIONS), {
        width: width.toString(),
        height: height.toString(),
        top,
        left
    });
    const ua15 = getUA().toLowerCase();
    if (name2) {
        target = _isChromeIOS(ua15) ? TARGET_BLANK : name2;
    }
    if (_isFirefox(ua15)) {
        url = url || FIREFOX_EMPTY_URL;
        options.scrollbars = "yes";
    }
    const optionsString = Object.entries(options).reduce((accum, [key41, value])=>`${accum}${key41}=${value},`
    , "");
    if (_isIOSStandalone(ua15) && target !== "_self") {
        openAsNewWindowIOS(url || "", target);
        return new AuthPopup(null);
    }
    const newWin = window.open(url || "", target, optionsString);
    _assert(newWin, auth86, "popup-blocked");
    try {
        newWin.focus();
    } catch (e) {}
    return new AuthPopup(newWin);
}
function openAsNewWindowIOS(url, target) {
    const el = document.createElement("a");
    el.href = url;
    el.target = target;
    const click = document.createEvent("MouseEvent");
    click.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 1, null);
    el.dispatchEvent(click);
}
const WIDGET_PATH = "__/auth/handler";
const EMULATOR_WIDGET_PATH = "emulator/auth/handler";
function _getRedirectUrl(auth87, provider, authType, redirectUrl, eventId, additionalParams) {
    _assert(auth87.config.authDomain, auth87, "auth-domain-config-required");
    _assert(auth87.config.apiKey, auth87, "invalid-api-key");
    const params = {
        apiKey: auth87.config.apiKey,
        appName: auth87.name,
        authType,
        redirectUrl,
        v: SDK_VERSION,
        eventId
    };
    if (provider instanceof FederatedAuthProvider) {
        provider.setDefaultLanguage(auth87.languageCode);
        params.providerId = provider.providerId || "";
        if (!isEmpty(provider.getCustomParameters())) {
            params.customParameters = JSON.stringify(provider.getCustomParameters());
        }
        for (const [key42, value] of Object.entries(additionalParams || {})){
            params[key42] = value;
        }
    }
    if (provider instanceof BaseOAuthProvider) {
        const scopes = provider.getScopes().filter((scope)=>scope !== ""
        );
        if (scopes.length > 0) {
            params.scopes = scopes.join(",");
        }
    }
    if (auth87.tenantId) {
        params.tid = auth87.tenantId;
    }
    const paramsDict = params;
    for (const key43 of Object.keys(paramsDict)){
        if (paramsDict[key43] === void 0) {
            delete paramsDict[key43];
        }
    }
    return `${getHandlerBase(auth87)}?${querystring(paramsDict).slice(1)}`;
}
function getHandlerBase({ config: config7  }) {
    if (!config7.emulator) {
        return `https://${config7.authDomain}/${WIDGET_PATH}`;
    }
    return _emulatorUrl(config7, EMULATOR_WIDGET_PATH);
}
const WEB_STORAGE_SUPPORT_KEY = "webStorageSupport";
class BrowserPopupRedirectResolver {
    constructor(){
        this.eventManagers = {};
        this.iframes = {};
        this.originValidationPromises = {};
        this._redirectPersistence = browserSessionPersistence;
        this._completeRedirectFn = _getRedirectResult;
    }
    async _openPopup(auth88, provider, authType, eventId) {
        var _a;
        debugAssert((_a = this.eventManagers[auth88._key()]) === null || _a === void 0 ? void 0 : _a.manager, "_initialize() not called before _openPopup()");
        const url = _getRedirectUrl(auth88, provider, authType, _getCurrentUrl(), eventId);
        return _open(auth88, url, _generateEventId());
    }
    async _openRedirect(auth89, provider, authType, eventId) {
        await this._originValidation(auth89);
        _setWindowLocation(_getRedirectUrl(auth89, provider, authType, _getCurrentUrl(), eventId));
        return new Promise(()=>{});
    }
    _initialize(auth90) {
        const key44 = auth90._key();
        if (this.eventManagers[key44]) {
            const { manager , promise: promise2  } = this.eventManagers[key44];
            if (manager) {
                return Promise.resolve(manager);
            } else {
                debugAssert(promise2, "If manager is not set, promise should be");
                return promise2;
            }
        }
        const promise = this.initAndGetManager(auth90);
        this.eventManagers[key44] = {
            promise
        };
        promise.catch(()=>{
            delete this.eventManagers[key44];
        });
        return promise;
    }
    async initAndGetManager(auth91) {
        const iframe = await _openIframe(auth91);
        const manager = new AuthEventManager(auth91);
        iframe.register("authEvent", (iframeEvent)=>{
            _assert(iframeEvent === null || iframeEvent === void 0 ? void 0 : iframeEvent.authEvent, auth91, "invalid-auth-event");
            const handled = manager.onEvent(iframeEvent.authEvent);
            return {
                status: handled ? "ACK" : "ERROR"
            };
        }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
        this.eventManagers[auth91._key()] = {
            manager
        };
        this.iframes[auth91._key()] = iframe;
        return manager;
    }
    _isIframeWebStorageSupported(auth92, cb3) {
        const iframe = this.iframes[auth92._key()];
        iframe.send(WEB_STORAGE_SUPPORT_KEY, {
            type: WEB_STORAGE_SUPPORT_KEY
        }, (result)=>{
            var _a;
            const isSupported = (_a = result === null || result === void 0 ? void 0 : result[0]) === null || _a === void 0 ? void 0 : _a[WEB_STORAGE_SUPPORT_KEY];
            if (isSupported !== void 0) {
                cb3(!!isSupported);
            }
            _fail(auth92, "internal-error");
        }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
    }
    _originValidation(auth93) {
        const key45 = auth93._key();
        if (!this.originValidationPromises[key45]) {
            this.originValidationPromises[key45] = _validateOrigin(auth93);
        }
        return this.originValidationPromises[key45];
    }
    get _shouldInitProactively() {
        return _isMobileBrowser() || _isSafari() || _isIOS();
    }
}
const browserPopupRedirectResolver = BrowserPopupRedirectResolver;
class MultiFactorAssertionImpl {
    constructor(factorId){
        this.factorId = factorId;
    }
    _process(auth94, session, displayName) {
        switch(session.type){
            case "enroll":
                return this._finalizeEnroll(auth94, session.credential, displayName);
            case "signin":
                return this._finalizeSignIn(auth94, session.credential);
            default:
                return debugFail("unexpected MultiFactorSessionType");
        }
    }
}
class PhoneMultiFactorAssertionImpl extends MultiFactorAssertionImpl {
    constructor(credential){
        super("phone");
        this.credential = credential;
    }
    static _fromCredential(credential) {
        return new PhoneMultiFactorAssertionImpl(credential);
    }
    _finalizeEnroll(auth95, idToken, displayName) {
        return finalizeEnrollPhoneMfa(auth95, {
            idToken,
            displayName,
            phoneVerificationInfo: this.credential._makeVerificationRequest()
        });
    }
    _finalizeSignIn(auth96, mfaPendingCredential) {
        return finalizeSignInPhoneMfa(auth96, {
            mfaPendingCredential,
            phoneVerificationInfo: this.credential._makeVerificationRequest()
        });
    }
}
class PhoneMultiFactorGenerator {
    constructor(){}
    static assertion(credential) {
        return PhoneMultiFactorAssertionImpl._fromCredential(credential);
    }
}
PhoneMultiFactorGenerator.FACTOR_ID = "phone";
var name2 = "@firebase/auth";
var version3 = "0.19.11";
class AuthInterop {
    constructor(auth97){
        this.auth = auth97;
        this.internalListeners = new Map();
    }
    getUid() {
        var _a;
        this.assertAuthConfigured();
        return ((_a = this.auth.currentUser) === null || _a === void 0 ? void 0 : _a.uid) || null;
    }
    async getToken(forceRefresh) {
        this.assertAuthConfigured();
        await this.auth._initializationPromise;
        if (!this.auth.currentUser) {
            return null;
        }
        const accessToken = await this.auth.currentUser.getIdToken(forceRefresh);
        return {
            accessToken
        };
    }
    addAuthTokenListener(listener) {
        this.assertAuthConfigured();
        if (this.internalListeners.has(listener)) {
            return;
        }
        const unsubscribe = this.auth.onIdTokenChanged((user)=>{
            var _a;
            listener(((_a = user) === null || _a === void 0 ? void 0 : _a.stsTokenManager.accessToken) || null);
        });
        this.internalListeners.set(listener, unsubscribe);
        this.updateProactiveRefresh();
    }
    removeAuthTokenListener(listener) {
        this.assertAuthConfigured();
        const unsubscribe = this.internalListeners.get(listener);
        if (!unsubscribe) {
            return;
        }
        this.internalListeners.delete(listener);
        unsubscribe();
        this.updateProactiveRefresh();
    }
    assertAuthConfigured() {
        _assert(this.auth._initializationPromise, "dependent-sdk-initialized-before-auth");
    }
    updateProactiveRefresh() {
        if (this.internalListeners.size > 0) {
            this.auth._startProactiveRefresh();
        } else {
            this.auth._stopProactiveRefresh();
        }
    }
}
function getVersionForPlatform(clientPlatform) {
    switch(clientPlatform){
        case "Node":
            return "node";
        case "ReactNative":
            return "rn";
        case "Worker":
            return "webworker";
        case "Cordova":
            return "cordova";
        default:
            return void 0;
    }
}
function registerAuth(clientPlatform) {
    _registerComponent(new Component("auth", (container, { options: deps  })=>{
        const app2 = container.getProvider("app").getImmediate();
        const heartbeatServiceProvider = container.getProvider("heartbeat");
        const { apiKey , authDomain  } = app2.options;
        return ((app3, heartbeatServiceProvider2)=>{
            _assert(apiKey && !apiKey.includes(":"), "invalid-api-key", {
                appName: app3.name
            });
            _assert(!(authDomain === null || authDomain === void 0 ? void 0 : authDomain.includes(":")), "argument-error", {
                appName: app3.name
            });
            const config8 = {
                apiKey,
                authDomain,
                clientPlatform,
                apiHost: "identitytoolkit.googleapis.com",
                tokenApiHost: "securetoken.googleapis.com",
                apiScheme: "https",
                sdkClientVersion: _getClientVersion(clientPlatform)
            };
            const authInstance = new AuthImpl(app3, heartbeatServiceProvider2, config8);
            _initializeAuthInstance(authInstance, deps);
            return authInstance;
        })(app2, heartbeatServiceProvider);
    }, "PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((container, _instanceIdentifier, _instance)=>{
        const authInternalProvider = container.getProvider("auth-internal");
        authInternalProvider.initialize();
    }));
    _registerComponent(new Component("auth-internal", (container)=>{
        const auth98 = _castAuth(container.getProvider("auth").getImmediate());
        return ((auth2)=>new AuthInterop(auth2)
        )(auth98);
    }, "PRIVATE").setInstantiationMode("EXPLICIT"));
    registerVersion(name2, version3, getVersionForPlatform(clientPlatform));
    registerVersion(name2, version3, "esm2017");
}
function getAuth(app2 = getApp()) {
    const provider = _getProvider(app2, "auth");
    if (provider.isInitialized()) {
        return provider.getImmediate();
    }
    return initializeAuth(app2, {
        popupRedirectResolver: browserPopupRedirectResolver,
        persistence: [
            indexedDBLocalPersistence,
            browserLocalPersistence,
            browserSessionPersistence
        ]
    });
}
registerAuth("Browser");
const ensure = (q2, on1 = document.body)=>{
    const element = on1.querySelector(q2);
    if (element === null) {
        throw new Error(`Element '${q2}' does not exist!`);
    }
    return element;
};
const component = (q1, create)=>()=>{
        const templateEl = ensure(q1);
        const el = templateEl.content.firstElementChild?.cloneNode(true);
        if (!el) {
            throw new Error("The template '" + q1 + "' has no child elements");
        }
        return create((q3)=>ensure(q3, el)
        , el);
    }
;
const makePassword = component("#password-template", (ensure1, el)=>({
        container: el,
        name: ensure1(".password-name"),
        domain: ensure1(".password-domain"),
        username: ensure1(".password-username"),
        actions: ensure1(".password-actions"),
        view: ensure1(".password-view")
    })
);
const passwordViewer = {
    container: ensure("#password-view-container"),
    card: ensure("#password-view-card"),
    name: ensure("#password-view-name"),
    domain: ensure("#password-view-domain"),
    username: ensure("#password-view-username"),
    password: ensure("#password-view-password"),
    show_password: ensure("#password-view-show_password"),
    notes: ensure("#password-view-notes"),
    save: ensure("#password-view-save"),
    cancel: ensure("#password-view-cancel")
};
const authView = ensure("#auth-view");
const login = {
    view: ensure("#login-view"),
    email: ensure("#login-email"),
    password: ensure("#login-password"),
    submit: ensure("#login-submit"),
    switch: ensure("#login-switch-to-signup")
};
const signup = {
    view: ensure("#signup-view"),
    email: ensure("#signup-email"),
    password: ensure("#signup-password"),
    confirmPassword: ensure("#signup-confirm-password"),
    submit: ensure("#signup-submit"),
    switch: ensure("#signup-switch-to-login")
};
const logout = ensure("#logout");
const passwordsView = ensure("#passwords-view");
const passwordsList = ensure("#passwords-list");
const error = ensure("#error");
const addPassword = ensure("#add-password");
const passwordSearch = ensure("#password-search");
const displayError = (s)=>{
    error.style.display = "block";
    error.style.opacity = "0";
    setTimeout(()=>error.style.opacity = "1"
    );
    error.textContent = s;
    setTimeout(()=>{
        error.style.opacity = "0";
        setTimeout(()=>{
            error.style.display = "none";
            error.textContent = "";
        }, 200);
    }, 4000);
};
const generateSalt = (len = 16)=>{
    return window.crypto.getRandomValues(new Uint8Array(len));
};
const pbkdf2 = async (password, salt)=>{
    const rawPass = new TextEncoder().encode(password);
    const passwordKey = await window.crypto.subtle.importKey("raw", rawPass, "PBKDF2", false, [
        "deriveBits",
        "deriveKey"
    ]);
    const hashed = await window.crypto.subtle.deriveKey({
        salt,
        name: "PBKDF2",
        hash: "SHA-512",
        iterations: 10000
    }, passwordKey, {
        name: "AES-GCM",
        length: 256
    }, true, [
        "encrypt",
        "decrypt"
    ]);
    return hashed;
};
const arrayBufferToBase64 = (buffer)=>{
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for(let i = 0; i < len; i++){
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};
const base64ToArrayBuffer = (str)=>{
    return Uint8Array.from(atob(str), (c)=>c.charCodeAt(0)
    );
};
const strToBuf = (str)=>{
    return new TextEncoder().encode(str);
};
const bufToStr = (buf)=>{
    return new TextDecoder().decode(buf);
};
const base64ToKey = async (base64Key)=>{
    const raw = base64ToArrayBuffer(base64Key);
    const key46 = await crypto.subtle.importKey("raw", raw, {
        name: "AES-GCM"
    }, true, [
        "encrypt",
        "decrypt"
    ]);
    return key46;
};
const keyToBase64 = async (key47)=>{
    const buf = await crypto.subtle.exportKey("raw", key47);
    return arrayBufferToBase64(buf);
};
const encrypt = async (data, key48)=>{
    const iv = generateSalt(12);
    return {
        data: arrayBufferToBase64(await crypto.subtle.encrypt({
            name: "AES-GCM",
            iv
        }, key48, strToBuf(data))),
        iv: arrayBufferToBase64(iv)
    };
};
const decrypt = async (data, iv, key49)=>{
    return bufToStr(await crypto.subtle.decrypt({
        name: "AES-GCM",
        iv
    }, key49, data));
};
let auth = null;
let key = null;
const strKey = localStorage.getItem("key");
if (strKey) {
    base64ToKey(strKey).then((k7)=>key = k7
    );
}
const init = ()=>{
    auth = getAuth();
    onAuthStateChanged(auth, (u)=>{
        if (u) {
            loginListeners.forEach((l6)=>l6(u)
            );
        } else {
            logoutListeners.forEach((l7)=>l7()
            );
        }
    });
};
const loginListeners = [];
const logoutListeners = [];
const getEncryptionKey = ()=>key
;
const onLogin = (listen)=>loginListeners.push(listen)
;
const onLogout = (listen)=>logoutListeners.push(listen)
;
const handleAuthError = (e)=>{
    if (e.code === AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY.EMAIL_EXISTS) {
        displayError("Email already in use");
    } else if (e.code === AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY.INVALID_PASSWORD) {
        displayError("Invalid password");
    } else if (e.code === AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY.INVALID_EMAIL) {
        displayError("Invalid email");
    } else {
        displayError(e.message);
    }
};
signup.submit.addEventListener("click", async ()=>{
    const password = signup.password.value;
    const confirmPassword = signup.confirmPassword.value;
    const email = signup.email.value;
    if (email.length !== 0 && password.length !== 0 && password === confirmPassword) {
        const googleSalt = generateSalt();
        const googlePassword = await pbkdf2(email + password, googleSalt);
        let user1 = null;
        try {
            user1 = await createUserWithEmailAndPassword(auth, email, await keyToBase64(googlePassword));
        } catch (e) {
            handleAuthError(e);
            return;
        }
        const localSalt = generateSalt();
        key = await pbkdf2(password, localSalt);
        localStorage.setItem("key", await keyToBase64(key));
        const db17 = Pc1();
        il(gc1(db17, "salts", email), {
            google: arrayBufferToBase64(googleSalt),
            local: arrayBufferToBase64(localSalt),
            owner: user1.user.uid
        });
    } else {
        displayError("Email and password must exist and confirm password must equal password");
    }
});
login.submit.addEventListener("click", async ()=>{
    const password = login.password.value;
    const email = login.email.value;
    if (email.length !== 0 && password.length !== 0) {
        const db18 = Pc1();
        const document = await Yh(gc1(db18, "salts", email));
        const data = document.data();
        if (!data) {
            displayError("Account does not exist");
            return;
        }
        const googleSalt = base64ToArrayBuffer(data.google);
        const localSalt = base64ToArrayBuffer(data.local);
        const googlePass = await pbkdf2(email + password, googleSalt);
        const localKey = await pbkdf2(password, localSalt);
        key = localKey;
        localStorage.setItem("key", await keyToBase64(localKey));
        try {
            await signInWithEmailAndPassword(auth, email, await keyToBase64(googlePass));
        } catch (e) {
            handleAuthError(e);
            return;
        }
    } else {
        displayError("Email and password must exist");
    }
});
logout.addEventListener("click", ()=>{
    signOut(auth);
    localStorage.removeItem("key");
});
signup.switch.addEventListener("click", ()=>{
    signup.view.style.display = "none";
    login.view.style.display = "flex";
});
login.switch.addEventListener("click", ()=>{
    signup.view.style.display = "flex";
    login.view.style.display = "none";
});
const firebaseConfig = {
    apiKey: "AIzaSyDDjs9F24IKJ1nyPyzkyZUMEMrlByetJGw",
    authDomain: "simplistic-passwords.firebaseapp.com",
    projectId: "simplistic-passwords",
    storageBucket: "simplistic-passwords.appspot.com",
    messagingSenderId: "602405019926",
    appId: "1:602405019926:web:e45b6340bd54cfb5d53037",
    measurementId: "G-S60FH5HYP0"
};
initializeApp(firebaseConfig);
init();
const db1 = Pc1();
let appData = {
    passwords: []
};
let userDoc = null;
const save = async ()=>{
    const key50 = getEncryptionKey();
    if (!key50) {
        throw new Error("No Key");
    }
    il(userDoc, await encrypt(JSON.stringify(appData), key50));
};
onLogin(async (user)=>{
    userDoc = gc1(db1, "user", user.uid);
    const docData1 = (await Yh(userDoc)).data();
    const key51 = getEncryptionKey();
    if (!key51) {
        throw new Error("No Key");
    }
    if (!docData1) {
        await il(userDoc, await encrypt(JSON.stringify(appData), key51));
    } else {
        const data = await decrypt(base64ToArrayBuffer(docData1.data), base64ToArrayBuffer(docData1.iv), key51);
        try {
            appData = JSON.parse(data);
        } catch (e) {
            appData = {
                passwords: []
            };
        }
    }
    al(userDoc, async (doc1)=>{
        const docData = doc1.data();
        if (docData) {
            const data = await decrypt(base64ToArrayBuffer(docData.data), base64ToArrayBuffer(docData.iv), key51);
            try {
                appData = JSON.parse(data);
                render();
            } catch (e) {
                console.log("Invalid data", e);
            }
        }
    });
    await save();
});
onLogin(()=>{
    authView.style.display = "none";
    passwordsView.style.display = "flex";
});
onLogout(()=>{
    passwordsView.style.display = "none";
    authView.style.display = "block";
});
let passwordViewerPassword = null;
let passwordViewerCreateMode = false;
const closePasswordView = ()=>{
    passwordViewer.container.style.opacity = "0";
    setTimeout(()=>{
        passwordViewer.container.style.display = "none";
    }, 200);
};
const openPasswordView = (password, create = false)=>{
    passwordViewerCreateMode = create;
    passwordViewerPassword = password;
    passwordViewer.domain.value = passwordViewerPassword.domain;
    passwordViewer.password.value = passwordViewerPassword.password;
    passwordViewer.username.value = passwordViewerPassword.username;
    passwordViewer.notes.value = passwordViewerPassword.notes;
    passwordViewer.name.value = passwordViewerPassword.name;
    passwordViewer.container.style.display = "flex";
    passwordViewer.container.style.opacity = "0";
    setTimeout(()=>{
        passwordViewer.container.style.opacity = "1";
    });
};
passwordViewer.save.addEventListener("click", ()=>{
    if (!passwordViewerPassword) {
        throw new Error("Not currently editing any password");
    }
    passwordViewerPassword.domain = passwordViewer.domain.value;
    passwordViewerPassword.password = passwordViewer.password.value;
    passwordViewerPassword.username = passwordViewer.username.value;
    passwordViewerPassword.notes = passwordViewer.notes.value;
    passwordViewerPassword.name = passwordViewer.name.value;
    if (passwordViewerCreateMode) {
        appData.passwords.push(passwordViewerPassword);
        passwordViewerCreateMode = false;
    }
    save();
    closePasswordView();
});
passwordViewer.cancel.addEventListener("click", ()=>{
    closePasswordView();
});
passwordViewer.container.addEventListener("click", ()=>{
    closePasswordView();
});
passwordViewer.card.addEventListener("click", (ev)=>{
    ev.stopPropagation();
});
passwordViewer.show_password.addEventListener("click", ()=>{
    if (passwordViewer.show_password.textContent === "Hide") {
        passwordViewer.show_password.textContent = "Show";
        passwordViewer.password.type = "password";
    } else {
        passwordViewer.show_password.textContent = "Hide";
        passwordViewer.password.type = "text";
    }
});
const render = ()=>{
    passwordsList.innerHTML = "";
    appData.passwords.filter((v13)=>(v13.name + v13.domain + v13.notes + v13.username).toLowerCase().includes(passwordSearch.value.toLowerCase())
    ).forEach((password)=>{
        const el = makePassword();
        passwordsList.appendChild(el.container);
        el.name.textContent = password.name;
        el.domain.textContent = password.domain;
        el.username.textContent = password.username;
        el.view.addEventListener("click", ()=>{
            openPasswordView(password);
        });
    });
};
addPassword.addEventListener("click", ()=>{
    openPasswordView({
        name: "New Password",
        notes: "",
        domain: "example.com",
        password: generateRandomPassword(),
        username: "Your Email"
    }, true);
});
const generateRandomPassword = (len = 12)=>{
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890!@#$%^&*()";
    let pass = "";
    for(let i = 0; i < len; i++){
        const value = crypto.getRandomValues(new Uint8Array(1))[0];
        pass += alphabet[Math.floor(value / 255 * alphabet.length)];
    }
    return pass;
};
passwordSearch.addEventListener("input", ()=>{
    render();
});
