#!/bin/sh

cd $(dirname $0)

cd App/log-reaper
yarn
yarn build
