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
  * [Important Tags](#important-tags)
  * [Example Traces](#example-traces)
