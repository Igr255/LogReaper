#!/bin/sh

if podman run --rm -ti -v $PWD:/opt/logreaper:z node /opt/logreaper/build.sh; then
    echo
    echo =========================
    echo Static files for web are located in: App/log-reaper/build
fi
