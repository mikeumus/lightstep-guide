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
    * [Search for a reporting service by platform](#search-for-a-reporting-service-by-platform)
    * [View ingress and egress operations for a service](#view-ingress-and-egress-operations-for-a-service)
    * [Create streams for ingress operations](#create-streams-for-ingress-operations)
    * [View existing streams and dashboards by service](#view-existing-streams-and-dashboards-by-service)
### Explorer
Explorer is LightStep's query page. This is where you can query your Satellites for live span and trace data, and view traces and performance in real time. You can view a live service diagram with performance overlayed, and do various analyses on your span data. _**There is no cardinality limits or additional cost when querying in Explorer.**_
  * [Features](#features)
    * [Querying](#querying)
      * [Snapshots](#snapshots)
      * [Latency histogram](#latency-histogram)
      * [Create a stream](#create-a-stream)
    * [Trace analysis](#trace-analysis)
      * [Show all spans in traces](#show-all-spans-in-traces)
      * [Filter](#filter)
      * [Group by](#group-by)
    * [Service diagram](#service-diagram)
    * [Correlations](#correlations)
  * [Logical flow](#logical-flow)
  * __Guides__
    * [Filter in latency histogram use group by to find long running operations
](#filter-in-latency-histogram-use-group-by-to-find-long-running-operations)
    * [Root cause a regional problem only affecting a few tenants/requests (p99+)](#root-cause-a-regional-problem-only-affecting-a-few-tenantsrequests-p99)
    * [See frequencies and latency percentiles per status code for an operation](#see-frequencies-and-latency-percentiles-per-status-code-for-an-operation)
    * [View downstream service performance for a single ingress operation of a service](#view-downstream-service-performance-for-a-single-ingress-operation-of-a-service)
### Streams
Streams are where you can record __timeseries data__ in LightStep of your span performance. Any query in Explorer of any cardinality can also be converted to a stream to enable recording of historical data. Streams record latency percentiles, throughput, error rate and traces over time for any query. See the Google SRE book [golden signals](https://landing.google.com/sre/sre-book/chapters/monitoring-distributed-systems/#xref_monitoring_golden-signals) for the philosophy behind the metrics being captured.
  * __Guides__
    * [View an individual stream](#view-an-individual-stream)
    * [Monitor performance over time for a tag](#monitor-performance-over-time-for-a-tag)
    * [Monitor performance across a service using a dashboard](#monitor-performance-across-a-service-using-a-dashboard)
    * [Monitor performance across an end to end transaction using a dashboard](#monitor-performance-across-an-end-to-end-transaction-using-a-dashboard) (multiple services)
    * [Define an SLA](#define-an-SLA) (Create a condition and an alerting rule for a stream)
### Trace page
View all spans that make up a trace. Clicking spans in LightStep's Explorer page, or clicking on a trace in a Stream, will take you to this page.
  * __Guides__
    * [View an individual trace](#view-an-individual-trace)
    * [Filter for a particular operation](#filter-for-a-particular-operation)
    * [View a tag, service or operation from a span in Explorer](#view-a-tag-service-or-operation-from-a-span-in-explorer)
    * [Define a workflow link for a tag key value pair, operation or service](#define-a-worflow-link-for-a-tag-key-value-pair-operation-or-service)

# Service Directory
## Search for a reporting service by platform
#### Why? 
To find your own service reporting to LightStep, or to see what other services are reporting with the same platform as yours so you can check out their instrumentation. 
#### Steps
1. Navigate to the Service Directory tab in LightStep.

2. Filter by platform in the dropdown.


<details><summary></summary>
<p>
 
![filter by platform](https://github.com/sbaum1994/lightstep-guide/blob/master/images/filter-by-platform-service-directory.gif)

</p>
</details>

#### From here
* Investigate individual traces from reporting services to see what the instrumentation looks like for each.
* Connect your own service to LightStep via instrumentation.

## View ingress and egress operations for a service
#### Why? 
To filter operations to those that are at the edges of your service, and from there investigate what may be causing performance problems upstream or downstream.

#### Steps
1. Navigate to the Service Directory tab in LightStep.

2. Select your service

3. Select Ingress or Egress column filters

#### From here
* Filter since 1 hour ago, 1 day ago or 1 week ago to see if there have been significant changes in Error Rate, Latency or Throughput for ingress or egress operations
* Choose an ingress/egress operation and go to Explorer, then view upstream and downstream service level performance for this operation via Service Diagram, or `show all spans in traces` in Trace Analyzer to start investigating upstream and downstream  performance by `operation` (via group-by). [See this guide](#view-downstream-service-performance-for-a-single-ingress-operation-of-a-service)

## Create streams for ingress operations
#### Why?
Usually ingress operations for a service are high level enough that they will indicate performance problems within a single service, and granular enough that finding the root cause of a performance problem is straightforward. Streams will tell LightStep capture performance data and example traces, making root-cause analysis via individual traces, and tracking performance easier.

#### Steps
1. Navigate to the Service Directory tab in LightStep.

2. Select your service

3. Select the Ingress column filter

4. Click the "Create Stream" button to the left of the operation. From here you will also be able to easily access streams that have been created.

<details><summary></summary>
<p>
 
![click ingress operation and create stream](https://github.com/sbaum1994/lightstep-guide/blob/master/images/click-ingress-operation-and-create-stream.gif)

</p>
</details>

## View existing streams and dashboards by service
#### Why?
If there is a performance problem impacting a particular service (indicated via an alert for example) in LightStep, after first investigating in Explorer, you may want to view historical performance by checking whether streams already exist for this service.

#### Steps
1. Navigate to the Service Directory tab in LightStep.

2. Select your service

3. Select the Streams and Dashboards tabs

4. OR view existing streams by operation by clicking View Stream next to an operation.

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

## See error frequencies and latency percentiles for a single service
#### Scenario
I'd like to investigate the downstream health of all services my `api-server` service depends on.

#### Steps
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

## Root cause a regional problem only affecting a few tenants/requests (p99+)
#### Scenario
An alert or complaint comes in for a particular service or transaction experiencing intermittent high latencies. (This could be configured through a stream for this particular service or transaction path by setting the alert condition to `p99 > Xms`) 

#### Steps
1. First I query the relevant service, for example `api-server`, and filter the latency histogram to longer running spans.

2. I **group by** the corresponding region tag, in this example `region` in the Trace Analysis table to see which 

<details><summary></summary>
<p>

![group by region](https://github.com/sbaum1994/lightstep-guide/blob/master/images/group_by_region.gif)

</p>
</details>

## See frequencies and latency percentiles per status code for an operation
#### Steps
1. I query the relevant service, and (in this example) operation, then **group by** the `http.status_code` tag. I could do this globally or scoped to a particular arbitrary tag (ex. `tenant-id`, or `region`) to view across a section of data.

<details><summary></summary>
<p>
 
![group by status code](https://github.com/sbaum1994/lightstep-guide/blob/master/images/group_by_http_status_code.gif)

</p>
</details>

## View downstream service performance for a single ingress operation of a service
#### Steps
1. I query the relevant service (in this case `ios-client`) and view the **service diagram** to see which downstream services have high latency contributions. I notice that `api-server` has significant latency contribution.

<details><summary></summary>
<p>
 
![show all and group by](https://github.com/sbaum1994/lightstep-guide/blob/master/images/service_diagram_ios-client.png)

</p>
</details>

2. I switch to the Trace Analysis table and click **show all spans**, **filter** by `service: api-server` and by `ingress.operation: true` to filter out some of the span data noise. My `api-server` might have all kinds of operations but I just want to see high-level ones. This requires you to have ingress.operation as a tag, good best practice. Then I **group by** operation and see the performance (error rate and average latencies) of the operations within `api-server` that is downstream to `ios-client`.

<details><summary></summary>
<p>
 
![show all and group by](https://github.com/sbaum1994/lightstep-guide/blob/master/images/check_upstream_service_operation_performance.gif)

</p>
</details>

# Streams
## View an individual stream
#### Steps
1. Find the Stream [via Service Directory](#view-existing-streams-and-dashboards-by-service) or via Streams page directly -

![streams page](https://github.com/sbaum1994/lightstep-guide/blob/master/images/streams-page-tab.png)

2. View and interpret the stream

Example Stream:

![example stream](https://github.com/sbaum1994/lightstep-guide/blob/master/images/stream-page.png)

###### What data is a stream capturing?
A stream in LightStep is capturing all span data flowing from your system into LightStep satellites that matches the queried predicate (underneath the name of the Stream). If I view a stream for `customer-id: BEEMO`, I'm viewing a stream of span data, including latencies, error rate and throughput, matching this particular tag only.

See the Google SRE book [golden signals](https://landing.google.com/sre/sre-book/chapters/monitoring-distributed-systems/#xref_monitoring_golden-signals) for the philosophy behind the metrics being captured.

###### Latency percentiles
Four lines representing different latency percentile performance appear on the stream by default. The p99.9 line at any moment, for example, represents the latency performance of 0.1% of transactions during this moment, where as the p50 line will represent the average latency performance. The *filter* button at the top right allows you to add a custom percentile line.

###### Error rate
The red line represents the historical error rate (error count/ops per second) across time. A stream with no operations occuring will also have a 0% error rate, similarly, a stream with only one operation being captured that is an erroring operation will have a 100% error rate.

###### Throughput
The black line represents the historical throughput, or raw operation counts per second, across time.

###### Historical Traces
Each green or red dot represent a saved trace when hovering. Red dots represent error traces. Traces are saved across the full performance distribution every minute, so clicking a trace in the p99 area will give you a p99 trace. Traces with errors are also saved with a higher sampling priority.

Click an individual dot on the stream to view the trace.

*Filter* for error traces via the filter button at the top, or for traces by duration.

<details><summary></summary>
<p>
 
![click a trace from a stream](https://github.com/sbaum1994/lightstep-guide/blob/master/images/click-trace-from-a-stream.gif)

</p>
</details>

## Monitor performance over time for a tag
#### Scenario
There is a particular tenant that has been having trouble with our iOS Platform. We have an `ios-client` service reporting and a `customer_id` tag reporting as well. 

#### Steps
1. Query for the service name and customer/tenant tag in Explorer. (or any tag you'd like to create a stream for)

2. Click the "Create Stream" button in the upper right. In this gif, a stream is already created so the button says "View Stream" instead. 

<details><summary></summary>
<p>
 
![create stream for customer id](https://github.com/sbaum1994/lightstep-guide/blob/master/images/create-stream-for-customer_id.gif)

</p>
</details>

## Monitor performance across a service using a dashboard
#### Pre-reqs
A service is reporting to LightStep with ingress operations.

#### Steps
1. Query for the reporting service in Service Directory
2. Click the quick "Create Stream" button on the left for all ingress operations.
    * See [View ingress and egress operations](#view-ingress-and-egress-operations-for-a-service)
3. Create a dashboard.

<details><summary></summary>
<p>
 
![create dashboard](https://github.com/sbaum1994/lightstep-guide/blob/master/images/create-dashboard.gif)

</p>
</details>

3. Name the dashboard, star it, and add all created streams.

<details><summary></summary>
<p>
 
![add streams to dashboard](https://github.com/sbaum1994/lightstep-guide/blob/master/images/name-dashboard-add-operations.gif)

</p>
</details>

4. Create additional streams as needed view querying in Explorer and add to this dashboard. (such as by `version` tag, or by `tenant-id` or `upstream-service` tags)

## Monitor performance across an end to end transaction using a dashboard
#### Pre-reqs
* Multiple services are reporting to LightStep that make up a transaction.
* You have already gone through the [Explorer](#explorer) walkthrough.

#### Steps
1. Query for individual operations via Explorer. Start with the highest (most user facing) level ingress operation
* Click **show all spans in trace** and **group-by** operation to quickly see upstream and downstream operations to this operation.
* Then click invididual operations to then view individual traces of different downstream operation flows.
  * Within individual spans on the trace, click the clock next to the operation to quickly query the operation in Explorer
* Each time you query for a relevant operation Explorer, click the "Create Stream" button on the upper right.

2. Add all streams created to a dashboard named after this transaction.

Example transaction tree for Stream creation (starting from `api-request/charge`)

![example transaction tree](https://github.com/sbaum1994/lightstep-guide/blob/master/images/transaction-tree-for-stream-creation.png)

End Result
(note that only highest level ingress operations were chosen in this case)

![example transaction dashboard](https://github.com/sbaum1994/lightstep-guide/blob/master/images/charge-transaction-dashboard.png)

## Define an SLA
#### Steps
1. View a Stream
2. Click the "Create Condition" button on the top right 
* Supported conditions are on error rate, throughput and latency

![example condition](https://github.com/sbaum1994/lightstep-guide/blob/master/images/example-condition.png)

"Trigger condition when the average (p50) latency is above 1000ms over the last 10m."

3. Add an alerting rule
* Supported alerting rules include Slack, PagerDuty or a Webhook (for ex. OpsGenie or to an AWS Lambda function)

![example condition and alerting rule](https://github.com/sbaum1994/lightstep-guide/blob/master/images/example-condition-and-alerting-rule.png)

"Alert #acme-alerts slack channel every 2m when the condition is violated."

4. View your conditions
* You can view conditions for a stream directly by clicking on the "Conditions" button on the top right of the stream page
* Or you can view conditions on the left by clicking the "Monitoring" tab and selecting "Conditions"

###### Alerts Flow in LightStep
Alert payloads also include direct links to traces that both violate and don't violate the condition for quicker MTTR. When an alert is triggered, likely the first step should be clicking on these traces and from there jumping into Explorer for real-time exploration. See the [Explorer guides](#logical-flow) for more on using Explorer for debugging. Additionally, it can be helpful to check the service being affected in Service Directory for latency or error rate changes in the last hour.

# Trace page
## View an individual trace
![example trace page](https://github.com/sbaum1994/lightstep-guide/blob/master/images/example-trace-page.png)

###### Trace Map
The trace map of the trace page is the condensed diagram on the top left. The yellow bar represent the **critical path** of Latency Contribution compute by LightStep, to quickly show where the most latency is occuring in a transaction. Different colors represent different services.

###### Spans
Spans that make up the trace are visualized below the trace map. Spans are emitted from particular services and describe particular operations (`service` and `operation` tags). Click on individual spans to see the **Span Context** update on the right. 

###### Span Context
Span context is additional information attached to each span in a trace. This includes tags and logs. Tags are unlimited cardinality bits of information that you can use to segment your data in LightStep. Logs are useful logging payloads that are across the duration of the span. These are configured within instrumentation. Under additional details you can also see span start and finish times, as well as the Latency Contribution computed per span.

Workflow links are links generated from a tag dynamically in a trace.

## Filter for a particular operation
Click the filter box underneath the trace minimap and type to begin filtering spans across service and operation name.

![filter in trace page](https://github.com/sbaum1994/lightstep-guide/blob/master/images/filter-in-trace-page.png)

## View a tag, service, or operation from a span in Explorer
Click the individual clock icons on the right corresponding to tags, service and operation to jump directly to Explorer. From here you can view and segment the particular queried data within your recall window.

## Define a workflow link for a tag key value pair, operation or service
Click the "Create Link" button under Workflow Links on the right to define a Workflow Link. This allows you to create dynamic links to your logging platform, or a slack channel for example, corresponding for a particular service, tag, operation or span timestamp.

See all the rule parameters for creating Workflow Links and more in our [documentation](https://docs.lightstep.com/docs/workflow-links).

<details><summary></summary>
<p>
 
![create a workflow link](https://github.com/sbaum1994/lightstep-guide/blob/master/images/create-workflow-link.gif)

</p>
</details>

Example Workflow:
1. I get alerted for my `api-server` service on error rate
2. I click the trace link in the alert payload which takes me to a trace with an `error: true` tagged span selected.
3. I click the Workflow Link to my logging platform that's generated with the span timestamps, this takes me to the logs for the same time period for this particular service. 
