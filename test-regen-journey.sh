#!/bin/bash

# This script regenerates the journey with the existing interview data
JOURNEY_ID="cml0zv85p0001jzy0169hzbag"

# Send request to regenerate journey using the existing interview data
curl -X POST http://localhost:3000/api/trpc/ai.generateJourney \
  -H "Content-Type: application/json" \
  -d "{
    \"0\": {
      \"journeyId\": \"$JOURNEY_ID\",
      \"interviewData\": {
        \"productType\": \"chakna central food app\",
        \"description\": \"one stop cloud kitchen for party snacks and alcohol pairings\",
        \"problem\": \"guests don't know what snacks go well with alcohol at parties\",
        \"userType\": \"party planners and alcohol enthusiasts\",
        \"discoveryChannels\": \"Instagram and word-of-mouth\",
        \"primaryAction\": \"see curated snack and alcohol pairings\"
      }
    }
  }"

echo ""
echo "Regeneration request sent!"
