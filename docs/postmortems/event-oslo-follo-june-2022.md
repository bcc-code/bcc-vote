# Incident

# Symptoms
1. Client connection closes after a time of inactive app usage.
2. While voting a error like "Didn't get through" is shown in the UI despite the vote being registered.
3. Problems are fixed multiple times by refreshing the page.
4. A Timeout error was thrown
5. Published polls are not showing up

# Observations
- Requests to the database have high latency (https://portal.azure.com/#@bcc.no/resource/subscriptions/a77a3461-9212-44cf-bc6a-11c6281797e9/resourceGroups/BCC-Vote/providers/microsoft.insights/components/bcc-vote-prod/performance) sort by latency
- Especially calls to the _system database, suspected to be caused by initiating containers.
- Cloud Run containers spiked up to 49 and later on 60 instances.
- Cloud Run shows a spike under the 95% percentile of 70%-80% CPU usage

# Theories

"Our container instances are setup for 250 concurrent connections, a websocket connection lasts for an hour. 

This means that when everyone starts logging in, the 1 active container accepts 250 sockets before another one is spun up. Now when the first poll starts, those 250 connection receive the 750 answers each; this means that 175.000 (250 x 750) events need to be sent out.

Because of all these events the CPU usage is pushed to 70% and Cloud Run decides to scale up to handle this load. But because the sockets last for one hour, scaling up doesn't reduce the load. Therefor Cloud Run just continues scaling up. The scaling loop ends when users stop voting, either due to broken usage or the end of an event.
"

# Conclusions

- There is no findable bug in the code.  
- Scalibility configuration is the most probable limitation.
- The actual problem is our approach to events, streaming all events to all users does not scale.

# Possible solutions

1. Replace WebSockets with a dedicated connections broker. Also move server traffic to HTTP.
2. Plug in FireStore directly into the client, this has a permissions downgrade though.
3. Optimize our current solution:
    - Reduce the traffic from FireStore; Periodically fetch the answers.
    - Reduce the traffic from events we send out; Batch answers we listened to from FireStore, for example during a 1 second timeframe.
    - Ditching FireStore might be the result of this.

## Actions

We like the possible solution proposed in point 3 best, because the others demand more. Therefor we want to prove it by load testing. 

1. Generate a load test to simulate the end-user experience with 750 connections.
2. Implement a prototype for proposed solution #3.
3. Verify solution #3 with loadtest from action point 1.
