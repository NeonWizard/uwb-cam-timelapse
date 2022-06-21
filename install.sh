#!/bin/sh

# install systemd service and timer for capturing photos
if [ -f /etc/systemd/system/uwb-timelapse-capture.timer ]; then
    sudo systemctl disable uwb-timelapse-capture.timer
    sudo systemctl stop uwb-timelapse-capture.timer
fi
eval "echo -e \"`<systemd/uwb-timelapse-capture.service`\"" > /etc/systemd/system/uwb-timelapse-capture.service
eval "echo -e \"`<systemd/uwb-timelapse-capture.timer`\"" > /etc/systemd/system/uwb-timelapse-capture.timer

# install systemd service and timer for posting GIF
if [ -f /etc/systemd/system/uwb-timelapse-post.timer ]; then
    sudo systemctl disable uwb-timelapse-post.timer
    sudo systemctl stop uwb-timelapse-post.timer
fi
eval "echo -e \"`<systemd/uwb-timelapse-post.service`\"" > /etc/systemd/system/uwb-timelapse-post.service
eval "echo -e \"`<systemd/uwb-timelapse-post.timer`\"" > /etc/systemd/system/uwb-timelapse-post.timer

# start systemctl timers
sudo systemctl daemon-reload
sudo systemctl enable uwb-timelapse-capture.timer
sudo systemctl enable uwb-timelapse-post.timer
sudo systemctl start uwb-timelapse-capture.timer
sudo systemctl start uwb-timelapse-post.timer
