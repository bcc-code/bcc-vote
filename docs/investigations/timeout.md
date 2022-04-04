# Incident

problem emerged as https://projects.bcc.no/desk/tickets/10378301/messages

VotingAdmin gets timeout errors when getting a polling-event and finding polls.

### root cause analysis

# Suspicions
1. Going to the Lobby (with an invalid JWT) causes 2 authenticate requests, and this errors when they both update the user.

# Deductions
1. Occurs in event Lobby and root page.
2. Not linked to a specific role.
3. Errors caused by write write conflict when updating the user.

# Root cause:
