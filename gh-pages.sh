npm run less
npm run example
cd ../menu-gh-pages
rm -rf build/
mkdir build
cp -r ../menu/build/ build
git add --all
git commit -am "update examples"
git push origin gh-pages:gh-pages