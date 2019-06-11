# lightstep-guide
Quick markdown guide to LightStep's UI.

Visit our full [documentation](http://docs.lightstep.com) or [API documentation](https://docs.lightstep.com/reference) for more in depth guides. Contact `support@lightstep.com` for additional questions and  resources, or to be added to our community slack channel. 

#### Login
Log into your LightStep organization account [here](https://app.lightstep.com) via username and email, SSO/SAML or Google.

###### Google Login
If you are a LightStep Admin you may configure Google login for your users, see this [page](https://docs.lightstep.com/docs/account-administration).

###### SSO Login
To configure SSO/SAML for your users, contact `support@lightstep.com`. 

## Table of Contents
* ### Service Directory
Service directory is LightStep's landing page. It's primary purpose is to allow you to see reporting services, operations and their high level performance. You can also quickly see what is instrumented and what is not instrumented in your codebase. 
  * __Guides__
    * Search for a reporting service by platform
    * View ingress and egress operations
    * Create a stream for an operation
    * View existing streams and dashboards by service
* ### Explorer
Explorer is LightStep's query page. This is where you can query your Satellites for live span and trace data, and view traces and performance in real time. You can view a live service diagram with performance overlayed, and do various analyses on your span data. There is no cardinality limits or additional cost when querying in Explorer. If you do not know what __Satellites__ are, read about them in this [section](https://docs.lightstep.com/docs/satellite-setup#section-what-is-the-satellite-), and read about the __Satellite buffer__ in this [section](https://docs.lightstep.com/docs/satellite-load-balancing#section-satellite-recall).
  * Features
    * Querying
      * Snapshots
      * Latency histogram
      * Create a stream
    * Trace analysis
      * Show all spans in traces
      * Filter
      * Group by
    * Service diagram
    * Correlations
  * Logical flow
  * __Guides__
    * Filter in latency histogram for long running spans (p95+) and view correlations and service diagram
    * Group by error type to see error frequencies and latency percentiles for a single service
    * Filter in latency histogram for long running spans and group by region to root cause a regional problem
    * Group by http status code to see frequencies and latency percentiles per status code for an operation
    * Show all spans in trace and filter in trace analyzer to view upstream service performance for an operation
* ### Streams
Streams are where you can record __timeseries data__ in LightStep of your span performance. Any query in Explorer of any cardinality can also be converted to a stream to enable recording of historical data. Streams record latency percentiles, throughput, error rate and traces over time for any query.
  * __Guides__
    * Define a stream to monitor performance over time for a tag
    * Define a dashboard to monitor performance across a service
    * Define a dashboard to monitor performance across an end to end transaction (multiple services)
    * View an individual stream
    * Define an SLA (Create a condition and an alerting rule for a stream)
* ### Trace page
View all spans that make up a trace. Clicking spans in LightStep's Explorer page, or clicking on a trace in a Stream, will take you to this page. 
  * __Guides__
    * Filter for a particular operation
    * View a tag, service or operation from a span in Explorer
    * Define an external link for a tag key value pair, operation or service
