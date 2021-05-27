# This script is made to quickly trigger new dev builds
# This currently only works for windows

# Create a new custom tag and attach it to the last commit
$date = "dev_"+(Get-Date).Ticks
git tag $date HEAD

## Push the last commit and then the tag after that
git push
git push --tags