# uwb-cam-timelapse
A Twitter bot that posts a timelapse GIF of each day of UW Bothell campus, using the security camera on the parking garage.

## Design
### Collect images
- Use systemd to run program to capture images periodically and save to day's folder
- Folder is named current date
- Use cron to delete folder at end of night for storage conservation

### Compile GIF and post
- Use systemd to run program once per day at night
- Compiles GIF from saved images throughout day
- **[TODO]** Upon successful GIF creation and post, delete image folder

## Installation
Run the following commands:
```bash
# install NPM packages
npm install

# install cron for clearing image folder at 7am UTC (12AM PST)
crontab -l | { cat; echo "0 7 * * * rm -rf $(pwd)/images/*"; } | crontab -

# install systemd services and timers
sudo bash install.sh
```

Finally, set up the Twitter authentication variables by copying `default.env` to `.env` and filling out the variables.

```bash
cp default.env .env
vim .env
```
