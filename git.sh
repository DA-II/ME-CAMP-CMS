message=`date +%Y-%m-%d`' fromMacBy1258'
# echo "$message"
git add .
git commit -m "$1"
git push
git push github
