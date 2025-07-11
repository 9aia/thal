#!/bin/bash

# Database load script for different environments
# Usage: ./db-load.sh [--preview|--prod] <sql_file>
#   No args: dev environment
#   --preview: preview environment  
#   --prod: production environment
#   <sql_file>: path to the SQL file to import

set -e

# Default to dev environment
ENV="dev"
SQL_FILE=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --preview)
            ENV="preview"
            shift
            ;;
        --prod)
            ENV="prod"
            shift
            ;;
        -*)
            echo "Unknown option: $1"
            echo "Usage: $0 [--preview|--prod] <sql_file>"
            exit 1
            ;;
        *)
            # This should be the SQL file path
            if [ -z "$SQL_FILE" ]; then
                SQL_FILE="$1"
            else
                echo "Error: Multiple SQL files specified. Only one file allowed."
                echo "Usage: $0 [--preview|--prod] <sql_file>"
                exit 1
            fi
            shift
            ;;
    esac
done

# Check if SQL file was provided
if [ -z "$SQL_FILE" ]; then
    echo "Error: No SQL file specified."
    echo "Usage: $0 [--preview|--prod] <sql_file>"
    exit 1
fi

# Check if SQL file exists
if [ ! -f "$SQL_FILE" ]; then
    echo "Error: SQL file '$SQL_FILE' does not exist."
    exit 1
fi

echo "Starting database import for environment: $ENV"
echo "SQL file: $SQL_FILE"

# Show file size
if command -v du >/dev/null 2>&1; then
    SIZE=$(du -h "$SQL_FILE" | cut -f1)
    echo "📊 File size: $SIZE"
fi

# Confirm before proceeding (especially for production)
if [ "$ENV" = "prod" ]; then
    echo ""
    echo "⚠️  WARNING: You are about to import data into the PRODUCTION database!"
    echo "This will overwrite existing data. Are you sure you want to continue?"
    read -p "Type 'yes' to confirm: " confirmation
    if [ "$confirmation" != "yes" ]; then
        echo "Import cancelled."
        exit 0
    fi
fi

# Execute the appropriate wrangler command based on environment
case $ENV in
    "dev")
        echo "Importing into local development database..."
        wrangler d1 execute thal --local --file "$SQL_FILE"
        ;;
    "preview")
        echo "Importing into preview environment database..."
        wrangler d1 execute thal --remote --env preview --file "$SQL_FILE"
        ;;
    "prod")
        echo "Importing into production environment database..."
        wrangler d1 execute thal --remote --env prod --file "$SQL_FILE"
        ;;
esac

if [ $? -eq 0 ]; then
    echo "✅ Database import completed successfully!"
    echo "📁 Imported from: $SQL_FILE"
    echo "🌍 Environment: $ENV"
else
    echo "❌ Database import failed!"
    exit 1
fi 