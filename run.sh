#!/bin/bash

function menu {
    echo
    echo
    echo
    echo "0: Exit"
    echo "1: Run Ember server with rockandrollwithemberjs.com proxy"
    echo "2: Run Ember test"
    echo "3: Run docker-compose"
    echo "4: Run Ember server with localhost proxy"

    read -p "Select [0]: " selection

    if [[ $selection == "1" ]]; then
        ember s --proxy=http://json-api.rockandrollwithemberjs.com &
    elif [[ $selection == "2" ]]; then
        ember t --server &
    elif [[ $selection == "3" ]]; then
        docker-compose up --detach
    else
        echo "Shutting down!"
        kill -9 $(jobs -p)
        return
    fi;
    menu
}

menu