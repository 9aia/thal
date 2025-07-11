#!/bin/bash

# Database dump script for different environments
# Usage: ./db-dump.sh [--preview|--prod]
#   No args: dev environment
#   --preview: preview environment  
#   --prod: production environment

set -e

# Default to dev environment
ENV="dev"
OUTPUT_DIR="devops/db-dumps"

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
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--preview|--prod]"
            exit 1
            ;;
    esac
done

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Generate timestamp for filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="thal_${ENV}_${TIMESTAMP}.sql"

echo "Starting database dump for environment: $ENV"
echo "Output file: $OUTPUT_DIR/$FILENAME"

# Execute the appropriate wrangler command based on environment
case $ENV in
    "dev")
        echo "Dumping local development database..."
        wrangler d1 export thal --local --output "$OUTPUT_DIR/$FILENAME"
        ;;
    "preview")
        echo "Dumping preview environment database..."
        wrangler d1 export thal --remote --env preview --output "$OUTPUT_DIR/$FILENAME"
        ;;
    "prod")
        echo "Dumping production environment database..."
        wrangler d1 export thal --remote --env prod --output "$OUTPUT_DIR/$FILENAME"
        ;;
esac

if [ $? -eq 0 ]; then
    echo "✅ Database dump completed successfully!"
    echo "📁 File saved to: $OUTPUT_DIR/$FILENAME"
    
    # Show file size
    if command -v du >/dev/null 2>&1; then
        SIZE=$(du -h "$OUTPUT_DIR/$FILENAME" | cut -f1)
        echo "📊 File size: $SIZE"
    fi
else
    echo "❌ Database dump failed!"
    exit 1
fi
