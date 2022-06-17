# bin/sh

rm users/*
issueDate=$(date +%s)
expireDate=$(date +%s -d "+1 day")
echo "The value of \"issueDate\" is $issueDate."
for f in {0..20}
do
    for i in {1..30}
    do
        let "personID = $f * 30 + $i"
        echo -n "$personID," >> "users/${f}.csv"
        curl -X GET 'http://7909239a5ed9.ngrok.io/token' \
            -H 'Content-Type: application/json' \
            -d '{
                "https://login.bcc.no/claims/personId": '$personID',
                "https://members.bcc.no/app_metadata": {
                    "hasMembership": true,
                    "personId": '$personID'
                },
                "iss": "https://bcc-sso-dev.eu.auth0.com/",
                "aud": [
                    "bcc.members",
                    "https://bcc-sso-dev.eu.auth0.com/userinfo"
                ],
                "iat": '$issueDate',
                "exp": '$expireDate',
                "azp": "hPK4PRnpFkY5MmUoJZa31sNldB0Mprei",
                "scope": "openid profile email"
            }' >> "users/${f}.csv"
        echo "" >> "users/${f}.csv"
    done
done
