#!/bin/bash
echo "export const SAWTOOTH_REST_API = \"http://127.0.0.1:8010\";" >> constants.js
npm run start
