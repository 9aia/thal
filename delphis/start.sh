#!/bin/bash

# Default values if variables are not provided
USER=${USER:-root}
PASSWORD=${PASSWORD:-password}

# Set the root password or create a new user
if [ "$USER" == "root" ]; then
    echo "Root cannot be used as user to delphis!"

    exit 1;
else
    # Add user without creating a home directory
    useradd -M "$USER"

    # Force create the home directory if it doesn't exist
    HOME_DIR="/home/$USER"
    if [ ! -d "$HOME_DIR" ]; then
        mkdir -p "$HOME_DIR"
    fi

    # Set ownership and permissions
    chown -R "$USER":"$USER" "$HOME_DIR"
    chmod 700 "$HOME_DIR"

    # Set the user's password
    echo "$USER:$PASSWORD" | chpasswd
fi

chmod -R 777 /delphis

# Start the SSH server
exec /usr/sbin/sshd -D
