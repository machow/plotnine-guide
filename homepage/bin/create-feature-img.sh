#!/usr/bin/env bash

# Check if an argument (ID) was provided
if [ -z "$1" ]; then
  echo "Usage: $0 <ID>"
  exit 1
fi

ID=$1
# Create a temporary file with the given ID
temp_file=$(mktemp "/tmp/${ID}_XXXXXX")

cat homepage/bin/img-start.py > $temp_file

echo -n "plot = " >> $temp_file
cat homepage/features/code/$ID.py | sed -e 's/!!!//g;s/???//g;/#skip/d' >> $temp_file
echo -e "\n\nggsave(plot, 'homepage/features/img/$ID.png')" >> $temp_file

cat $temp_file
python $temp_file