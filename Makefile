HOMEDIR = $(shell pwd)
USER = bot
SERVER = smallcatlabs
SSHCMD = ssh $(USER)@$(SERVER)
PROJECTNAME = shotbot
APPDIR = /opt/$(PROJECTNAME)

pushall: sync
	git push origin master

sync:
	rsync -a $(HOMEDIR) $(USER)@$(SERVER):/opt --exclude node_modules/
	$(SSHCMD) "cd $(APPDIR) && npm install"

run-hills:
	CONFIG="configs/hills-config" node post-shot.js

run-hills-dry:
	CONFIG="configs/hills-config" node post-shot.js --dry

prettier:
	prettier --single-quote --write "**/*.js"
