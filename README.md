# uwb-cam-timelapse
A Twitter bot that posts a timelapse GIF of each day of UW Bothell campus, using the security camera on the parking garage.

## Plan
### Collect images
- Use cron or systemd to run program to capture image and save to folder for day
- Folder named current date

### Compile GIF and post
- Use cron or systemd to run program once per day at night
- Upon successful GIF creation and post, delete image folder

## Installation
```bash
# install NPM packages
npm install

# install cron for clearing image folder at 7am UTC (12AM PST)
crontab -l | { cat; echo "0 7 * * * rm -rf $(pwd)/images/*"; } | crontab -

# install systemd services and timers
sudo bash install.sh
```