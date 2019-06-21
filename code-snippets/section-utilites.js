import opentracing from 'opentracing';
import _ from 'underscore';
import * as api from 'helpers/api';
import * as time from 'helpers/time';

/**
 * Calls extract, treating the `carrier` as a TEXT_MAP carrier, and then
 * executes the callback inside of a child span.
 * @param {String} name - The name for the span
 * @param {Object} carrier - The carrier for the span
 * @param {function} callback - The function to call when we're done joining.
 * @return {?} - The return value of the callback
 */
export function joinAndRun(name, carrier, callback) {
    let ctx = opentracing.globalTracer().extract(opentracing.FORMAT_TEXT_MAP, carrier);
    let span = opentracing.globalTracer().startSpan(name, { childOf : ctx });
    try {
        return callback(span);
    } finally {
        span.finish();
    }
}

/**
 *  Creates a TEXT_MAP carrier from a given span.
 * @param {Object} span - The span to get the carrier for
 * @return {object} - The span carrier
 */
export function carrierForSpan(span) {
    let carrier = {};
    opentracing.globalTracer().inject(span, opentracing.FORMAT_TEXT_MAP, carrier);
    return carrier;
}

/**
 * Trivial buffering of analytics events so we're not making an API call per
 * event.
 */
class AnalyticsEventBuffer {
    constructor(identifier) {
        this._identifier = identifier;
        this._buffer = [];
        this._flush = _.throttle(() => {
            if (this._buffer.length === 0) {
                return;
            }
            const params = {
                identifier : identifier,
                events       : this._buffer,
            };
            this._buffer = [];
            api.invoke('event/emit', params, null, false);
        }, ANALYTICS_BUFFER_THROTTLE_MS);
    }

    add(event, payload) {
        this._buffer.push({
            timestamp_micros : time.nowMicros(),
            context          : {
                page : {
                    path     : window.location.pathname,
                    referrer : document.referrer,
                    search   : window.location.search,
                    title    : document.title,
                    url      : `${window.location}`,
                },
            },
            event,
            payload : Object.assign({
                url : `${window.location}`,
            }, payload),
        });
        this._flush();
    }
}

let analyticsEventBuffers = {};

/**
 * A span-like interface with a bit more JS-centric convenience.
 */
class Section {
    constructor(span) {
        this._span = span;
    }

    tag(name, value) {
        this._span.setTag(name, value);
        return this;
    }
    child(name) {
        let span = opentracing.globalTracer().startSpan(name, { childOf : this._span });
        return new Section(span);
    }

    span() {
        return this._span;
    }

    carrier() {
        return carrierForSpan(this._span);
    }

    section(name, cb) {
        let section = this.child(name);
        try {
            cb();
        } finally {
            section.finish();
        }
    }

    finish() {
        this._span.finish();
    }

    /**
     * Record an analytics event.
     * @param {Object} event - The event to track
     * @param {Object} [payload={}] - The payload / body for the given event.
     * @return {object} - This instr instance
     */
    event(event, payload = {}) {
        this._span.log(Object.assign({
            type : 'analytics_event',
            event,
        }, payload));

        let buffer = analyticsEventBuffers[identifier];

        if (!buffer) {
            buffer = new AnalyticsEventBuffer(identifier);
            analyticsEventBuffers[identifier] = buffer;
        }
        buffer.add(event, payload);
        return this;
    }

    info(message, payload) {
        if (payload === undefined) {
            this._span.log({ message });
        } else {
            this._span.log({ message, payload });
        }
        return this;
    }

    error(message, err) {
        this._span.setTag('error', true);
        this._span.log({
            event          : 'error',
            'error.object' : err,
        });
        return this;
    }

    payload(payload) {
        this._span.log(payload);
    }
}

export function start(name, parentSpan) {
    let span;
    if (!parentSpan) {
        span = opentracing.globalTracer().startSpan(name);
    } else {
        span = opentracing.globalTracer().startSpan(name, { childOf : parentSpan });
    }
    return new Section(span);
}

export function event(event, payload = {}) {
    payload = Object.assign({
        type : 'analytics_event',
        event,
    }, payload);

    const identifier ... // however you identify a session or "project" or "org" etc. in LightStep's case this is by project

    let buffer = analyticsEventBuffers[identifier];
    if (!buffer) {
        buffer = new AnalyticsEventBuffer(identifier);
        analyticsEventBuffers[identifier] = buffer;
    }
    buffer.add(event, payload);
}

export function globalTracer() {
    return opentracing.globalTracer();
}

// unwrap
export function lightstepTracer() {
    return _lightstepTracer;
}
