url=http://visual.cs.ucl.ac.uk/pubs/monoDepth/models/model_city2kitti
output_file=./model_city2kitti
output_location=./pycalc/depth

wget -nc $url -O $output_file
mkdir $output_location
unzip $output_file -d $output_location
rm $output_file

