# LightStep Quickstart
Quickstart guides to LightStep's UI.

Visit our full [documentation](http://docs.lightstep.com) or [API documentation](https://docs.lightstep.com/reference) for more in depth guides. Contact `support@lightstep.com` for additional questions and  resources, or to be added to our community slack channel.

## Pre-reqs
#### Login
Log into your LightStep organization account [here](https://app.lightstep.com) via username and email, SSO/SAML or Google.

###### Google Login
If you are a LightStep Admin you may configure Google login for your users if it isn't enabled, see this [page](https://docs.lightstep.com/docs/account-administration).

###### SSO Login
To configure SSO/SAML for your users, contact `support@lightstep.com`. 

#### Distributed Tracing
If you do not know what __distributed tracing__ is, scan the first section of this [page](https://lightstep.com/distributed-tracing/).

#### LightStep Satellites
If you do not know what __Satellites__ are, read this [paragraph](https://docs.lightstep.com/docs/satellite-setup#section-what-is-the-satellite-), and read about the __Satellite recall buffer__ in this [paragraph](https://docs.lightstep.com/docs/satellite-load-balancing#section-satellite-recall).

## Table of Contents
### Service Directory
Service directory is LightStep's landing page. It's primary purpose is to allow you to see reporting services, operations and their high level performance. A reporting service is a service that is sending span data (which make up traces) to LightStep Satellites. You can also quickly see what is instrumented and what is not instrumented in your codebase. 
  * __Guides__
    * Search for a reporting service by platform
    * View ingress and egress operations
    * Create a stream for an operation
    * View existing streams and dashboards by service
### Explorer
Explorer is LightStep's query page. This is where you can query your Satellites for live span and trace data, and view traces and performance in real time. You can view a live service diagram with performance overlayed, and do various analyses on your span data. _**There is no cardinality limits or additional cost when querying in Explorer.**_
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
### Streams
Streams are where you can record __timeseries data__ in LightStep of your span performance. Any query in Explorer of any cardinality can also be converted to a stream to enable recording of historical data. Streams record latency percentiles, throughput, error rate and traces over time for any query.
  * __Guides__
    * Define a stream to monitor performance over time for a tag
    * Define a dashboard to monitor performance across a service
    * Define a dashboard to monitor performance across an end to end transaction (multiple services)
    * View an individual stream
    * Define an SLA (Create a condition and an alerting rule for a stream)
### Trace page
View all spans that make up a trace. Clicking spans in LightStep's Explorer page, or clicking on a trace in a Stream, will take you to this page. 
  * __Guides__
    * Filter for a particular operation
    * View a tag, service or operation from a span in Explorer
    * Define an external link for a tag key value pair, operation or service

# Service Directory
## Search for a reporting service by platform
## View ingress and egress operations
## Create a stream for an operation
## View existing streams and dashboards by service

# Explorer
## Features
### Querying
Use the query bar at the top of Explorer to do queries on a combination of service, operation and multiple tags. Before doing any additional analysis, it is recommended to query for at least a service to start with. When you submit a query, the span table will populate with spans corresponding to traces that match your query. Clicking an individual span in the span table will take you to the trace page. You may see a "trace assembling" message on the trace page, this means LightStep is polling your Satellites to add additional spans that may be coming in. LightStep polls your Satellites for about 2 minutes for every trace assembly.

###### Running a query
![run a query](https://github.com/sbaum1994/lightstep-guide/raw/master/images/run_query.gif)

#### Snapshots
Every time you run a query in Explorer a Snapshot is created automatically, triggering 3000 traces (or less depending on the throughput of the service and the size of the Satellite buffer) that are then assembled and **persisted** and attached to this **Snapshot URL**. This URL can be shared or linked to as needed within your org, and will retain all functionality. (i.e. you can filter, group by, view service diagram etc. in each persisted Snapshot)

###### Viewing your snapshots
![view a snapshot](https://github.com/sbaum1994/lightstep-guide/blob/master/images/view_snapshot.gif)

#### Latency histogram
The latency histogram below the query bar in the Explorer displays on a logarithmic scale x scale, the duration of the spans queried, along with the amount on the y axis. It's useful for filtering the span table to a particular latency percentile, or viewing past performance of the same query (by clicking the 1 day, 1 hour, 1 week buttons).

###### Filtering to only p95+ spans with the latency histogram
![filter latency histogram](https://github.com/sbaum1994/lightstep-guide/blob/master/images/filter_histogram.gif)

#### Create a stream
When you run a query, a Stream, or historical timeseries data, may already exist for the query. If it does exist, "View Stream" will appear on the upper right of the Explorer page. If there is no Stream yet for this query, "Create Stream" will appear on the upper right instead. Click "Create Stream" to begin collecting historical data for any query of any cardinality. 

###### Creating a stream
![create a stream](https://github.com/sbaum1994/lightstep-guide/blob/master/images/create_stream.gif)

### Trace analysis
The trace analysis section of Explorer allows you to perform further actions on the spans in the spans table that were returned by your query.

#### Show all spans in traces
Clicking show all spans in traces will populate the table with all spans making up a trace for each trace in this Snapshot. For example, if I had a trace with spans starting in my `webapp` service and ending in my `api-server` service, and queried for `api-server` in the query bar, when I click "Show all spans in traces" the span table will populate with upstream spans emitted from my `webapp` service in addition to the spans from my `api-server` service.

###### Showing all spans in traces
![show all spans](https://github.com/sbaum1994/lightstep-guide/blob/master/images/show_all_spans.gif)

#### Filter
Filtering by a tag, operation or service will filter all spans in the table correspondingly. For example, if I had queried for a service, `api-server`, emitting spans with the tag `type` corresponding to http methods, I could filter by `type: POST` to see only the `POST` method spans. It's possible to add multiple filters.

###### Filtering by `type: POST`
![filter span table by a tag](https://github.com/sbaum1994/lightstep-guide/blob/master/images/filter_spans_table_by_tag.gif)

#### Group by
Group by allows you to see roll up analysis of spans in the span table. It's possible to group by operation, service or any tag. For example, assuming I had just filtered my spans table by the `type: POST` tag I can group by `operation` to see the latency, error rate and span count of all operations serving the http method `POST` in my `api-server`.

###### Grouping by `operation`
![group by operation](https://github.com/sbaum1994/lightstep-guide/blob/master/images/group_spans_table_by_operation.gif)

### Service diagram
Clicking the service diagram tab in Explorer will dynamically generate a service diagram based on all traces that were assembled for this query (or Snapshot). The yellow rings around services represent latency contribution and the red rings represent services with errors reporting (spans with the `error: true` tag). Latency contributions are calculated corresponding to the `service` that was queried, if no service was queried then the latency contribution rings _will not_ appear. Filtering the latency histogram will re-render the service diagram using only the selected spans (and corresponding selected traces). 

###### Filtering the latency histogram to view latency contributions in the service diagram for long-running spans
![service diagram latency histogram](https://github.com/sbaum1994/lightstep-guide/blob/master/images/service_diagram_filter_histogram.png) 

Clicking a service in the service diagram will populate example spans on the left for each service operation, in order of operation throughput and span duration. Clicking on a service that has a red ring will prioritize showing spans with _errors_. Selecting a span from the service diagram will take you to the trace page, with the corresponding span highlighted.

###### Selecting a span with an error from the service diagram
![service diagram span with error](https://github.com/sbaum1994/lightstep-guide/blob/master/images/service_diagram_to_trace_page.gif)

### Correlations
Latency correlations appear in the right panel of the spans table. A positive number indicates a correlation inside the selected window of the latency histogram, while a negative number indicates a correlation outside the selected window. Hovering a correlation computation will highlight the raw span counts in the latency histogram as well. Correlations are run based only off the query bar on the top and the latency histogram selection, and _do not re-compute based on any trace analysis selections_. Correlations will run over combinations of service, tag and operation for all traces corresponding to the query.

###### Selecting long running spans from the latency histogram and viewing corresponding correlations
![view correlations](https://github.com/sbaum1994/lightstep-guide/blob/master/images/correlations_hover.gif)

## Logical flow
In Explorer, unless you are searching for something specifically high cardinality, such as a single trace based on a `request-id` tag for example, you usually want to:
* Start with querying a __service__ or __service and operation__ combination

Then you could: 
* Use __group by__ to see what tags are reporting for the spans that were returned based on your query and their performance across values
* Click into __service diagram__ to understand the transaction flow between services
* Click __show all spans in traces__ and then __group by `operation`__ to see the performance break down across all operations upstream and downstream of this queried __service__ or __service and operation__ combination
* Click individual traces to view corresponding log information, relevant external links, and span context in the trace page

Once you've solved a problem or found relevant clues you could:
* Link the Snapshot URL corresponding to your Explorer query to your colleagues or in a post-mortem
* Link to a selected span in the trace page with suspect logs or performance
* Create a stream to start collecting performance metrics and historical traces for a query

## Group by error type to see error frequencies and latency percentiles for a single service
Scenario: I'd like to investigate the downstream health of all services my `api-server` service depends on.

1. First I query the service `api-server` and visit the **service diagram** to view downstream service health.

2. I see that the `auth-service` is red, showing that there are errors reporting dowstream from my `api-server` service.

<details><summary></summary>
<p>
 
![view service diagram](https://github.com/sbaum1994/lightstep-guide/blob/master/images/2select_service_diagram.gif)

</p>
</details>

3. I switch back to the Trace Analysis tab and click **show all spans in traces** to view all the spans flowing through the `api-server` service. Then I filter by `service:auth-service` and `error:true`. Now I am looking at all spans downstream of `api-server` that originate in the `auth-service` with the `error:true` tag.

<details><summary></summary>
<p>
 
![show all spans and filter](https://github.com/sbaum1994/lightstep-guide/blob/master/images/3show_all_spans_and_filter.gif)

</p>
</details>

4. I **add a column** for `exception.type` to populate this tag in my trace table without having to click on each trace individually. I see this tag is populating for all my spans and might be a good candidate for **group by**.

<details><summary></summary>
<p>
 
![add a column to view exception type tag](https://github.com/sbaum1994/lightstep-guide/blob/master/images/4add_column_exception_type.gif)

</p>
</details>

5. I group by `exception.type` and see the breakdown of latency averages and frequency (span count) by the `exception.type` tag. In this case, `TimeoutException` seems to be much more frequent than `RuntimeException` and therefore causing the higher magnitude of errors.

<details><summary></summary>
<p>

![group by exception type](https://github.com/sbaum1994/lightstep-guide/blob/master/images/5group_by_exception_type.gif)

</p>
</details>

## Filter in latency histogram use group by to find long running operations
WIP
Group by operation
Sort by latency
Click show all spans in traces
Group by operation
Sort by latency
Click into a span
Verify that this operation is actually the outlier that is causing long running transactions.
(! transactions that include user-space-mapping operation) 

## Filter in latency histogram to find the and group by region to root cause a regional problem
Scenario: An alert comes in about my `api-server` service experiences high latencies. 


## Group by http status code to see frequencies and latency percentiles per status code for an operation
## Show all spans in trace and filter in trace analyzer to view upstream service performance for an operation

# Streams
## Define a stream to monitor performance over time for a tag
## Define a dashboard to monitor performance across a service
## Define a dashboard to monitor performance across an end to end transaction (multiple services)
## View an individual stream
## Define an SLA (Create a condition and an alerting rule for a stream)

# Trace page
## Filter for a particular operation
## View a tag, service or operation from a span in Explorer
## Define an external link for a tag key value pair, operation or service
