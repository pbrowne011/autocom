#!/bin/bash

curl -X POST 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery/' \
    -H 'accept: application/json;api-version=3.0-preview.1' \
    -H 'content-type: application/json' \
    -d '{
        "filters": [{
            "criteria": [{
                    "filterType": 7,
                    "value": "pbrowne011.autocom"
            }]
          }],
        "flags": 402
       }' | jq 'del(.results[].extensions[].versions)'
