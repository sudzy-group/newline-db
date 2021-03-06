#!/bin/bash

usage()
{
    echo "usage: etl -s ... -m ... -u ... -p ... -c ... | [-h]]"
}

do_etl() 
{
  lib/tools/etl.js -p "$couchdb/$store" -P $store -U $store -h "$mysql" -u $user -w $pass -d newline -s $store
}

store=
mysql=
user=
pass=
couchdb=

while [ "$1" != "" ]; do
    case $1 in
        -s | --store )          shift
                                store=$1
                                ;;
        -m | --mysql )          shift
                                mysql=$1
                                ;;
        -u | --user )           shift
                                user=$1
                                ;;
        -p | --pass )           shift
                                pass=$1
                                ;;
        -c | --couchdb )        shift
                                couchdb=$1
                                ;;
        -h | --help )           usage
                                exit
                                ;;
        * )                     usage
                                exit 1
    esac
    shift
done

do_etl

