#!/bin/bash

# Defaults
ENV_FILE=".env"
EDITOR_CMD=""
WINDOW_FLAG="--reuse-window"
HOST=""
PORT=""
ROOT="./codeshare"

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --env-file|-e)
      ENV_FILE="$2"
      shift 2
      ;;
    --new-window|-n)
      WINDOW_FLAG=""
      shift
      ;;
    --host|-h)
      HOST="$2"
      shift 2
      ;;
    --port|-p)
      PORT="$2"
      shift 2
      ;;
    --root|-r)
      ROOT="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Load env file
if [[ -f "$ENV_FILE" ]]; then
  set -a
  source "$ENV_FILE"
  set +a
else
  echo "Error: Env file '$ENV_FILE' not found."
  exit 1
fi

# Editor fallback
EDITOR_CMD=${LAUNCH_EDITOR:-code}

# Check required args
if [[ -z "$HOST" || -z "$PORT" ]]; then
  echo "Error: --host and --port are required."
  echo "Usage: $0 --host <hostname> --port <port> [--new-window] [--root <folder>] [--env-file <file>]"
  exit 1
fi

# Run the editor
$EDITOR_CMD $WINDOW_FLAG --remote "ssh-remote+codeshare@${HOST}:${PORT}" "$ROOT"
