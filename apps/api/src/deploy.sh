set -e

ROOT_PATH=${1:-"/home/plutonus/plutonus.host"}

log() {
    # ref: http://linuxcommand.org/lc3_adv_tput.php
    tput bold; tput setaf 6; echo "  ○ $@"; tput sgr0;
}

abort() {
  echo
  echo "  $@" 1>&2
  echo
  exit 1
}

deploy() {
    log "Deployment endpoint was hit..."
    log "Checksums validated..."

    log Root is $ROOT_PATH

    log "Stashing local changes, if any..."
    cd $ROOT_PATH/source && git stash -u;
    test $? -eq 0 || abort "Stash failed!"

    log "Pulling updates from Github..."
    cd $ROOT_PATH/source && git pull --all;
    test $? -eq 0 || abort "Github pull failed!"

    log "Getting latest SHA commit..."
    local latest_sha=$(git rev-parse --short --verify HEAD);

    if ! [ -d "$ROOT_PATH/ver/$latest_sha" ]; then
        log "Creating new versioned deployment on $ROOT_PATH/ver"
        mkdir -p $ROOT_PATH/ver/$latest_sha;
        test $? -eq 0 || abort "Directory creation unsuccessful!"

        rsync -aHW --stats $ROOT_PATH/source/ $ROOT_PATH/ver/$latest_sha;
        test $? -eq 0 || abort "Version copy unsuccessful!"

        log "Installing and building from source...";
        cd $ROOT_PATH/ver/$latest_sha && yarn && yarn build || (rm -rf $ROOT_PATH/ver/$latest_sha && abort "Installation or build failed!")

        log "Updating symlink to current version..."
        ln -sfn $ROOT_PATH/ver/$latest_sha $ROOT_PATH/current
        test $? -eq 0 || abort "Symlink failed!"
    fi

    abort "Finished without errors!"
}

deploy
