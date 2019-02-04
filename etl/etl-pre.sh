#!/bin/bash

usage()
{
    echo "usage: etl -m ... -u ... -p ... -c ... | [-h]]"
}

do_etl() 
{
  mysql -h $mysql -D newline -u $user -p$pass < etl/tables.sql
}

mysql=
user=
pass=
couchdb=

while [ "$1" != "" ]; do
    case $1 in
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

