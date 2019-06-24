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
  * [Code-snippets](#code-snippets)
* [Emitting Data](#emitting-data)
* [**Meaningful Traces**](#meaningful-traces)
  * [Abstracting User Interactions](#abstracting-user-interactions)
  * [Important Tags and Logs](#important-tags-and-logs)
  * [Example Instrumentation](#example-instrumentation)

## Client-Side Tracers
### Libraries
#### C++ Library
LightStep's C++ library is heavily optimized when using the http streaming transport option. This is recommended.

* [Standard LightStep C++ Library](https://github.com/lightstep/lightstep-tracer-cpp) 

#### iOS Libraries
LightStep supports two iOS libraries. One is a standard tracer library in Objective C. The other is a Swift library we developed concurrently with Lyft that requires a custom defined transport. This was done to allow for more flexibility and optimization on the analytics data payloads (Lyft was using a specialized transport for all analytics data). [Mobile Envoy](https://eng.lyft.com/announcing-envoy-mobile-5c2067d9ade0) was made to work with this library.

* [Standard LightStep Objective-C Library](https://github.com/lightstep/lightstep-tracer-objc)
* [Self-defined Transport LightStep Swift Library](https://github.com/lightstep/lightstep-tracer-swift), send a request to your LightStep rep for access to this library as it's non-public

#### Android Libraries
LightStep supports two android libraries. One is a standard tracer library with built in Okhttp and GRPC transports. The other is a library we developed concurrently with Lyft that requires a custom defined transport. This was done to allow for more flexibility and optimization on the analytics data payloads (Lyft was using a specialized transport for all analytics data). [Mobile Envoy](https://eng.lyft.com/announcing-envoy-mobile-5c2067d9ade0) was made to work with this library.

* [Standard LightStep Android Library](https://github.com/lightstep/lightstep-tracer-android)
* [Self-defined Transport LightStep Android3 Library](https://github.com/lightstep/lightstep-tracer-android3), send a request to your LightStep rep for access to this library as it's non-public

#### Javascript Library
LightStep has a single Javascript library that supports both backend and frontend Javascript applications. It also comes with auto-instrumentation on fetch and xhr. Make sure you include the platform e.g. `lightstep-tracer/browser` in your require statements. See the repository for usage options and examples. 

* [Standard LightStep Javascript Library](https://github.com/lightstep/lightstep-tracer-javascript) 

#### Code-snippets and common patterns
WIP
See respective repositories linked above for examples on basics (like starting a tracer and sending spans).

* For code examples of user-specific abstractions, jump to this [section](#abstracting-user-interactions)
* [See examples of common patterns in Java here](https://github.com/opentracing/opentracing-java/tree/master/opentracing-testbed)

### Implementing the Tracer
#### Instantiation
The LightStep tracer is meant to be a singleton. It should be instantiated at the very beginning of your application. Dependency injection of the tracer is definitely nice to have, for easy access across classes and for ensuring a singleton instance. If you are already using DI for logging or http transport etc. consider following the same patterns

Registering the tracer with DI in Android:
```@Module
public class TracerModule {

 @Provides @Singleton
 protected io.opentracing.Tracer provideTracer() {
   if (!GlobalTracer.isRegistered()) {
     io.opentracing.Tracer tracer;

...
```

Always try-catch the instantiation of the tracer, and fallback to the NoopTracer on failures. The tracer options ideally would come from a configuration file. It's a good idea to set high-level tags that will be on all spans at the tracer insantiation level. 

Example of try-catch instantiation in Android:
```
try {
   Options options = new Options.OptionsBuilder() ...
   tracer = new JRETracer(options);
   Log.e("TracerInit", "Initialized OpenTracing Tracer with LightStep impl.");
 } catch (Exception ex) {
   Log.e("TracerMisconfig", "Invalid Lightstep configuration.  Returning a NoopTracer: {}\", ex.getClass()");
   if (!isNullOrEmpty(ex.getMessage())) {
     Log.e("TracerMisconfigEx", ex.getMessage());
   }
   tracer = NoopTracerFactory.create();
 }
 GlobalTracer.register(tracer);
 ```

#### Reporting Loop
LightStep's tracers have a reporting loop that reports to Satellites every x milliseconds, or every x bytes within the buffer, depending on the language (see the tracer libraries for more details on this). 

On traces that have a flush function, considering calling tracer.flush if the tracer is not to be kept alive in the background. For example, flush explictly when the application closes, or when the user temporarily switches to a different application.

In Android it will look like this:
```
  // Take advantage of LightStep specific force flush functionality
  public void castAndFlush(io.opentracing.Tracer tracer, long timeoutMillis) {
    ((JRETracer)tracer).flush(timeoutMillis);
  }

```

## Emitting Data
There are two ways to emit event data from your frontend applications to LightStep.
1. Report directly to a publically hosted satellite pool, either LightStep SaaS Satellites or your hosted public satellites.
2. Report indirectly via an analytics bundle that is sent to the backend.

The practical advise is to use whatever pathway you currently use for other metrics and eventing data. The most popular approach among our customer base is to use a public satellite pool. As long as your public satellites are rate limited, this should not be a problem. 

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

### Example Instrumentation
This is an example directly from LightStep tracing it's users, where I'm investigating the performance for our dom_load operation. (LightStep inception!)

The first picture is a service diagram of my *react-client* which is the frontend web client reporting from the browser when a user uses our UI. As you can see there are some backend services it's relying upon.

![service diagram](https://github.com/sbaum1994/lightstep-guide/raw/master/images/blurred_service_diagram_from_fe.png)

If I wanted to dig into our DOM load performance in particular for the higher percentiles (similar to start-up on a mobile app) I can query for that high level operation in Explorer, filter my latency histogram, and then click _show all spans in traces_ and _group-by operation_ (or any other tag). Now what I see is all the operations in order of average latency that are happening in my *react-client* and _downstream_ to it for p95+ latencies.

![groupby](https://github.com/sbaum1994/lightstep-guide/raw/master/images/blurred_show_all_traces_groupby_from_fe.png)

I can then click on an individual trace and see a breakdown of latencies from downstream services contributing to my DOM load time, as well as spans showing latency contributions from the *react-client* such as DOM load transfer time etc. Since I already grouped by operation previously and saw the average times for my p95+ latencies, I know which operations in this trace are an average example of latency contribution, and I can also see more in depth the latency breakdown between services of all things that are triggered by the DOM load action and order of events.

![domload trace](https://github.com/sbaum1994/lightstep-guide/raw/master/images/domload_trace_blurred.png)

If I wanted to monitor DOM load historically I could create streams for it. I could also have done this even further by adding a particular tag for an application version for example or region etc. Service directory will also populate with all the operations for each service, and will keep track of operation latency and error changes per service. So I can click over to service directory and see if there's been a jump in p50, p90, p95, p99 latencies or error rate or throughput historically compared to now.
