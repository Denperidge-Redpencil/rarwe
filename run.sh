#!/bin/bash

function menu {
    echo
    echo
    echo
    echo "0: Exit"
    echo "1: Run Ember server with rockandrollwithemberjs.com proxy"
    echo "2: Run Ember test"
    echo "3: (Custom) Run rarwe-backend/"
    echo "4: (Custom) Run Ember server with rarwe-backend/ proxy"

    read -p "Select [0]: " selection

    if [[ $selection == "1" ]]; then
        ember s --proxy=http://json-api.rockandrollwithemberjs.com &
    elif [[ $selection == "2" ]]; then
        ember t --server &
    elif [[ $selection == "3" ]]; then
        pushd rarwe-backend/
        docker-compose up --detach
        popd
    else
        echo "Shutting down!"
        kill -9 $(jobs -p)
        return
    fi;
    menu
}

menu