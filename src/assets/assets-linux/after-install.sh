#!/bin/bash

# Link to the binary
ln -sf /opt/iNgawi/iNgawi /usr/local/bin/iNgawi

# Launcher icon
desktop-file-install /opt/iNgawi/iNgawi.desktop
