# Incident

problem emerged as https://projects.bcc.no/desk/tickets/10378301/messages

VotingAdmin gets timeout errors when getting a polling-event and finding polls.

### root cause analysis

# Suspicions
1. Going to the Lobby (with an invalid JWT) causes 2 authenticate requests, and this errors when they both update the user.
2. Locally error can't be picked up because there is less latency when authenticating

# Deductions
1. Occurs in event Lobby and root page.
2. Not linked to a specific role.
3. Errors caused by write write conflict when updating the user.

url: http://localhost:8080/polling-event/lobby/504279890

4. Error is triggered on authenticateExternal in app.hooks
5. Locally there are no write-write conflicts

# Root cause:
