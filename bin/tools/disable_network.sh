tc qdisc add dev $(ip -o addr show scope global | grep $1 | cut -d " " -f 2) root netem loss 100%
