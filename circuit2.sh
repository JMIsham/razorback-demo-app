#!/bin/bash
echo "export const SAWTOOTH_REST_API = \"http://private-po-service-a2:8000\";" >> constants.js
npm run start
