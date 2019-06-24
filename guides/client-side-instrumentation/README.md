# Client-Side Instrumentation
Quickstart guide to instrumenting user-facing applications.

Visit our full [documentation](http://docs.lightstep.com) or [API documentation](https://docs.lightstep.com/reference) for more in depth guides. Contact `support@lightstep.com` for additional questions and  resources, or to be added to our community slack channel.

## Pre-reqs
#### TBD
* probably want to be familiar with basic OpenTracing API architecture (span, trace, tracer, tag, log)

## Table of Contents
* [**Use Cases to Enable** *(what's the end goal here?)*](#usecases-to-enable)
* [Client-Side Tracers](#client-side-tracers)
  * [Libraries](#libraries)
    * [iOS Libraries](#ios-libs)
    * [Android Libraries](#android-libs)
    * [Javascript Library](#javascript-library)
  * [Implementating the Tracer](#implementing-the-tracer)
    * [Instantiation](#instantiation)
    * [Reporting Loop](#reporting-loop)
    * [Tracer Overhead](#tracer-overhead)
  * [Gen2 Mobile Libs (self-defined transport)](#gen2-mobile-libs)
* [Emitting Data](#emitting-data)
  * [Practical Advice](#practical-advice)
  * [Public Satellites](#public-satellites)
* [**Meaningful Traces**](#meaningful-traces)
  * [Abstracting User Interactions](#abstracting-user-interactions)
  * [Important Tags and Logs](#important-tags-and-logs)
  * [Example Traces](#example-traces)

## Meaningful Traces
### Abstracting User Interactions
Users can leave Applications open with little to know interactions. Similarly they can perform several, disjointed interactions within a very short period of time. Both of these, when not handled properly, can emit crazy looking traces that don't actually provide any useful information. We suggest abstracting user interactions in such a way that results in meaningful chunks of trace data.

When a user interacts with a certain high-level component, it can be beneficial to record all interactions rolling up under that component into a single trace. For example, a user enters a search query and clicks search, then the results fetch from the backend and load, until the user has the completed results. That whole interaction or "small use case" makes sense to belong in a single trace.

See this [file](https://github.com/sbaum1994/lightstep-guide/blob/master/code-snippets/section-utilites.js) for a full example of useful utilities that help with creating meaningful traces of user interactions.

### Important Tags and Logs
There are tags that work very well with LightStep in addition to the [opentracing semantic conventions](https://github.com/opentracing/specification/blob/master/semantic_conventions.md). Any tag that you add to your span data will enable more segmentation, so the more tags the merrier. LightStep doesn't have cardinality limitations, and the more powerful your tags the greater your insights will be, especially when using Explorer. In particular, tags that allow you to segment user pathways are useful.

Adding things like "parameters", `params.name` `params.count`, that correspond to the operation on the span, that tell an operation which path to take depending on user input, are also very helpful for grouping, filtering, and segmenting. Otherwise you may optimize for one use case without noticing some other outlier use case that only gets triggered 1/4 the time for example (and Correlations will also be able to spot the outliers from those tag values).

**Useful tags:**
* `params.count`, `params.name`, `params.type` corresponding to an operation
* `payload.size`, `response.size`, `request.bytes` or other size tags when sending and receiving data
* `host.dc`, `zone.name`, `zone.id` or `region`, any sort of regional, zone, or geographical tag.
* `request.id`, `uuid` or other anonymous identifiers of transactions or of users (or even of user segments or user types)
* `version`, `library.version`, `api.version` any sort of version tagging on your actual code that is shipped
* hardware versions, `platform` any identifier of the user's hardware, ios vs android, ios 10 vs ios 8
* `http.status_code_group` 4xx vs 5xx vs 2xx
* `client.error` vs `internal.error` boolean, for differentiating when an error is caused by a user, for ex. a 404, 400 vs 500
* `exception.class`, `exception.message`, `unified_error_code` to quickly figure out the magnitude of exceptions or specific  error types that are occuring (cannot stress having a unified error code enough!!) 

**Useful logs:**
* Sanitized payload of a request and a response (clear the PII)
* Stack trace or exception messages, error messages
* Logging when things are returning, processing, or waiting, ex. context deadline exceeded. An operation may go for a few seconds, logging can add context on what it's doing or what it's waiting for.
* For any additional context. If a user hit a certain flow and it's non-obvious by the operations, a simple log message can be helpful, i.e. "user entered flow x" (that should also be a tag!)
