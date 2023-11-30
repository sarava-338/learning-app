#!/bin/sh
cd frontend
echo 'installing frontend dependencies'
npm i
echoe 'front end dependencies installed'
cd ../backend
echo 'installing backend dependencies'
npm i
echo 'back end dependencies installed'
echo 'All installations and setup are done. You are ready to go now.'