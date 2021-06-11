# BCC Vote does not scale on Cloud Run

## Description

The Voting app has to be able to scale up to 5000 connection, currently it is not possible to scale up to mora than 250

## What do we know.
1. 

## Hypthesis 1
The moment you enforme the minimum container count to more than one the app does not want to accept socket connections anymore but it still acepts https requests

### Experiment
Set the minimum container cound to two and then put a http load on the voting app

### Observations


### Conclusion




## Hypthesis 2
It is a common problem between both members and voting

### Experiment
Reproduce the same load test on members.

### Observations


### Conclusion